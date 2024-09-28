import nodemailer from "nodemailer"
import {ApiError} from "./ApiError.js";

var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERID,
      pass: process.env.MAILTRAP_PASSWORD
    }
});

export async function mailer({email,verifyCode}) {
    try {
        const mailOptions = {
            from: 'info@mailtrap.club', // sender address
            to: email, // list of receivers
            subject: "Verify Your email",
            html: `<p>Hello User,</p>
            <p>Thank you for registering. Please use the verification code below to verify your email address:</p>
            <div class="verification-code">
                ${verifyCode}
            </div>
            <p>If you did not request this verification, please ignore this email.</p>`, // html body
        };
        const mailResponse = await transport.sendMail(mailOptions)
    
        return mailResponse
    } catch (error) {
        throw new ApiError(505,`An unexpected error occured while sending the mail. Error:-${error}`)
    }

}