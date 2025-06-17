const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.BASE_URL}/api/users/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Xác thực Email của bạn",
    html: `<p>Vui lòng nhấp vào liên kết sau để xác thực email của bạn: <a href="${url}">${url}</a></p>`,
  });
};

module.exports = { sendVerificationEmail };
