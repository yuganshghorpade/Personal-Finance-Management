import { Router } from "express";
import {
    addEventExpense,
    createEvent,
    deleteEvent,
    deleteEventExpense,
    fetchEventDetails,
    fetchEventExpense,
    fetchEvents,
    updateEvent,
    updateEventExpense
} from '../controllers/events.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/create-event").post(verifyJWT,createEvent)
router.route("/fetch-events").get(verifyJWT,fetchEvents)
router.route("/delete-event").post(verifyJWT,deleteEvent)
router.route("/add-event-expense").post(verifyJWT,
    upload.single('expenseImage'),
    addEventExpense)
router.route("/update-event-expense").post(
    upload.single('expenseImage'),
    updateEventExpense)
router.route("/fetch-event-expenses").get(verifyJWT,fetchEventExpense)
router.route("/delete-event-expense").delete(verifyJWT,deleteEventExpense)
router.route("/fetch-event-details").get(verifyJWT,fetchEventDetails)
router.route("/update-event").patch(verifyJWT,updateEvent)

    

export default router