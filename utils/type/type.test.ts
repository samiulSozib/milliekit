import { describe, it, expect } from 'vitest';
import { isNumber, isArray, isString, isFunction, isObject, isUndefined } from '.';

describe('Type checking functions', () => {
  describe('isNumber', () => {
    it('should return true if the input is a number', () => {
      expect(isNumber(5)).toBeTruthy();
    });

    it('should return true if the input is a string that can be converted into a number', () => {
      expect(isNumber('5')).toBeTruthy();
    });

    it('should return false if the input is not a number or a string that can be converted to a number', () => {
      expect(isNumber('hello')).toBeFalsy();
      expect(isNumber([])).toBeFalsy();
      expect(isNumber({})).toBeFalsy();
      expect(isNumber(false)).toBeFalsy();
      expect(isNumber(null)).toBeFalsy();
      expect(isNumber(undefined)).toBeFalsy();
    });

    it.skip('should return false if the input is not a number or a string that can be converted to a number', () => {
      // TODO: `Nan` and `Infinity` aren't number
      expect(isNumber(NaN)).toBeFalsy();
      expect(isNumber(Infinity)).toBeFalsy();
    });
  });

  describe('isArray', () => {
    it('should return true if the input is an array', () => {
      expect(isArray([1, 2, 3])).toBeTruthy();
    });

    it('should return false if the input is not an array', () => {
      expect(isArray('hello')).toBeFalsy();
      expect(isArray({})).toBeFalsy();
      expect(isArray(false)).toBeFalsy();
      expect(isArray(null)).toBeFalsy();
      expect(isArray(undefined)).toBeFalsy();
      expect(isArray(NaN)).toBeFalsy();
      expect(isArray(Infinity)).toBeFalsy();
    });
  });

  describe('isString', () => {
    it('should return true if the input is a string', () => {
      expect(isString('hello')).toBeTruthy();
    });

    it('should return false if the input is not a string', () => {
      expect(isString(5)).toBeFalsy();
      expect(isString([1, 2, 3])).toBeFalsy();
      expect(isString({})).toBeFalsy();
      expect(isString(false)).toBeFalsy();
      expect(isString(null)).toBeFalsy();
      expect(isString(undefined)).toBeFalsy();
      expect(isString(NaN)).toBeFalsy();
      expect(isString(Infinity)).toBeFalsy();
    });
  });

  describe('isFunction', () => {
    it('should return true if the input is a function', () => {
      const myFunc = () => {
        console.log('hello');
      };
      expect(isFunction(myFunc)).toBeTruthy();
    });

    it('should return false if the input is not a function', () => {
      expect(isFunction(5)).toBeFalsy();
      expect(isFunction([1, 2, 3])).toBeFalsy();
      expect(isFunction({})).toBeFalsy();
      expect(isFunction(false)).toBeFalsy();
      expect(isFunction(null)).toBeFalsy();
      expect(isFunction(undefined)).toBeFalsy();
      expect(isFunction(NaN)).toBeFalsy();
      expect(isFunction(Infinity)).toBeFalsy();
    });
  });

  describe('isObject', () => {
    it('should return true if the input is a non-array object', () => {
      expect(isObject({ name: 'Berneti', age: 30 })).toBeTruthy();
    });

    it('should return false if the input is not a non-array object', () => {
      expect(isObject(5)).toBeFalsy();
      expect(isObject([1, 2, 3])).toBeFalsy();
      expect(isObject('hello')).toBeFalsy();
      expect(isObject(false)).toBeFalsy();
      expect(isObject(null)).toBeFalsy();
      expect(isObject(undefined)).toBeFalsy();
      expect(isObject(NaN)).toBeFalsy();
      expect(isObject(Infinity)).toBeFalsy();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(isObject(() => {})).toBeFalsy();
    });
  });

  describe('isUndefined', () => {
    it('should return true if the input is undefined', () => {
      let myVar;
      expect(isUndefined(myVar)).toBeTruthy();
    });
  });
});
