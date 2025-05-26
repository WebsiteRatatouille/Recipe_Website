import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";

import UserLayout from "./layouts/UserLayout/UserLayout";
import Home from "./pages/UserPages/Home/Home";
import Recipes from "./pages/UserPages/Recipes/Recipes";
import Contact from "./pages/UserPages/Contact/Contact";
import AboutUs from "./pages/UserPages/AboutUs/AboutUs";
import Blog from "./pages/UserPages/Blog/Blog";
import UserProfile from "./pages/UserMenu/UserProfile/UserProfile";
import MyRecipes from "./pages/UserMenu/MyRecipes/MyRecipes";

import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AdminDashboard from "./pages/AdminPages/AdminDashboard/AdminDashboard";
import AdminRecipes from "./pages/AdminPages/AdminRecipes/AdminRecipes";
import AdminCategories from "./pages/AdminPages/AdminCategories/AdminCategories";
import AdminCollections from "./pages/AdminPages/AdminCollections/AdminCollections";
import AdminUsers from "./pages/AdminPages/AdminUsers/AdminUsers";

import LoginPopup from "./components/LoginPopup/LoginPopup";
import ProgressBar from "./components/ProgressBar/ProgressBar";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log("app render");
  return (
    <>
      <ProgressBar />
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}

      <div className="App">
        <Routes>
          <Route element={<UserLayout setShowLogin={setShowLogin} />}>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/aboutUs" element={<AboutUs />} />
          </Route>

          {/* Trang user đã đăng nhập */}
          <Route
            element={
              user ? (
                <UserLayout setShowLogin={setShowLogin} />
              ) : (
                <Navigate to="/" />
              )
            }
          >
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
          </Route>

          <Route
            element={
              user && user.role === "admin" ? (
                <AdminLayout />
              ) : (
                <Navigate to="/" />
              )
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/adminRecipes" element={<AdminRecipes />} />
            <Route path="/adminCategories" element={<AdminCategories />} />
            <Route path="/adminCollections" element={<AdminCollections />} />
            <Route path="/adminUsers" element={<AdminUsers />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
