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
    const [monthlyExpenses, setMonthlyExpenses] = useState([])
    const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState("")
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

        const fetchMonthlyExpenses = async()=>{
            const response = await axios.get("http://localhost:8000/api/v1/expense/fetch-expenses",{
                withCredentials:true
            })
            console.log(response);
            setMonthlyExpenses(response.data.data.expenses)
            const totalAmount = response.data.data.expenses.reduce((accumulator, expense) => {
                return accumulator + expense.amount;
            }, 0);
            setTotalMonthlyExpenses(totalAmount)
        }

        fetchUserDetails();
        fetchMonthlyExpenses();
    }, []);

    return (
        <>
            <div className="navbar bg-base-400 h-32 w-full p-10">
                <div className="navbar-start">
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
            <div className="w-full flex justify-center items-center h-44">
                <div className="stats bg-slate-750 text-white ">
                    <div className="stat">
                        <div className="stat-title">Savings</div>
                        <div className="stat-value font-mono">₹{userDetails.savings}</div>
                        <div className="stat-actions">
                            <button className="btn btn-sm bg-green-300 btn-success">
                                Add funds
                            </button>
                        </div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Current balance</div>
                        <div className="stat-value font-mono">₹{userDetails.wallet}</div>
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
                        <div className="stat-value font-mono">
                            ₹{totalMonthlyExpenses}
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
