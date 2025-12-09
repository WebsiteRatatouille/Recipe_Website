import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  payUrl: { type: String },
  // orderId mà gửi sang MoMo (orderIdMomo), dùng để map khi xử lý IPN
  momoOrderId: { type: String },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
