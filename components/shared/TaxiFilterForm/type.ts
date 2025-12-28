import type { InferType } from 'yup';
import type { filterFormSchema, searchFormSchema } from '@/validation';
import { TaxiTicketRegistrationDataType } from '@/types/taxi-ticket';

export type FilterFormPropsType = {
  onSubmit(data: InferType<typeof filterFormSchema>): void;
};

export type SearchFormPropsType = {
  onSubmit(data: InferType<typeof searchFormSchema>): void;
  recentBooks: TaxiTicketRegistrationDataType[];
};
