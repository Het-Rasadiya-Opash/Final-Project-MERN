import type { Request, Response } from "express";
import { listingModel } from "../models/listing.model.js";
import { reviewModel } from "../models/review.model.js";
import { bookingModel } from "../models/booking.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import { json2csv } from "json-2-csv";
import { userModel } from "../models/user.model.js";
import { likeModel } from "../models/like.model.js";

export const createListing = async (req: Request, res: Response) => {
  const { title, description, price, category, location, coordinates } =
    req.body;

  if (!title || !price || !location || !coordinates) {
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
    let parsedCoordinates = coordinates;

    if (typeof coordinates === "string") {
      parsedCoordinates = JSON.parse(coordinates);
    }

    if (Array.isArray(parsedCoordinates) && parsedCoordinates.length === 2) {
      parsedCoordinates = [
        Number(parsedCoordinates[0]),
        Number(parsedCoordinates[1]),
      ];
    }

    const listing = await listingModel.create({
      title,
      description,
      price,
      category,
      location,
      images: imageUrls,
      geometry: {
        coordinates: parsedCoordinates,
      },
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
    const { search, category, minPrice, maxPrice, sortBy, sort } = req.query;

    const filter: any = {};
    const sortValue = String(sortBy || sort || "newest").toLowerCase();

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

    let sortStage: Record<string, 1 | -1>;

    switch (sortValue) {
      case "price":
        sortStage = { price: 1, createdAt: -1 };
        break;
      case "rating":
        sortStage = { avgRating: -1, createdAt: -1 };
        break;
      case "newest":
      default:
        sortStage = { createdAt: -1 };
        break;
    }

    const listings = await listingModel.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "listing",
          as: "reviewsData",
        },
      },
      {
        $addFields: {
          avgRating: {
            $ifNull: [{ $avg: "$reviewsData.rating" }, 0],
          },
        },
      },
      { $sort: sortStage },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                username: 1,
                email: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: { $arrayElemAt: ["$owner", 0] },
          avgRating: { $round: ["$avgRating", 1] },
        },
      },
      {
        $project: {
          reviewsData: 0,
        },
      },
    ]);

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

export const incrementListingViews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await listingModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ success: false });
  }
};

export const getListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const listing = await listingModel
      .findById(id)
      .populate("owner", "username email");
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
};

export const getSimilarListings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const listing = await listingModel.findById(id, "category");
    if (!listing)
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    const similar = await listingModel
      .find({ category: listing.category, _id: { $ne: id as string } })
      .populate("owner", "username email")
      .limit(4);
    return res.status(200).json({ success: true, data: similar });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch similar listings" });
  }
};

export const getListingStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const listing = await listingModel.findById(id, "views owner");
    if (!listing)
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    const ownerId = (req as any).user._id;
    if (listing.owner.toString() !== ownerId.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    return res.status(200).json({ success: true, views: listing.views });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch stats" });
  }
};

export const getUserListing = async (req: Request, res: Response) => {
  try {
    const listings = await listingModel
      .find({ owner: (req as any).user._id })
      .populate("owner", "username email");
    if (!listings) {
      return res.status(404).json({
        success: false,
        message: "Listings not found",
      });
    }
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

export const userDeleteListing = async (req: Request, res: Response) => {
  const { listingId } = req.params;

  const ownerId = (req as any).user._id;
  const isAdmin = (req as any).user.admin;

  try {
    const listing = await listingModel.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    if (!isAdmin && listing.owner.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this listing",
      });
    }

    await Promise.all(listing.images.map((url) => deleteFromCloudinary(url)));

    if (listing.reviews && listing.reviews.length > 0) {
      await reviewModel.deleteMany({ _id: { $in: listing.reviews } });
    }

    await bookingModel.deleteMany({ listing: listingId } as any);
    await likeModel.deleteMany({ listing: listingId } as any);

    await listingModel.findByIdAndDelete(listingId);

    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete listing",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateListing = async (req: Request, res: Response) => {
  const { listingId } = req.params;
  const ownerId = (req as any).user._id;
  const { title, description, price, category, location, coordinates } =
    req.body;

  try {
    const listing = await listingModel.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    if (listing.owner.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this listing",
      });
    }

    const files = req.files as Express.Multer.File[];

    let imageUrls: string[] = listing.images || [];

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) => uploadOnCloudinary(file.path));
      const uploadResults = await Promise.all(uploadPromises);

      const newImageUrls = uploadResults
        .filter((result) => result !== null)
        .map((result) => result!.url);

      imageUrls = [...imageUrls, ...newImageUrls];
    }

    const updateData: any = {
      title,
      description,
      price,
      category,
      location,
      images: imageUrls,
    };

    if (coordinates) {
      let parsedCoordinates = coordinates;

      if (typeof coordinates === "string") {
        parsedCoordinates = JSON.parse(coordinates);
      }

      if (Array.isArray(parsedCoordinates) && parsedCoordinates.length === 2) {
        parsedCoordinates = [
          Number(parsedCoordinates[0]),
          Number(parsedCoordinates[1]),
        ];
      }

      updateData.geometry = {
        coordinates: parsedCoordinates,
      };
    }

    const updatedListing = await listingModel.findByIdAndUpdate(
      listingId,
      updateData,
      { returnDocument: "after" },
    );

    if (!imageUrls || imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      data: updatedListing,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update listing",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteListingImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { imageUrl } = req.body;

  try {
    const listing = await listingModel.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.images.length <= 1) {
      return res.status(400).json({
        message: "At least one image is required",
      });
    }

    await deleteFromCloudinary(imageUrl);

    listing.images = listing.images.filter((img) => img !== imageUrl);
    await listing.save();

    return res.status(200).json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete image",
    });
  }
};

export const getUserListingCSVData = async (req: Request, res: Response) => {
  try {
    const listings = await listingModel
      .find({ owner: (req as any).user._id })
      .populate("owner", "username email")
      .lean();

    if (!listings || listings.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No listings to export" });
    }

    const csv = json2csv(listings, {
      keys: [
        "title",
        "price",
        "location",
        "owner.username",
        "owner.email",
        "createdAt",
      ],
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=listings.csv");

    return res.status(200).send(csv);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to export CSV",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
