import { isNumber, isObject } from '../type';

export const isEmpty = (data: unknown): data is never | undefined | null =>
  (!data && !isNumber(data)) ||
  (Array.isArray(data) && data.length === 0) ||
  (isObject(data) && Object.keys(data).length === 0);
