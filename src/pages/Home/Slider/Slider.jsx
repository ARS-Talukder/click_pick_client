import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Slider.css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loading from '../../Shared/Loading';


const Slider = () => {
    const { data: banner, isLoading, isSuccess, isError, error } = useQuery({
        queryKey: ["banner"],
        queryFn: () => {
            return axios.get("http://localhost:5000/banner")
        }
    })

    let content;

    if (isLoading) {
        return <Loading></Loading>
    }

    if (isSuccess) {
        content = banner.data.map(b => <SwiperSlide key={b._id} b={b}>
            <img
                src={b.url}
                loading="lazy"
            />
            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
        </SwiperSlide>)
    }
    return (
        <div className='mb-6'>
            <Swiper
                style={{
                    '--swiper-navigation-color': 'black',
                    '--swiper-navigation-size': '15px',
                }}
                // spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                loop={true}
                navigation={true}
                modules={[Autoplay, Navigation]}
                className="mySwiper"
            >

                {content}

            </Swiper>

        </div>
    );
};

export default Slider;