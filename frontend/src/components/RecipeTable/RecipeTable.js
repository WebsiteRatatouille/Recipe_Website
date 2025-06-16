import React, { useState, useEffect } from "react";
import "./RecipeTable.css";
import { DataGrid } from "@mui/x-data-grid";
import { viVN } from "@mui/x-data-grid/locales";
import Paper from "@mui/material/Paper";
import {
    Box,
    Typography,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import RecipeInfoAdmin from "../../components/RecipeInfoAdmin/RecipeInfoAdmin";
import RecipeEditAdmin from "../../components/RecipeEditAdmin/RecipeEditAdmin";

const paginationModel = { page: 0, pageSize: 10 };

export default function DataTable() {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [selectedRecipe, setSelectedRecipe] = useState(null);
    // for show recipe
    const [openDialog, setOpenDialog] = useState(false);
    // for edit recipe
    const [openEdit, setOpenEdit] = useState(false);

    const handleViewRecipe = async (id) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`);
            const data = await res.json();
            setSelectedRecipe(data);
            setOpenDialog(true);
        } catch (err) {
            console.error("Lỗi khi lấy công thức:", err);
        }
    };

    const handleEditRecipe = async (id) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`);
            const data = await res.json();
            setSelectedRecipe(data);
            setOpenEdit(true);
        } catch (err) {
            console.error("Lỗi khi lấy công thức:", err);
        }
    };

    // For display image
    const combinedImages =
        selectedRecipe?.images && selectedRecipe.images.length > 0
            ? [
                  selectedRecipe.imageThumb,
                  ...selectedRecipe.images.filter((img) => img !== selectedRecipe.imageThumb),
              ]
            : [selectedRecipe?.imageThumb];

    const columns = [
        {
            field: "imageThumb",
            headerName: "Ảnh",
            width: 90,
            renderCell: (params) => (
                <img src={params.row.imageThumb} alt="" style={{ width: 60 }} />
            ),
        },
        { field: "title", headerName: "Tên món", width: 250 },
        { field: "categoryDisplay", headerName: "Danh mục", width: 120 },
        { field: "likes", headerName: "Lượt thích", type: "number", width: 100 },
        { field: "views", headerName: "Lượt xem", type: "number", width: 100 },
        {
            field: "createdAt",
            headerName: "Ngày tạo",
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
                <div className="action-button-recipe-table">
                    <Tooltip title="Đi đến" placement="top">
                        <i
                            className="bx bx-link-external"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/recipes/${params.row.id}`)}
                        ></i>
                    </Tooltip>
                    <Tooltip title="Xem" placement="top">
                        <i
                            className="bx bx-show"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleViewRecipe(params.row.id)}
                        ></i>
                    </Tooltip>
                    <Tooltip title="Sửa" placement="top">
                        <i
                            className="bx bx-edit"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleEditRecipe(params.row.id)}
                        ></i>
                    </Tooltip>

                    <Tooltip title="Xóa" placement="top">
                        <i className="bx bx-trash"></i>
                    </Tooltip>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`);
                const data = await res.json();
                const formatted = data.recipes.map((item) => ({
                    id: item._id,
                    imageThumb: item.imageThumb,
                    title: item.title,
                    categoryDisplay: item.categoryDisplay,
                    likes: item.likes,
                    views: item.views,
                    createdAt: new Date(item.createdAt).toLocaleDateString("vi-VN"),
                    updatedAt: new Date(item.updatedAt).toLocaleDateString("vi-VN"),
                }));
                setRows(formatted);
            } catch (err) {
                console.error("Lỗi khi tải công thức:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <Paper className="table-wrapper" sx={{ maxHeight: "80vh", width: "90%" }}>
            <Box className="table-toolbar">
                <Typography className="table-title">Danh sách công thức nấu ăn</Typography>
                <div className="erase-button">
                    <i className="bx bx-trash"></i>
                </div>
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
            {/* show recipe popup */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <IconButton
                        onClick={() => setOpenDialog(false)}
                        style={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <RecipeInfoAdmin recipe={selectedRecipe} recipeImageList={combinedImages} />
                </DialogContent>
            </Dialog>

            {/* edit recipe popup */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <IconButton
                        onClick={() => setOpenEdit(false)}
                        style={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <RecipeEditAdmin recipe={selectedRecipe} />
                </DialogContent>
            </Dialog>
        </Paper>
    );
}
