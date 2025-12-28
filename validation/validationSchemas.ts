import { object, string, number } from 'yup';
import './yupExtensions'; // Import global extensions (e.g., `afghanPhone`)

const phoneRegex = /^(093|0093|07)[0-9]{8}$/; // Afghan phone format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Basic email format

// Schema for login form with username validation
export const loginWithUsernameSchema = object().shape({
  username: string()
    .required('invalidPhoneOrEmail')
    .test('phone-or-email', 'enterPhoneNumberOrEmail', (value) => {
      if (!value) return false; // Required field
      return phoneRegex.test(value) || emailRegex.test(value);
    }),
  password: string().required('passwordIsRequired').min(6, 'passwordValidation'),
});

// Schema for register form
export const registerFormSchema = object().shape({
  first_name: string().trim().required('requiredField'),
  last_name: string().trim().required('requiredField'),
  password: string().trim().required('requiredField').min(6, 'passwordValidation'),
  mobile: string()
    .trim()
    .required('requiredField')
    .test('mobile', 'mobileNumberValidation', (value) => {
      if (!value) return false; // Required field
      return phoneRegex.test(value);
    }),
  email: string()
    .trim()
    .required('requiredField')
    .test('email', 'mobileNumberValidation', (value) => {
      if (!value) return false; // Required field
      return emailRegex.test(value);
    }),
});

export const mySelfFormSchema = object().shape({
  phone: string()
    .trim()
    .required('requiredField')
    .test('phone', 'mobileNumberValidation', (value) => {
      if (!value) return false; // Required field
      return phoneRegex.test(value);
    }),
});

export const othersDataFormSchema = object().shape({
  first_name: string().trim().required('requiredField'),
  last_name: string().trim().required('requiredField'),
  national_id: string().trim().required('requiredField').min(10, 'nationalIdValidation'),
  birthday: string().trim().required('requiredField'),
  gender: string().trim().oneOf(['male', 'female', 'other']),
  phone: string()
    .trim()
    .required('requiredField')
    .test('phone', 'mobileNumberValidation', (value) => {
      if (!value) return false; // Required field
      return phoneRegex.test(value);
    }),
  email: string()
    .trim()
    .test('email', 'mobileNumberValidation', (value) => {
      if (!value) return false; // Required field
      return emailRegex.test(value);
    }),
});

export const filterFormSchema = object().shape({
  'origin-city-id': string().trim().nullable().required('requiredField'),
  'destination-city-id': string().trim().nullable().required('requiredField'),
  'passenger-count': string().trim().nullable().required('requiredField'),
  'departure-time': string().trim().nullable().required('requiredField'),

  'route-id': string().trim().nullable(),
});

export const taxiFilterFormSchema = object().shape({
  'origin-city-id': string().trim().nullable().required('requiredField'),
  'destination-city-id': string().trim().nullable().required('requiredField'),
  'passenger-count': string().trim().nullable().required('requiredField'),
  'departure-time': string().trim().nullable().required('requiredField'),

  'route-id': string().trim().nullable(),
  'trip-type':string().trim(),
  'return-time':string().trim()
});

export const searchFormSchema = object().shape({
  phone: string()
    .trim()
    .test('email', 'mobileNumberValidation', (value) => {
      if (!value) return false; // Required field
      const phoneRegex = /^(\+93|0)?([0-9]{12})$/; // Afghan phone format
      return phoneRegex.test(value);
    }),
  'identification-number': string().trim().nullable(),
  'tracking-code': string().trim().nullable(),
  'origin-city-id': string().trim().nullable(),
  'destination-city-id': string().trim().nullable(),
  'departure-time': string().trim().nullable(),
});

export const filterCitySchema = object().shape({
  filter_origin_cities: string().trim().nullable(),
  filter_destination_cities: string().trim().nullable(),
});

export const transactionFilterFormSchema = object().shape({
  'from-date': string().trim().nullable(),
  'to-date': string().trim().nullable(),
  search: string().trim().nullable(),
});

export const orderFilterFormSchema = transactionFilterFormSchema;

export const creditTransferFormSchema = object().shape({
  amount: string().trim().required('requiredField'),
  phone: string()
    .trim()
    .required('requiredField')
    .test('phone', 'mobileNumberValidation', (value) => {
      if (!value) return false; // Required field
      return phoneRegex.test(value);
    }),
  commission_method:string()
  .oneOf(['amount_with_commission', 'amount_without_commission'])
  .required('commissionMethodRequired'),
});

export const creditTransferListFilterFormSchema = object().shape({
  date: string().trim().nullable(),
  type: string().trim().nullable(),
  search: string().trim().nullable(),
});

export const faqFilterFormSchema = object().shape({
  category: string().trim().nullable(),
  search: string().trim().nullable(),
});


export const moneyTransferFormSchema = object().shape({
  amount: string().trim().required('requiredField'),
  mobile_or_email: string()
    .trim()
    .required('requiredField')
    .test('mobile_or_email', 'mobileNumberValidation', (value) => {
      if (!value) return false; // Required field
      return phoneRegex.test(value);
    }),
  commission_method:string()
  .oneOf(['amount_with_commission', 'amount_without_commission'])
  .required('commissionMethodRequired'),
});

export const moneyTransferListFilterFormSchema = object().shape({
  date: string().trim().nullable(),
  type: string().trim().nullable(),
  search: string().trim().nullable(),
});