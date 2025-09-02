import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

type CarouselBannersPropsType = {
  banners: string[];
};

export default function CarouselBanners(props: CarouselBannersPropsType) {
  const { banners = [] } = props;

  // If no banners are provided, return null to avoid rendering an empty carousel
  if (banners.length === 0) {
    return null;
  }

  return (
    <Swiper spaceBetween={15} slidesPerView={1} loop={true} pagination={true} modules={[Pagination]}>
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
