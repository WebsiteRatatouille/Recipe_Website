import React from "react";
import "../AdminRecipes/AdminRecipes.css";
import EbookTable from "../../../components/EbookTable/EbookTable";

function AdminEbooks() {
  return (
    <div className="admin-recipes-wrapper">
      <div className="content">
        <EbookTable />
      </div>
    </div>
  );
}

export default AdminEbooks;
