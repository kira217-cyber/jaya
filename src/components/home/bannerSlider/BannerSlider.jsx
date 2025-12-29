import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// import baseURL_For_IMG_UPLOAD from "../../../utils/baseURL";

import "swiper/css";
import "swiper/css/pagination";
import { baseURL_For_IMG_UPLOAD } from "@/utils/baseURL";
import { getCarouselImages } from "@/features/carousel/carouselControlThunks";

const BannerSlider = () => {
  const dispatch = useDispatch();
  const {
    images,
    isLoading,
    isError,
    errorMessage,
    interval,
    infiniteLoop,
    autoPlay,
  } = useSelector((state) => state.homePageCarousel);

  // Fetch carousel images on component mount
  useEffect(() => {
    dispatch(getCarouselImages());
  }, [dispatch]);

  // Determine if the device is mobile based on window width
  const isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed

  // Loading state
  if (isLoading) {
    const skeletonHeight = isMobile ? 130 : 260;
    return (
      <div className="pb-3 lg:pb-4 w-full max-w-5xl mx-auto rounded-xl overflow-hidden">
        <Skeleton
          height={skeletonHeight}
          baseColor="#062a30"
          highlightColor="#0c424b"
          borderRadius={16}
        />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="pb-3 lg:pb-4 w-full max-w-5xl mx-auto rounded-xl overflow-hidden">
        <p>Error: {errorMessage}</p>
      </div>
    );
  }

  // If no images are available
  if (!images || images.length === 0) {
    return (
      <div className="pb-3 lg:pb-4 w-full max-w-5xl mx-auto rounded-xl overflow-hidden">
        <p>No images available</p>
      </div>
    );
  }

  return (
    <div

      className="pb-3 lg:pb-4 w-full max-w-5xl mx-auto rounded-xl overflow-hidden"
    >
      <Swiper
        spaceBetween={10}
        pagination={{ clickable: true }}
        autoplay={
          autoPlay
            ? {
                delay: interval,
                disableOnInteraction: false,
              }
            : false
        }
        loop={infiniteLoop}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        {images.map((slide, index) => (
          <SwiperSlide key={index}>
            <img
              src={`${baseURL_For_IMG_UPLOAD}s/${
                isMobile ? slide.mobile : slide.desktop
              }`}
              alt={`Slide ${index + 1}`}
              className="w-full h-32 sm:h-auto object-cover rounded-xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
