import React from "react";
import "./AdminCategories.css";
import DataTable from "../../../components/DataTable/DataTable";

function AdminCategories() {
    return (
        <div className="admin-categories-wrapper">
            <h1>Admin Categories</h1>
            <div className="content">
                <DataTable />
            </div>
        </div>
    );
}

export default AdminCategories;
