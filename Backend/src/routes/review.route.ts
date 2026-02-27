import express from "express";
import { createReview, getReviewofListing } from "../controllers/review.controller.js";
import { verifyToken } from "../middlewares/verfiyToken.js";
const router = express.Router();

router.post("/create/:listingId", verifyToken, createReview);
router.get("/:listingId", getReviewofListing);

export default router;
