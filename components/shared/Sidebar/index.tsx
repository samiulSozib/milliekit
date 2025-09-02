'use client';

import { useSettings } from '@/components/core/hooks/useSettings';
import useAuthStore from '@/store/useAuthStore';
import styles from './Sidebar.module.scss';
import Backdrop from '../Backdrop';
import { useEffect, useRef, useState } from 'react';
import useSidebarStore from '@/store/useSidebarStore';
import Icon from '@/components/core/Icon';
import NavItem from './NavItem';
import { Modal } from '@/components/core/Modal';
import { Button } from '@/components/core/Button';
import { LanguageSelection } from '@/components/shared/LanguageSelection';
import { useParams, usePathname } from 'next/navigation';
import { getLocalizedUrl } from '@/utils';
import { routeList } from '@/config';

import type { Locale } from '@/config/i18n';

export default function Sidebar() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const { lang: locale } = useParams();
  const { isOpen, toggleSidebar } = useSidebarStore();
  const profile = useAuthStore((state) => state.profile);
  const logout = useAuthStore((state) => state.logout);
  const [isOpenLogoutModal, setIsOpenLogoutModal] = useState<boolean>(false);
  const [isOpenContactModal, setIsOpenContactModal] = useState<boolean>(false);
  const [isOpenSwitchLanguageModal, setIsOpenSwitchLanguageModal] = useState<boolean>(false);

  const {
    settings: { dictionary },
  } = useSettings();
  const generalDictionary = dictionary.general;

  useEffect(() => {
    if (typeof window == 'undefined') return;

    if (isOpen) {
      document.body.classList.add(styles['--sidebar-open'], '--sidebar-open');
    } else {
      document.body.classList.remove(styles['--sidebar-open'], '--sidebar-open');
    }
  }, [isOpen]);

  // Close the menu on change route
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      if (isOpen) {
        toggleSidebar(); // Close the menu
      }
      prevPathname.current = pathname; // Update previous pathname
    }
  }, [pathname, isOpen, toggleSidebar]);

  const handleLogout = () => {
    toggleSidebar();
    logout();
  };

  const handleRedirectWhatsapp = () => {};

  return (
    <>
      <div className={styles.Sidebar}>
        <div className={styles.Sidebar__inner}>
          <div className="relative">
            <button
              onClick={toggleSidebar}
              className="absolute left-0 -top-6 ltr:left-auto ltr:right-0 hover:text-primary transition"
            >
              <Icon name="close" />
            </button>
          </div>
          <div className="flex flex-col h-full">
            {profile && (
              <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-full overflow-hidden w-11 h-11 select-none">
                  <img src="/assets/images/misc/profile-default.png" alt="" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="text-xbase font-semibold">
                    {profile.first_name} {profile.last_name}
                  </div>
                  <div className="text-gray-500">{profile.email}</div>
                </div>
              </div>
            )}
            <div className="px-3 mt-10 flex flex-col justify-between flex-1 overflow-y-auto">
              <div className="space-y-8">
                <NavItem
                  title={generalDictionary.profile}
                  icon={<Icon name="user-bold" size={29} />}
                  link={getLocalizedUrl(routeList.profile.path, locale as Locale)}
                />
                <NavItem
                  title={generalDictionary.termsAndConditions}
                  icon={<Icon name="rules" size={29} />}
                  link={getLocalizedUrl(routeList.pages.subPathList.rules.path, locale as Locale)}
                />
                <NavItem
                  title={generalDictionary.faq}
                  icon={<Icon name="question" size={29} />}
                  link={getLocalizedUrl(routeList.pages.subPathList.faq.path, locale as Locale)}
                />
                <NavItem
                  title={generalDictionary.help}
                  icon={<Icon name="note" size={29} />}
                  link={getLocalizedUrl(routeList.pages.subPathList.help.path, locale as Locale)}
                />
                <NavItem
                  title={generalDictionary.contactUs}
                  icon={<Icon name="whatsapp" size={29} />}
                  onClick={() => setIsOpenContactModal(true)}
                />
                <NavItem
                  title={generalDictionary.appLanguage}
                  icon={<Icon name="global" size={29} />}
                  onClick={() => setIsOpenSwitchLanguageModal(true)}
                />
              </div>

              <div className="mt-8">
                <NavItem
                  title={generalDictionary.accountLogout}
                  icon={<Icon name="logout" size={29} />}
                  onClick={() => setIsOpenLogoutModal(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && <Backdrop onClick={toggleSidebar} />}

      <Modal
        isOpen={isOpenLogoutModal}
        onClose={() => setIsOpenLogoutModal(false)}
        autoClose={false}
        footer={
          <div className="p-5 flex gap-3 border-t">
            <div className="w-2/3">
              <Button size="xs" color="danger" className="w-full" onClick={handleLogout}>
                {dictionary.dialogs.confirmLogout}
              </Button>
            </div>
            <div className="w-1/3">
              <Button
                size="xs"
                variant="outlined"
                color="white"
                className="w-full border border-gray-300"
                onClick={() => setIsOpenLogoutModal(false)}
              >
                {generalDictionary.cancel}
              </Button>
            </div>
          </div>
        }
      >
        <div className="px-5 py-6 text-sm text-center flex items-center justify-center gap-3">
          <div className="w-16">
            <img src="/assets/images/misc/icon-failure.png" />
          </div>
          <p>{dictionary.dialogs.readyForLogout}</p>
        </div>
      </Modal>

      <Modal
        isOpen={isOpenContactModal}
        onClose={() => setIsOpenContactModal(false)}
        autoClose={false}
        footer={
          <div className="p-5 flex gap-3 border-t">
            <div className="w-2/3">
              <Button size="xs" color="success" className="w-full" onClick={handleRedirectWhatsapp}>
                {generalDictionary.yes}
              </Button>
            </div>
            <div className="w-1/3">
              <Button
                size="xs"
                variant="outlined"
                color="white"
                className="w-full border border-gray-300"
                onClick={() => setIsOpenContactModal(false)}
              >
                {generalDictionary.cancel}
              </Button>
            </div>
          </div>
        }
      >
        <div className="px-5 py-6 text-sm text-center">
          <p
            dangerouslySetInnerHTML={{
              __html: dictionary.dialogs.continueRedirectToWhatsapp,
            }}
          ></p>
        </div>
      </Modal>

      <Modal isOpen={isOpenSwitchLanguageModal} onClose={() => setIsOpenSwitchLanguageModal(false)} autoClose={false}>
        <div className="px-5 py-6">
          <LanguageSelection
            languageList={[
              {
                langCode: 'fa',
                langName: 'فارسی',
              },
              {
                langCode: 'af',
                langName: 'پشتو',
              },
              {
                langCode: 'en',
                langName: 'English',
              },
            ]}
            selectedLang={locale as Locale}
          />
        </div>
      </Modal>
    </>
  );
}
