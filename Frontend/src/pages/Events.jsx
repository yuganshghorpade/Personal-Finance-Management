import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, LogOutIcon, Pencil, PencilLine, Plus, SquarePen, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
    Card as ShadcnCard,
    CardContent,
    CardDescription,
    CardFooter as ShadcnCardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Events() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingTotal, setIsLoadingTotal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventsExpenses, setEventsExpenses] = useState([]);

    const [addEventTitle, setAddEventTitle] = useState("");
    const [addEventDialogDisplay, setAddEventDialogDisplay] = useState(false);
    const { toast } = useToast();
    const skeletons = [];

    const fetchingEvents = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/v1/event/fetch-events",
                { withCredentials: true }
            );

            // console.log(response.data.data.ObjectsArr);
            setEvents(response.data.data.ObjectsArr);
            console.log(response.data.data.ObjectsArr);
        } catch (error) {
            console.error("error", error);
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
        } finally {
            setIsLoading(false);
        }
    };

    const fetchingEventExpenses = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/v1/event/fetch-event-expenses`,
                { withCredentials: true }
            );
            console.log(
                "Response",
                response.data.data.eventExpensesArrayWithoutIds
            );
            response.data.data.eventExpensesArrayWithoutIds.reverse();

            setEventsExpenses(response.data.data.eventExpensesArrayWithoutIds);
        } catch (error) {
            console.error("Error occured", error);
        }
    };
    const calculateTotalAmount = (index) => {
        const expenses = eventsExpenses[index];

        if (!expenses || !Array.isArray(expenses)) {
            return (<span className="loading loading-infinity loading-sm mt-2 ml-2"></span>);
        }

        const flattenedArray = expenses.flat();

        const totalAmount = flattenedArray.reduce(
            (sum, obj) => sum + (obj.amount || 0),
            0
        );
        return `₹ ${totalAmount}`;
    };
    useEffect(() => {
        fetchingEvents();
        fetchingEventExpenses();
    }, []);

    useEffect(() => {
        fetchingEvents();
    }, [addEventDialogDisplay]);

    useEffect(() => {
        // Lock or unlock scroll based on modal state
        if (addEventDialogDisplay) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => document.body.classList.remove("overflow-hidden"); // Cleanup
    }, [addEventDialogDisplay]);

    const addEvent = async () => {
        try {
            console.log("Events", events);
            setIsSubmitting(true);
            const response = await axios.post(
                "http://localhost:8000/api/v1/event/create-event",
                { title: addEventTitle },
                {
                    withCredentials: true,
                }
            );
            toast({
                title: response.data.message,
                description: "You can update the expenses later on.",
            });
            await fetchingEvents();
        } catch (error) {
            console.error(error);
            toast({
                title: error.response.data.message,
                description: "Please try again later",
                variant: "destructive",
            });
        } finally {
            setAddEventDialogDisplay(false);
            setIsSubmitting(false);
            setAddEventTitle("");
        }
    };

    const navigateEvent = async (eventId) => {
        console.log(eventId);
        navigate(`/event?eventId=${eventId}`);
    };

    if (isLoading) {
        for (let i = 0; i < 8; i++) {
            skeletons.push(
                <div key={i}>
                    <Skeleton className="h-[160px] w-[220px] mb-3 rounded-xl" />
                    <Skeleton className="h-4 space-y-3 " />
                    <Skeleton className="h-4 mt-2" />
                </div>
            );
        }
    }

    return (
        <>
            <div className="h-screen">
                {/* <h1 className="font-serif text-3xl m-5">Your Events</h1> */}
                <div className="navbar bg-base-400 h-32 w-full p-10">
                    <div className="navbar-start">
                        <a className="btn btn-ghost text-4xl">Events</a>
                    </div>
                    <div className="navbar-center ">
                        <a href="/dashboard">
                            <Button variant="link" className="text-lg">
                                Dashboard
                            </Button>
                        </a>
                        <a href="/profile">
                            <Button variant="link" className="text-lg">
                                My Profile
                            </Button>
                        </a>
                        <a href="/friends">
                            <Button variant="link" className="text-lg">
                                Friends
                            </Button>
                        </a>
                        <a href="/splits">
                            <Button variant="link" className="text-lg">
                                Splitwise
                            </Button>
                        </a>
                    </div>
                    <div className="navbar-end">
                        <Button
                            // onClick={logoutUser}
                            className=" text-base p-6 "
                        >
                            <LogOutIcon className="" size={20} />
                            <p className="ml-3 mr-4 mt-1">Logout</p>
                        </Button>
                    </div>
                </div>
                {/* //Todo editing events - popover */}
                <div className="flex justify-center w-full">
                    <div className="grid m-2 grid-cols-4 gap-14">
                        <button onClick={() => setAddEventDialogDisplay(true)}>
                            <ShadcnCard className="h-full w-full">
                                <CardHeader>
                                    <CardTitle className={"font-libaskerville"}>
                                        Add a event
                                    </CardTitle>
                                    <CardDescription></CardDescription>
                                </CardHeader>
                                <CardContent className=" flex items-center justify-center">
                                    <Plus size={80} strokeWidth={1.5} />
                                </CardContent>
                            </ShadcnCard>
                        </button>
                        {isLoading ? (
                            skeletons // Render skeletons while loading
                        ) : !events ? (
                            <div className="flex items-center justify-center w-full h-full text-gray-500">
                                <p>No events available</p>
                            </div>
                        ) : (
                            events.map((event, index) => (
                                // <div key={index} className="hover:cursor-pointer font-libaskerville" onClick={()=>navigateEvent(event._id)}>
                                //     <div className="h-[175px] w-[350px] border border-white rounded-xl relative overflow-hidden">
                                //         <img
                                //             src="/src/assets/event.jpg"
                                //             alt="Event"
                                //             className="w-full h-full opacity-30 filter rounded-xl"
                                //         />
                                //         <p className=" absolute inset-0 flex items-center justify-center text-white text-lg font-semibold z-10">
                                //             {event.eventTitle}
                                //         </p>
                                //         <p className="absolute inset-28 flex  justify-center text-white text-lg font-semibold z-10">
                                //             ₹ {calculateTotalAmount(index)}
                                //         </p>
                                //     </div>
                                //     <p className="pl-2 pt-2 font-light text-sm ">
                                //         {format(
                                //             new Date(event.createdAt),
                                //             "dd/MM/yyyy HH:mm:ss"
                                //         )}
                                //     </p>
                                // </div>
                                <>
                                <Card
                                    shadow="sm"
                                    key={index}
                                    isPressable
                                    onPress={() => navigateEvent(event._id)}
                                >
                                    <CardBody className="overflow-visible p-0">
                                        <Image
                                            shadow="sm"
                                            radius="lg"
                                            width="100%"
                                            alt={event.eventTitle}
                                            className="w-full object-cover  blur-sm"
                                            src="/src/assets/event.jpeg"
                                        />
                                    </CardBody>
                                    <CardFooter className="text-small justify-between">
                                        <b className="text-default-600">
                                            {event.eventTitle}
                                        </b>
                                            <p className=" font-extrabold">
                                            {calculateTotalAmount(index)}
                                        </p>
                                    </CardFooter>
                                    <div className="flex">
                                    <p className="pl-2 pt-2 font-light text-sm ml-1 text-default-500 ">
                                        {format(
                                            new Date(event.createdAt),
                                            "dd/MM/yyyy HH:mm:ss"
                                        )}
                                    </p>
                                    </div>
                                </Card>
                                        </>
                            ))
                        )}
                        {addEventDialogDisplay && (
                            <>
                                {/* Background Overlay */}
                                <div className="fixed inset-0 bg-black/70 z-40"></div>
                                <div className="fixed left-[400px] inset-1/4 rounded-lg shadow-lg z-50 w-[460px]">
                                    <Card className="w-full">
                                        <CardHeader>
                                            <CardTitle>Create Event</CardTitle>
                                            <CardDescription>
                                                Keep a track of bundled expenses
                                                in a Event...
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <form>
                                                <div className="grid w-full items-center gap-4">
                                                    <div className="flex flex-col space-y-1.5">
                                                        <Label
                                                            htmlFor="name"
                                                            className="mb-3"
                                                        >
                                                            Name
                                                        </Label>
                                                        <Input
                                                            value={
                                                                addEventTitle
                                                            }
                                                            onChange={(e) => {
                                                                setAddEventTitle(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                            id="name"
                                                            placeholder="Name of the event"
                                                        />
                                                    </div>
                                                </div>
                                            </form>
                                        </CardContent>
                                        <CardFooter className="flex justify-between mt-10">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setAddEventDialogDisplay(
                                                        false
                                                    )
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            {!isSubmitting && (
                                                <Button onClick={addEvent}>
                                                    Create
                                                </Button>
                                            )}
                                            {isSubmitting && (
                                                <Button disabled>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Please wait
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                    <div className="h-20">
                    </div>
                {/* <footer className="w-full text-center h-14 fixed opacity-50 mt-10 bottom-0 bg-white text-black ">
                    <p className="text-lg pt-4 font-semibold">
                        Designed by Yugansh Ghorpade
                    </p>
                </footer> */}
            </div>
        </>
    );
}

export default Events;
