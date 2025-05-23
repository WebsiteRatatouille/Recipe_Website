const mongoose = require("mongoose");
const Recipe = require("../models/recipeModel");
const dotenv = require("dotenv");

dotenv.config();

const recipes = [
  {
    title: "Cơm rang thập cẩm",
    description: "Món cơm rang đơn giản nhưng đầy đủ dinh dưỡng",
    ingredients: [
      "2 bát cơm nguội",
      "2 quả trứng",
      "100g thịt heo xay",
      "1 củ cà rốt",
      "1 củ hành tây",
      "Gia vị: muối, tiêu, nước mắm",
    ],
    instructions:
      "1. Đánh trứng và chiên sơ\n2. Xào thịt heo với hành tây\n3. Cho cơm vào xào\n4. Thêm trứng và gia vị\n5. Xào đều tay đến khi cơm khô và thơm",
    cookingTime: 20,
    servings: 2,
    image: "https://example.com/com-rang.jpg",
  },
  {
    title: "Canh chua cá lóc",
    description: "Món canh chua truyền thống của miền Tây",
    ingredients: [
      "1 con cá lóc",
      "2 quả dứa",
      "2 quả cà chua",
      "1 bó bạc hà",
      "Gia vị: muối, đường, nước mắm, me",
    ],
    instructions:
      "1. Làm sạch cá và cắt khúc\n2. Nấu nước dùng với me\n3. Cho cá vào nấu\n4. Thêm rau và gia vị\n5. Nêm nếm vừa ăn",
    cookingTime: 45,
    servings: 4,
    image: "https://example.com/canh-chua.jpg",
  },
];

const seedRecipes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Recipe.deleteMany({});
    await Recipe.insertMany(recipes);
    console.log("Đã thêm dữ liệu mẫu thành công!");
    process.exit();
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu mẫu:", error);
    process.exit(1);
  }
};

seedRecipes();
