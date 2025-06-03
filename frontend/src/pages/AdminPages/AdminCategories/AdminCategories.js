import React from "react";
import "./AdminCategories.css";
import CategoryTable from "../../../components/CategoryTable/CategoryTable";

function AdminCategories() {
  return (
    <div className="admin-categories-wrapper">
      <h1>Admin Categories</h1>
      <div className="content">
        <CategoryTable />
      </div>
    </div>
  );
}

export default AdminCategories;
