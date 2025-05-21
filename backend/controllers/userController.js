const User = require("../models/User");
const bcrypt = require("bcrypt");

// Sign in
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "Email đã tồn tại" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ msg: "Đăng ký thành công" });
    } catch (err) {
        res.status(500).json({ msg: "Lỗi server", error: err });
    }
};

// Log in
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Sai email hoặc mật khẩu" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Sai email hoặc mật khẩu" });

        // Tạo JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "yourSecretKey",
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
        res.status(500).json({ msg: "Lỗi server", error: err });
    }
};

module.exports = { register, login };
