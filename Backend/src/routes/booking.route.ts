import express from "express";
import { verifyToken } from "../middlewares/verfiyToken.js";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getListingAvailability,
  getOwnerRevenue,
  getUserBookings,
  listingOwnerChangeBookingStatus,
  ListingOwnerShowBookingDetails,
  updatePaymentStatus,
} from "../controllers/booking.controller.js";
const router = express.Router();

router.get("/availability/:listingId", getListingAvailability);
router.get("/revenue", verifyToken, getOwnerRevenue);
router.post("/:listingId", verifyToken, createBooking);
router.get("/", verifyToken, getAllBookings);
router.get("/all", verifyToken, ListingOwnerShowBookingDetails);
router.get("/user", verifyToken, getUserBookings);
router.put("/status", verifyToken, listingOwnerChangeBookingStatus);
router.put("/payment", verifyToken, updatePaymentStatus);
router.delete("/delete", verifyToken, deleteBooking);

export default router;
