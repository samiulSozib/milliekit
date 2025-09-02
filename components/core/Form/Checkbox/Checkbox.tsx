import { classnames } from '@/utils';
import { useState } from 'react';

type CheckboxPropsType = {
  name?: string;
  value?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  labelClassName?: string;
  inputClassName?: string;
  onChange?: (checked: boolean) => void;
};

export const Checkbox = (props: CheckboxPropsType) => {
  const {
    name = '',
    value = '',
    className = '',
    label = '',
    disabled = false,
    required = false,
    color = 'green',
    size = 'medium',
    labelClassName = '',
    inputClassName = '',
    onChange,
  } = props;

  const [isChecked, setIsChecked] = useState(false);

  const handleChange = () => {
    if (disabled) return;

    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  return (
    <label htmlFor={name} className={classnames('flex items-center select-none', className)}>
      <div className="flex items-center justify-center">
        <input
          id={name}
          name={name}
          type="checkbox"
          className={classnames(
            'peer relative shrink-0 appearance-none w-4 h-4 border-2 border-gray-700 rounded bg-white focus:outline-none focus:ring-0 checked:border-blue-800 checked:bg-blue-800 checked:border-0 disabled:border-steel-400 disabled:bg-steel-400',
            inputClassName,
            {
              'cursor-pointer': !disabled,
              'cursor-not-allowed opacity-50': disabled,
              'w-3 h-3': size === 'small',
              'w-4 h-4': size === 'medium',
              'w-5 h-5': size === 'large',
              'checked:border-green-600 checked:bg-green-600': color === 'green',
            }
          )}
          onChange={handleChange}
          checked={isChecked}
        />
        <svg
          className="absolute w-3 h-3 pointer-events-none hidden peer-checked:block stroke-white mt-1 outline-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      {label && (
        <div className={classnames('ms-2 text-sm text-gray-700', labelClassName)}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </div>
      )}
    </label>
  );
};
