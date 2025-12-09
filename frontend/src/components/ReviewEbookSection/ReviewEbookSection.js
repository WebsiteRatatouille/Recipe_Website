import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ReviewEbookSection.css";

const ReviewEbookSection = ({ ebookId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef();
  const ebookServiceUrl =
    process.env.REACT_APP_EBOOK_URL || "http://localhost:5001";

  useEffect(() => {
    if (!ebookId) return;
    setLoading(true);
    axios
      .get(`${ebookServiceUrl}/${ebookId}/comments`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        data.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setComments(data);
      })
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [ebookId]);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!user) {
      setError("Vui lòng đăng nhập để bình luận");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await axios.post(`${ebookServiceUrl}/${ebookId}/comments`, {
        content,
        userId: user.id || user._id,
        userName: user.name || user.username || user.email,
      });
      setContent("");
      const res = await axios.get(
        `${ebookServiceUrl}/${ebookId}/comments`
      );
      const data = Array.isArray(res.data) ? res.data : [];
      data.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setComments(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Có lỗi xảy ra, vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const handleEditSubmit = async (e, comment) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    if (!user) return;
    try {
      await axios.put(
        `${ebookServiceUrl}/${ebookId}/comments/${comment._id}`,
        {
          content: editContent,
          userId: user.id || user._id,
          isAdmin: user.isAdmin,
        }
      );
      setEditingId(null);
      setEditContent("");
      const res = await axios.get(
        `${ebookServiceUrl}/${ebookId}/comments`
      );
      const data = Array.isArray(res.data) ? res.data : [];
      data.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setComments(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Có lỗi khi sửa bình luận"
      );
    }
  };

  const handleDelete = async (comment) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;
    if (!user) return;
    try {
      await axios.delete(
        `${ebookServiceUrl}/${ebookId}/comments/${comment._id}`,
        {
          data: {
            userId: user.id || user._id,
            isAdmin: user.isAdmin,
          },
        }
      );
      const res = await axios.get(
        `${ebookServiceUrl}/${ebookId}/comments`
      );
      setComments(res.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Có lỗi khi xóa bình luận"
      );
    }
  };

  return (
    <div className="ebook-review-section">
      <h2>Bình luận ({comments.length})</h2>
      {!user && (
        <div className="ebook-review-login-warning">
          Đăng nhập để sử dụng tính năng bình luận
        </div>
      )}
      {user && (
        <form className="ebook-review-form" onSubmit={handleSubmit}>
          <textarea
            placeholder="Bạn nghĩ gì về ebook này?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
          />
          {error && <div className="ebook-review-error">{error}</div>}
          <button type="submit" disabled={!content.trim() || submitting}>
            Gửi bình luận
          </button>
        </form>
      )}
      <div className="ebook-review-list">
        {loading ? (
          <div className="ebook-review-loading">Đang tải bình luận...</div>
        ) : (
          comments.map((c) => {
            const currentUserId = user && (user._id || user.id);
            const commentUserId = c.user?._id || c.user?.id || c.user;
            const isOwner =
              currentUserId &&
              commentUserId &&
              currentUserId.toString() === commentUserId.toString();
            const isAdmin = user && user.isAdmin;

            return (
              <div className="ebook-review-item" key={c._id}>
                <div className="ebook-review-header">
                  <span className="ebook-review-name">
                    {c.userName || c.user?.username || c.user?.name || "Ẩn danh"}
                  </span>
                  <span className="ebook-review-date">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                  {(isOwner || isAdmin) && (
                    <span
                      style={{ marginLeft: "auto", position: "relative" }}
                    >
                      <button
                        className="ebook-review-menu-btn"
                        onClick={() =>
                          setMenuOpenId(
                            menuOpenId === c._id ? null : c._id
                          )
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 20,
                        }}
                        aria-label="Tùy chọn bình luận"
                      >
                        &#8942;
                      </button>
                      {menuOpenId === c._id && (
                        <div
                          className="ebook-review-menu-dropdown"
                          ref={menuRef}
                        >
                          {isOwner && (
                            <button
                              className="ebook-review-edit-btn"
                              onClick={() => {
                                handleEdit(c);
                                setMenuOpenId(null);
                              }}
                            >
                              Sửa
                            </button>
                          )}
                          <button
                            className="ebook-review-delete-btn"
                            onClick={() => {
                              handleDelete(c);
                              setMenuOpenId(null);
                            }}
                          >
                            Xóa
                          </button>
                        </div>
                      )}
                    </span>
                  )}
                </div>
                {editingId === c._id ? (
                  <form
                    onSubmit={(e) => handleEditSubmit(e, c)}
                    className="ebook-review-edit-form"
                  >
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        minHeight: 60,
                        marginBottom: 8,
                      }}
                    />
                    <button
                      type="submit"
                      className="ebook-review-edit-save-btn"
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="ebook-review-edit-cancel-btn"
                    >
                      Hủy
                    </button>
                  </form>
                ) : (
                  <div className="ebook-review-text">{c.content}</div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReviewEbookSection;
