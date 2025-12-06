import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: String,
  userId: String,
  amount: Number,
  status: {
    type: String,
    default: "pending",
  }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
