import React from "react";
import "./EbookGridOneColumn.css";
import EbookCard from "../EbookCard/EbookCard";

function EbookGridOneColumn({ ebookList }) {
    if (!Array.isArray(ebookList) || ebookList.length === 0) {
        return <div>Không có sách nào để hiển thị</div>;
    }

    return (
        <div className="ebook-grid-one-column-wrapper">
            {ebookList.map((ebook) => (
                <EbookCard
                    key={ebook._id}
                    id={ebook._id}
                    title={ebook.title}
                    author={ebook.author}
                    image={ebook.imageUrl}
                    price={ebook.price}
                />
            ))}
        </div>
    );
}

export default EbookGridOneColumn;

