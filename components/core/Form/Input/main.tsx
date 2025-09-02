import { ReactElement, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

import { classnames } from '@/utils';

import formStyles from '../Form.module.scss';
import styles from './Input.module.scss';

type CommonProps = {
  name: string;
  id: string;
  type: 'text' | 'tel' | 'number' | 'password' | 'textarea';
  label?: string;
  placeholder?: string;
  className?: string;
  value?: string | number;
  ltr?: boolean;
  autoFocus?: boolean;
  prefixIcon?: ReactElement;
  suffixIcon?: ReactElement;
  hasError?: boolean;
  errorMessage?: string;
};

type InputProps = CommonProps &
  (
    | ({
        type: 'textarea';
      } & TextareaHTMLAttributes<HTMLTextAreaElement>)
    | ({
        type: 'text' | 'tel' | 'number' | 'password';
      } & InputHTMLAttributes<HTMLInputElement>)
  );

export const Input = (props: InputProps) => {
  const {
    name,
    label,
    type,
    id,
    className,
    ltr,
    prefixIcon,
    suffixIcon,
    hasError,
    errorMessage,
    autoFocus,
    placeholder,
    ...otherProps
  } = props;

  return (
    <div className={classnames(formStyles.FormControl, 'form-control flex flex-col w-full gap-y-2', className)}>
      {label && (
        <label className={classnames(formStyles.FormControl__label, 'form-control__label')} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={classnames(formStyles.FormControl__field, 'form-control__field relative')}>
        {prefixIcon && (
          <label htmlFor={id}>
            <i className={styles.PrefixIcon}>{prefixIcon}</i>
          </label>
        )}
        {type === 'textarea' ? (
          <textarea
            id={id}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={classnames(
              styles.Textarea,
              { [styles.isInvalid]: hasError },
              { 'direction-ltr': ltr },
              { [styles.isInvalid]: hasError }
            )}
            {...(otherProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={classnames(
              styles.Input,
              { 'direction-ltr': ltr },
              { [styles.withPrefix]: !!prefixIcon },
              { [styles.withSuffix]: !!suffixIcon },
              { [styles.isInvalid]: hasError }
            )}
            {...(otherProps as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {suffixIcon && (
          <label htmlFor={id}>
            <i className={styles.SuffixIcon}>{suffixIcon}</i>
          </label>
        )}
      </div>

      {hasError && <InputError message={errorMessage || ''} key={name} />}
    </div>
  );
};

const InputError = ({ message }: { message: string }) => {
  return <div className="font-semibold text-red-500 text-xxs">{message}</div>;
};
