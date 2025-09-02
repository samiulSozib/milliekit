import Icon from '@/components/core/Icon';

import { classnames } from '@/utils';
import { Badge, type badgeStatusMap } from '@/components/core/Badge';
import { _dateOptions, i18n } from '@/config';
import { useSettings } from '@/components/core/hooks/useSettings';

import type { PaymentStatusType } from '@/types';

// type OrderStatus = 'success' | 'failed' | 'pending';

export interface OrderCardProps {
  id: string;
  date: string;
  // description: string;
  phone: string;
  title: string;
  // buy: string;
  // sell: string;
  status: PaymentStatusType;
  amount: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({ id, date, phone, status, title, amount }) => {
  const {
    settings: { dictionary, lang },
  } = useSettings();
  const generalDictionary = dictionary.general;

  const orderStatus: Record<PaymentStatusType, keyof typeof badgeStatusMap> = {
    paid: 'success',
    partially_paid: 'success',
    unpaid: 'pending',
    cancelled: 'cancelled',
  };

  return (
    <div className={classnames('rounded-lg overflow-hidden', `${orderStatus[status]}-shadow`)}>
      <div className={classnames('flex justify-between py-3 px-2', `${orderStatus[status]}-bg`)}>
        <div className="text-xs text-gray-700">
          {generalDictionary.orderId} (<div className="direction-ltr inline-block">#{id}</div>)
        </div>
        <div className="text-xxs text-gray-600">
          {i18n.langDateFormatter[lang!](_dateOptions).format(new Date(date))}
        </div>
      </div>
      <div className="card-content text-right space-y-2 text-xxs p-2">
        {/* <div className="flex justify-between items-center">
          <div className="text-gray-500">نوع سفارش:</div>
          <div className="text-gray-700">{description}</div>
        </div> */}
        {/* <div className="flex justify-between items-center">
          <div className="text-gray-500">حساب قابل شارژ:</div>
          <div className="text-gray-700 font-semibold">{phone}</div>
        </div> */}
        <div className="flex justify-between items-center">
          <div className="text-gray-500">{generalDictionary.transactionType}:</div>
          <div className="text-gray-700">
            <Badge status={orderStatus[status]} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center gap-x-4">
            <div className="text-gray-500">{generalDictionary.buy}:</div>
            <div className="text-gray-700 font-semibold">{title}</div>
          </div>
          <div className="flex justify-between items-center gap-x-4">
            <div className="text-gray-500">{generalDictionary.amount}:</div>
            <div className="flex gap-1 text-gray-700 font-semibold">
              {i18n.langNumberFormatter[lang!].format(Number(amount))}
              <Icon name={i18n.langCurrencySvgIconName['af']} size={17} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
