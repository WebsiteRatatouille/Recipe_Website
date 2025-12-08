import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Paper, Tooltip, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from "@mui/material";
import { viVN } from "@mui/x-data-grid/locales";
import { useNavigate } from "react-router-dom";

// Tái sử dụng style bảng của RecipeTable
import "../RecipeTable/RecipeTable.css";

const paginationModel = { page: 0, pageSize: 10 };

function EbookTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState("create"); // create | edit
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    imageUrl: "",
    description: "",
    pdfUrl: ""
  });
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
      width: 140,
      renderCell: (params) => (
        <div className="action-button-recipe-table">
          <Tooltip title="Xem sách" placement="top">
            <i
              className="bx bx-show"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/ebooks/${params.row.id}`)}
            ></i>
          </Tooltip>
          <Tooltip title="Sửa" placement="top">
            <i
              className="bx bx-edit"
              style={{ cursor: "pointer", marginLeft: 10 }}
              onClick={() => handleEdit(params.row)}
            ></i>
          </Tooltip>
          <Tooltip title="Xóa" placement="top">
            <i
              className="bx bx-trash"
              style={{ cursor: "pointer", marginLeft: 10, color: "#d00" }}
              onClick={() => handleDelete(params.row)}
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

  const resetForm = () => {
    setForm({
      title: "",
      author: "",
      price: "",
      imageUrl: "",
      description: "",
      pdfUrl: ""
    });
    setCurrentId(null);
  };

  const openCreate = () => {
    resetForm();
    setFormMode("create");
    setOpenForm(true);
  };

  const handleEdit = (row) => {
    setCurrentId(row.id);
    setFormMode("edit");
    setForm({
      title: row.title || "",
      author: row.author || "",
      price: row.price || "",
      imageUrl: row.imageUrl || "",
      description: row.description || "",
      pdfUrl: row.pdfUrl || ""
    });
    setOpenForm(true);
  };

  const handleDelete = async (row) => {
    if (!window.confirm("Xóa sách này?")) return;
    try {
      const ebookServiceUrl = process.env.REACT_APP_EBOOK_URL || "http://localhost:5001";
      await axios.delete(`${ebookServiceUrl}/${row.id}`);
      fetchEbooks();
    } catch (err) {
      console.error("Lỗi khi xóa sách:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      const ebookServiceUrl = process.env.REACT_APP_EBOOK_URL || "http://localhost:5001";
      const payload = {
        ...form,
        price: Number(form.price) || 0,
      };
      if (formMode === "create") {
        await axios.post(`${ebookServiceUrl}/`, payload);
      } else if (formMode === "edit" && currentId) {
        await axios.put(`${ebookServiceUrl}/${currentId}`, payload);
      }
      setOpenForm(false);
      resetForm();
      fetchEbooks();
    } catch (err) {
      console.error("Lỗi khi lưu sách:", err);
    }
  };

  return (
    <Paper className="table-wrapper" sx={{ maxHeight: "80vh", width: "90%" }}>
      <Box className="table-toolbar">
        <Typography className="table-title">Danh sách sách</Typography>
        <Button variant="contained" onClick={openCreate}>
          Thêm sách
        </Button>
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

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{formMode === "create" ? "Thêm sách" : "Sửa sách"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Tiêu đề"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <TextField
              label="Tác giả"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
            />
            <TextField
              label="Giá"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <TextField
              label="Ảnh (URL)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <TextField
              label="PDF (URL)"
              value={form.pdfUrl}
              onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
            />
            <TextField
              label="Mô tả"
              multiline
              minRows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default EbookTable;
