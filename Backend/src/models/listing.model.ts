import mongoose from "mongoose";

interface Listing {
  title: string;
  description?: string;
  price: number;
  images: string[];
  location: string;
  category: "rooms" | "beachfront" | "cabins" | "trending" | "city" | "countryside";
  owner: mongoose.Types.ObjectId;
  review?: mongoose.Types.ObjectId;
}

interface ListingDocument extends Listing, mongoose.Document {}

const listingSchema = new mongoose.Schema<ListingDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is  Required"],
      index: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Price is Required"],
    },
    images: {
      type: [String],
      required: [true, "Image is Required"],
    },

    location: {
      type: String,
      required: [true, "Location is Required"],
    },
    category: {
      type: String,
      enum: {
        values: [
          "rooms",
          "beachfront",
          "cabins",
          "trending",
          "city",
          "countryside",
        ],
        message: "Invalid category",
      },
      default: "rooms",
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is Required"],
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  },
  {
    timestamps: true,
  },
);

export const listingModel = mongoose.model<ListingDocument>("Listing", listingSchema);
