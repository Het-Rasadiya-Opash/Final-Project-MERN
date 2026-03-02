import type { Request, Response } from "express";
import { bookingModel } from "../models/booking.model.js";
import { listingModel } from "../models/listing.model.js";
import { userModel } from "../models/user.model.js";

export const createBooking = async (req: Request, res: Response) => {
  const { listingId } = req.params;
  const userId = (req as any).user?._id;
  const { checkIn, checkOut, date, guests } = req.body;
  if (!listingId || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const listing = await listingModel.findById(listingId);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (listing.owner.id === userId) {
    return res
      .status(400)
      .json({ message: "You cannot book your own listing" });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const utcCheckInDate = Date.UTC(
    checkInDate.getFullYear(),
    checkInDate.getMonth(),
    checkInDate.getDate(),
  );
  const utcCheckOutDate = Date.UTC(
    checkOutDate.getFullYear(),
    checkOutDate.getMonth(),
    checkOutDate.getDate(),
  );

  const days = Math.abs(utcCheckOutDate - utcCheckInDate);
  const daysCount = Math.ceil(days / (1000 * 60 * 60 * 24));

  const totalPrice = listing.price * daysCount;

  const booking = await bookingModel.create({
    listing: listingId,
    customer: userId,
    checkIn,
    checkOut,
    guests,
    stayDay: daysCount,
    totalPrice,
  });
  return res.status(201).json(booking);
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const user = await userModel.findById(userId);
    if (!user?.admin) {
      return res.status(403).json({ message: "Access denied" });
    }
    const bookings = await bookingModel.find().populate("listing customer");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};
