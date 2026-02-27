import dotenv from "dotenv";
dotenv.config();
import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import { dbConnection } from "./config/db.js";
import errorHandler from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.route.js";
import listingRoutes from "./routes/listing.route.js";
import reviewRoutes from "./routes/review.route.js";
import cors from "cors";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/listing", listingRoutes);
app.use("/api/review", reviewRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  dbConnection();
});
