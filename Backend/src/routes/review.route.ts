import express from "express";
import { createReview } from "../controllers/review.controller.js";
import { verifyToken } from "../middlewares/verfiyToken.js";
const router = express.Router();

router.post("/create/:listingId", verifyToken, createReview);

export default router;
