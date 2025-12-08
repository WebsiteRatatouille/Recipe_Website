import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EbookDetail.css";
import { toast } from "react-toastify";

import { startProgress, stopProgress } from "../../../utils/NProgress/NProgress";

import RecipeSkeletonGrid from "../../../components/RecipeSkeletonGrid/RecipeSkeletonGrid";
import LineSeparator from "../../../components/LineSeparator/LineSeparator";
import EbookFavorite from "../../../components/EbookFavorite/EbookFavorite";

function EbookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ebook, setEbook] = useState(null);
    const [topEbookList, setTopEbookList] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);

    const [loadingTopEbooks, setLoadingTopEbooks] = useState(true);
    const [loading, setLoading] = useState(true);

    const [errorTopEbooks, setErrorTopEbooks] = useState("");
    const [error, setError] = useState("");

    // Fetch the main ebook for display
    useEffect(() => {
        const fetchEbook = async () => {
            startProgress();
            setLoading(true);
            try {
                const ebookServiceUrl = process.env.REACT_APP_EBOOK_URL || "http://localhost:5001";
                const res = await axios.get(`${ebookServiceUrl}/${id}`);
                setEbook(res.data);
                setSelectedImage(res.data.imageUrl);
            } catch (err) {
                setError("Không tìm thấy sách");
                console.error("Lỗi khi fetch ebook:", err);
            } finally {
                setLoading(false);
                stopProgress();
            }
        };

        fetchEbook();
    }, [id]);

    // Get top ebooks
    useEffect(() => {
        const fetchTopEbooks = async () => {
            setLoadingTopEbooks(true);
            startProgress();
            try {
                const ebookServiceUrl = process.env.REACT_APP_EBOOK_URL || "http://localhost:5001";
                const res = await axios.get(`${ebookServiceUrl}`);
                // Lọc bỏ ebook hiện tại và lấy 8 ebook đầu tiên
                const filtered = res.data.filter((e) => e._id !== id).slice(0, 8);
                setTopEbookList(filtered);
            } catch (err) {
                setErrorTopEbooks("Lỗi khi lấy sách nổi bật");
                console.error("Lỗi khi fetch sách nổi bật:", err);
            } finally {
                stopProgress();
                setLoadingTopEbooks(false);
            }
        };

        fetchTopEbooks();
    }, [id]);

    const handleAddToCart = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            toast.info("Vui lòng đăng nhập để thêm vào giỏ hàng!");
            return;
        }

        setAddingToCart(true);
        try {
            // Gọi trực tiếp cart-service
            const cartServiceUrl = process.env.REACT_APP_CART_URL || "http://localhost:5002";

            await axios.post(`${cartServiceUrl}/cart`, {
                userId: user.id || user._id,
                productId: id,
                quantity: 1
            });
            toast.success("Đã thêm vào giỏ hàng!");
            // Trigger event để cập nhật số lượng giỏ hàng
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            console.error("Lỗi khi thêm vào giỏ hàng:", err?.response || err);
            const message = err?.response?.data?.error || err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
            toast.error(message);
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            toast.info("Vui lòng đăng nhập để mua sách!");
            return;
        }

        // Thêm vào giỏ hàng và chuyển đến trang thanh toán
        await handleAddToCart();
        navigate("/cart");
    };

    if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Đang tải sách...</div>;
    if (error) return <div style={{ padding: "50px", textAlign: "center" }}>{error}</div>;
    if (!ebook) return <div style={{ padding: "50px", textAlign: "center" }}>Không tìm thấy sách</div>;

    return (
        <div className="ebook-detail-shopee">
            <div className="ebook-detail-container">
                {/* Main Product Section - Shopee Style */}
                <div className="ebook-product-section">
                    {/* Left: Image Gallery */}
                    <div className="ebook-image-gallery">
                        <div className="ebook-main-image">
                            <img 
                                src={selectedImage || ebook.imageUrl || "https://via.placeholder.com/500x600"} 
                                alt={ebook.title}
                            />
                        </div>
                        {ebook.imageUrl && (
                            <div className="ebook-thumbnails">
                                <div 
                                    className={`thumbnail ${selectedImage === ebook.imageUrl ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(ebook.imageUrl)}
                                >
                                    <img src={ebook.imageUrl} alt="Thumbnail" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="ebook-product-info">
                        <h1 className="ebook-product-title">{ebook.title}</h1>
                        
                        {ebook.author && (
                            <div className="ebook-product-author">
                                <span className="label">Tác giả:</span>
                                <span className="value">{ebook.author}</span>
                            </div>
                        )}

                        <div className="ebook-product-price-section">
                            <div className="price-label">Giá bán</div>
                            <div className="price-value">
                                {ebook.price?.toLocaleString('vi-VN')} ₫
                            </div>
                        </div>

                        <div className="ebook-product-actions">
                            <button 
                                className="btn-add-to-cart" 
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                            >
                                <i className="bx bx-cart"></i>
                                {addingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                            </button>
                            <button 
                                className="btn-buy-now" 
                                onClick={handleBuyNow}
                                disabled={addingToCart}
                            >
                                Mua ngay
                            </button>
                        </div>

                        {ebook.pdfUrl && (
                            <div className="ebook-preview-section">
                                <a 
                                    href={ebook.pdfUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn-preview"
                                >
                                    <i className="bx bx-show"></i>
                                    Xem trước PDF
                                </a>
                            </div>
                        )}

                        {ebook.description && (
                            <div className="ebook-short-description">
                                <h3>Mô tả sản phẩm</h3>
                                <p>{ebook.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Details Section */}
                {ebook.description && (
                    <div className="ebook-details-section">
                        <div className="ebook-details-header">
                            <h2>Chi tiết sản phẩm</h2>
                        </div>
                        <div className="ebook-details-content">
                            <div className="detail-item">
                                <span className="detail-label">Tên sách:</span>
                                <span className="detail-value">{ebook.title}</span>
                            </div>
                            {ebook.author && (
                                <div className="detail-item">
                                    <span className="detail-label">Tác giả:</span>
                                    <span className="detail-value">{ebook.author}</span>
                                </div>
                            )}
                            <div className="detail-item">
                                <span className="detail-label">Giá:</span>
                                <span className="detail-value">{ebook.price?.toLocaleString('vi-VN')} ₫</span>
                            </div>
                            {ebook.description && (
                                <div className="detail-item full-width">
                                    <span className="detail-label">Mô tả:</span>
                                    <span className="detail-value">{ebook.description}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Related Products Section */}
                <div className="ebook-related-section">
                    <LineSeparator />
                    {loadingTopEbooks ? (
                        <>
                            <p className="ebook-loading">Đang tải sách...</p>
                            <RecipeSkeletonGrid number={8} />
                        </>
                    ) : errorTopEbooks ? (
                        <p>{errorTopEbooks}</p>
                    ) : (
                        <EbookFavorite topEbookList={topEbookList} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default EbookDetail;

