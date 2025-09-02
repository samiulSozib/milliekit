// components/core/Form/RadioGroup.tsx
import { classnames } from '@/utils';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
}

export const RadioGroup = ({
  options,
  value,
  onChange,
  hasError = false,
  errorMessage,
  className = '',
}: RadioGroupProps) => {
  return (
    <div className={className}>
      <div className="flex gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer">
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="mx-2 text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {hasError && errorMessage && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};