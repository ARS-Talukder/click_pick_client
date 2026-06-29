import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { FreeMode, Navigation, Thumbs, Autoplay } from 'swiper/modules';
import ReactImageMagnify from 'react-image-magnify';

const ProductSlider = ({ images }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className='lg:w-1/2 md:w-1/2 lg:mr-4 md:mr-4'>
            {/* Main Image Swiper */}
            <Swiper
                style={{
                    '--swiper-navigation-color': 'black',
                    '--swiper-navigation-size': '20px',
                    '--swiper-pagination-color': 'black',
                    width: '100%',
                    height: '471px',
                }}
                loop={true}
                spaceBetween={10}
                navigation={true}
                autoplay={{
                    delay: 3000, // 3 seconds per slide
                    disableOnInteraction: false, // keep autoplay after user interaction
                }}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                className="mySwiper2"
            >
                {images?.map((i) => (
                    <SwiperSlide key={i._id}>
                        <ReactImageMagnify
                            {...{
                                smallImage: {
                                    alt: "Product",
                                    isFluidWidth: true,
                                    src: i.url,
                                },
                                largeImage: {
                                    src: i.url,
                                    width: 1200,
                                    height: 800,
                                },
                                enlargedImageContainerStyle: { zIndex: 9 },
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbnails Swiper */}
            <Swiper
                style={{
                    '--swiper-navigation-color': 'black',
                    '--swiper-pagination-color': 'black',
                    width: '100%',
                    height: '120px',
                    cursor: 'pointer',
                }}
                onSwiper={setThumbsSwiper}
                loop={true}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
            >
                {images?.map((i) => (
                    <SwiperSlide key={i._id}>
                        <img src={i.url} alt="Product thumbnail" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProductSlider;
