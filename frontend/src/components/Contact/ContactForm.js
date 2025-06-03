import React, { useState } from "react";
import "./ContactForm.css";
import axios from "axios";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );
      console.log("Message sent successfully:", response.data);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      alert(
        "Cảm ơn bạn đã gửi tin nhắn. Chúng tôi sẽ phản hồi sớm nhất có thể!"
      );
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="contact-form-container">
      <h2>Gửi Tin Nhắn Cho Chúng Tôi</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Họ và tên</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Nhập họ và tên của bạn"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Nhập địa chỉ email của bạn"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Tiêu đề</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Nhập tiêu đề tin nhắn"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Nội dung tin nhắn</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Nhập nội dung tin nhắn của bạn"
            rows="5"
          ></textarea>
        </div>

        <button type="submit" className="submit-button">
          Gửi tin nhắn
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
