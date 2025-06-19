import React, { useEffect, useState } from "react";
import "./LoginPopup.css";
import { useNavigate } from "react-router-dom";

function LoginPopup({ setShowLogin }) {
    const navigate = useNavigate();
    const [currState, setCurrState] = useState("Đăng nhập");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            username: "",
            email: "",
            password: "",
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("Đã nhấn nút đăng ký");

        if (!formData.username || !formData.email || !formData.password) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.msg || "Đăng ký thất bại");
                return;
            }

            alert(data.msg);
            setCurrState("Đăng nhập");
            resetForm();
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            alert("Lỗi hệ thống, vui lòng thử lại.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Đã nhấn nút đăng nhập");

        if (!formData.email || !formData.password) {
            alert("Vui lòng nhập đầy đủ email và mật khẩu");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                }),
            });

            const data = await response.json();
            console.log("Response từ server:", data);

            if (!response.ok) {
                alert(data.msg || "Đăng nhập thất bại");
                return;
            }

            // Kiểm tra trạng thái xác thực email
            // Bỏ qua kiểm tra xác thực email cho tài khoản admin
            if (data.user && !data.user.isVerified && data.user.role !== "admin") {
                alert(
                    "Tài khoản của bạn chưa được xác thực. Vui lòng kiểm tra email của bạn để xác thực."
                );
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            setShowLogin(false);

            console.log("User role:", data.user.role);

            if (data.user.role === "admin") {
                console.log("Chuyển hướng đến trang admin");
                navigate("/admin");
            } else {
                console.log("Chuyển hướng đến trang chủ");
                navigate("/");
                window.location.reload();
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            alert("Lỗi kết nối server, vui lòng thử lại sau.");
        }
    };

    const handleStateChange = (newState) => {
        setCurrState(newState);
        resetForm();
    };

    const renderFormInputs = () => (
        <div className="login-popup-inputs">
            {currState === "Đăng kí" && (
                <input
                    type="text"
                    name="username"
                    placeholder="Tên của bạn"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                />
            )}

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
            />

            <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                required
            />
        </div>
    );

    return (
        <div className="login-popup">
            <form
                className="login-popup-container"
                onSubmit={currState === "Đăng nhập" ? handleSubmit : handleRegister}
            >
                <div>
                    <span></span>
                    <i onClick={() => setShowLogin(false)} className="close-icon bx bx-x"></i>
                </div>

                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <p>
                        {currState === "Đăng nhập"
                            ? "Khám phá hàng ngàn công thức, lưu lại món ăn yêu thích và chia sẻ trải nghiệm của bạn!"
                            : "Tham gia ngay để lưu công thức, viết đánh giá và kết nối với những người yêu ẩm thực!"}
                    </p>
                </div>

                {renderFormInputs()}

                <button type="submit">
                    {currState === "Đăng kí" ? "Tạo tài khoản" : "Đăng nhập"}
                </button>

                {currState === "Đăng kí" && (
                    <div className="login-popup-condition">
                        <input type="checkbox" required />
                        <p>Tôi đồng ý với Điều khoản sử dụng & Chính sách quyền riêng tư</p>
                    </div>
                )}

                {/* Social Login Buttons */}
                <div className="social-login-buttons">
                    <a href="http://localhost:5000/auth/facebook">
                        <button type="button">Đăng nhập bằng Facebook</button>
                    </a>
                    <a href="http://localhost:5000/auth/google">
                        <button type="button">Đăng nhập bằng Google</button>
                    </a>
                </div>

                <div className="auth-switch">
                    {currState === "Đăng nhập" ? (
                        <p>
                            Tạo tài khoản?
                            <span onClick={() => handleStateChange("Đăng kí")}>Đăng kí</span>
                        </p>
                    ) : (
                        <p>
                            Đã có tài khoản?
                            <span onClick={() => handleStateChange("Đăng nhập")}>Đăng nhập</span>
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}

export default LoginPopup;
