import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.css";
import { toast } from "react-toastify";
import { startProgress, stopProgress } from "../../../utils/NProgress/NProgress";
import RecipeSkeletonGrid from "../../../components/RecipeSkeletonGrid/RecipeSkeletonGrid";

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            toast.info("Vui lòng đăng nhập để xem giỏ hàng!");
            navigate("/");
            return;
        }

        fetchCart(user);
    }, [navigate]);

    const fetchCart = async (user) => {
        startProgress();
        setLoading(true);
        try {
            const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";
            const res = await axios.get(`${apiUrl}/cart/${user.id || user._id}`);
            setCart(res.data);

            // Fetch ebook details for each item
            if (res.data.items && res.data.items.length > 0) {
                const microUrl = process.env.REACT_APP_MICRO_URL || "http://localhost:5500";
                const ebookPromises = res.data.items.map(item =>
                    axios.get(`${microUrl}/ebooks/${item.productId}`)
                        .then(res => ({ ...res.data, quantity: item.quantity }))
                        .catch(err => {
                            console.error(`Lỗi khi fetch ebook ${item.productId}:`, err);
                            return null;
                        })
                );
                const ebookResults = await Promise.all(ebookPromises);
                setEbooks(ebookResults.filter(ebook => ebook !== null));
            }
        } catch (err) {
            console.error("Lỗi khi lấy giỏ hàng:", err);
            toast.error("Không thể tải giỏ hàng!");
        } finally {
            setLoading(false);
            stopProgress();
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(productId);
            return;
        }

        setUpdating({ ...updating, [productId]: true });
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";
            await axios.put(`${apiUrl}/cart/${user.id || user._id}`, {
                productId,
                quantity: newQuantity
            });
            
            // Update local state
            setEbooks(prev => prev.map(ebook => 
                ebook._id === productId ? { ...ebook, quantity: newQuantity } : ebook
            ));
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            console.error("Lỗi khi cập nhật số lượng:", err);
            toast.error("Có lỗi xảy ra!");
        } finally {
            setUpdating({ ...updating, [productId]: false });
        }
    };

    const removeItem = async (productId) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";
            await axios.delete(`${apiUrl}/cart/${user.id || user._id}/${productId}`);
            
            setEbooks(prev => prev.filter(ebook => ebook._id !== productId));
            window.dispatchEvent(new Event('cartUpdated'));
            toast.success("Đã xóa khỏi giỏ hàng!");
        } catch (err) {
            console.error("Lỗi khi xóa sản phẩm:", err);
            toast.error("Có lỗi xảy ra!");
        }
    };

    const calculateTotal = () => {
        return ebooks.reduce((total, ebook) => {
            return total + (ebook.price * ebook.quantity);
        }, 0);
    };

    const handleCheckout = () => {
        // TODO: Implement checkout
        toast.info("Tính năng thanh toán đang được phát triển!");
    };

    if (loading) {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <h1>Giỏ hàng</h1>
                    <RecipeSkeletonGrid number={3} />
                </div>
            </div>
        );
    }

    if (!ebooks || ebooks.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <h1>Giỏ hàng</h1>
                    <div className="empty-cart">
                        <i className="bx bx-cart" style={{ fontSize: "80px", color: "#ccc" }}></i>
                        <p>Giỏ hàng của bạn đang trống</p>
                        <button onClick={() => navigate("/ebooks")} className="btn-browse">
                            Mua sắm ngay
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <h1>Giỏ hàng của tôi</h1>
                
                <div className="cart-content">
                    <div className="cart-items">
                        {ebooks.map((ebook) => (
                            <div key={ebook._id} className="cart-item">
                                <div className="item-image">
                                    <img 
                                        src={ebook.imageUrl || "https://via.placeholder.com/150"} 
                                        alt={ebook.title}
                                    />
                                </div>
                                <div className="item-info">
                                    <h3>{ebook.title}</h3>
                                    {ebook.author && <p className="item-author">Tác giả: {ebook.author}</p>}
                                    <p className="item-price">{ebook.price?.toLocaleString('vi-VN')} ₫</p>
                                </div>
                                <div className="item-quantity">
                                    <button 
                                        onClick={() => updateQuantity(ebook._id, ebook.quantity - 1)}
                                        disabled={updating[ebook._id]}
                                    >
                                        -
                                    </button>
                                    <span>{ebook.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(ebook._id, ebook.quantity + 1)}
                                        disabled={updating[ebook._id]}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="item-total">
                                    <p>{(ebook.price * ebook.quantity)?.toLocaleString('vi-VN')} ₫</p>
                                </div>
                                <div className="item-actions">
                                    <button 
                                        onClick={() => removeItem(ebook._id)}
                                        className="btn-remove"
                                    >
                                        <i className="bx bx-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Tổng thanh toán</h2>
                        <div className="summary-item">
                            <span>Tạm tính:</span>
                            <span>{calculateTotal().toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div className="summary-item total">
                            <span>Tổng cộng:</span>
                            <span>{calculateTotal().toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <button className="btn-checkout" onClick={handleCheckout}>
                            Thanh toán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;

