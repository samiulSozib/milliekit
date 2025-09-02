import { useCallback } from 'react';

import Icon from '@/components/core/Icon';
import { classnames } from '@/utils';
import { Button } from '@/components/core/Button/Button';
import { useSettings } from '@/components/core/hooks/useSettings';

import type { MouseEvent } from 'react';

type IBusTicketProps = {
  ticketId: string;
  busName: string;
  busImage: string;
  // passengers: string;
  departure: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  travelDate: string;
  price: string;
  isCancellable?: boolean;
  className?: string;
  onCancelTicket?: () => void;
  onClick?(): void;
};

export default function BusTicketCard({
  ticketId,
  busName,
  busImage,
  // passengers,
  departure,
  destination,
  departureTime,
  arrivalTime,
  travelDate,
  price,
  isCancellable = false,
  className = '',
  onCancelTicket,
  onClick,
}: IBusTicketProps) {
  const {
    settings: { dictionary },
  } = useSettings();

  const generalDictionary = dictionary.general;

  const _onCancelTicket = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      onCancelTicket?.();
    },
    [onCancelTicket]
  );

  return (
    <div className={classnames('ticket-item select-none cursor-pointer', className)} onClick={onClick}>
      <div className="bg-[var(--color-gray-200)] rounded-2xl shadow">
        <div className="p-2 flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                <img className="w-full h-full object-cover" src={busImage} alt="" />
              </div>
              <div>
                <div>{busName}</div>
                {/* <div className="text-[var(--color-gray-500)] text-xxs mt-1">{passengers}</div> */}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-[var(--color-gray-700)] text-xxs">#{ticketId}</div>
              <div className="flex items-center text-error gap-1.5">
                <div className="text-lg">{price}</div>
                <div className="text-error">
                  <Icon name="afghan-currency" size={18} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs">{departure}</div>
              <div className="text-primary text-xsm mt-0.5">{departureTime}</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-primary">
                <Icon name="bus-path" width={93} height={18} />
              </div>
              <div className="text-[var(--color-gray-500)] text-xxs">{travelDate}</div>
            </div>
            <div className="text-left">
              <div className="font-semibold text-xs">{destination}</div>
              <div className="text-primary text-xs mt-0.5">{arrivalTime}</div>
            </div>
          </div>
          {isCancellable && (
            <div className="flex justify-center mb-1">
              <Button size="xs" color="danger" onClick={_onCancelTicket}>
                {generalDictionary.ticketCancellationRequest}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
