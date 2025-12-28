'use client';

import { useSettings } from '@/components/core/hooks/useSettings';

export function NotFound() {
  const {
    settings: { dictionary },
  } = useSettings();

  return (
    <div className="flex md:min-h-[50vh] text-center">
      <div className="container-fluid">
        <div className="flex flex-col items-center">
          <div className="w-[10rem] md:w-[14rem] select-none mt-2 md:mt-0">
            <img src="/assets/images/error/ticket-not-found.webp" alt="" />
          </div>
          <div className="text-xmd md:text-lg mt-2">
            <p>{dictionary.general.noBusFoundForThisDate}</p>
          </div>
          <div className="text-xs text-muted mt-3 lg:mt-2">
            <p>{dictionary.general.goPrevOrNextDay}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
