'use client';

import { useEffect, useState } from 'react';
import PageWrapper from '@/components/core/PageWrapper';
import Header from '@/components/shared/Header';
import { useSettings } from '@/components/core/hooks/useSettings';
import Icon from '@/components/core/Icon';
import { ControlItem } from './ControlItem';
import useAuthStore from '@/store/useAuthStore';
import { getLocalStorageItem } from '@/utils';
import { LoggedInDataType } from '@/types';
import { apiPathConfig, routeList } from '@/config';
import { CustomerRequest } from '@/server/customer';
import { Spinner } from '@/components/core/Spinner';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';

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

export default function Profile() {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [userBalance, setUserBalance] = useState<number>();

  const {
    settings: { dictionary },
  } = useSettings();

  const generalDictionary = dictionary.general;

  const profile = useAuthStore((state) => state.profile);

  useEffect(() => {
    setIsLoading(true);

    getWalletBalance({
      onSettled() {
        setIsLoading(false);
      },
    }).then((balance) => {
      setUserBalance(balance);
    });
  }, []);

  const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);

  useEffect(() => {
    setActiveRoute(routeList.profile);

    return () => {
      setActiveRoute(null);
    };
  }, []);

  return (
    <PageWrapper name="profile">
      <Header title={dictionary.general.profile} minHeight="10.5rem" overlayOpacity={0.1} />
      <div className="container-fluid">
        <div className="flex justify-center -mt-4">
          <div className="border border-dashed border-gray-400 p-1.5 flex items-center justify-center rounded-full">
            <button className="relative flex items-center justify-center rounded-full overflow-hidden w-[8rem] h-[8rem] select-none">
              <div className="select-none bg-gray-900">
                <img src="/assets/images/misc/profile-default.png" className="opacity-20" alt="" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-2">
                <div className="text-white flex flex-col items-center text-center gap-y-1">
                  <Icon name="camera" size={24} />
                  <div className="text-xxs">بارگذاری تصویر جدید</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-y-3 mt-8">
          {isLoading ? (
            <div className="text-3xl flex justify-center mt-[10%]">
              <Spinner turbo />
            </div>
          ) : (
            <>
              {profile && (
                <>
                  {profile.first_name || profile.last_name ? (
                    <ControlItem
                      name={`${generalDictionary.firstName} ${generalDictionary.lastName}`}
                      value={`${profile.first_name ?? ''} ${profile.last_name ?? ''}`}
                    />
                  ) : null}

                  {profile.email && <ControlItem name={generalDictionary.email} value={profile.email} />}

                  {profile.mobile && <ControlItem name={generalDictionary.phoneNumber} value={profile.mobile} />}
                </>
              )}

              {userBalance && (
                <ControlItem name={generalDictionary.accountAmount} value={userBalance} isCurrency={true} />
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
