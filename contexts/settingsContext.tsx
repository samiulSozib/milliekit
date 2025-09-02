'use client';

// React Imports
import type { ReactNode } from 'react';
import { createContext, useMemo, useState } from 'react';

// Type Imports
import type { Mode } from '@/types';

// Hook Imports
import { useSetCookie } from '@/components/core/hooks/useSetCookie';

import type { getDictionary } from '@/utils/get-dictionary';
import { i18n, type Locale } from '@/config/i18n';

// Settings type
export type Settings = {
  mode?: Mode;
  primaryColor?: string;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang?: Locale;
};

// UpdateSettingsOptions type
type UpdateSettingsOptions = {
  updateCookie?: boolean;
};

// SettingsContextProps type
type SettingsContextProps = {
  settings: Settings;
  updateSettings(settings: Partial<Settings>, options?: UpdateSettingsOptions): void;
  isSettingsChanged: boolean;
  resetSettings(): void;
  updatePageSettings: (settings: Partial<Settings>) => () => void;
};

type Props = {
  children: ReactNode;
  settingsCookie: Settings | null;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;

  mode?: Mode;
};

// Initial Settings Context
export const SettingsContext = createContext<SettingsContextProps | null>(null);

// Settings Provider
export const SettingsProvider = (props: Props) => {
  // Initial Settings
  const initialSettings: Settings = {
    mode: 'light',
    primaryColor: 'red',
    dictionary: props.dictionary,
    lang: i18n.defaultLocale as Locale,
  };

  const updatedInitialSettings = {
    ...initialSettings,
    mode: props.mode || 'light',
  };

  // Cookies
  const [settingsCookie, updateSettingsCookie] = useSetCookie<Omit<Settings, 'dictionary'>>(
    'milliekitCookie',
    JSON.stringify(props.settingsCookie) !== '{}' ? props.settingsCookie : updatedInitialSettings
  );

  // State
  const [_settingsState, _updateSettingsState] = useState<Settings>(
    JSON.stringify(settingsCookie) !== '{}'
      ? {
          ...settingsCookie,
          dictionary: updatedInitialSettings.dictionary,
        }
      : updatedInitialSettings
  );

  const updateSettings = (settings: Partial<Settings>, options?: UpdateSettingsOptions) => {
    const { updateCookie = true } = options || {};

    _updateSettingsState((prev) => {
      const newSettings = { ...prev, ...settings };

      // Update cookie if needed
      if (updateCookie === true) {
        const { dictionary, ...otherSettings } = newSettings;

        updateSettingsCookie(otherSettings);
      }

      return newSettings;
    });
  };

  /**
   * Updates the settings for page with the provided settings object.
   * Updated settings won't be saved to cookie hence will be reverted once navigating away from the page.
   *
   * @param settings - The partial settings object containing the properties to update.
   * @returns A function to reset the page settings.
   *
   * @example
   * useEffect(() => {
   *     return updatePageSettings({ theme: 'dark' });
   * }, []);
   */
  const updatePageSettings = (settings: Partial<Settings>): (() => void) => {
    updateSettings(settings, { updateCookie: false });

    // Returns a function to reset the page settings
    return () => updateSettings(settingsCookie, { updateCookie: false });
  };

  const resetSettings = () => {
    updateSettings(initialSettings);
  };

  const isSettingsChanged = useMemo(
    () => JSON.stringify(initialSettings) !== JSON.stringify(_settingsState),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_settingsState]
  );

  return (
    <SettingsContext.Provider
      value={{
        settings: _settingsState,
        updateSettings,
        isSettingsChanged,
        resetSettings,
        updatePageSettings,
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
};
