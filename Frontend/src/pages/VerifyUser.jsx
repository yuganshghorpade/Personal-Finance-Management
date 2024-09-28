import React from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";

function VerifyUser() {
    const { username } = useParams();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verifyCode, setVerifyCode] = useState("");
    const handleOtp = (newVerifyCode) => {
        setVerifyCode(newVerifyCode);
    };

    const submitOtp = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(
                `http://localhost:8000/api/v1/user/verify/${username}`,
                { verifyCode }
            );
            if (response) {
                setVerifyCode("");
                console.log(response.data.message);
                toast({
                    title: response.data.message,
                    description:
                        "Redirecting you to Login page in couple of seconds",
                });
                setTimeout(() => {
                    navigate(`/login`);
                }, 3000);
            }
        } catch (error) {
            console.error(
                `An unexpected error occured while submitting the OTP. Error:-${error}`
            );
            setVerifyCode("");
            toast({
                variant: "destructive",
                title: error.response.data.message,
                // description: "Click the button below for a new OTP",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const sendMail = async () =>{
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/user/sendmail/${username}`)
        toast({
          title: response.data.message,
          description:
              "Please check your email address",
      });
      } catch (error) {
        console.error(
          `An unexpected error occured while submitting the OTP. Error:-${error}`
      );
        toast({
          variant: "destructive",
          title: error.response.data.message,
      });
      }
    }

    return (
        <>
            <div
                className="pointer-events-none flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black)]
                absolute inset-0 bg-cover bg-center bg-no-repeat filter"
                style={{ backgroundImage: "url('/src/assets/Designer.png')" }}
            ></div>
            <div className="flex flex-col items-center h-full">
                {/* <div className='text-center font-bold text-5xl text-white mt-5'>One Last Step: Unlock Your Journey</div> */}
                <div className="flex flex-col w-1/3 h-[500px] border border-white rounded-lg p-5 mt-6">
                    <p className="text-center text-4xl font-black mt-5 mb-5">
                        Verify Your Email
                    </p>
                    <p className="text-center mt-5 mb-5">
                        OTP sent successfully. Check your inbox of the email
                        address registered for verification... <br /> OTP
                        Expires in 60 mins !!!
                    </p>
                    <p className="font-bold tracking-widest">OTP:-</p>
                    <InputOTP
                        maxLength={6}
                        value={verifyCode}
                        onChange={handleOtp}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <Button className="mt-16" type="submit" onClick={submitOtp}>
                        Submit
                    </Button>
                    <p className="mt-12 text-center">
                        Email not received?{" "}
                        <Button size="sm" variant="link" onClick={sendMail}>
                            Send again
                        </Button>
                    </p>
                </div>
            </div>
        </>
    );
}

export default VerifyUser;
