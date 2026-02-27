import type { Request, Response } from "express";
import { reviewModel } from "../models/review.model.js";
import { listingModel } from "../models/listing.model.js";

export const createReview = async (req: Request, res: Response) => {
  const { comment, rating } = req.body;
  const { listingId } = req.params;
  console.log(comment, rating);

  if (!comment || !rating) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const review = await reviewModel.create({
      comment,
      rating,
      owner: (req as any).user?._id,
    });

    const listing = await listingModel.findByIdAndUpdate(
      listingId,
      {
        $push: { reviews: review._id },
      },
      {
        returnDocument: "after",
      },
    );

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      listing,
      review,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getReviewofListing = async (req: Request, res: Response) => {
  const { listingId } = req.params;
  try {
    const listing = await listingModel.findById(listingId).populate("reviews");
    const review = await reviewModel
      .findById(listing?.reviews?.[0])
      .populate("owner", "username");
    return res.status(200).json({
      success: true,
      listing,
      review,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
