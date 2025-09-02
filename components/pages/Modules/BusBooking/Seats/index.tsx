'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import PageWrapper from '@/components/core/PageWrapper';
import Header from '@/components/shared/Header';
import styles from './Seats.module.scss';
import { classnames, getLocalizedUrl } from '@/utils';
import SeatButton from './SeatButton';
import BottomBar from '@/components/shared/BottomBar';
import Icon from '@/components/core/Icon';
import { Button } from '@/components/core/Button';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';

import { useSettings } from '@/components/core/hooks/useSettings';
import { routeList } from '@/config';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';
import useTripStore from '@/store/useTripStore';

import type { Locale } from '@/config/i18n';
import type { SeatItemDataType } from '@/types/bus';
import type { SeatPriceItemDataType } from '@/types/trip';
import { formatSeatNumber } from '@/utils/seatNumber';

export default function BusBookingSeats() {
  const router = useRouter();
  const { lang: locale } = useParams();
  const {
    settings: { dictionary },
  } = useSettings();

  const generalDictionary = dictionary.general;

  const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);

  const [isNextStepLoading, setIsNextStepLoading] = useState(false);

  const selectedTripDataStore = useTripStore((state) => state.selectedTripData);
  const setSelectedSeatsStore = useTripStore((state) => state.setSelectedSeats);

  const [selectedSeats, setSelectedSeats] = useState<{ seatPriceId: number; seatNumber: number }[]>([]);

  const handleSelectSeat = useCallback(
    (seatData: { seatPriceId: number; seatNumber: number }) => {
      const targetIndex = selectedSeats.findIndex((item) => item.seatNumber === seatData.seatNumber);
      if (targetIndex > -1) {
        selectedSeats.splice(targetIndex, 1);
        setSelectedSeats([...selectedSeats]);
        return;
      }

      if (selectedSeats.length >= 2) {
        toast.error(generalDictionary.maxSeats);
        return;
      }

      setSelectedSeats([...selectedSeats, seatData]);
    },
    [selectedSeats]
  );

  const handleNextStep = useCallback(() => {
    setIsNextStepLoading(true);
    router.push(getLocalizedUrl(routeList.busBooking.subPathList.supervisorInfo.path, locale as Locale));
  }, []);

  useEffect(() => {
    setActiveRoute(routeList.busBooking.subPathList.seatSelection);

    return () => {
      setActiveRoute(null);
    };
  }, []);

  useEffect(() => {
    setSelectedSeatsStore(selectedSeats);
  }, [selectedSeats]);

  const seatFormattedList = useMemo(() => {
    const formattedSeats: (SeatItemDataType & SeatPriceItemDataType)[][] = [];

    selectedTripDataStore.bus.seats?.seats.forEach((seat) => {
      const _seatData = {
        ...seat,
        ...selectedTripDataStore.seat_prices.find((item) => item.seat_number === seat.seat_number),
      } as SeatItemDataType & SeatPriceItemDataType;

      if (formattedSeats[seat.row - 1] == null) {
        formattedSeats[seat.row - 1] = [_seatData];
      } else {
        formattedSeats[seat.row - 1].push(_seatData);
      }
    });

    return formattedSeats;
  }, [selectedTripDataStore.bus.seats]);

  const { ticket_price, available_seats, total_seats } = selectedTripDataStore;

  return (
    <PageWrapper name="module-bus-booking" customBottomSpacing="15rem">
      <Header
        wallpaper="/assets/images/modules/bus-booking/wallpaper.jpg"
        title={generalDictionary.selectSeat}
        minHeight="9.7rem"
      />

      <div className="-mt-4 relative z-10">
        <div className="container-fluid">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 justify-center">
            <li className="flex items-center gap-1.5">
              <i className="w-3.5 h-3.5 rounded-full bg-primary" />
              <span className="text-xxs sm:text-xs font-semibold">{generalDictionary.selected}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <i className="w-3.5 h-3.5 rounded-full border border-primary" />
              <span className="text-xxs sm:text-xs font-semibold">{generalDictionary.emptySeat}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <i className="w-3.5 h-3.5 rounded-full bg-[var(--color-disabled)]" />
              <span className="text-xxs sm:text-xs font-semibold text-[var(--color-gray-600)]">
                {generalDictionary.inactive}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <div className="container-fluid">
          <div className={classnames(styles.seatsWrapper)}>
            <div className={classnames(styles.seatsTable, 'table')}>
              <div className="table-row-group">
                {seatFormattedList.map((seatListInRow, index) => (
                  <div key={`seats-row-${index + 1}`} className={`table-row seats-row-${index + 1}`}>
                    {seatListInRow.map((seat) => (
                      <div key={seat.row + '-' + seat.column} className="table-cell">
                        <SeatButton
                          seatData={{ seatNumber: seat.seat_number, seatPriceId: seat.id }}
                          onSelectSeat={handleSelectSeat}
                          isSelected={selectedSeats.findIndex((item) => item.seatNumber === seat.seat_number) > -1}
                          isUnavailable={seat.is_avaiable === false}
                        />
                      </div>
                    ))}
                  </div>
                ))}
                {/* <div className="table-row seats-row-1">
                  <div className="table-cell">
                    <SeatButton
                      name="F1"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('F1')}
                      isUnavailable={unavailableSeats.includes('F1')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="D1"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('D1')}
                      isUnavailable={unavailableSeats.includes('D1')}
                    />
                  </div>
                  <div className="table-cell"></div>
                  <div className="table-cell">
                    <SeatButton
                      name="B1"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('B1')}
                      isUnavailable={unavailableSeats.includes('B1')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="A1"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('A1')}
                      isUnavailable={unavailableSeats.includes('A1')}
                    />
                  </div>
                </div>
                <div className="table-row seats-row-2">
                  <div className="table-cell">
                    <SeatButton
                      name="F2"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('F2')}
                      isUnavailable={unavailableSeats.includes('F2')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="D2"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('D2')}
                      isUnavailable={unavailableSeats.includes('D2')}
                    />
                  </div>
                  <div className="table-cell"></div>
                  <div className="table-cell">
                    <SeatButton
                      name="B2"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('B2')}
                      isUnavailable={unavailableSeats.includes('B2')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="A2"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('A2')}
                      isUnavailable={unavailableSeats.includes('A2')}
                    />
                  </div>
                </div>
                <div className="table-row seats-row-3">
                  <div className="table-cell">
                    <SeatButton
                      name="F3"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('F3')}
                      isUnavailable={unavailableSeats.includes('F3')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="D3"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('D3')}
                      isUnavailable={unavailableSeats.includes('D3')}
                    />
                  </div>
                  <div className="table-cell"></div>
                  <div className="table-cell">
                    <SeatButton
                      name="B3"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('B3')}
                      isUnavailable={unavailableSeats.includes('B3')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="A3"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('A3')}
                      isUnavailable={unavailableSeats.includes('A3')}
                    />
                  </div>
                </div>
                <div className="table-row seats-row-4">
                  <div className="table-cell">
                    <SeatButton
                      name="F4"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('F4')}
                      isUnavailable={unavailableSeats.includes('F4')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="D4"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('D4')}
                      isUnavailable={unavailableSeats.includes('D4')}
                    />
                  </div>
                  <div className="table-cell"></div>
                  <div className="table-cell">
                    <SeatButton
                      name="B4"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('B4')}
                      isUnavailable={unavailableSeats.includes('B4')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="A4"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('A4')}
                      isUnavailable={unavailableSeats.includes('A4')}
                    />
                  </div>
                </div>
                <div className="table-row seats-row-5">
                  <div className="table-cell">
                    <SeatButton
                      name="F5"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('F5')}
                      isUnavailable={unavailableSeats.includes('F5')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="D5"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('D5')}
                      isUnavailable={unavailableSeats.includes('D5')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="C5"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('C5')}
                      isUnavailable={unavailableSeats.includes('C5')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="B5"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('B5')}
                      isUnavailable={unavailableSeats.includes('B5')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="A5"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('A5')}
                      isUnavailable={unavailableSeats.includes('A5')}
                    />
                  </div>
                </div>
                <div className="table-row seats-row-6">
                  <div className="table-cell">
                    <SeatButton
                      name="F6"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('F6')}
                      isUnavailable={unavailableSeats.includes('F6')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="D6"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('D6')}
                      isUnavailable={unavailableSeats.includes('D6')}
                    />
                  </div>
                  <div className="table-cell"></div>
                  <div className="table-cell">
                    <SeatButton
                      name="B6"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('B6')}
                      isUnavailable={unavailableSeats.includes('B6')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="A6"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('A6')}
                      isUnavailable={unavailableSeats.includes('A6')}
                    />
                  </div>
                </div>
                <div className="table-row seats-row-7">
                  <div className="table-cell">
                    <SeatButton
                      name="F7"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('F7')}
                      isUnavailable={unavailableSeats.includes('F7')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="D7"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('D7')}
                      isUnavailable={unavailableSeats.includes('D7')}
                    />
                  </div>
                  <div className="table-cell"></div>
                  <div className="table-cell">
                    <SeatButton
                      name="B7"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('B7')}
                      isUnavailable={unavailableSeats.includes('B7')}
                    />
                  </div>
                  <div className="table-cell">
                    <SeatButton
                      name="A7"
                      onSelectSeat={handleSelectSeat}
                      isSelected={selectedSeats.includes('A7')}
                      isUnavailable={unavailableSeats.includes('A7')}
                    />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomBar transparent={true}>
        <div className="pt-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-start basis-1/2">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="text-xxs">{generalDictionary.seat}</div>
                <div className="text-xxs xs:text-xsm">
                  {selectedSeats.length
                    ? selectedSeats.map((item) => formatSeatNumber(item.seatNumber)).join(',')
                    : generalDictionary.notSelected}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-1 shrink-0">
              <div className="text-xxs">{generalDictionary.numberPassengers}</div>
              {/* <div className="text-xxs xs:text-xsm">بزرگسال 2، کودک 0</div> */}
              <div className="text-xxs xs:text-xsm">{total_seats} {generalDictionary.seatCountUnit}</div>
            </div>
            <div className="flex flex-col items-end basis-1/2">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="text-xxs">{generalDictionary.amount}</div>
                <div className="flex items-center gap-1">
                  <div className="font-semibold text-xmd">{ticket_price}</div>
                  <div className="text-[var(--color-gray-300)]">
                    <Icon name="afghan-currency" size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button
              color="success"
              size="medium"
              className="w-full"
              disabled={!selectedSeats.length}
              onClick={handleNextStep}
              loading={isNextStepLoading}
            >
              {generalDictionary['confirm&payment']}
            </Button>
          </div>
        </div>
      </BottomBar>
    </PageWrapper>
  );
}
