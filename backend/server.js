const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // <-- import file db.js
const cors = require("cors");

dotenv.config(); // load .env

const app = express();
app.use(cors()); // Cho phép frontend (React) truy cập backend
app.use(express.json()); // Cho phép xử lý JSON từ body request

// Connect database
connectDB();

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
