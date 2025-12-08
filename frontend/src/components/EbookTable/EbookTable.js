import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Paper, Tooltip } from "@mui/material";
import { viVN } from "@mui/x-data-grid/locales";
import { useNavigate } from "react-router-dom";

// Tái sử dụng style bảng của RecipeTable
import "../RecipeTable/RecipeTable.css";

const paginationModel = { page: 0, pageSize: 10 };

function EbookTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const columns = [
    {
      field: "imageUrl",
      headerName: "Ảnh",
      width: 90,
      headerAlign: "center",
      renderCell: (params) => (
        <img
          src={params.row.imageUrl || "https://via.placeholder.com/60x80"}
          alt={params.row.title}
          style={{ width: 60, height: 80, objectFit: "cover", marginLeft: 8 }}
        />
      ),
    },
    { field: "title", headerName: "Tên sách", width: 280 },
    { field: "author", headerName: "Tác giả", width: 160 },
    {
      field: "price",
      headerName: "Giá",
      width: 120,
      renderCell: (params) => `${params.value?.toLocaleString("vi-VN")} ₫`,
    },
    { field: "createdAt", headerName: "Ngày tạo", width: 140 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 120,
      renderCell: (params) => (
        <div className="action-button-recipe-table">
          <Tooltip title="Xem sách" placement="top">
            <i
              className="bx bx-show"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/ebooks/${params.row.id}`)}
            ></i>
          </Tooltip>
        </div>
      ),
    },
  ];

  const fetchEbooks = async () => {
    setLoading(true);
    try {
      const ebookServiceUrl = process.env.REACT_APP_EBOOK_URL || "http://localhost:5001";
      const res = await axios.get(`${ebookServiceUrl}`);
      const formatted = (res.data || []).map((item) => ({
        id: item._id,
        imageUrl: item.imageUrl,
        title: item.title,
        author: item.author || "Chưa có",
        price: item.price || 0,
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "",
      }));
      setRows(formatted);
    } catch (err) {
      console.error("Lỗi khi tải sách:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

  return (
    <Paper className="table-wrapper" sx={{ maxHeight: "80vh", width: "90%" }}>
      <Box className="table-toolbar">
        <Typography className="table-title">Danh sách sách</Typography>
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
          footerPaginationLabelDisplayedRows: ({ from, to, count }) => `${from}–${to} trong ${count}`,
        }}
      />
    </Paper>
  );
}

export default EbookTable;
