import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Paper, Tooltip, Chip } from "@mui/material";
import { viVN } from "@mui/x-data-grid/locales";
import "../RecipeTable/RecipeTable.css";

const paginationModel = { page: 0, pageSize: 10 };

const statusColor = {
  pending: "warning",
  paid: "success",
  cancelled: "default",
};

function AdminOrderTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: "userId", headerName: "User ID", width: 200 },
    { field: "userName", headerName: "Tên user", width: 200 },
    { field: "createdAt", headerName: "Ngày tạo", width: 160 },
    { field: "itemCount", headerName: "Số lượng SP", width: 120 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 140,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Chip
            label={params.value}
            color={statusColor[params.value] || "default"}
            size="small"
          />
        </Tooltip>
      ),
    },
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const orderServiceUrl = process.env.REACT_APP_ORDER_URL;
      const { data } = await axios.get(`${orderServiceUrl}/orders`);
      const formatted = (data || []).map((o) => ({
        id: o._id,
        userId: o.userId,
        userName: o.userName || o.userId,
        createdAt: o.createdAt
          ? new Date(o.createdAt).toLocaleString("vi-VN")
          : "",
        itemCount: o.items?.reduce((sum, it) => sum + (it.quantity || 0), 0) || 0,
        status: o.status || "pending",
      }));
      setRows(formatted);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Paper className="table-wrapper" sx={{ maxHeight: "80vh", width: "90%" }}>
      <Box className="table-toolbar">
        <Typography className="table-title">Đơn hàng người dùng</Typography>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{
          border: 0,
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          },
        }}
        localeText={{
          ...viVN.components.MuiDataGrid.defaultProps.localeText,
          noRowsLabel: loading ? "Đang tải..." : "Không có dữ liệu",
          footerRowSelected: () => "",
          footerPaginationLabelRowsPerPage: "Số dòng mỗi trang",
          footerPaginationLabelDisplayedRows: ({ from, to, count }) =>
            `${from}–${to} trong ${count}`,
        }}
      />
    </Paper>
  );
}

export default AdminOrderTable;

