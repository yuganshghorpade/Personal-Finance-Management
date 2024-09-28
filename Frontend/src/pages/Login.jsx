import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {
    const navigate = useNavigate();

    const [credentialMessage, setCredentialMessage] = useState("");
    const [showPasswordToggle, setShowPasswordToggle] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {toast} = useToast();

    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('')

    const changePasswordToggle = () => {
        setShowPasswordToggle(!showPasswordToggle);
        console.log(cookies);
    };

    const submitForm = async () =>{
        setIsSubmitting(true)
        try {
            const response = await axios.post("http://localhost:8000/api/v1/user/login",{credential,password},{
                withCredentials:true
            })
            if (response) {
                toast({
                    title: response.data.message,
                    description: "Welcome user !!! "
                })
                setTimeout(() => {
                    navigate("/dashboard")
                }, 1000);
            }
        } catch (error) {
            console.error(`An unexpected error occured while Logging User in. Error:- ${error}`)
            toast({
                variant: "destructive",
                title: error.response.data.message,
            })
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
                    <p className="text-center text-4xl font-black mt-5 mb-10">
                        LOGIN
                    </p>
                    <label
                        htmlFor="credential"
                        className="mt-4 mb-1 text-sm ml-2"
                    >
                        Username / Email
                    </label>
                    <input
                        type="text"
                        id="credential"
                        className="bg-black text-white rounded-lg border border-gray-600 px-4 pt-5 pb-5 focus:outline-none text-sm h-8"
                        placeholder="Enter your credential"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                    />
                    <label
                        htmlFor="password"
                        className="mt-4 mb-1 text-sm ml-2"
                    >
                        Password
                    </label>
                    <input
                        type={showPasswordToggle ? "text" : "password"}
                        className=" bg-black text-white rounded-lg border border-gray-600 px-4 pt-5 pb-5 focus:outline-none text-sm h-8 mb-4 "
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <div className="flex justify-start items-start h-auto px-2 mb-5">
                        <input
                            type="checkbox"
                            id="show"
                            name="show"
                            value="yes"
                            checked={showPasswordToggle}
                            onChange={changePasswordToggle}
                            className="checkbox checkbox-primary size-4"
                        />
                        <label
                            htmlFor="show"
                            className=" px-2 ml-1 text-right text-xs font-normal text-[#b2b2b2] hover:cursor-pointer"
                        >
                            Show Password
                        </label>
                    </div>
                    <Button
                        type="submit"
                        className="px-12 py-2 rounded-full tracking-widest uppercase font-bold mb-7 mt-10"
                        disabled={
                            isSubmitting === true ||
                            !(credential && password)
                        }
                        onClick={submitForm}
                    >
                        {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        LOGIN
                    </Button>
                    <p className=" text-center text-xs font-extralight">
                        If you dont have account, signup{" "}
                        <a href="/register" className=" text-cyan-300">
                            here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
