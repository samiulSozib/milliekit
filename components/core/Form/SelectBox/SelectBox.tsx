import { classnames } from '@/utils';
import formStyles from '../Form.module.scss';
import styles from './SelectBox.module.scss';
import Select from 'react-select';

export interface ISelectBoxOption {
  label: string;
  value: string | number;
}

interface SelectBoxProps {
  name: string;
  id: string;
  label?: string;
  placeholder?: string;
  className?: string;
  value: ISelectBoxOption | null;
  options: ISelectBoxOption[];
  isLoading?: boolean;
  onChange?: (selected: ISelectBoxOption | null) => void;
}

export const SelectBox = ({
  name,
  label,
  id,
  placeholder,
  className,
  value,
  options,
  isLoading,
  onChange,
  ...props
}: SelectBoxProps) => {
  return (
    <div className={classnames(formStyles.FormControl, 'form-control flex flex-col w-full gap-y-2', className)}>
      {label && (
        <label className={classnames(formStyles.FormControl__label, 'form-control__label')} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={classnames(formStyles.FormControl__field, 'form-control__field')}>
        <Select
          className={classnames(styles.Select)}
          classNamePrefix="select"
          isLoading={isLoading}
          isRtl={true}
          isSearchable={true}
          name="province"
          options={options}
          onChange={onChange}
          value={value}
          noOptionsMessage={() => {
            return 'یافت نشد';
          }}
          placeholder={placeholder}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: 'var(--bg-color-primary)',
              primary: 'black',
            },
          })}
          {...props}
        />
      </div>
    </div>
  );
};

const InputError = ({ message }: { message: string }) => {
  return <div className="font-semibold text-red-500 text-xs">{message}</div>;
};
