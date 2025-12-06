import mongoose from "mongoose";

const ebookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    author: String,
    price: { type: Number, required: true },
    imageUrl: String,
    pdfUrl: String
  },
  { timestamps: true }
);

export default mongoose.model("Ebook", ebookSchema);
