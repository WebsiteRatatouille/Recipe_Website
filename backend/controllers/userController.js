const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Sign in
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const emailNormalized = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) return res.status(400).json({ msg: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email: emailNormalized,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ msg: "Đăng ký thành công" });
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err });
  }
};

// Log in
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Vui lòng nhập đầy đủ email và mật khẩu" });
    }

    const emailNormalized = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailNormalized });

    if (!user) {
      console.log("Không tìm thấy user với email:", emailNormalized);
      return res.status(400).json({ msg: "Sai email hoặc mật khẩu" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Mật khẩu không khớp cho user:", emailNormalized);
      return res.status(400).json({ msg: "Sai email hoặc mật khẩu" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "1234",
      { expiresIn: "2h" }
    );

    res.status(200).json({
      msg: "Đăng nhập thành công",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { username, oldPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!username || !username.trim()) {
      return res
        .status(400)
        .json({ msg: "Tên người dùng không được để trống" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("Không tìm thấy user với id:", req.user.id);
      return res.status(404).json({ msg: "Không tìm thấy người dùng" });
    }

    // Nếu có thay đổi mật khẩu
    if (newPassword || confirmPassword) {
      if (!oldPassword) {
        return res.status(400).json({ msg: "Vui lòng nhập mật khẩu cũ" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        console.log("Mật khẩu cũ không đúng cho user:", user.email);
        return res.status(400).json({ msg: "Mật khẩu cũ không đúng" });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ msg: "Mật khẩu mới không khớp" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ msg: "Mật khẩu mới phải từ 6 ký tự" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Cập nhật username nếu có thay đổi
    if (username.trim() !== user.username) {
      user.username = username.trim();
    }

    await user.save();
    console.log("Cập nhật profile thành công cho user:", user.email);
    res.json({ msg: "Cập nhật thành công" });
  } catch (err) {
    console.error("Lỗi khi cập nhật profile:", err);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

module.exports = { register, login, updateProfile };
