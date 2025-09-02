import { parseJson } from './parse-json';

export const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);

  if (data == null) return defaultValue;

  return parseJson(data) ?? defaultValue;
};
