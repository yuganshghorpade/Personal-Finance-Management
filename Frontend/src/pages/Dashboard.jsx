import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOutIcon, SquareArrowOutUpRight, User, Wallet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ToastAction } from "@/components/ui/toast";
import { Separator } from "@/components/ui/separator";

function Dashboard() {
    const [userDetails, setUserDetails] = useState({});
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/v1/user/fetch-user-details",
                    {
                        withCredentials: true,
                    }
                );
                setUserDetails(response.data.data.loggedInUser);
                console.log(response.data.data);
                console.log(response.data.data.loggedInUser);
            } catch (error) {
                console.error(
                    "Error fetching user details:",
                    error.response.data.message
                );
                toast({
                    title: error.response.data.message,
                    description: "Please login ...",
                    variant: "destructive",
                    action: (
                        <ToastAction altText="Login">
                            <a href="/login">Login</a>
                        </ToastAction>
                    ),
                });
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <>
            {/* <div className="flex justify-between px-10">
                <p className="mt-10 text-4xl font-serif">Dashboard</p>
                <Button onClick={logoutUser} className="mt-10 p-6">
                    <LogOutIcon className="mr-2" size={20} />
                    Logout
                </Button>
            </div> */}
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
                    <a className="btn btn-ghost text-4xl">Dashboard</a>
                </div>
                <div className="navbar-center ">
                    <a href="/friends">
                        <Button variant="link" className="text-lg">
                            Friends
                        </Button>
                    </a>
                    <a href="events">
                        <Button variant="link" className="text-lg">
                            Events
                        </Button>
                    </a>
                    <a href="splits">
                        <Button variant="link" className="text-lg">
                            Splitwise
                        </Button>
                    </a>
                </div>
                <div className="navbar-end">
                    <a href="/profile">
                        <Button className=" text-base p-6">
                            {/* <LogOutIcon className="mr-2" size={20} /> */}
                            <User />
                            <p className="ml-4 mr-3 mt-1">Profile</p>
                        </Button>
                    </a>
                </div>
            </div>
            {/* <div className="flex items-center justify-center w-full h-[calc(8/10*100vh)] mt-4 gap-6">
                <div className="flex flex-col border border-white rounded-2xl h-full items-center justify-center w-full">
                    Friends - { userDetails.friends ? (userDetails.friends.length): ("No Friends") }
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="w-full rounded-2xl border border-white p-5 text-center">
                        <h2>Savings</h2>
                        <p>{userDetails.savings}</p>
                    </div>
                    <div className="flex justify-evenly w-full">
                        <div className="border rounded-3xl border-white p-12 m-5">
                            <div className="flex justify-evenly">
                                <h2 className=" text-3xl mb-5 pr-4">Wallet</h2>
                            <Wallet size={40} strokeWidth={0.8} />  
                            </div>
                            <p className="text-center text-3xl">
                                {userDetails.wallet}
                            </p>
                        </div>
                        <div className="border rounded-3xl border-white p-12 m-5">
                            <div className="flex justify-evenly">
                                <h2 className=" text-3xl mb-5 pr-2">Expense</h2>
                            <SquareArrowOutUpRight size={40} strokeWidth={0.8} />
                            </div>
                            <p className="text-center text-3xl">
                                {userDetails.monthlyExpense}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center h-full justify-center w-full border border-white rounded-2xl ">
                    Events - { userDetails.event ? (userDetails.event.length): ("No Events") }
                </div>
            </div> */}
            <div className="w-full flex justify-center items-center h-44">
                <div className="stats bg-slate-750 text-white ">
                    <div className="stat">
                        <div className="stat-title">Savings</div>
                        <div className="stat-value">₹{userDetails.savings}</div>
                        <div className="stat-actions">
                            <button className="btn btn-sm bg-green-300 btn-success">
                                Add funds
                            </button>
                        </div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Current balance</div>
                        <div className="stat-value">₹{userDetails.wallet}</div>
                        <div className="stat-actions">
                            <button className="btn btn-sm mr-1 hover:text-white bg-red-300 text-black">
                                Withdrawal
                            </button>
                            <button className="btn btn-sm ml-1 hover:text-white bg-green-300 text-black">
                                Deposit
                            </button>
                        </div>
                    </div>
                </div>
                <div className="stats bg-red-500 text-primary-content ml-10">
                    <div className="stat">
                        <div className="stat-title text-white">
                            Transactions this month
                        </div>
                        <div className="stat-value">
                            ₹{userDetails.monthlyExpense}
                        </div>
                        <div className="stat-actions">
                            <button className="btn btn-sm bg-green-300 text-black btn-success">
                                Add event
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
