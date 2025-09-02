'use client';

import { useSettings } from "@/components/core/hooks/useSettings";

export function NotFound() {
  const {
    settings: { dictionary },
  } = useSettings();
  
  return (
    <div className="flex md:min-h-[40vh] text-center">
      <div className="container-fluid">
        <div className="flex flex-col items-center">
          <div className="w-[6rem] md:w-[8rem] select-none mt-4 md:mt-0">
            <img src="/assets/images/error/transaction-not-found.webp" alt="" />
          </div>
          <div className="text-sm mt-2 text-muted">
            <p>{dictionary.general.noOrdersFound}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
