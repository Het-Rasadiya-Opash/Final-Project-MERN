import express from "express";
import { verifyToken } from "../middlewares/verfiyToken.js";
import { adminChangeBookingStatus, createBooking, deleteBooking, getAllBookings, getUserBookings } from "../controllers/booking.controller.js";
const router = express.Router();

router.post("/:listingId", verifyToken, createBooking);
router.get("/", verifyToken,getAllBookings);
router.get("/user", verifyToken, getUserBookings);
router.put("/status", verifyToken, adminChangeBookingStatus);
router.delete("/delete", verifyToken, deleteBooking);



export default router;
