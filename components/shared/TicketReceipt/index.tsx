import TripDetails from '@/components/shared/TripDetails';
import { classnames } from '@/utils';
import styles from './TicketReceipt.module.scss';
import Icon from '@/components/core/Icon';
import { useSettings } from '@/components/core/hooks/useSettings';
import { i18n } from '@/config';

import type { TicketItemDataType, TripItemDataType, UserBaseDataType } from '@/types';
import { formatSeatNumber } from '@/utils/seatNumber';

type TicketReceiptPropsType = {
  className?: string;
  tripData: TripItemDataType;
  selectedSeats: number[];
  paymentData: Record<string, unknown>; // TODO: Define a proper type for paymentData
  ownerData: UserBaseDataType;
  passengers: TicketItemDataType[];
};

export default function TicketReceipt({
  className = '',
  tripData,
  paymentData,
  selectedSeats,
  ownerData,
  passengers,
}: TicketReceiptPropsType) {
  const {
    settings: { dictionary, lang },
  } = useSettings();

  const generalDictionary = dictionary.general;

  const { bus, route, arrival_time, departure_time } = tripData;
  const { origin_city, origin_station, destination_city, destination_station } = route ?? {};

  const { first_name, last_name, id, mobile, email, status } = ownerData;

  const [, departureTime] = departure_time.split(' ');

  return (
    <div className={classnames('TicketReceipt', styles.TicketReceipt, className)}>
      <div className={classnames(styles.TicketReceipt__inner, 'p-4')}>
        <TripDetails
          departure={origin_city.name}
          destination={destination_city.name}
          departureTime={departureTime.replace(/:00$/, '')}
          arrivalTime={arrival_time.split(' ')[1].replace(/:00$/, '')}
          duration={250}
          className="mt-3 relative z-10"
        />
        <div className={classnames(styles.TicketReceipt__separator, 'mt-6 mb-4')}>
          <div className={styles.TicketReceipt__separator__inner}></div>
        </div>
        <div className={classnames('table relative z-10', styles.TicketReceipt__ticketInfo)}>
          <div className="table-row-group">
            <div className="table-row">
              <div className="table-cell">
                <div className={styles.TicketReceipt__ticketInfo__item}>
                  <div className={styles.TicketReceipt__ticketInfo__item__title}>{generalDictionary.fullName}</div>
                  <div className={styles.TicketReceipt__ticketInfo__item__value}>
                    {first_name} {last_name}
                  </div>
                </div>
              </div>
              <div className="table-cell">
                <div className={styles.TicketReceipt__ticketInfo__item}>
                  <div className={styles.TicketReceipt__ticketInfo__item__title}>{generalDictionary.idNumber}</div>
                  <div className={styles.TicketReceipt__ticketInfo__item__value}>---</div>
                </div>
              </div>
              {/* <div className="table-cell">
                <div className={styles.TicketReceipt__ticketInfo__item}>
                  <div className={styles.TicketReceipt__ticketInfo__item__title}>{generalDictionary.trackingNumber}</div>
                  <div className={styles.TicketReceipt__ticketInfo__item__value}>#145216</div>
                </div>
              </div> */}
            </div>
            <div className="table-row">
              <div className="table-cell">
                <div className={styles.TicketReceipt__ticketInfo__item}>
                  <div className={styles.TicketReceipt__ticketInfo__item__title}>{generalDictionary.moveDate}</div>
                  <div className={styles.TicketReceipt__ticketInfo__item__value}>
                    {i18n.langDateFormatter[lang!]().format(new Date(departure_time))}
                  </div>
                </div>
              </div>
              <div className="table-cell">
                <div className={styles.TicketReceipt__ticketInfo__item}>
                  <div className={styles.TicketReceipt__ticketInfo__item__title}>ساعت حرکت</div>
                  <div className={styles.TicketReceipt__ticketInfo__item__value}>{departureTime.replace(/:00$/, '')}</div>
                </div>
              </div>
              <div className="table-cell">
                <div className={styles.TicketReceipt__ticketInfo__item}>
                  <div className={styles.TicketReceipt__ticketInfo__item__title}>ترمینال مبدا</div>
                  <div className={styles.TicketReceipt__ticketInfo__item__value}>{origin_station.name || 'نامشخص'}</div>
                </div>
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell">
                <div className={styles.TicketReceipt__ticketInfo__item}>
                  <div className={styles.TicketReceipt__ticketInfo__item__title}>تعداد بزرگسال</div>
                  <div className={styles.TicketReceipt__ticketInfo__item__value}>
                    {passengers.filter((item) => item.is_child === false).length}
                  </div>
                </div>
              </div>
              <div className="table-cell">
                <div className={styles.TicketReceipt__ticketInfo__item}>
                  <div className={styles.TicketReceipt__ticketInfo__item__title}>تعداد کودک</div>
                  <div className={styles.TicketReceipt__ticketInfo__item__value}>
                    {passengers.filter((item) => item.is_child === true).length}
                  </div>
                </div>
              </div>
              <div className="table-cell">
                <div className={styles.TicketReceipt__ticketInfo__item}>
                  <div className={styles.TicketReceipt__ticketInfo__item__title}>{generalDictionary.seat}</div>
                  {/* <div className={styles.TicketReceipt__ticketInfo__item__value}>{selectedSeats.join(', ')}</div> */}
                  <div className={styles.TicketReceipt__ticketInfo__item__value}>{selectedSeats.map((item) => formatSeatNumber(item)).join(', ')}</div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-error text-center text-xs leading-[1.8] relative z-10">
          <p>{generalDictionary.invalidateTicketMessage}</p>
        </div>
        <div className={classnames(styles.TicketReceipt__separator, 'mt-4 mb-7')}>
          <div className={styles.TicketReceipt__separator__inner}></div>
        </div>
        <div className="flex flex-col items-center gap-2 relative z-10">
          <div className="px-2">
            <img className="w-full !h-auto" src="/assets/images/tmp/sample-barcode.png" alt="" />
          </div>
          <div className="flex gap-1 text-[#003] text-xxs">
            <div>{generalDictionary.showBarcode}</div>
            <Icon name="info" size={13} />
          </div>
        </div>
      </div>
    </div>
  );
}
