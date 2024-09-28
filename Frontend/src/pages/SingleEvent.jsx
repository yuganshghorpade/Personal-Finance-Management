import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, SquarePlus, Trash2 } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function SingleEvent() {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdatingEvent, setIsUpdatingEvent] = useState(false);
    const [isUpdatingExpense, setIsUpdatingExpense] = useState(false);
    const [isDeletingExpense, setIsDeletingExpense] = useState(false);
    const [displayAddCategoryDialog, setDisplayAddCategoryDialog] =
        useState(false);
    const [displayDeleteEventDialog, setDisplayDeleteEventDialog] =
        useState(false);
    const [displayUpdateEventDialog, setDisplayUpdateEventDialog] =
        useState(false);
    const [displayAddExpenseDialog, setDisplayAddExpenseDialog] =
        useState(false);
    const [displayDeleteExpenseDialog, setDisplayDeleteExpenseDialog] =
        useState(false);
    const [expenseStagedForDeletion, setExpenseStagedForDeletion] =
        useState(null);
    const [displayUpdateExpenseDialog, setDisplayUpdateExpenseDialog] =
        useState(false);
    const [expenseStagedForUpdation, setExpenseStagedForUpdation] =
        useState(null);
    const [eventTitleUpdate, setEventTitleUpdate] = useState();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [fetchedEvent, setFetchedEvent] = useState({});
    const [fetchedEventExpense, setFetchedEventExpense] = useState([]);
    const [categories, setCategories] = useState([]);
    const eventId = searchParams.get("eventId");

    const [isCreatingExpense, setIsCreatingExpense] = useState(false);
    const [expenseName, setExpenseName] = useState(null);
    const [expenseAmount, setExpenseAmount] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [image, setImage] = useState(null);

    const handleBadgeClick = (index) => {
        console.log("into handle badge");
        console.log(index);
        setSelectedCategory(index);
    };

    const [addCategoryName, setAddCategoryName] = useState(null);
    const [isCreatingCategory, setisCreatingCategory] = useState(false);
    const createCategory = async () => {
        setisCreatingCategory(true);
        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/category/add-category",
                {
                    categoryName: addCategoryName,
                },
                {
                    withCredentials: true,
                }
            );
            toast({
                title: response.data.message,
            });
        } catch (error) {
            console.error(error);
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
            await fetchCategories();
            setDisplayAddCategoryDialog(false);
            setAddCategoryName(null);
            setisCreatingCategory(false);
        }
    };

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                "http://localhost:8000/api/v1/category/fetch-categories",
                {
                    withCredentials: true,
                }
            );
            setCategories(response.data.data.ObjectsArray);
        } catch (error) {
            console.error(error);
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

    const addEventExpense = async () => {
        const formData = new FormData();
        try {
            setIsCreatingExpense(true);
            formData.append("expenseTitle", expenseName);
            formData.append("amount", expenseAmount);
            formData.append("categoryId", categories[selectedCategory]._id);
            formData.append("expenseImage", image);
            const response = await axios.post(
                `http://localhost:8000/api/v1/event/add-event-expense?eventId=${eventId}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            toast({
                title: response.data.message,
                description: "You can update it later on..",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: error.response.data.message,
                description: "Try again after few seconds",
                variant: "destructive",
            });
        } finally {
            fetchDetails();
            setIsCreatingExpense(false);
            setDisplayAddExpenseDialog(false);
            setExpenseAmount(null);
            setExpenseName(null);
            setSelectedCategory(null);
            setImage(null);
        }
    };

    const fetchDetails = async () => {
        try {
            setIsLoading(true);
            // Access specific query parameter
            const response = await axios.get(
                `http://localhost:8000/api/v1/event/fetch-event-details?eventId=${eventId}`,
                { withCredentials: true }
            );
            setFetchedEventExpense(response.data.data.eventExpenseDetails);
            setFetchedEvent(response.data.data.event);
            setEventTitleUpdate(response.data.data.event.eventTitle);
        } catch (error) {
            console.error(error);
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

    useEffect(() => {
        fetchDetails();
        fetchCategories();
    }, []);

    const findTitleById = (idToFind) => {
        const flattenedArray = categories.flat();

        const foundObject = flattenedArray.find((obj) => obj._id === idToFind);

        return foundObject ? foundObject.name : null;
    };

    const deleteEvent = async () => {
        try {
            console.log(eventId);
            const response = await axios.post(
                `http://localhost:8000/api/v1/event/delete-event?eventId=${eventId}`,
                {},
                {
                    withCredentials: true,
                }
            );
            toast({
                title: response.data.message,
            });
            navigate("/events");
        } catch (error) {
            console.error(error);
            toast({
                title: error.response.data.message,
                variant: "destructive",
                action: (
                    <ToastAction altText="Login">
                        <a href="/login">Login</a>
                    </ToastAction>
                ),
            });
        }
    };

    const updateEvent = async () => {
        try {
            setIsUpdatingEvent(true);
            console.log(eventTitleUpdate);
            const response = await axios.patch(
                `http://localhost:8000/api/v1/event/update-event?eventId=${eventId}`,
                {
                    newEventTitle: eventTitleUpdate,
                },
                {
                    withCredentials: true,
                }
            );
            if (response.status < 300) {
                fetchDetails();
                toast({
                    title: response.data.message,
                });
            } else {
                toast({
                    title: response.data.message,
                    description: "Please try again",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: error.response.data.message,
                variant: "destructive",
            });
        } finally {
            setIsUpdatingEvent(false);
            setDisplayUpdateEventDialog(false);
        }
    };

    const deleteExpense = async () => {
        try {
            setIsDeletingExpense(true);
            const response = await axios.delete(
                `http://localhost:8000/api/v1/event/delete-event-expense?eventId=${eventId}&expenseId=${expenseStagedForDeletion._id}`,
                {
                    withCredentials: true,
                }
            );
            if (response.status < 300) {
                await fetchDetails();
            }
            toast({
                title: response.data.message,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: error.response.data.message,
                variant: "destructive",
            });
        } finally {
            setIsDeletingExpense(false);
            setExpenseStagedForDeletion(null);
        }
    };

    //TODO: UPDATE EXPENSE
    const updateExpense = async () => {
        try {
            setIsUpdatingExpense(true);
        } catch (error) {
            console.error(error);
            toast({
                title: error.response.data.message,
                variant: "destructive",
            });
        }
    };

    const handleImageChange = async (event) => {
        setImage(event.target.files[0]);
    };

    return (
        <div>
            <div className="flex text-center w-full items-center justify-center">
                <div></div>
                {isLoading ? (
                    <span className="loading loading-dots loading-lg mt-20 ml-10"></span>
                ) : (
                    <p
                        className="text-center text-6xl mt-10 font-fairplay"
                        onClick={() => setDisplayUpdateEventDialog(true)}
                    >
                        {fetchedEvent.eventTitle}
                    </p>
                )}

                <Button
                    className="absolute right-20 mt-10 border-1 border-red-500 "
                    onClick={() => {
                        setDisplayDeleteEventDialog(true);
                        console.log(
                            "Delete dialog state:",
                            displayDeleteEventDialog
                        ); // Check if state updates
                    }}
                    size="lg"
                >
                    <Trash2
                        size={20}
                        strokeWidth={1}
                        color="#FF0000"
                        className="z-1 mr-3  hover:cursor-pointer"
                    />
                    <p className="mt-1 text-base text-red-500">Delete</p>
                </Button>
            </div>
            <AlertDialog
                open={displayDeleteEventDialog}
                onOpenChange={setDisplayDeleteEventDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your event and all the expenses entered
                            within it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteEvent}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog
                open={displayDeleteExpenseDialog}
                onOpenChange={setDisplayDeleteExpenseDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your expense and all the data entered within
                            it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteExpense()}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog
                open={displayUpdateEventDialog}
                onOpenChange={setDisplayUpdateEventDialog}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogDescription>
                            Make changes to your event here. Click save when
                            you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="name"
                                value={eventTitleUpdate}
                                onChange={(e) =>
                                    setEventTitleUpdate(e.target.value)
                                }
                                className="col-span-3"
                            />
                        </div>
                        {/* <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    defaultValue="@peduarte"
                                    className="col-span-3"
                                />
                            </div> */}
                    </div>
                    <DialogFooter>
                        {isUpdatingEvent ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button onClick={updateEvent}>Save Changes</Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* TODO: FIX THIS TOO */}
            <Dialog
                open={displayUpdateExpenseDialog}
                onOpenChange={setDisplayUpdateExpenseDialog}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Expense</DialogTitle>
                        <DialogDescription>
                            Make changes to your expense here. Click save when
                            you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="name"
                                value={eventTitleUpdate}
                                onChange={(e) =>
                                    setEventTitleUpdate(e.target.value)
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        {isUpdatingExpense ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button onClick={updateExpense}>
                                Save Changes
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {displayAddExpenseDialog && (
                <>
                    {/* Background overlay */}
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

                    {/* Dialog card */}
                    <Card className="fixed top-1/2 left-1/2 w-[450px] transform -translate-x-1/2 -translate-y-1/2 z-50">
                        <CardHeader>
                            <CardTitle>Add Expense</CardTitle>
                            <CardDescription>
                                Add a new expense to the event.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="expenseName">
                                            Expense Name *
                                        </Label>
                                        <Input
                                            id="expenseName"
                                            value={expenseName}
                                            onChange={(e) =>
                                                setExpenseName(e.target.value)
                                            }
                                            placeholder="Enter the expense name"
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="amount">Amount *</Label>
                                        <Input
                                            id="amount"
                                            value={expenseAmount}
                                            onChange={(e) =>
                                                setExpenseAmount(e.target.value)
                                            }
                                            placeholder="Enter the amount in rupees"
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="picture">Image</Label>
                                        <Input
                                            id="picture"
                                            type="file"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="category">
                                            Category *
                                        </Label>
                                        <div>
                                            {categories.map(
                                                (category, index) => (
                                                    <Badge
                                                        key={index}
                                                        className={`hover:cursor-pointer`}
                                                        variant={`${
                                                            selectedCategory ===
                                                            index
                                                                ? "outline"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            handleBadgeClick(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        {category.name}
                                                    </Badge>
                                                )
                                            )}
                                            <Badge
                                                variant={"secondary"}
                                                className={
                                                    "hover:cursor-pointer"
                                                }
                                                onClick={() =>
                                                    setDisplayAddCategoryDialog(
                                                        true
                                                    )
                                                }
                                            >
                                                + Add Category
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        {displayAddCategoryDialog && (
                            <>
                                {/* Background overlay */}
                                <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

                                {/* Dialog card */}
                                <Card className="fixed top-1/2 left-1/2 w-[350px] transform -translate-x-1/2 -translate-y-1/2 z-50">
                                    <CardHeader>
                                        <CardTitle>Add Category</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form>
                                            <div className="grid w-full items-center gap-4">
                                                <div className="flex flex-col space-y-1.5">
                                                    <Label htmlFor="expenseName">
                                                        Category Name
                                                    </Label>
                                                    <Input
                                                        value={addCategoryName}
                                                        onChange={(e) =>
                                                            setAddCategoryName(
                                                                e.target.value
                                                            )
                                                        }
                                                        id="expenseName"
                                                        placeholder="Enter the category name"
                                                    />
                                                </div>
                                            </div>
                                        </form>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setDisplayAddCategoryDialog(
                                                    false
                                                );
                                                setAddCategoryName(null);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        {isCreatingCategory ? (
                                            <Button disabled>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Please wait
                                            </Button>
                                        ) : (
                                            <Button onClick={createCategory}>
                                                Add
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            </>
                        )}

                        <CardFooter className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setDisplayAddExpenseDialog(false);
                                    setExpenseAmount(null);
                                    setExpenseName(null);
                                    setSelectedCategory(null);
                                }}
                            >
                                Cancel
                            </Button>
                            {isCreatingExpense ? (
                                <Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button onClick={addEventExpense}>Add</Button>
                            )}
                        </CardFooter>
                    </Card>
                </>
            )}
            <div className="mt-20 mx-16">
                <Table>
                    {fetchedEventExpense && fetchedEventExpense.length > 0 && (
                        <TableCaption>
                            A list of your transactions in this event.
                        </TableCaption>
                    )}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead className="w-[100px]">Id</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fetchedEventExpense &&
                        fetchedEventExpense.length > 0 ? (
                            fetchedEventExpense.map((expense, index) => (
                                <TableRow
                                    key={index}
                                    className="relative group"
                                >
                                    <TableCell className="font-medium"></TableCell>
                                    <TableCell className="font-medium"></TableCell>
                                    <TableCell className="font-medium">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        {expense.expenseTitle}
                                    </TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(expense.createdAt),
                                            "dd/MM/yyyy HH:mm:ss"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(expense.updatedAt),
                                            "dd/MM/yyyy HH:mm:ss"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {findTitleById(expense.category)}
                                    </TableCell>
                                    <TableCell>
                                        <a
                                            href={expense.expenseImage}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block"
                                        >
                                            <img
                                                src={expense.expenseImage || "./src/assets/defaultImg.jpg"}
                                                alt="Expense Image"
                                                width={60}
                                                className="rounded-lg hover:cursor-pointer"
                                            />
                                        </a>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-lg ">
                                        ₹{expense.amount}
                                    </TableCell>
                                    <div className="absolute left-[20px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex space-x-2">
                                        <Pencil
                                            size={24}
                                            color="#4A90E2"
                                            strokeWidth={2}
                                            className="hover:cursor-pointer mr-2"
                                            onClick={() =>
                                                setDisplayUpdateExpenseDialog(
                                                    true
                                                )
                                            }
                                        />
                                        <Trash2
                                            size={24}
                                            color="#ff3d3d"
                                            strokeWidth={2}
                                            className="hover:cursor-pointer "
                                            onClick={() => {
                                                setDisplayDeleteExpenseDialog(
                                                    true
                                                );
                                                setExpenseStagedForDeletion(
                                                    expense
                                                );
                                            }}
                                        />
                                    </div>
                                </TableRow>
                            ))
                        ) : (
                            <>
                                <TableRow>
                                    <TableCell
                                        colSpan="9"
                                        className="text-center"
                                    >
                                        No Expenses
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-center mt-10 mb-20">
                    <Button
                        variant="outline"
                        className="dark:bg-blue-700"
                        onClick={() => setDisplayAddExpenseDialog(true)}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SingleEvent;
