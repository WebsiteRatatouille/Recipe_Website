import React from "react";
import "./SearchBar.css";

function SearchBar() {
    return (
        <div className="search-bar-wrapper">
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm công thức"
                    aria-label="Recipient's username"
                    aria-describedby="button-addon2"
                />

                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                >
                    Tìm kiếm
                </button>
            </div>
        </div>
    );
}

export default SearchBar;
