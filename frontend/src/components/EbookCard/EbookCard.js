import React from "react";
import "./EbookCard.css";
import { Link } from "react-router-dom";

function EbookCard({ image, title, author, price, id }) {
  return (
    <div className="ebook-card">
      <div className="col">
        <Link className="card-link" to={`/ebooks/${id}`}>
          <div className="card">
            <img loading="lazy" src={image || "https://via.placeholder.com/300x400"} alt={title} />
            <div className="card-body">
              <h5 className="card-title">{title}</h5>
              {author && <p className="author">{author}</p>}
              {price !== undefined && (
                <p className="price">{price.toLocaleString('vi-VN')} đ</p>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default React.memo(EbookCard);

