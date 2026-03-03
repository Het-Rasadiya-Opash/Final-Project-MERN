"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingModel = void 0;
var mongoose_1 = require("mongoose");
var listingSchema = new mongoose_1.default.Schema({
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
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Owner is Required"],
    },
    reviews: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
}, {
    timestamps: true,
});
exports.listingModel = mongoose_1.default.model("Listing", listingSchema);
