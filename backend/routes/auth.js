const express = require("express");
const passport = require("passport");
const router = express.Router();

// Facebook routes
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    // Đăng nhập Facebook thành công, redirect về frontend kèm token và user ID
    const token = req.user.generateAuthToken();
    // EncodeURIComponent để đảm bảo các ký tự đặc biệt trong token và id không gây lỗi URL
    res.redirect(
      `http://localhost:3000/?token=${encodeURIComponent(
        token
      )}&userId=${encodeURIComponent(
        req.user._id
      )}&provider=${encodeURIComponent(req.user.provider)}`
    );
  }
);

// Google routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Đăng nhập Google thành công, redirect về frontend kèm token và user ID
    const token = req.user.generateAuthToken();
    // EncodeURIComponent để đảm bảo các ký tự đặc biệt trong token và id không gây lỗi URL
    res.redirect(
      `http://localhost:3000/?token=${encodeURIComponent(
        token
      )}&userId=${encodeURIComponent(
        req.user._id
      )}&provider=${encodeURIComponent(req.user.provider)}`
    );
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
