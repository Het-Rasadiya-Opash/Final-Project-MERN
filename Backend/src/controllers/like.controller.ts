import type { Request, Response } from "express";
import { likeModel } from "../models/like.model.js";

export const addLike = async (req: Request, res: Response) => {
  const { listingId, userId } = req.body;
  try {
    const existingLike = await likeModel.findOne({
      listing: listingId,
      user: userId,
    });
    if (existingLike) {
      await likeModel.findByIdAndDelete(existingLike._id);
      return res
        .status(200)
        .json({ message: "Like removed successfully", liked: false });
    }
    const newLike = await likeModel.create({
      listing: listingId,
      user: userId,
    });
    res
      .status(201)
      .json({ message: "Like added successfully", liked: true, newLike });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkLike = async (req: Request, res: Response) => {
  const { listingId, userId } = req.query;
  try {
    const existingLike = await likeModel.findOne({
      listing: listingId as string,
      user: userId as string,
    });
    res.status(200).json({ liked: !!existingLike });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
