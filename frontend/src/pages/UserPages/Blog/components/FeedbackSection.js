import React from "react";

const FeedbackSection = () => {
  const exploreTags = [
    { label: "Công thức", href: "/recipes" },
    { label: "Nấu ăn mỗi ngày", href: "/" },
    { label: "Bộ sưu tập đặc biệt", href: "#" },
  ];

  return (
    <div className="blog-feedback-section">
      <div className="explore-more">
        <h2>Đăng kí để trở thành thành viên:</h2>
        <div className="tags">
          {exploreTags.map((tag, index) => (
            <a key={index} href={tag.href} aria-label={`Explore ${tag.label}`}>
              {tag.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;
