import express from "express";
import {
  createListing,
  deleteListingImage,
  getAllListings,
  getListingById,
  getListingStats,
  getSimilarListings,
  getUserListing,
  getUserListingCSVData,
  incrementListingViews,
  updateListing,
  userDeleteListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../middlewares/verfiyToken.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/", verifyToken, upload.array("images", 5), createListing);
router.get("/", getAllListings);
router.get("/user-listing", verifyToken, getUserListing);
router.get("/csv-data", verifyToken, getUserListingCSVData);

router.get("/:id", getListingById);
router.post("/:id/view", incrementListingViews);
router.get("/:id/similar", getSimilarListings);
router.get("/:id/stats", verifyToken, getListingStats);
router.delete("/:listingId", verifyToken, userDeleteListing);
router.put(
  "/:listingId",
  verifyToken,
  upload.array("images", 5),
  updateListing,
);
router.delete("/:id/image", deleteListingImage);

export default router;
