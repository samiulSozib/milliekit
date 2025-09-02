
import { classnames } from '@/utils';
import BusAltIcon from '@/components/core/Icon/BusAltIcon';

import styles from './LocationInput.module.scss';

interface ILocationInputProps {
  name: string;
  id: string;
  title: string;
  label: string;
  placeholder: string;
  value?: string;
  hasError?: boolean;
  errorMessage?: string;
  onClick?(): void;
}

export const LocationInput = ({
  id,
  title,
  label,
  placeholder,
  name,
  value,
  hasError,
  errorMessage,
  onClick,
}: ILocationInputProps) => {

  return (
    <div className={classnames(styles.LocationInput, { '!border-error': hasError })}>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 min-w-[70px] ltr:min-w-[110px]" htmlFor={id}>
          <div className="text-primary">
            <BusAltIcon width="26" />
          </div>
          <span className="font-semibold text-md">{title}</span>
        </label>
        <div className="h-6 w-px bg-[var(--color-gray-300)]"></div>
        <div className="flex flex-col flex-1">
          <div className="w-full">
            <label className="text-xxs text-[var(--color-gray-500)] block py-0.5" htmlFor={id}>
              {label}
            </label>
          </div>
          <div className={styles.LocationInput__inputWrapper}>
            <input
              type="text"
              id={id}
              name={name}
              placeholder={placeholder}
              value={value ?? ''}
              onClick={onClick}
              autoComplete="off"
              readOnly={true}
            />
          </div>
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
  return (
    <div className="font-semibold text-red-500 text-xxs absolute left-2 top-1/2 -translate-y-1/2 hidden sm:block">
      {message}
    </div>
  );
};
