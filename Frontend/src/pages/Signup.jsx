import axios from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

function Signup() {
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState("");
    const [showPasswordToggle, setShowPasswordToggle] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate()
    const {toast} = useToast()

    const [username, setUsername] = useState('');
    const [debouncedUsername] = useDebounce(username, 300);
    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`http://localhost:8000/api/v1/user/check-username-unique?username=${debouncedUsername}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    console.error(
                        `Some unexpected error occured while checking username. Error:-${error}`
                    );
                    setUsernameMessage("Error checking username")
                }finally{
                    setIsCheckingUsername(false)
                }
            }else{
                setUsernameMessage('')
            }
        };
        checkUsernameUnique()
    }, [debouncedUsername]);


    const [email, setEmail] = useState('')

    const [password, setPassword] = useState('')
    const changePasswordToggle = () => {
        setShowPasswordToggle(!showPasswordToggle);
    };

    const submitForm = async () =>{
        setIsSubmitting(true)
        try {
            const response = await axios.post('http://localhost:8000/api/v1/user/register',{username,email,password})
            console.log("Response",response);
            if (response.data.statusCode < 300) {
                toast({
                    title: response.data.message,
                    description: "Redirecting you to verification page in couple of seconds",
                  })
                setTimeout(() => {
                    navigate(`/verify/${username}`)
                }, 3000);
            }else{
                throw new Error(response.data.message || 'Registration failed.');
            }
        } catch (error) {
            console.error(`An error occured while submitting the form. Error:- ${error}`)
            toast({
                variant: "destructive",
                title: error.response.data.message,
            });
        }finally{
            setIsSubmitting(false)
        }
        
    }

    return (
        <div className="h-screen w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
            <div
                className="pointer-events-none flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]
                absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-sm"
                style={{ backgroundImage: "url('/src/assets/background.jpg')" }}
            ></div>

            <div className="h-screen flex items-center justify-center">
                <div className=" h-[550px] w-80 flex flex-col rounded-2xl p-5 border border-solid border-white">
                    <p className="text-center text-4xl font-black mt-5 mb-5">
                        SIGNUP
                    </p>
                    <label
                        htmlFor="username"
                        className="mt-4 mb-1 text-sm ml-2"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        className=" bg-black text-white rounded-lg border border-gray-600 px-4 pt-5 pb-5 focus:outline-none text-sm h-8"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {isCheckingUsername && (
                        <Loader2 size={20} className="animate-spin" />
                    )}
                    {!isCheckingUsername && usernameMessage && (
                        <p
                            className={`font-light ml-2 text-sm ${
                                usernameMessage === "Username is available"
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            {usernameMessage}
                        </p>
                    )}
                    <label htmlFor="email" className="mt-4 mb-1 text-sm ml-2">
                        Email
                    </label>
                    <input
                        type="email"
                        className=" bg-black text-white rounded-lg border border-gray-600 px-4 pt-5 pb-5 focus:outline-none text-sm h-8 "
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                    <label
                        htmlFor="password"
                        className="mt-4 mb-1 text-sm ml-2"
                    >
                        Password
                    </label>
                    <input
                        type={`${showPasswordToggle ? "text" : "password"}`}
                        className=" bg-black text-white rounded-lg border px-4 pt-5 pb-5 border-gray-600  text-sm h-8 mb-4 "
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                    />
                    <div className="flex justify-start items-start h-auto px-2 mb-2">
                        <input
                            checked={showPasswordToggle}
                            onChange={changePasswordToggle}
                            type="checkbox"
                            id="show"
                            name="show"
                            value="yes"
                            className="checkbox checkbox-primary size-4"
                        />
                        <label
                            htmlFor="show"
                            className=" px-2 text-right text-xs font-normal text-[#b2b2b2] hover:cursor-pointer"
                        >
                            Show Password
                        </label>
                    </div>
                    <Button
                        type="submit"
                        className="px-12 py-2 rounded-full tracking-widest uppercase font-bold mb-7 mt-5"
                        disabled={isSubmitting === true || !(username && email && password)}
                        onClick={submitForm}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    SIGNUP
                    </Button>
                    <p className=" text-center text-xs font-extralight">
                        If you already have account, login{" "}
                        <a href="/login" className=" text-cyan-300">
                            here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
