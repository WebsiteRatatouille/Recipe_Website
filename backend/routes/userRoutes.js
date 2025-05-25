const express = require("express");
const router = express.Router();
const {
  register,
  login,
  updateProfile,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.put("/update-profile", auth, updateProfile);

module.exports = router;
