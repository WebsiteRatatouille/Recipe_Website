import React, { useState, useEffect, useRef } from "react";
import UserMenuPortal from "./UserMenuPortal"; // portal để hiển thị menu người dùng tránh bị che khuất
import "./Navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/img/ratatouille-original.png";
import Profile from "../../assets/img/ratatouille-icon.png";

function Navbar({ setShowLogin }) {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch cart count & orders count
  useEffect(() => {
    const fetchCounts = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setCartCount(0);
        setOrdersCount(0);
        return;
      }

      try {
        const user = JSON.parse(storedUser);
        const cartServiceUrl = process.env.REACT_APP_CART_URL;
        const res = await axios.get(`${cartServiceUrl}/cart/${user.id || user._id}`);
        const totalItems = res.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalItems);

        const orderServiceUrl = process.env.REACT_APP_ORDER_URL;
        const ordersRes = await axios.get(
          `${orderServiceUrl}/orders/user/${user.id || user._id}`
        );
        const allOrders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        const pendingCount = allOrders.filter((o) => o.status === "pending").length;
        setOrdersCount(pendingCount);
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng / đơn hàng:", err);
        setCartCount(0);
        setOrdersCount(0);
      }
    };

    fetchCounts();

    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCounts();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user]);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowMenu(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg header-nav">
        <div className="container-fluid ">
          <NavLink className="navbar-brand" to="/">
            <img src={Logo} alt="Logo" />
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <NavLink className="nav-link" to="/">
                Trang chủ
              </NavLink>
              <NavLink className="nav-link" to="/recipes">
                Công thức
              </NavLink>
              <NavLink className="nav-link" to="/ebooks">
                Sách
              </NavLink>
              <NavLink className="nav-link" to="/blog">
                Blog
              </NavLink>
              <NavLink className="nav-link" to="/contact">
                Liên hệ
              </NavLink>
              <NavLink className="nav-link" to="/aboutUs">
                Chúng tôi
              </NavLink>
            </ul>
          </div>
          <div className="profile" style={{ position: "relative", display: "flex", alignItems: "center", gap: "30px" }}>
            {user && (
              <NavLink 
                to="/cart" 
                className="cart-icon-wrapper"
                style={{ position: "relative", textDecoration: "none", color: "inherit" }}
              >
                <i className="bx bx-cart" style={{ fontSize: "28px", cursor: "pointer" }}></i>
                {cartCount > 0 && (
                  <span 
                    className="cart-badge"
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      background: "var(--gray-color)",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </NavLink>
            )}
            {user ? (
              <>
                <img
                  src={Profile}
                  alt="User"
                  className="user-icon"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowMenu((prev) => !prev)}
                />
                {showMenu && (
                  <UserMenuPortal>
                    <div
                      ref={menuRef}
                      className="user-menu"
                      style={{
                        position: "fixed",
                        right: 30,
                        top: 70,
                        background: "white",
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        boxShadow: "0 2px 8px #0002",
                        zIndex: 2147483647,
                        minWidth: "200px",
                      }}
                    >
                      <div
                        style={{
                          padding: "10px 20px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <b>{user.name || user.username}</b>
                        <div style={{ fontSize: 12, color: "#888" }}>
                          {user.email}
                        </div>
                      </div>

                      <div className="menu-items">
                        <Link
                          to="/profile"
                          className="menu-item"
                          onClick={() => setShowMenu(false)}
                        >
                          <i className="fas fa-user"></i>
                          Thông tin cá nhân
                        </Link>

                        <Link
                          to="/my-recipes"
                          className="menu-item"
                          onClick={() => setShowMenu(false)}
                        >
                          <i className="fas fa-utensils"></i>
                          Quản lý công thức
                        </Link>

                        <Link
                          to="/favorite-recipes"
                          className="menu-item"
                          onClick={() => setShowMenu(false)}
                        >
                          <i className="fas fa-heart"></i>
                          Công thức yêu thích
                        </Link>

                        <Link
                          to="/orders"
                          className="menu-item"
                          onClick={() => setShowMenu(false)}
                        >
                          <i className="fas fa-receipt"></i>
                          Đơn hàng{ordersCount > 0 ? ` (${ordersCount})` : ""}
                        </Link>

                        <Link
                          to="/library"
                          className="menu-item"
                          onClick={() => setShowMenu(false)}
                        >
                          <i className="fas fa-book"></i>
                          Thư viện
                        </Link>

                        <Link
                          to="/cart"
                          className="menu-item cart-menu-item"
                          onClick={() => setShowMenu(false)}
                        >
                          Giỏ hàng{cartCount > 0 ? ` (${cartCount})` : ""}
                        </Link>

                        <Link
                          to="/contact"
                          className="menu-item"
                          onClick={() => setShowMenu(false)}
                        >
                          <i className="fas fa-envelope"></i>
                          Liên hệ
                        </Link>

                        {user && user.isAdmin && (
                          <Link
                            to="/admin"
                            className="menu-item"
                            onClick={() => setShowMenu(false)}
                          >
                            <i className="fas fa-tachometer-alt"></i>
                            Trang quản trị
                          </Link>
                        )}

                        <button
                          className="menu-item logout-btn"
                          onClick={handleLogout}
                        >
                          <i className="fas fa-sign-out-alt"></i>
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </UserMenuPortal>
                )}
              </>
            ) : (
              <button onClick={() => setShowLogin(true)}>Đăng nhập</button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
