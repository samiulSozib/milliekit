'use client';

import PageWrapper from '@/components/core/PageWrapper';
import Header from '@/components/shared/Header';
import { useSettings } from '@/components/core/hooks/useSettings';
import { useEffect } from 'react';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';
import { routeList } from '@/config';

export default function Help() {
  const {
    settings: { dictionary },
  } = useSettings();

  const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);

  useEffect(() => {
    setActiveRoute(routeList.pages.subPathList.help);

    return () => {
      setActiveRoute(null);
    };
  }, []);

  return (
    <PageWrapper name="help">
      <Header title={dictionary.general.help} minHeight="10.5rem" overlayOpacity={0.1} />
      <div className="container-fluid">
        <div className="flex justify-center select-none mb-6">
          <div className="max-w-[8.5rem]">
            <img src="/assets/images/misc/guidance.png" alt="" />
          </div>
        </div>
        <div className="entry-content">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون
          بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع
          با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و
          متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ
          پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط
          سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود
          طراحی اساسا مورد استفاده قرار گیرد.
        </div>
      </div>
    </PageWrapper>
  );
}
