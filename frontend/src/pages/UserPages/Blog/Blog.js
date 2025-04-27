import React from "react";
import "./Blog.css";

import imageBlog1 from "../../../assets/imgBlog/halong1.jpg";
import imageBlog2 from "../../../assets/imgBlog/hanoi1.jpg";
import imageBlog3 from "../../../assets/imgBlog/hanoi2.jpg";
// import videoBlog from "../../../assets/imgBlog/video1.mp4";
import imagePopUp from "../../../assets/imgBlog/jerry.png";
import { Link, NavLink } from "react-router-dom";

function Blog() {
    return (
        <>
            <div className="video-blog-background">
                <div className="overlay"></div>
                <div>
                    {/* <video
                        src={videoBlog}
                        disablePictureInPicture
                        autoPlay
                        loop
                        muted
                        width="100%"
                        style={{ display: "block" }}
                    /> */}
                </div>
                <div className="content">
                    <p>Ratatouille</p>
                    <h3>Welcome</h3>
                </div>
            </div>
            <div className="blog-container">
                <div className="text-field-1">
                    <NavLink className="dieu-huong" to="/">
                        HOME
                    </NavLink>
                    <i class="bx bx-chevron-right"></i>
                    <NavLink className="dieu-huong" to="/recipes">
                        CÔNG THỨC
                    </NavLink>
                    <i class="bx bx-chevron-right"></i>
                    <NavLink className="dieu-huong" to="/contact">
                        LIÊN HỆ
                    </NavLink>
                    <i class="bx bx-chevron-right"></i>
                    <NavLink className="dieu-huong" to="/aboutUs">
                        CHÚNG TÔI
                    </NavLink>
                </div>
                <h1 className="title">RATATOUILLE</h1>
                <div className="author-info">
                    <div className="author-wrapper">
                        <a
                            href="https://www.facebook.com/profile.php?id=61574901281597"
                            target="_blank"
                        >
                            <span className="author-name">By Jerry</span>
                        </a>

                        <div className="author-popup">
                            <img src={imagePopUp} alt="Jerry" className="author-image" />
                            <h4 className="name-1">Jerry</h4>
                            <p>
                                {" "}
                                Jerry là người mang trong mình niềm đam mê sâu sắc với ẩm thực và
                                luôn coi đó là sứ mệnh cuộc đời. Đối với Jerry, mỗi món ăn không chỉ
                                là sự kết hợp của hương vị, mà còn là một phần của văn hóa, lịch sử
                                và con người. Anh sẵn sàng dành thời gian đi đến những vùng quê xa
                                xôi để học hỏi cách nấu ăn truyền thống từ người dân địa phương. Với
                                anh, việc nghiên cứu ẩm thực không dừng lại ở nấu ngon, mà còn là
                                sáng tạo, gìn giữ và kể lại những câu chuyện qua từng món ăn. Jerry
                                luôn chú trọng từng chi tiết nhỏ, từ cách chọn nguyên liệu, chế biến
                                đến trình bày. Anh tin rằng, qua mỗi bữa ăn, con người có thể gần
                                gũi nhau hơn, hiểu nhau hơn, và cùng nhau giữ gìn những giá trị đẹp
                                của ẩm thực dân tộc.
                            </p>
                        </div>
                    </div>
                    <span className="article-date">Updated on April 1, 2024</span>
                </div>

                <div className="social-icon">
                    <a href="https://web.facebook.com/people/Ratatouille-Page/61574059620067/">
                        <i className="bx bxl-facebook-circle"></i>
                    </a>
                    <i className="bx bxl-tiktok"></i>
                    <i class="bx bxl-youtube"></i>
                </div>
                <div className="image-blog">
                    <img src={imageBlog1}></img>
                </div>
            </div>
        </>
    );
}

export default Blog;
