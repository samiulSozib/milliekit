import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

type OfferBannersCarouselPropsType = {
  banners: string[];
  isDesktop?: boolean;
};

export default function OfferBannersCarousel(props: OfferBannersCarouselPropsType) {
  const { banners = [], isDesktop = false } = props;

  // If no banners are provided, return null to avoid rendering an empty carousel
  if (banners.length === 0) {
    return null;
  }

  return (
    <Swiper
      spaceBetween={15}
      loop={true}
      centeredSlides={true}
      {...(isDesktop ? { pagination: true, slidesPerView: 1 } : { slidesPerView: 1.3, pagination: false })}
      modules={[Pagination]}
    >
      {banners.map((banner, index) => (
        <SwiperSlide key={index}>
          <div className="shadow-sm rounded-xl overflow-hidden select-none">
            <img className="w-full" src={banner} alt="" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
