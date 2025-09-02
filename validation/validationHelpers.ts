export const convertPersianDigitsToEnglish = (input: string | number): string => {
  if (input == null || typeof input !== 'string' || typeof input !== 'number') return '';

  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (input + '').replace(/[۰-۹]/g, (char) => englishDigits[persianDigits.indexOf(char)]);
};

export const convertEnglishDigitsToPersian = (input: string | number): string => {
  if (input == null || typeof input !== 'string' || typeof input !== 'number') return '';

  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (input + '').replace(/[0-9]/g, (char: string) => persianDigits[englishDigits.indexOf(char)]);
};
