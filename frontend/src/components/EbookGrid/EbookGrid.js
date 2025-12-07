import React from "react";
import "./EbookGrid.css";

import EbookCard from "../EbookCard/EbookCard";

function EbookGrid({ ebookList }) {
    if (!Array.isArray(ebookList) || ebookList.length === 0) {
        return <div>Không có sách nào để hiển thị</div>;
    }

    return (
        <div className="ebook-grid-wrapper">
            <div className="card-container">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
                    {ebookList.map((ebook) =>
                        ebook && ebook._id ? (
                            <EbookCard
                                key={ebook._id}
                                id={ebook._id}
                                title={ebook.title}
                                author={ebook.author}
                                image={ebook.imageUrl}
                                price={ebook.price}
                            />
                        ) : null
                    )}
                </div>
            </div>
        </div>
    );
}

export default EbookGrid;

