import express from "express";
import {
  createListing,
  getAllListings,
  getListingById,
  getUserListing,
  userDeleteListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../middlewares/verfiyToken.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/", verifyToken, upload.array("images", 5), createListing);
router.get("/", getAllListings);
router.get("/user-listing", verifyToken, getUserListing);
router.get("/:id", getListingById);
router.delete("/:listingId", verifyToken, userDeleteListing);

export default router;
