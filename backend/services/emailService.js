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

const sendContactNotificationEmail = async ({
  to,
  subject,
  name,
  email,
  messageSubject,
  message,
}) => {
  const html = `
    <h2>Tin nhắn liên hệ mới</h2>
    <p><strong>Người gửi:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Tiêu đề:</strong> ${messageSubject}</p>
    <p><strong>Nội dung:</strong></p>
    <p>${message}</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

const sendContactConfirmationEmail = async ({ to, name }) => {
  const html = `
    <h2>Xin chào ${name},</h2>
    <p>Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>
    <p>Trân trọng,<br>Đội ngũ Ratatouille</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Xác nhận tin nhắn liên hệ - Ratatouille",
    html,
  });
};

module.exports = {
  sendVerificationEmail,
  sendContactNotificationEmail,
  sendContactConfirmationEmail,
};
