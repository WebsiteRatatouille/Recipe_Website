import React from "react";
import "./EbookInfo.css";
import SmallLineSeparator from "../SmallLineSeparator/SmallLineSeparator";

function EbookInfo({ ebook }) {
    const handleBuyNow = () => {
        // TODO: Implement buy now functionality
        alert("Tính năng mua sách đang được phát triển!");
    };

    return (
        <div className="ebook-info-wrapper">
            <h1 className="ebook-title">{ebook.title}</h1>

            <div className="ebook-detail">
                {ebook.author && (
                    <div className="author">
                        <span>Tác giả:</span>
                        <span style={{ fontWeight: "bold" }}>{ebook.author}</span>
                    </div>
                )}

                <div className="ebook-price-section">
                    <span>Giá:</span>
                    <span style={{ fontWeight: "bold", color: "var(--primary-color, #ff6b35)", fontSize: "24px" }}>
                        {ebook.price?.toLocaleString('vi-VN')} ₫
                    </span>
                </div>

                {ebook.description && (
                    <p>&quot;{ebook.description}&quot;</p>
                )}

                <div className="ebook-image-container">
                    <img 
                        src={ebook.imageUrl || "https://via.placeholder.com/400x600"} 
                        alt={ebook.title}
                        className="ebook-cover-image"
                    />
                </div>

                <div className="ebook-actions">
                    <button className="btn-buy-now" onClick={handleBuyNow}>
                        Mua ngay
                    </button>
                    {ebook.pdfUrl && (
                        <a 
                            href={ebook.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-preview"
                        >
                            Xem trước
                        </a>
                    )}
                </div>

                <SmallLineSeparator />
            </div>
        </div>
    );
}

export default EbookInfo;

