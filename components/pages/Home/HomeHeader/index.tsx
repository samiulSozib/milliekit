import { useEffect, useRef, useState } from 'react';
import { classnames, getLocalStorageItem, type getDictionary } from '@/utils';
import useAuthStore from '@/store/useAuthStore';

import styles from './HomeHeader.module.scss';
import MenuIcon from '@/components/core/Icon/MenuIcon';
import WalletIcon from '@/components/core/Icon/WalletIcon';
import WalletFilledIcon from '@/components/core/Icon/WalletFilledIcon';
import WalletAltIcon from '@/components/core/Icon/WalletAltIcon';
import WalletAltFilledIcon from '@/components/core/Icon/WalletAltFilledIcon';
import CartSendIcon from '@/components/core/Icon/CartSendIcon';
import CartSendFilledIcon from '@/components/core/Icon/CartSendFilledIcon';
import CartReceiveIcon from '@/components/core/Icon/CartReceiveIcon';
import CartReceiveFilledIcon from '@/components/core/Icon/CartReceiveFilledIcon';
import { useSettings } from '@/components/core/hooks/useSettings';
import useSidebarStore from '@/store/useSidebarStore';
import { CustomerRequest } from '@/server/customer';
import { apiPathConfig, i18n } from '@/config';

import type { LoggedInDataType } from '@/types';
import { Spinner } from '@/components/core/Spinner';
import Icon from '@/components/core/Icon';

const selectOptions = (dictionary: Awaited<ReturnType<typeof getDictionary>>) => [
  {
    id: 1,
    icon: WalletIcon,
    iconFilled: WalletFilledIcon,
    title: dictionary.general.credit,
    fullTitle: dictionary.general.accountCredit,
    value: 0,
  },
  {
    id: 2,
    icon: WalletAltIcon,
    iconFilled: WalletAltFilledIcon,
    title: dictionary.general.debt,
    fullTitle: dictionary.general.accountDebt,
    value: 0,
  },
  {
    id: 3,
    icon: CartSendIcon,
    iconFilled: CartSendFilledIcon,
    title: dictionary.general.sale,
    fullTitle: dictionary.general.accountSale,
    value: 0,
  },
  {
    id: 4,
    icon: CartReceiveIcon,
    iconFilled: CartReceiveFilledIcon,
    title: dictionary.general.profit,
    fullTitle: dictionary.general.accountInterest,
    value: 0,
  },
];

const customerRequest = new CustomerRequest({
  url: apiPathConfig.bookings.base,
});

const getWalletBalance = async (params?: { onSuccess?: () => void; onError?: () => void; onSettled?: () => void }) => {
  const { onSuccess, onError, onSettled } = params || {};

  const userData = getLocalStorageItem<LoggedInDataType | null>('userData', null);
  customerRequest.options.token = userData?.token;

  try {
    const response = await customerRequest.getWalletBalance<{ balance: number }>();
    onSuccess?.();
    return response.balance;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    onError?.();
  } finally {
    onSettled?.();
  }
};

export default function HomeHeader() {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const profile = useAuthStore((state) => state.profile);
  const {
    settings: { dictionary, lang },
  } = useSettings();

  const options = selectOptions(dictionary);
  const [loading, setLoading] = useState(false);

  const selectedSectionRef = useRef<(typeof options)[0]>({} as (typeof options)[0]);

  const handleSelect = (id: number) => {
    setLoading(true);

    const selectedItem = options.find((item) => item.id === id);

    if (selectedItem == null) {
      setLoading(false);
      return;
    }

    selectedSectionRef.current = selectedItem;

    requestAnimationFrame(() => {
      if (selectedSectionRef.current.id === 1) {
        setLoading(true);

        getWalletBalance({
          onSettled() {
            setLoading(false);
          },
        }).then((balance) => {
          selectedSectionRef.current = {
            ...selectedSectionRef.current,
            value: balance ?? 0,
          };
        });
      } else {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    handleSelect(1);
  }, []);

  return (
    <div className={classnames('HomeHeader', styles.HomeHeader)}>
      <div className={classnames('HomeHeader__inner text-white relative pt-8 pb-24', styles.HomeHeader__inner)}>
        <div className="container-fluid">
          <div className={classnames('HomeHeader__top flex justify-between items-center')}>
            <div className={classnames('HomeHeader__menu')}>
              <button
                onClick={toggleSidebar}
                className="border rounded-full w-10 h-10 flex items-center justify-center ltr-rotate"
              >
                <MenuIcon width="25" />
              </button>
            </div>
            {profile && (
              <div className="flex items-center gap-3">
                <span className="text-sm">
                  {profile.first_name} {profile.last_name}
                </span>
                <div className="rounded-full overflow-hidden w-10 h-10 select-none">
                  <img src="/assets/images/misc/profile-default.png" alt="" />
                </div>
              </div>
            )}
          </div>
          <div className="HomeHeader__credits relative">
            <div className="mt-8 text-center flex flex-col items-center justify-center select-none h-20">
              {loading || !selectedSectionRef.current.value ? (
                <div className="text-[1.5rem] mt-4">
                  <Spinner turbo />
                </div>
              ) : (
                <>
                  <div className="text-base text-[#DFE3E8]">{selectedSectionRef.current.fullTitle}</div>
                  <div className="flex items-center gap-2.5 mt-3">
                    <div className="text-4xl font-semibold">
                      {i18n.langNumberFormatter[lang!].format(+selectedSectionRef.current.value)}
                    </div>
                    <i>
                      <Icon name="afghan-currency" size={25} />
                    </i>
                  </div>
                </>
              )}
            </div>

            <div className="bg-white rounded-2xl mt-6 w-full shadow-md absolute right-0 z-10 text-global">
              <div className="flex justify-around items-center py-4 px-5">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={classnames('text-center text-gray-700 select-none hover:text-primary transition', {
                      'text-primary': selectedSectionRef.current.id === option.id,
                    })}
                  >
                    <button className="flex flex-col items-center" onClick={() => handleSelect(option.id)}>
                      <div className="text-primary c-icon">
                        {selectedSectionRef.current.id === option.id ? (
                          <option.iconFilled width="28" />
                        ) : (
                          <option.icon width="28" />
                        )}
                      </div>
                      <div className="text-xsm mt-2.5">{option.title}</div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
