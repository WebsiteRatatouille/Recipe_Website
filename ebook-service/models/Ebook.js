import mongoose from "mongoose";

const ebookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    author: String,
    price: { type: Number, required: true },
    imageUrl: String,
    pdfUrl: String,

    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        userName: { type: String },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Ebook", ebookSchema);
