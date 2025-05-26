const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // <-- import file db.js
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

dotenv.config(); // load .env

require("./config/passport");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000", // URL của frontend
    credentials: true,
  })
);

app.use(express.json()); // Cho phép xử lý JSON từ body request

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect database
connectDB();

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/auth");

app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
