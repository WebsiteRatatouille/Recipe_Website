import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import ebookRoutes from "./routes/ebookRoutes.js";
import "./models/User.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Ebook DB connected"))
  .catch((err) => console.log(err));

// Routes - mount at root since API Gateway handles /ebooks prefix
app.use("/", ebookRoutes);

// Start server
app.listen(process.env.PORT, () =>
  console.log("Ebook Service on " + process.env.PORT)
);
