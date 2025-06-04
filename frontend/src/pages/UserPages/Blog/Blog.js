import React from "react";
import "./Blog.css";

import imageBlog1 from "../../../assets/imgBlog/halong1.jpg";
import imageBlog2 from "../../../assets/imgBlog/hanoi1.jpg";
import imageBlog3 from "../../../assets/imgBlog/hanoi2.jpg";
import videoBlog from "../../../assets/imgBlog/video2.mp4";
import imagePopUp from "../../../assets/imgBlog/jerry.png";
import imageBlog4 from "../../../assets/imgBlog/Leslie.jpg";
import videoBlog2 from "../../../assets/imgBlog/Creamy Garlic Chicken.mp4";
import { Link } from "react-router-dom";

function Blog() {
  return (
    <>
      <div className="video-blog-background">
        <div className="overlay"></div>
        <div>
          {/* Video không có controls, không tự động phát */}
          <video
            src={videoBlog}
            disablePictureInPicture
            autoPlay
            loop
            muted
            width="100%"
            style={{ display: "block" }}
          />
        </div>
        <div className="content">
          <p>Ratatouille</p>
          <h3>Welcome</h3>
        </div>
      </div>
      <div className="blog-container">
        <div className="text-field-1">
          <Link className="dieu-huong" to="/">
            HOME
          </Link>
          <i class="bx bx-chevron-right"></i>
          <Link className="dieu-huong" to="/recipes">
            CÔNG THỨC
          </Link>
          <i class="bx bx-chevron-right"></i>
          <Link className="dieu-huong" to="/contact">
            LIÊN HỆ
          </Link>
          <i class="bx bx-chevron-right"></i>
          <Link className="dieu-huong" to="/aboutUs">
            CHÚNG TÔI
          </Link>
        </div>
        <h1 className="title">RATATOUILLE</h1>
        <div className="author-info">
          <div className="author-wrapper">
            <a
              href="https://www.facebook.com/profile.php?id=61574901281597"
              target="_blank"
            >
              <span className="author-name">By Ratatouille</span>
            </a>

            <div className="author-popup">
              <img src={imagePopUp} alt="Jerry" className="author-image" />
              <h4 className="name-1">Jerry</h4>
              <p>
                {" "}
                Jerry là người mang trong mình niềm đam mê sâu sắc với ẩm thực
                và luôn coi đó là sứ mệnh cuộc đời. Đối với Jerry, mỗi món ăn
                không chỉ là sự kết hợp của hương vị, mà còn là một phần của văn
                hóa, lịch sử và con người. Anh sẵn sàng dành thời gian đi đến
                những vùng quê xa xôi để học hỏi cách nấu ăn truyền thống từ
                người dân địa phương. Với anh, việc nghiên cứu ẩm thực không
                dừng lại ở nấu ngon, mà còn là sáng tạo, gìn giữ và kể lại những
                câu chuyện qua từng món ăn. Jerry luôn chú trọng từng chi tiết
                nhỏ, từ cách chọn nguyên liệu, chế biến đến trình bày. Anh tin
                rằng, qua mỗi bữa ăn, con người có thể gần gũi nhau hơn, hiểu
                nhau hơn, và cùng nhau giữ gìn những giá trị đẹp của ẩm thực dân
                tộc.
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
        <div className="allstars-container">
          <h1 className="allstars-title">Home Cooks Are Our Heroes</h1>
          <div className="allstars-content">
            <div className="image-section">
              <img
                src={imageBlog4}
                alt="Allstar Woman"
                className="allstars-image"
              />
              <p className="image-credit">PHOTO: Leslie from MasterCheft</p>
            </div>
            <div className="text-section">
              <p>
                Những người có ảnh hưởng trên mạng xã hội, các chuyên gia dinh
                dưỡng được cấp phép, và các bậc thầy nướng thịt dày dạn kinh
                nghiệm—Ratatouille là một đội ngũ đa dạng, yêu ẩm thực, trải dài
                trên khắp nước Mỹ và đại diện cho nhiều nền văn hóa, sắc tộc
                cũng như kiểu mẫu gia đình khác nhau. Từ việc lập kế hoạch bữa
                ăn, mua sắm thực phẩm thông minh, theo kịp các xu hướng nấu ăn
                theo mùa cho đến những mẹo tổ chức tiệc tài tình, nhóm người
                dùng đầy tâm huyết này thường xuyên được mời chia sẻ kiến thức
                chuyên môn của họ.
              </p>
              <p>
                Kể từ năm 2011, nhóm Ratatouille đã tạo ra hàng chục nghìn công
                thức nấu ăn, hình ảnh và bài đánh giá gốc, đồng thời chia sẻ
                kiến thức nấu nướng của họ thông qua nội dung đa phương tiện
                trên trang web của chúng tôi, mạng xã hội và nhiều kênh tiếp thị
                khác. Nói ngắn gọn, Ratatouille giúp mọi hành trình nấu ăn tại
                nhà của chúng ta trở nên thành công hơn.
              </p>
              <p>
                Leslie Gilliams, người bạn thấy bên trái, là “ông vua của ẩm
                thực” với khả năng nấu nướng tài tình . Hãy học những mẹo tiếp
                khách đã được kiểm chứng của ông ấy để biến chúng thành bí quyết
                của riêng bạn. Cần một bữa ăn nhanh? Leslie Gilliams sẽ trổ tài
                với món gà sốt kem chỉ với 3 nguyên liệu yêu thích của ông ấy
                ngay bên dưới.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="allstar-container">
        <h1>Trở thành một người dùng Ratatouille, và bạn sẽ...</h1>

        <p>
          <strong>Luôn được cập nhật:</strong> Yêu thích thương hiệu của chúng
          tôi? Là một Allstar, bạn sẽ được xem trước những tính năng, công thức,
          chương trình khuyến mãi và sản phẩm mới một cách độc quyền, phía sau
          hậu trường.
        </p>

        <p>
          <strong>Đưa ra ý kiến:</strong> Phản hồi từ cộng đồng tiếp thêm năng
          lượng cho chúng tôi — dù sao thì, chúng tôi là một nền tảng được tạo
          ra bởi và dành cho các đầu bếp tại gia. Bạn sẽ có vô số cơ hội để chia
          sẻ suy nghĩ và góp phần định hình tương lai của chương trình cũng như
          thương hiệu.
        </p>

        <p>
          <strong>Mở rộng mối quan hệ:</strong> Kết nối với các Allstar trên
          khắp cả nước, chia sẻ kiến thức nấu ăn, tìm hiểu về cơ hội trong lĩnh
          vực truyền thông ẩm thực và tham gia các sự kiện cũng như buổi gặp mặt
          Allstar đặc biệt trong năm.
        </p>

        <p>
          <strong>Phát triển thương hiệu cá nhân:</strong> Là một Allstar và
          người ảnh hưởng thương hiệu, bạn sẽ thường xuyên xuất hiện trong các
          chiến dịch quảng bá trên website, kênh tiếp thị và tạp chí Allrecipes
          của chúng tôi. Tài năng nấu ăn và sự tỏa sáng của bạn sẽ được tiếp cận
          với hàng chục triệu người.
        </p>

        <p>
          <strong>Kiếm thêm thu nhập:</strong> Đang tìm kiếm một công việc tay
          trái? Tài năng của bạn trong phát triển công thức, chụp ảnh món ăn,
          sáng tạo nội dung mạng xã hội hoặc sản xuất video sẽ được ghi nhận qua
          các dự án tài trợ từ thương hiệu, sự kiện PR và các giải thưởng hàng
          tháng.
        </p>
        <div class="cta-button">
          <a href="#" class="cta-link">
            TÌM HIỂU THÊM
          </a>
        </div>

        <div class="explore-more">
          <h2>Khám phá thêm:</h2>
          <div class="tags">
            <a href="#">Công thức</a>
            <a href="#">Nấu ăn mỗi ngày</a>
            <a href="#">Bộ sưu tập đặc biệt</a>
            <a href="#">Công thức Allstar</a>
          </div>
        </div>

        <div class="feedback">
          <p>Trang này có hữu ích không?</p>
          <div class="feedback-buttons">
            <button title="Hữu ích">👍</button>
            <button title="Không hữu ích">👎</button>
          </div>
        </div>
        <h1>Theo dõi chúng tôi tại TikTok</h1>
      </div>

      <div className="video-tiktok-container">
        <div className="tiktok-logo">
          <i class="bx bxl-tiktok"></i>
        </div>
        <div>
          <video
            src={videoBlog2}
            disablePictureInPicture
            autoPlay
            loop
            muted
            width="100%"
            style={{ display: "block" }}
          />
        </div>
      </div>
    </>
  );
}

export default Blog;
