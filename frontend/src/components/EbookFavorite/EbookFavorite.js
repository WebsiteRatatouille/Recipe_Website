import React from "react";
import "./EbookFavorite.css";
import EbookGrid from "../EbookGrid/EbookGrid";

function EbookFavorite({ topEbookList }) {
    return (
        <div className="ebook-favorite-wrapper" id="ebook-favorite">
            <div className="ebook-favorite-title">
                <h2>Sách nổi bật</h2>
            </div>
            <EbookGrid ebookList={topEbookList} />
        </div>
    );
}

export default EbookFavorite;

