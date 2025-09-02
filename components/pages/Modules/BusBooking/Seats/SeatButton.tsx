import Icon from '@/components/core/Icon';
import styles from './Seats.module.scss';
import { classnames } from '@/utils';
import { toast } from 'react-toastify';
import { useSettings } from '@/components/core/hooks/useSettings';
import { formatSeatNumber } from '@/utils/seatNumber';

interface ISeatButtonProps {
  seatData: { seatPriceId: number; seatNumber: number; };
  isSelected?: boolean;
  isUnavailable?: boolean;
  onSelectSeat?(seatData: { seatPriceId: number; seatNumber: number; }): void;
}

export default function SeatButton({
  seatData,
  isSelected = false,
  isUnavailable = false,
  onSelectSeat,
}: ISeatButtonProps) {
  const { settings: { dictionary } } = useSettings();
  
  const handleSelectSeat = (seatData?: { seatPriceId: number; seatNumber: number; }) => {
    if (isUnavailable) {
      toast.error(dictionary.general.seatAlreadySelected);
      return;
    }

    if (seatData == null) return;

    onSelectSeat?.(seatData);
  };

  const seatClass = classnames(styles.seatsTable__button, {
    [styles.isSelected]: isSelected,
    [styles.isUnavailable]: isUnavailable,
  });

  const SeatIcon = () => {
    if (isSelected) {
      return <Icon name="seat" className="text-primary" />;
    }

    if (isUnavailable) {
      return <Icon name="seat" className="text-[var(--color-disabled)]" />;
    }

    return <Icon name="seat-available" className="text-primary" />;
  };

  return (
    <button
      className={seatClass}
      aria-label={seatData.seatNumber + ''}
      onClick={() => {
        handleSelectSeat(seatData);
      }}
    >
      <SeatIcon />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span
          className={classnames('block text-primary font-secondary text-md sm:text-lg font-medium', {
            'text-white': [isSelected, isUnavailable].includes(true),
          })}
        >
          {formatSeatNumber(seatData.seatNumber)}
        </span>
        <span></span>
      </div>
    </button>
  );
}
