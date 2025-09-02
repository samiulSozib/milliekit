'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

interface WelcomeCarouselProps {
  slides: {
    title: string;
    description: string;
  }[];
}

export default function WelcomeCarousel({ slides }: WelcomeCarouselProps) {
  return (
    <Swiper
      pagination={true}
      modules={[Pagination]}
      spaceBetween={30}
      slidesPerView={1}
      loop={true}
      dir="rtl"
      style={{
        ['--swiper-pagination-bullet-horizontal-gap' as string]: '.25rem',
        ['--swiper-pagination-bottom' as string]: '0',
      }}
      className="pb-8"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="cursor-pointer select-none text-gray-700 text-center flex justify-center">
            <div className="max-w-[30rem]">
              <div className="text-[.85rem] font-semibold">
                <h2>{slide.title}</h2>
              </div>
              <div className="text-xsm leading-[1.7] text-muted mt-2">
                <p>{slide.description}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
