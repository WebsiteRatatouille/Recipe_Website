import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Slide from "../Slide/Slide";
import "./BigSwiper.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";

import Slide1 from "../../assets/img/slide1.webp";
import Slide2 from "../../assets/img/slide2.webp";
import Slide3 from "../../assets/img/slide3.webp";
import BackGroundImage from "../../assets/img/background.jpg";

function BigSwiper() {
    const bigSwiperSlides = [
        {
            image: Slide1,
            title: "Cơm sốt cà ri",
            description:
                "Cơm sốt cà ri là món ăn thơm ngon với cơm trắng dẻo kết hợp cùng sốt cà ri đậm đà, béo nhẹ. Sốt được nấu từ thịt, khoai tây, cà rốt và gia vị đặc trưng, tạo nên hương vị cay nhẹ, hấp dẫn",
            subtitle: "Thời gian nấu: 20 phút",
            link: "#",
        },

        {
            image: Slide2,
            title: "Gumbo hải sản",
            description:
                "Gumbo hải sản là món súp đậm đà của ẩm thực Louisiana, kết hợp tôm, xúc xích, rau củ và gia vị Cajun đặc trưng. Nước dùng sánh mịn, thơm lừng, thấm đẫm hương vị cay nồng và ngọt tự nhiên từ hải sản",

            subtitle: "Thời gian nấu: 1 tiếng",
            link: "#",
        },

        {
            image: Slide3,
            title: "Bánh sừng bò nhân kem",
            description:
                "Bánh sừng bò nhân kem là món bánh ngọt thơm ngon với lớp vỏ bơ giòn rụm và nhân kem mịn màng, béo ngậy bên trong. Khi cắn vào, lớp vỏ xốp tan hòa quyện cùng vị ngọt dịu của kem, tạo nên trải nghiệm ẩm thực hấp dẫn",
            subtitle: "Thời gian nấu: 2 tiếng",
            link: "#",
        },
    ];
    return (
        <div className="big-swiper-wrapper" id="big-swiper">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                {bigSwiperSlides.map((slide, index) => (
                    <SwiperSlide
                        key={index}
                        style={{
                            backgroundImage: `url(${BackGroundImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <Slide
                            image={slide.image}
                            title={slide.title}
                            subtitle={slide.subtitle}
                            description={slide.description}
                            link={slide.description}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default BigSwiper;
