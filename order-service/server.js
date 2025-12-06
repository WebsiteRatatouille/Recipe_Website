import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Order DB connected"))
  .catch((err) => console.log(err));

app.use("/orders", orderRoutes);

app.get("/", (req, res) => res.send("Order Service Running"));

app.listen(process.env.PORT, () =>
  console.log("Order Service on " + process.env.PORT)
);
