import React, { useState, useEffect, useRef } from "react";
import UserMenuPortal from "./UserMenuPortal"; // portal để hiển thị menu người dùng tránh bị che khuất
import "./Navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/img/ratatouille-original.png";
import Profile from "../../assets/img/ratatouille-icon.png";

function Navbar({ setShowLogin }) {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
          <div className="profile" style={{ position: "relative" }}>
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
                          to="/contact"
                          className="menu-item"
                          onClick={() => setShowMenu(false)}
                        >
                          <i className="fas fa-envelope"></i>
                          Liên hệ
                        </Link>

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
