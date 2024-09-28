import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { mailer } from "../utils/Mailer.js";

const cookieOptions = {
    httpOnly: true,
    secure: false, // Use true for HTTPS
    sameSite: "Lax", // Required for cross-origin cookies
};
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                statusCode: error.statusCode,
                message: error.message,
                errors: error.errors,
                data: error.data,
            });
        }
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "An unexpected error occured while Generating Tokens...",
            errors: [],
            data: null,
        });
    }
};

const registerUser = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;

        if (!(username.trim() && password.trim() && email.trim())) {
            throw new ApiError(402, "All the fields are required");
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            throw new ApiError(403, "Invalid email address");
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUser) {
            if (existingUser.isVerified) {
                throw new ApiError(
                    402,
                    "Already an account with this email id or username exists"
                );
            }
            existingUser.username = username;
            existingUser.password = password;
            existingUser.verifyCode = verifyCode;
            existingUser.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUser.save();

            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        existingUser,
                    },
                    "User details updated please verify the user using Verify Code sent to your email address."
                )
            );
        }

        const newUser = await User.create({
            username,
            email,
            password: password,
            isVerified: false,
            verifyCode,
            verifyCodeExpiry: new Date(Date.now() + 3600000),
        });

        mailer({ email, verifyCode });

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    { newUser },
                    "User created successfully..."
                )
            );

        //https://youtu.be/QDIOBsMBEI0?si=nReUf3amCvlxhGwX
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                statusCode: error.statusCode,
                message: error.message,
                errors: error.errors,
                data: error.data,
            });
        }
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "An unexpected error occured while Registering User...",
            errors: [],
            data: null,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { credential, password } = req.body;

        if (!(credential && password)) {
            throw new ApiError(403, "Both the fields are required");
        }

        const user = await User.findOne({
            $or: [{ email: credential }, { username: credential }],
        });

        if (!user) {
            throw new ApiError(403, "User with the credential doesnt exist");
        }

        if (!user.isVerified) {
            throw new ApiError(
                402,
                "Unauthorised Access.. Verify your account using the code send on your registered email"
            );
        }
        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new ApiError(403, "Password is incorrect");
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        return res
            .status(200)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .cookie("accessToken", accessToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    {
                        loggedInUser,
                        accessToken,
                        refreshToken,
                    },
                    "User logged in successfully"
                )
            );
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                statusCode: error.statusCode,
                message: error.message,
                errors: error.errors,
                data: error.data,
            });
        }
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "An unexpected error occured while Logging User In...",
            errors: [],
            data: null,
        });
    }
};

const verifyUser = async (req, res) => {
    try {
        const { username } = req.params;
        const { verifyCode } = req.body;

        if (!username?.trim()) {
            throw new ApiError(404, "Link has been compromised");
        }
        if (!verifyCode) {
            throw new ApiError(403, "Verify code field must not be empty");
        }

        const user = await User.findOne({ username });
        if (!user) {
            throw new ApiError(403, "User not found");
        }
        if (user.isVerified) {
            throw new ApiError(403, "User is already verified.");
        }

        if (new Date(user.verifyCodeExpiry) < new Date()) {
            throw new ApiError(403, "The Verify Code is expired");
        }
        if (user.verifyCode !== verifyCode) {
            throw new ApiError(403, "Verify Code entered is incorrect");
        }
        user.verifyCode = null;
        user.verifyCodeExpiry = null;
        user.isVerified = true;
        await user.save();

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "User is successfully verified."));
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                statusCode: error.statusCode,
                message: error.message,
                errors: error.errors,
                data: error.data,
            });
        }
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "An unexpected error occured while Verifying User...",
            errors: [],
            data: null,
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user.id,
            {
                $unset: {
                    refreshToken: 1,
                },
            },
            {
                new: true,
            }
        );

        return res
            .status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json(new ApiResponse(200, {}, "Logout successful"));
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                statusCode: error.statusCode,
                message: error.message,
                errors: error.errors,
                data: error.data,
            });
        }
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "An unexpected error occured while Logging Out User...",
            errors: [],
            data: null,
        });
    }
};

const checkUsernameUnique = async (req, res) => {
    try {
        const username = req.query.username;

        const regex = /^(?=.*[a-z])[a-z0-9_]+$/;

        if (username.length < 2 || username.length > 20) {
            return res
                .status(201)
                .json(
                    new ApiResponse(
                        202,
                        { username },
                        "Username must have atleast 2 characters and maximum 20 characters"
                    )
                );
        }

        if (!regex.test(username)) {
            return res
                .status(201)
                .json(
                    new ApiResponse(
                        202,
                        { username },
                        "Username must contain only lowercase letters, numbers, and underscores. At least one lowercase letter is required."
                    )
                );
        }
        const user = await User.findOne({
            username,
            isVerified: true,
        });
        if (!user) {
            return res
                .status(201)
                .json(new ApiResponse(201, {}, "Username is available"));
        }
        return res
            .status(201)
            .json(new ApiResponse(201, {}, "Username is not available"));
    } catch (error) {
        throw new ApiError(
            505,
            `An unexpected error occured while checking username. Error:-${error}`
        );
    }
};

const fetchUserDetails = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(402, "Unauthorised access");
        }
        const loggedInUser = await User.findById(user.id).select(
            "-password -refreshToken -isVerified -verifyCode -verifyCodeExpiry"
        );
        if (!loggedInUser) {
            throw new ApiError(404, " User not found ");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { loggedInUser },
                    "User details fetched successfully"
                )
            );
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                statusCode: error.statusCode,
                message: error.message,
                errors: error.errors,
                data: error.data,
            });
        }
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message:
                "An unexpected error occured while Fetching User Details...",
            errors: [],
            data: null,
        });
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const { username, password, savings, wallet, salary } = req.body;
        const user = req.user;
        if (!(username || password || savings || wallet || salary )) {
            throw new ApiError(403, "The field to be updated is missing");
        }
        if (!user) {
            throw new ApiError(400, "Unauthorised Request");
        }
        const loggedInUser = await User.findById(user.id);
        if (!loggedInUser) {
            throw new ApiError(404, "User not found");
        }

        const updatedFields = {};

        // Only include fields that are present in the request body
        if (username) updatedFields.username = username;
        if (password) updatedFields.password = password;
        if (savings) updatedFields.savings = savings;
        if (wallet) updatedFields.wallet = wallet;
        if (salary) updatedFields.salary = salary;

        // Update the user with the fields that were provided
        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            { $set: updatedFields },
            { new: true, runValidators: true } // Returns the updated document and validates
        );
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {updatedUser},
                "User updated"
            )
        )
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                statusCode: error.statusCode,
                message: error.message,
                errors: error.errors,
                data: error.data,
            });
        }
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message:
                "An unexpected error occured while Updating User Details...",
            errors: [],
            data: null,
        });
    }
};

export {
    generateAccessAndRefreshTokens,
    registerUser,
    loginUser,
    verifyUser,
    logoutUser,
    checkUsernameUnique,
    fetchUserDetails,
    updateUserDetails
};
