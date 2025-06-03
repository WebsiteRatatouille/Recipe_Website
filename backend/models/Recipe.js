const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  ingredients: [String],
  steps: [String],
  imageThumb: String,
  images: [String],
  videoUrl: String,
  category: String,
  categoryDisplay: String,
  cookingTime: String,
  serves: Number,
  tags: [String],
  calories: Number,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  origin: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
