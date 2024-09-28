import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { CircleUserRound, Loader2, LogOutIcon, Newspaper, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Profile() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({});

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
            toast({
                title:
                    error.response.data.message || "Something went wrong",
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

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const [newSalary, setNewSalary] = useState("");
    const [isUpdatingSalary, setIsUpdatingSalary] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

    const updateUser = async () => {
        try {
            setIsUpdatingSalary(true);
            console.log(newSalary);
            const response = await axios.patch(
                "http://localhost:8000/api/v1/user/update-user-details",
                {
                    salary: newSalary,
                },
                {
                    withCredentials: true,
                }
            );
        } catch (error) {
            toast({
                title: error.response.data.message || "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setNewSalary("");
            setIsUpdatingSalary(false);
            fetchUserDetails();
            setIsUpdateDialogOpen(false)
        }
    };
    return (
        <>
            <div>
                <div className="navbar bg-base-400 h-32 w-full p-10">
                    <div className="navbar-start">
                        <a className="btn btn-ghost text-4xl">My Profile</a>
                    </div>
                    <div className="navbar-center ">
                        <a href="/dashboard">
                            <Button variant="link" className="text-lg">
                                Dashboard
                            </Button>
                        </a>
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
                    <div className="navbar-end flex items-center">
                        <CircleUserRound size={25} strokeWidth={2} />
                        <p className="ml-2 mr-20 font-bold">
                            @{userDetails.username}
                        </p>
                    </div>
                </div>
                <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                    <div className="">
                        <div className="flex justify-start items-center mx-4">
                            <div className="stat w-60 border-white border-1 rounded-2xl">
                                <div className="stat-title text-slate-300">
                                    Salary
                                </div>
                                <div className="stat-value font-mono">
                                    ₹{userDetails.salary}
                                </div>
                                <DialogTrigger asChild>
                                    <div className="stat-actions w-full">
                                        <button className="btn btn-xs w-full ml-1 rounded-md border-green-400 hover:text-green-300 text-white">
                                            Update
                                        </button>
                                    </div>
                                </DialogTrigger>
                            </div>
                        </div>
                    </div>

                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Salary</DialogTitle>
                            <DialogDescription>
                                Got an appraisal or a coworker stabbed you, We
                                got you covered. Update your salary
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="username"
                                    className="text-right"
                                >
                                    Salary
                                </Label>
                                <Input
                                    id="username"
                                    placeholder="in Rupees.."
                                    value={newSalary}
                                    onChange={(e) =>
                                        setNewSalary(e.target.value)
                                    }
                                    className="col-span-3 text-base"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            {isUpdatingSalary ? (
                                <Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button onClick={updateUser} type="submit">
                                    Save changes
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

export default Profile;
