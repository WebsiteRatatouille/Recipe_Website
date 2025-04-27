import React from "react";
import "./SocialMedia.css";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="social-icon">
    <path
      fill="currentColor"
      d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z"
    />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="social-icon">
    <path
      fill="currentColor"
      d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
    />
  </svg>
);

const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" className="social-icon">
    <path
      fill="currentColor"
      d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"
    />
  </svg>
);

const SocialMedia = () => {
  return (
    <div className="social-section">
      <h2>Kết Nối Với Chúng Tôi</h2>
      <div className="social-grid">
        <a
          href="https://facebook.com/your-page"
          target="_blank"
          rel="noopener noreferrer"
          className="social-card facebook"
        >
          <FacebookIcon />
          <span>Facebook</span>
        </a>
        <a
          href="https://youtube.com/your-channel"
          target="_blank"
          rel="noopener noreferrer"
          className="social-card youtube"
        >
          <YoutubeIcon />
          <span>YouTube</span>
        </a>
        <a
          href="https://tiktok.com/@your-account"
          target="_blank"
          rel="noopener noreferrer"
          className="social-card tiktok"
        >
          <TiktokIcon />
          <span>TikTok</span>
        </a>
      </div>
    </div>
  );
};

export default SocialMedia;
