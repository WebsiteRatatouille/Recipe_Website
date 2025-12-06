import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Payment DB connected"))
  .catch((err) => console.log(err));

app.use("/payments", paymentRoutes);

app.get("/", (req, res) => res.send("Payment Service Running"));

app.listen(process.env.PORT, () =>
  console.log("Payment Service on " + process.env.PORT)
);
