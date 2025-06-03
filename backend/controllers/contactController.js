const asyncHandler = require("express-async-handler");
const Contact = require("../models/Contact");

// @desc    Create new contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = asyncHandler(async (req, res) => {
  console.log("Received contact form submission:", req.body);
  const { name, email, subject, message } = req.body;

  // Simple validation
  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const contactMessage = new Contact({
    name,
    email,
    subject,
    message,
  });

  try {
    const createdContactMessage = await contactMessage.save();
    console.log("Contact message saved successfully:", createdContactMessage);
    res.status(201).json(createdContactMessage);
  } catch (error) {
    console.error("Error saving contact message:", error);
    res
      .status(500)
      .json({ message: "Error saving contact message", error: error.message });
  }
});

module.exports = {
  createContactMessage,
};
