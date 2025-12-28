'use client';

import { classnames, type getDictionary } from '@/utils';
import { Badge } from '@/components/core/Badge';
import { _dateOptions, i18n } from '@/config';
import { useSettings } from '@/components/core/hooks/useSettings';

export interface TaxiTransactionCardProps {
  id: number;
  status: 'issued_ticket' | 'pending' | 'cancelled' | 'completed';
  order_id: string;
  date: string;
  amount: string;
  origin?: string;
  destination?: string;
  passengers?: {
    adult: number;
    child: number;
  };
}

const statusStyles = (dictionary: Awaited<ReturnType<typeof getDictionary>>) => ({
  issued_ticket: {
    shadow: 'success-shadow',
    background: 'success-bg',
    labelText: dictionary.general.issuedTicket,
    badgeStatus: 'success' as const,
  },
  completed: {
    shadow: 'success-shadow',
    background: 'success-bg',
    labelText: dictionary.general.completed,
    badgeStatus: 'success' as const,
  },
  pending: {
    shadow: 'pending-shadow',
    background: 'pending-bg',
    labelText: dictionary.general.pending,
    badgeStatus: 'pending' as const,
  },
  cancelled: {
    shadow: 'failed-shadow',
    background: 'failed-bg',
    labelText: dictionary.general.cancelled,
    badgeStatus: 'failed' as const,
  },
});

export const TaxiTransactionCard: React.FC<TaxiTransactionCardProps> = ({ 
  status, 
  date, 
  order_id, 
  amount, 
  origin, 
  destination, 
  passengers 
}) => {
  const {
    settings: { dictionary, lang },
  } = useSettings();

  const styles = statusStyles(dictionary);
  const defaultStyles = styles[status] ?? styles.pending;

  return (
    <div className={classnames('rounded-lg overflow-hidden', defaultStyles.shadow)}>
      <div className={classnames('flex justify-between py-3 px-2', defaultStyles.background)}>
        <div className="text-xs text-gray-700">{order_id}</div>
        <div className="text-xxs text-gray-600">
          {i18n.langDateFormatter[lang!](_dateOptions).format(new Date(date))}
        </div>
      </div>
      <div className="card-content text-right space-y-2 text-xxs p-2">

        {/* ticket number */}
        
          <div className="flex justify-between items-center">
            <div className="text-gray-500">{dictionary.general.ticket}:</div>
            <div className="text-gray-700 font-semibold">
              {order_id}
            </div>
          </div>
        

        {/* Route Information */}
        {(origin || destination) && (
          <div className="flex justify-between items-center">
            <div className="text-gray-500">{dictionary.general.origin}:</div>
            <div className="text-gray-700 font-semibold">
              {origin}
            </div>
          </div>
        )}

        {/* Route Information */}
        {(origin || destination) && (
          <div className="flex justify-between items-center">
            <div className="text-gray-500">{dictionary.general.destination}:</div>
            <div className="text-gray-700 font-semibold">
              {destination}
            </div>
          </div>
        )}

        {/* Route Information */}
        {(origin || destination) && (
          <div className="flex justify-between items-center">
            <div className="text-gray-500">{dictionary.general.arrivalTime}:</div>
            <div className="text-gray-700 font-semibold">
              {i18n.langDateFormatter[lang!](_dateOptions).format(new Date(date))}
            </div>
          </div>
        )}

        {/* Passengers Information */}
        {passengers && (
          <div className="flex justify-between items-center">
            <div className="text-gray-500">{dictionary.general.passengers}:</div>
            <div className="text-gray-700">
              {dictionary.general.adult}: {passengers.adult}, {dictionary.general.child}: {passengers.child}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="flex justify-between items-center">
          <div className="text-gray-500">{dictionary.general.status}:</div>
          <Badge status={defaultStyles.badgeStatus}>{defaultStyles.labelText}</Badge>
        </div>

        {/* Amount */}
        <div className="flex justify-between items-center">
          <div className="text-gray-500">{dictionary.general.amount}:</div>
          <div className="text-gray-700 font-semibold">{amount}</div>
        </div>
      </div>
    </div>
  );
};