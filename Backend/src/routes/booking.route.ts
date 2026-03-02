import express from "express";
import { verifyToken } from "../middlewares/verfiyToken.js";
import { createBooking, getAllBookings } from "../controllers/booking.controller.js";
const router = express.Router();

router.post("/:listingId", verifyToken, createBooking);
router.get("/", verifyToken,getAllBookings);

export default router;
