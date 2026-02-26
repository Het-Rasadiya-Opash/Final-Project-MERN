import type { Request, Response } from "express";
import { listingModel } from "../models/listing.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

export const createListing = async (req: Request, res: Response) => {
  const { title, description, price, category, location } = req.body;

  if (!title || !price || !location) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const images = req.files as Express.Multer.File[];

  if (!images || images.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one image is required",
    });
  }

  const uploadPromises = images.map((file) => uploadOnCloudinary(file.path));
  const uploadResults = await Promise.all(uploadPromises);
  const imageUrls = uploadResults
    .filter((result) => result !== null)
    .map((result) => result!.url);

  if (imageUrls.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Failed to upload images",
    });
  }

  try {
    const listing = await listingModel.create({
      title,
      description,
      price,
      category,
      location,
      images: imageUrls,
      owner: (req as any).user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      data: listing,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create listing",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllListings = async (req: Request, res: Response) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const listings = await listingModel
      .find(filter)
      .populate("owner", "username email");

    return res.status(200).json({
      success: true,
      data: listings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch listings",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};


export const getListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const listing = await listingModel.findById(id).populate("owner", "username email");
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch listing",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
