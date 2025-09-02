'use client';

import { classnames, type getDictionary } from '@/utils';
import { Badge } from '@/components/core/Badge';
import { _dateOptions, i18n } from '@/config';
import { useSettings } from '@/components/core/hooks/useSettings';

type TransactionType = 'debit' | 'credit';

export interface TransactionCardProps {
  id: number;
  type: TransactionType;
  phone?: string;
  date: string;
  amount: string;
}

const typeStyles = (dictionary: Awaited<ReturnType<typeof getDictionary>>) => ({
  credit: {
    shadow: 'success-shadow',
    background: 'success-bg',
    labelText: dictionary.general.receiveAmount,
    phonePrefix: dictionary.general.fromNumber,
  },
  debit: {
    shadow: 'failed-shadow',
    background: 'failed-bg',
    labelText: dictionary.general.depositAmount,
    phonePrefix: dictionary.general.toNumber,
  },
});

export const TransactionCard: React.FC<TransactionCardProps> = ({ type, date, phone, amount }) => {
  const {
    settings: { dictionary, lang },
  } = useSettings();

  const styles = typeStyles(dictionary);
  const defaultStyles = styles[type] ?? styles.debit;

  return (
    <div className={classnames('rounded-lg overflow-hidden', defaultStyles.shadow)}>
      <div className={classnames('flex justify-between py-3 px-2', defaultStyles.background)}>
        <div className="text-xs text-gray-700">{/* {defaultStyles.phonePrefix} {phone} */}</div>
        <div className="text-xxs text-gray-600">
          {i18n.langDateFormatter[lang!](_dateOptions).format(new Date(date))}
        </div>
      </div>
      <div className="card-content text-right space-y-2 text-xxs p-2">
        <div className="flex justify-between items-center">
          <div className="text-gray-500">{dictionary.general.transactionType}:</div>
          {type === 'credit' ? (
            <Badge status="success">{dictionary.general.receiveAmount}</Badge>
          ) : (
            <Badge status="failed">{dictionary.general.depositAmount}</Badge>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div className="text-gray-500">{dictionary.general.amount}</div>
          <div className="text-gray-700 font-semibold">{amount}</div>
        </div>
      </div>
    </div>
  );
};
