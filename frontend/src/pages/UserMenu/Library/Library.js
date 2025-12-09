import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Library.css";

function Library() {
  const navigate = useNavigate();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // all | recent | name

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.info("Vui lòng đăng nhập để xem thư viện");
      navigate("/login");
      return;
    }

    const fetchLibrary = async () => {
      try {
        setLoading(true);

        const orderServiceUrl =
          process.env.REACT_APP_ORDER_URL || "http://localhost:5003";
        const ebookServiceUrl =
          process.env.REACT_APP_EBOOK_URL || "http://localhost:5002";

        // 1. Lấy tất cả orders của user
        const { data: orders } = await axios.get(
          `${orderServiceUrl}/orders/user/${user.id || user._id}`
        );

        const paidOrders = (orders || []).filter((o) => o.status === "paid");
        if (paidOrders.length === 0) {
          setEbooks([]);
          return;
        }

        // 2. Gom tất cả productId từ các đơn đã thanh toán
        const ebookMap = new Map();

        for (const order of paidOrders) {
          for (const item of order.items || []) {
            if (!item.productId) continue;
            const existing = ebookMap.get(item.productId);
            const latestPurchasedAt = new Date(order.createdAt);
            if (!existing || latestPurchasedAt > existing.purchasedAt) {
              ebookMap.set(item.productId, {
                productId: item.productId,
                titleSnapshot: item.title,
                purchasedAt: latestPurchasedAt,
              });
            }
          }
        }

        const ebookIds = Array.from(ebookMap.keys());
        if (ebookIds.length === 0) {
          setEbooks([]);
          return;
        }

        // 3. Lấy thông tin chi tiết từng ebook từ ebook-service
        const ebookDetails = await Promise.all(
          ebookIds.map(async (id) => {
            try {
              const { data } = await axios.get(`${ebookServiceUrl}/${id}`);
              const base = ebookMap.get(id);
              return {
                ...data,
                purchasedAt: base?.purchasedAt,
              };
            } catch (err) {
              console.error("Lỗi lấy ebook", id, err);
              return null;
            }
          })
        );

        const merged = ebookDetails.filter(Boolean);
        setEbooks(merged);
      } catch (err) {
        console.error("Lỗi khi tải thư viện:", err);
        toast.error("Không thể tải thư viện ebook");
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [navigate]);

  const sortedEbooks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filtered = term
      ? ebooks.filter((eb) => (eb.title || "").toLowerCase().includes(term))
      : ebooks;

    const list = [...filtered];

    if (filterMode === "name") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else {
      // all & recent: sắp xếp theo ngày mua, mới nhất lên trên
      list.sort(
        (a, b) => new Date(b.purchasedAt || 0) - new Date(a.purchasedAt || 0)
      );
    }

    return list;
  }, [ebooks, searchTerm, filterMode]);

  return (
    <div className="library-page">
      <div className="library-container">
        <h1>Thư viện ebook của tôi</h1>

        <div className="library-toolbar">
          <div className="library-filters">
            <button
              className={filterMode === "all" ? "active" : ""}
              onClick={() => setFilterMode("all")}
            >
              Tất cả
            </button>
            <button
              className={filterMode === "recent" ? "active" : ""}
              onClick={() => setFilterMode("recent")}
            >
              Gần nhất
            </button>
            <button
              className={filterMode === "name" ? "active" : ""}
              onClick={() => setFilterMode("name")}
            >
              Theo tên
            </button>
          </div>
          <input
            type="text"
            className="library-search"
            placeholder="Tìm kiếm theo tên ebook..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {sortedEbooks.length === 0 ? (
          <div className="library-placeholder">
            Bạn chưa có ebook nào. Hãy mua ebook để xuất hiện trong thư viện.
          </div>
        ) : (
          <div className="library-grid">
            {sortedEbooks.map((ebook) => (
              <div key={ebook._id} className="library-card">
                <div className="library-thumb">
                  {ebook.imageUrl ? (
                    <img src={ebook.imageUrl} alt={ebook.title} />
                  ) : (
                    <div className="library-thumb-placeholder">EBOOK</div>
                  )}
                </div>
                <div className="library-body">
                  <h3 className="library-title">{ebook.title}</h3>
                  {ebook.author && (
                    <div className="library-author">Tác giả: {ebook.author}</div>
                  )}
                  {ebook.purchasedAt && (
                    <div className="library-date">
                      Mua ngày: {" "}
                      {new Date(ebook.purchasedAt).toLocaleString("vi-VN")}
                    </div>
                  )}
                  <div className="library-actions">
                    {ebook.pdfUrl ? (
                      <a
                        href={ebook.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="library-btn"
                      >
                        Đọc / Tải về
                      </a>
                    ) : (
                      <span className="library-note">
                        Chưa có file PDF, liên hệ quản trị viên.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Library;
