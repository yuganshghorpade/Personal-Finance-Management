import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { LogOutIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function Profile() {

    const {toast} = useToast();
    const navigate = useNavigate();

    const logoutUser = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/user/logout",
                null,
                {
                    withCredentials: true,
                }
            );
            toast({
                title: response.data.message,
            });
            navigate("/login");
        } catch (error) {
            console.error(
                "Error",
                error.response ? error.response.data : error.message
            );
        }
    };
    return (
        <>
        <div>
            <div className="navbar bg-base-400 h-32 w-full p-10">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost lg:hidden"
                        ></div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-lg"
                        >
                            <li>
                                <a className="text-lg">Friends</a>
                            </li>
                            <li>
                                <a>Parent</a>
                            </li>
                            <li>
                                <a>Item 3</a>
                            </li>
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-4xl">My Profile</a>
                </div>
                <div className="navbar-center ">
                    <a href="/dashboard">
                        <Button variant="link" className="text-lg">Dashboard</Button>
                    </a>
                    <a href="/friends">
                        <Button variant="link" className="text-lg">Friends</Button>
                    </a>
                    <a href="events">
                        <Button variant="link" className="text-lg">Events</Button>
                    </a>
                    <a href="splits">
                        <Button variant="link" className="text-lg">Splitwise</Button>
                    </a>
                </div>
                <div className="navbar-end">
                    <Button onClick={logoutUser} className=" text-base p-6 ">
                        <LogOutIcon className="" size={20} />
                        <p className="ml-3 mr-4 mt-1">Logout</p>
                    </Button>
                </div>
            </div>
            <div>

            </div>
            </div>
        </>
    );
}

export default Profile;
