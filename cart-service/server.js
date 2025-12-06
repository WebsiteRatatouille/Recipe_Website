import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Cart DB connected"))
  .catch(err => console.log(err));

app.use("/cart", cartRoutes);

app.get("/", (req, res) => res.send("Cart Service Running"));

app.listen(process.env.PORT, () =>
  console.log("Cart Service on " + process.env.PORT)
);
