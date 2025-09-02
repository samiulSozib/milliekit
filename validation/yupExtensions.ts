import { string, addMethod } from 'yup';
import { convertPersianDigitsToEnglish } from './validationHelpers';

addMethod(string, 'afghanPhone', function () {
  return this.test('afghanPhone', 'mobileNumberValidation', function (value) {
    const { path, createError } = this;

    if (!value) return true; // Skip validation if the field is empty

    // Convert Persian digits to English
    const normalizedValue = convertPersianDigitsToEnglish(value);

    // Validate the normalized value
    const afghanPhoneRegex = /^09[0-9]{9}$/;
    if (!afghanPhoneRegex.test(normalizedValue)) {
      return createError({ path, message: 'mobileNumberValidation' });
    }

    return true;
  });
});
