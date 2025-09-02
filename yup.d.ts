import * as Yup from 'yup';

declare module 'yup' {
  interface StringSchema {
    afghanPhone(message?: string): this;
  }
}
