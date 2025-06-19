import React, { useState, useEffect } from "react";
import "./BlogTable.css";
import { DataGrid } from "@mui/x-data-grid";
import { viVN } from "@mui/x-data-grid/locales";
import {
    Box,
    Typography,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    Paper,
    Alert,
    Snackbar,
} from "@mui/material";

const paginationModel = { page: 0, pageSize: 10 };

export default function BlogTable() {
    const [rows, setRows] = useState([]);

    const columns = [
        {
            field: "image",
            headerName: "Ảnh",
            width: 90,
            renderCell: (params) => (
                <img src={params.row.image} alt="" style={{ width: 60, height: 40 }} />
            ),
        },
        { field: "title", headerName: "Tên hiển thị", width: 200 },
        { field: "content", headerName: "Nội dung", width: 200 },

        {
            field: "createdAt",
            headerName: "Tạo lúc",
            width: 120,
        },

        {
            field: "actions",
            headerName: "Hành động",
            width: 140,
            renderCell: (params) => (
                <div className="action-button-category-table">
                    <Tooltip title="Xem" placement="top">
                        <i className="bx bx-show" style={{ cursor: "pointer" }}></i>
                    </Tooltip>
                    <Tooltip title="Sửa" placement="top">
                        <i className="bx bx-edit" style={{ cursor: "pointer" }}></i>
                    </Tooltip>
                    <Tooltip title="Xóa" placement="top">
                        <i className="bx bx-trash" style={{ cursor: "pointer" }}></i>
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <Paper className="table-wrapper" sx={{ maxHeight: "80vh", width: "90%" }}>
            <Box className="table-toolbar">
                <Typography className="table-title">Danh sách bài viết Blog</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        borderRadius: "12px",
                        fontWeight: "bold",
                        px: 3,
                        py: 1,
                        textTransform: "none",
                        boxShadow: 2,
                        backgroundColor: "#4a4a48",
                        "&:hover": {
                            backgroundColor: "black",
                        },
                    }}
                >
                    + THÊM
                </Button>
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
        </Paper>
    );
}
