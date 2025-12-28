// components/shared/TaxiTicket/index.tsx
import { memo, useEffect, useState } from 'react';
import Icon from '@/components/core/Icon';
import { classnames } from '@/utils';
import { useSettings } from '@/components/core/hooks/useSettings';
import styles from './Ticket.module.scss';
import type { TaxiTripItemDataType } from '@/types';

interface ITaxiTicketProps {
  ticketData: TaxiTripItemDataType;
  onClick: (seatsCount: number) => void;
}

function TaxiTicket({ ticketData, onClick }: ITaxiTicketProps) {
  const {
    settings: { dictionary },
  } = useSettings();

  const generalDictionary = dictionary.general;

  const [_ticketData, setTicketData] = useState<TaxiTripItemDataType>(ticketData);

  useEffect(() => {
    setTicketData(ticketData);
  }, [ticketData]);

  const {
    taxi_model,
    driver,
    departure_time,
    arrival_time,
    duration,
    ticket_price,
    available_seats,
    route,
    boarding_location,
    drop_off_location,
    is_fastest
  } = _ticketData;

  return (
    <div
      className={classnames(styles.ticket, 'overflow-hidden pt-1.5 pb-4 px-3.5 cursor-pointer')}
      onClick={() => onClick(available_seats ?? 0)}
    >
      {/* Header with Driver and Taxi Info */}
      <div className="flex items-center justify-end relative z-10">
        
        {is_fastest && (
          <div className="bg-success text-white text-xxs px-2 py-1 rounded-full">
            {generalDictionary.fastest}
          </div>
        )}
      </div>

      {/* Route and Timing Information */}
      <div className="mt-2 flex items-center justify-between relative z-10 gap-x-4">
        {/* Origin */}
        <div className="w-1/2 flex">
          <div className="text-center">
            <div className="font-semibold text-xs leading-[1.65]">
              {route?.origin || generalDictionary.unknown}
            </div>
            <div className="text-primary text-xsm mt-0.5">{departure_time}</div>
            <div className="text-xxs text-[var(--color-gray-500)]">
              {boarding_location?.name || generalDictionary.unknown}
            </div>
          </div>
        </div>

        {/* Duration and Path */}
        <div className="flex flex-col items-center gap-y-1 shrink-0">
          <div className="text-primary">
            <Icon name="taxi-path" className="ltr:hidden rtl:block" width={93} height={18} />
            <Icon name="taxi-path-ltr" className="ltr:block rtl:hidden" width={93} height={18} />
          </div>
          <div className="mt-1 text-[var(--color-gray-500)] text-xxs">{duration}</div>
        </div>

        {/* Destination */}
        <div className="w-1/2 flex justify-end">
          <div className="text-center">
            <div className="font-semibold text-xs leading-[1.65]">
              {route?.destination || generalDictionary.unknown}
            </div>
            <div className="text-primary text-xs mt-0.5">{arrival_time}</div>
            <div className="text-xxs text-[var(--color-gray-500)]">
              {drop_off_location?.name || generalDictionary.unknown}
            </div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className={classnames(styles['ticket-separator'], 'my-4 px-4')}>
        <div className={classnames(styles['ticket-separator__line'])}></div>
      </div>

      {/* Footer with Price and Availability */}
      <div className="flex flex-wrap items-center justify-between gap-y-3 relative z-10">

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img 
              src={taxi_model?.image || '/assets/images/modules/bus-booking/vendor-default.png'} 
              alt={`${taxi_model?.name} - ${driver?.name}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="font-semibold text-[var(--color-gray-800)] text-xsm">
            {driver?.name} - {taxi_model?.name}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <div className="font-semibold text-xmd">{ticket_price}</div>
            <div className="text-[var(--color-gray-500)]">
              <Icon name="afghan-currency" size={18} />
            </div>
          </div>
        </div>

        
      </div>

      {/* Additional Info - Driver Rating and Model */}
      <div className="flex items-center justify-between mt-3 text-xxs text-[var(--color-gray-500)]">
        
        <div>
          <span className='text-red-600'>{taxi_model?.capacity} {generalDictionary.seat}</span>
        </div>

        <div>
         {generalDictionary.perPerson}
        </div>
      </div>
    </div>
  );
}

export default memo(TaxiTicket, (prevProps, nextProps) => {
  return prevProps.ticketData === nextProps.ticketData && prevProps.onClick === nextProps.onClick;
});