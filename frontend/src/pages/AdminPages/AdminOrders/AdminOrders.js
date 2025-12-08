import React from "react";
import "./AdminOrders.css";
import AdminOrderTable from "../../../components/AdminOrderTable/AdminOrderTable";

function AdminOrders() {
  return (
    <div className="admin-recipes-wrapper">
      <div className="content">
        <AdminOrderTable />
      </div>
    </div>
  );
}

export default AdminOrders;

