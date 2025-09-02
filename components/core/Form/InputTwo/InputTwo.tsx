import { FieldValues, RegisterOptions } from 'react-hook-form';

import { classnames } from '@/utils';

import formStyles from '../Form.module.scss';
import styles from './InputTwo.module.scss';

import type { ReactElement } from 'react';

interface InputProps {
  name: string;
  id: string;
  type: 'text' | 'tel' | 'number' | 'password' | 'textarea';
  label?: string;
  placeholder?: string;
  validation?: RegisterOptions<FieldValues, string> | undefined;
  className?: string;
  value?: string | number | null;
  ltr?: boolean;
  autoFocus?: boolean;
  prefixIcon?: ReactElement;
  suffixIcon?: ReactElement;
  hasError?: boolean;
  errorMessage?: string;
  onClick?(): void;
}

export const InputTwo = ({
  name,
  label,
  type,
  id,
  placeholder,
  validation,
  className,
  value,
  ltr,
  prefixIcon,
  suffixIcon,
  hasError,
  errorMessage,
  onClick,
  ...otherProps
}: InputProps) => {

  return (
    <div className="flex flex-col gap-y-2">
      <div
        className={classnames(
          formStyles.FormControl,
          styles.FormControl,
          'form-control flex flex-col w-full gap-y-2',
          { [styles.isInvalid]: hasError },
          className
        )}
      >
        {label && (
          <label
            className={classnames(formStyles.FormControl__label, styles.Label, 'form-control__label')}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <div className={classnames(formStyles.FormControl__field, 'form-control__field')}>
          {prefixIcon && (
            <label htmlFor={id}>
              <i className={styles.PrefixIcon}>{prefixIcon}</i>
            </label>
          )}
          {type === 'textarea' ? (
            <textarea
              id={id}
              placeholder={placeholder}
              className={classnames(styles.Textarea, { [styles.isInvalid]: hasError }, { 'direction-ltr': ltr })}
              {...otherProps}
              value={value ?? ''}
            />
          ) : (
            <input
              id={id}
              type={type}
              className={classnames(styles.Input, { [styles.isInvalid]: hasError }, { 'direction-ltr': ltr })}
              placeholder={placeholder}
              onClick={onClick}
              {...otherProps}
              value={value ?? ''}
              autoComplete="off"
              readOnly={true}
            />
          )}
          {suffixIcon && (
            <label htmlFor={id}>
              <i className={styles.SuffixIcon}>{suffixIcon}</i>
            </label>
          )}
        </div>
      </div>
      {hasError && (
        <InputError
          message={errorMessage || ''}
          key={errorMessage}
        />
      )}
    </div>
  );
};

const InputError = ({ message }: { message: string }) => {
  return <div className="font-semibold text-red-500 text-xxs">{message}</div>;
};
