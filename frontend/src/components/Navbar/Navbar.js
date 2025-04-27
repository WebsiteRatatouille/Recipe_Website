import React, { useContext, useState } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../assets/img/ratatouille-original.png";
import Profile from "../../assets/img/ratatouille-icon.png";

function Navbar({ setShowLogin }) {
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
                    <div className="profile">
                        <button onClick={() => setShowLogin(true)}>Đăng nhập</button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
