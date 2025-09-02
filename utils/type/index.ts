import { SimpleObject } from '@/types/general';

export function isNumber(value: unknown): value is number {
  if (typeof value === 'number') return true;
  else if (typeof value === 'string') return !isNaN(Number(value));
  return false;
}

export function isArray<T>(value: unknown): value is Array<T> {
  return Array.isArray(value);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(functionToCheck: unknown): functionToCheck is Function {
  return !!functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export function isObject<T>(val: unknown): val is SimpleObject<T> {
  return (
    val !== null &&
    typeof val === 'object' &&
    Array.isArray(val) === false &&
    Object.prototype.toString.call(val) === '[object Object]'
  );
}

export function isUndefined(data: unknown): data is undefined {
  return typeof data === 'undefined';
}
