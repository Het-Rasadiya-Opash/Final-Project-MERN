import dotenv from "dotenv";
dotenv.config();
import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import { dbConnection } from "./config/db.js";
import errorHandler from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.route.js";
import listingRoutes from "./routes/listing.route.js";
import reviewRoutes from "./routes/review.route.js";
import bookingRoutes from "./routes/booking.route.js";
import cors from "cors";
import Stripe from "stripe";
export const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
//stripe routes
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { listing } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: listing.title,
              images: [listing.images[0]],
            },
            unit_amount: listing.price ,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/profile",
      cancel_url: "http://localhost:5173/profile",
    });
    res.json({
      url: session.url,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/api/user", userRoutes);
app.use("/api/listing", listingRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/booking", bookingRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  dbConnection();
});
