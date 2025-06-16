import React, { useState, useEffect } from "react";
import "./MyRecipes.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

// Define backend API base URL
const API_BASE_URL = "http://localhost:5000";

function MyRecipes() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState(""); // State for the search input
  const [userId, setUserId] = useState(null); // Add state for user ID
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  }); // Thêm state notification

  // Get user ID from localStorage when component mounts
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User from localStorage:", user); // LOGGING
    if (user && user.id) {
      setUserId(user.id);
      console.log("userId set:", user.id); // LOGGING
    }
  }, []);

  const fetchRecipes = async (search = "", page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      console.log("Token in fetchRecipes:", token); // LOGGING
      const response = await axios.get(
        `${API_BASE_URL}/api/recipes?keyword=${search}&page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRecipes(response.data.recipes);
      setTotalPages(response.data.pages);
      setCurrentPage(response.data.page);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError("Không thể tải danh sách công thức.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRecipes(keyword, currentPage);
    }
  }, [keyword, currentPage, userId]); // Add userId to dependencies

  const handleCreateNewRecipe = () => {
    navigate("/add-recipe"); // Navigate to the new add recipe page
  };

  const handleSearchInputChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearchButtonClick = () => {
    setKeyword(searchKeyword); // Update keyword state to trigger effect
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update page state to trigger effect
  };

  const handleViewRecipe = (recipeId) => {
    navigate(`/recipes/${recipeId}`); // Navigate to recipe detail page
  };

  const handleEditRecipe = (recipeId) => {
    navigate(`/edit-recipe/${recipeId}`); // Navigate to edit recipe page (need to create this route and page)
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa công thức này không?")) {
      try {
        const token = localStorage.getItem("token"); // Lấy token
        // Call backend API to delete the recipe
        await axios.delete(`${API_BASE_URL}/api/recipes/${recipeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Refetch recipes to update the list after deletion
        fetchRecipes(keyword, currentPage);
        console.log(`Công thức với ID ${recipeId} đã được xóa.`);
        setNotification({
          message: "Công thức đã được xóa thành công!",
          type: "success",
        }); // Thông báo thành công
        window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu
        setTimeout(() => setNotification({ message: null, type: null }), 3000);
      } catch (error) {
        console.error("Error deleting recipe:", error);
        setError("Không thể xóa công thức.");
        setNotification({
          message: "Không thể xóa công thức. Vui lòng thử lại.",
          type: "error",
        }); // Thông báo lỗi
        window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu
        setTimeout(() => setNotification({ message: null, type: null }), 3000);
      }
    }
  };

  // Placeholder data for the table (no longer needed, replaced by API data)
  // const dummyRecipes = [
  //   // ... dummy data ...
  // ];

  return (
    <div className="my-recipes-container">
      <div className="recipes-header">
        <h1>Quản lý công thức</h1>
      </div>

      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="recipes-content">
        <div className="recipes-actions">
          <div className="search-section">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="search-input"
              value={searchKeyword}
              onChange={handleSearchInputChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearchButtonClick();
                }
              }} // Allow search on Enter key press
            />
            <button className="search-button" onClick={handleSearchButtonClick}>
              Search
            </button>
          </div>
          <button
            className="create-new-recipe-btn"
            onClick={handleCreateNewRecipe}
          >
            <i className="fas fa-plus"></i> Tạo mới Công thức
          </button>
        </div>

        <div className="recipes-list">
          {loading ? (
            <p>Đang tải công thức...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : !recipes || recipes.length === 0 ? (
            <p>Không tìm thấy công thức nào.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  {/* <th>ID</th> */} {/* Remove ID header */}
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe) => (
                  <tr key={recipe._id}>
                    {" "}
                    {/* <td>{recipe._id}</td> */} {/* Remove ID data cell */}
                    <td>
                      <img
                        src={
                          recipe.imageThumb || "https://via.placeholder.com/50"
                        } // Use imageThumb from API or placeholder
                        alt={recipe.title}
                        className="recipe-thumbnail"
                      />
                    </td>
                    <td>{recipe.title}</td> {/* Display actual title */}
                    <td>
                      <button
                        className="action-button"
                        onClick={() => handleViewRecipe(recipe._id)}
                      >
                        Chi tiết
                      </button>
                      <button
                        className="action-button"
                        onClick={() => handleEditRecipe(recipe._id)}
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        className="action-button"
                        onClick={() => handleDeleteRecipe(recipe._id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {!loading &&
            !error &&
            recipes &&
            recipes.length > 0 &&
            totalPages > 1 && (
              <div className="pagination">
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page + 1}
                    onClick={() => handlePageChange(page + 1)}
                    className={currentPage === page + 1 ? "active" : ""}
                  >
                    {page + 1}
                  </button>
                ))}
              </div>
            )}

          {/* <p className="placeholder-message"> */}
          {/* Bảng danh sách công thức và phân trang sẽ hiển thị ở đây. */}
          {/* </p> */}
        </div>
      </div>
    </div>
  );
}

export default MyRecipes;
