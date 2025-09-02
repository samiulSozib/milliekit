import { memo, useEffect, useState } from 'react';

import Icon from '@/components/core/Icon';

import { classnames } from '@/utils';
import { useSettings } from '@/components/core/hooks/useSettings';

import styles from './Ticket.module.scss';

import type { TripItemDataType } from '@/types/trip';

interface ITicketProps {
  ticketData: TripItemDataType;
  onClick: (seatsCount: number) => void;
}

function Ticket({ ticketData, onClick }: ITicketProps) {
  const {
    settings: { dictionary },
  } = useSettings();

  const generalDictionary = dictionary.general;

  const [_ticketData, setTicketData] = useState<TripItemDataType>(ticketData);

  useEffect(() => {
    setTicketData(ticketData);
  }, [ticketData]);

  const { route, departure_time, arrival_time, ticket_price, available_seats, bus } = _ticketData;
  const { origin_city, origin_station, destination_city, destination_station } = route;
  const { name, bus_number } = bus;
  const { logo, long_name: vendorName } = _ticketData.vendor;

  return (
    <div
      className={classnames(styles.ticket, 'overflow-hidden pt-1.5 pb-4 px-3.5 cursor-pointer')}
      onClick={() => onClick(available_seats ?? 0)}
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src={logo || '/assets/images/modules/bus-booking/vendor-default.png'} alt="" />
          </div>
          <div className="font-semibold text-[var(--color-gray-800)] text-xsm">
            {vendorName} - {name} - {bus_number}
          </div>
        </div>
        {/* <div className="text-xxs text-[var(--color-gray-500)]">بزرگسال ۲، کودک ۱</div> */}
      </div>
      <div className="mt-2 flex items-center justify-between relative z-10 gap-x-4">
        <div className="w-1/2 flex">
          <div className="text-center">
            <div className="font-semibold text-xs leading-[1.65]">{origin_city.name || generalDictionary.unknown}</div>
            <div className="text-primary text-xsm mt-0.5">{departure_time.split(' ')[1].replace(/:00$/, '')}</div>
            <div className="text-xxs text-[var(--color-gray-500)]">
              {origin_station.name || generalDictionary.unknown}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-1 shrink-0">
          <div className="text-primary">
            <Icon name="bus-path" className="ltr:hidden rtl:block" width={93} height={18} />
            <Icon name="bus-path-ltr" className="ltr:block rtl:hidden" width={93} height={18} />
          </div>
          {/* <div className="mt-1 text-[var(--color-gray-500)] text-xxs">3 ساعت و 14 دقیقه</div> */}
        </div>
        <div className="w-1/2 flex justify-end">
          <div className="text-center">
            <div className="font-semibold text-xs leading-[1.65]">
              {destination_city.name || generalDictionary.unknown}
            </div>
            <div className="text-primary text-xs mt-0.5">{arrival_time.split(' ')[1].replace(/:00$/, '')}</div>
            <div className="text-xxs text-[var(--color-gray-500)]">
              {destination_station.name || generalDictionary.unknown}
            </div>
          </div>
        </div>
      </div>
      <div className={classnames(styles['ticket-separator'], 'my-8 px-4')}>
        <div className={classnames(styles['ticket-separator__line'])}></div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-y-3 relative z-10">
        <div className="flex items-center gap-1">
          <div className="text-[var(--color-gray-500)] text-xs">{generalDictionary.totalPrice}:</div>
          <div className="flex items-center gap-1">
            <div className="font-semibold text-xmd">{ticket_price}</div>
            <div className="text-[var(--color-gray-500)]">
              <Icon name="afghan-currency" size={18} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {available_seats == null || available_seats < 1 ? (
            <div className="text-xs text-error">{generalDictionary.capacityCompletion}</div>
          ) : (
            <>
              {available_seats > 3 ? (
                <div className="text-xs text-[var(--color-gray-500)]">
                  {available_seats} {generalDictionary.emptySeat}
                </div>
              ) : (
                <div className="text-xs text-error">
                  {available_seats} {generalDictionary.remainingSeats}
                </div>
              )}
            </>
          )}
          <div className="text-error">
            <Icon name="ticket" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Ticket, (prevProps, nextProps) => {
  return prevProps.ticketData === nextProps.ticketData && prevProps.onClick === nextProps.onClick;
});
