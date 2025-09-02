'use client';

import { useSettings } from '@/components/core/hooks/useSettings';
import Icon from '@/components/core/Icon';
import { classnames, convertMinutesToHours } from '@/utils';

interface ITripDetailsProps {
  departure: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  className?: string;
}

export default function TripDetails({
  departure,
  destination,
  departureTime,
  arrivalTime,
  duration,
  className = '',
}: ITripDetailsProps) {
  const {
    settings: { dictionary },
  } = useSettings();

  return (
    <div className={classnames('flex items-center justify-between', className)}>
      <div className="flex flex-col items-center gap-1">
        <div className="text-xxs text-[var(--color-gray-500)]">{dictionary.general.origin}</div>
        <div className="font-semibold text-xs">{departure}</div>
        <div className="text-primary text-xsm">{departureTime}</div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="text-primary mt-3">
          <Icon name="bus-path" width={93} height={18} />
        </div>
        <div className="mt-1 text-[var(--color-gray-500)] text-xxs">
          {convertMinutesToHours(duration)
            .replace('{{hoursAnd}}', dictionary.general.hoursAnd)
            .replace('{{minutes}}', dictionary.general.minutes)}
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="text-xxs text-[var(--color-gray-500)]">{dictionary.general.destination}</div>
        <div className="font-semibold text-xs">{destination}</div>
        <div className="text-primary text-xs">{arrivalTime}</div>
      </div>
    </div>
  );
}
