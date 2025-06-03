const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Add connection options here if needed, e.g.:
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`); // Log connection host on success
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`); // More detailed error message
    process.exit(1); // dừng server nếu connect fail
  }
};

module.exports = connectDB;
