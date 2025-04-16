import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel, Parallax } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/exactSwiper.css';

const ExactCollectionsSlider = (props) => {

    const { collections } = props;

    
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-[#2a1f30] via-[#2a1f30] to-[#383d44] text-white">
      <div id="home-slider" className="relative h-[80vh] w-screen">
        <Swiper
          direction="vertical"
          loop={true}
          pagination={{
            clickable: true,
            el: '.swiper-pagination',
          }}
        //   grabCursor={true}
          speed={1000}
          parallax={true}
          autoplay={
            {
              delay: 1000,
            }
          }
          effect="creative"

          modules={[Pagination, Mousewheel, Parallax]}
          className="h-full"
        >
          {/* Slide 1 */}
          <SwiperSlide className="swiper-slide-one">
            <div className="swiper-image" data-swiper-parallax-y="-20%">
              <div className="swiper-image-inner swiper-image-left p-8" style={{ backgroundImage: `url(${collections[0].imageSrc})` }}>
                <h1 className="text-4xl font-bold mb-4">
                    {collections[0].title}
                </h1>
              </div>
            </div>
            <div className="swiper-image" data-swiper-parallax-y="35%">
              <div className="swiper-image-inner swiper-image-right p-8" style={{ backgroundImage: `url(${collections[0].imageSrc})` }}>

              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide className="swiper-slide-two">
            <div className="swiper-image" data-swiper-parallax-y="-20%">
                <div className="swiper-image-inner swiper-image-left p-8" style={{ backgroundImage: `url(${collections[1].imageSrc})` }}>
                <h1 className="text-4xl font-bold mb-4">
                {collections[1].title}
                </h1>
              </div>
            </div>
            <div className="swiper-image" data-swiper-parallax-y="35%">
              <div className="swiper-image-inner swiper-image-right p-8" style={{ backgroundImage: `url(${collections[1].imageSrc})` }}>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide className="swiper-slide-three">
            <div className="swiper-image" data-swiper-parallax-y="-20%">
              <div className="swiper-image-inner swiper-image-left p-8" style={{ backgroundImage: `url(${collections[2].imageSrc})` }}>
                <h1 className="text-4xl font-bold mb-4">
                    {collections[2].title}
                </h1>
              </div>
            </div>
            <div className="swiper-image" data-swiper-parallax-y="35%">
              <div className="swiper-image-inner swiper-image-right p-8" style={{ backgroundImage: `url(${collections[2].imageSrc})` }}>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        <div className="swiper-pagination absolute bottom-4 left-1/2 transform -translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default ExactCollectionsSlider;