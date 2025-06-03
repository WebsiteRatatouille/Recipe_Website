import React, { useState, useEffect } from "react";
import "./CategoryTable.css";
import { DataGrid } from "@mui/x-data-grid";
import { viVN } from "@mui/x-data-grid/locales";
import {
    Box,
    Paper,
    Typography,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const paginationModel = { page: 0, pageSize: 10 };

export default function CategoryTable() {
    const [rows, setRows] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    const handleViewCategory = async (id) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/categories/${id}`);
            const data = await res.json();
            setSelectedCategory(data);
            setOpenDialog(true);
        } catch (err) {
            console.error("Lỗi khi lấy danh mục:", err);
        }
    };

    const columns = [
        {
            field: "image",
            headerName: "Ảnh",
            width: 90,
            renderCell: (params) => (
                <img src={params.row.image} alt="" style={{ width: 60, height: 40 }} />
            ),
        },
        { field: "displayName", headerName: "Tên hiển thị", width: 200 },
        { field: "name", headerName: "Slug", width: 200 },

        {
            field: "createdAt",
            headerName: "Tạo lúc",
            width: 120,
        },
        {
            field: "updatedAt",
            headerName: "Cập nhật",
            width: 120,
        },
        {
            field: "actions",
            headerName: "Hành động",
            width: 140,
            renderCell: (params) => (
                <div className="action-button-category-table">
                    <Tooltip title="Xem" placement="top">
                        <i
                            className="bx bx-show"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleViewCategory(params.row.id)}
                        ></i>
                    </Tooltip>
                    <Tooltip title="Sửa" placement="top">
                        <i className="bx bx-edit"></i>
                    </Tooltip>
                    <Tooltip title="Xóa" placement="top">
                        <i className="bx bx-trash"></i>
                    </Tooltip>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`);
                const data = await res.json();
                const formatted = data.map((cat) => ({
                    id: cat._id,
                    name: cat.name,
                    displayName: cat.displayName,
                    image: cat.image,

                    createdAt: new Date(cat.createdAt).toLocaleDateString("vi-VN"),
                    updatedAt: new Date(cat.updatedAt).toLocaleDateString("vi-VN"),
                }));
                setRows(formatted);
            } catch (err) {
                console.error("Lỗi khi tải danh mục:", err);
            }
        };
        fetchCategories();
    }, []);

    return (
        <Paper className="table-wrapper" sx={{ maxHeight: "80vh", width: "90%" }}>
            <Box className="table-toolbar">
                <Typography className="table-title">Danh sách danh mục</Typography>
            </Box>

            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
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
                    noRowsLabel: "Không có dữ liệu",
                    footerRowSelected: (count) =>
                        count === 1 ? "Đã chọn 1 dòng" : `Đã chọn ${count} dòng`,
                    footerPaginationLabelRowsPerPage: "Số dòng mỗi trang",
                    footerPaginationLabelDisplayedRows: ({ from, to, count }) =>
                        `${from}–${to} trong ${count}`,
                }}
            />

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <IconButton
                        onClick={() => setOpenDialog(false)}
                        style={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedCategory && (
                        <div>
                            <h2>{selectedCategory.displayName}</h2>
                            <img
                                src={selectedCategory.image}
                                alt="Ảnh danh mục"
                                style={{ width: "100%" }}
                            />
                            <p>{selectedCategory.description}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Paper>
    );
}
