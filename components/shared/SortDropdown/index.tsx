import { Button } from '@/components/core/Button';
import Icon from '@/components/core/Icon';
import styles from './SortDropdown.module.scss';
import { classnames } from '@/utils';
import { useState } from 'react';

type SortDropdownPropsType = {
  buttonTitle: string;
  options: {
    label: string;
    value: string;
  }[];
  onSelect?(value: string): void;
};

export function SortDropdown({ buttonTitle, options, onSelect }: SortDropdownPropsType) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelect = (value: string) => {
    if (!onSelect) return;

    setIsDropdownOpen(false);

    onSelect(value);
  };

  return (
    <div className={classnames(styles.sortDropdown, { [styles['--is-open']]: isDropdownOpen })}>
      <Button
        color="white"
        size="xs"
        className={classnames(styles.sortDropdown__button, 'border border-primary hover:bg-slate-100')}
        onClick={handleToggleDropdown}
      >
        <div className="flex items-center gap-2 text-primary">
          <Icon name="switch" size={16} />
          <span>{buttonTitle}</span>
          <Icon
            name="arrow-bottom"
            size={18}
            className={classnames(styles.sortDropdown__button__arrow, '-ml-[2px] -mr-[2px] transition-all')}
          />
        </div>
      </Button>

      {options?.length && (
        <div
          className={classnames(
            styles.sortDropdown__list,
            'border border-primary border-t-0 rounded-b-lg flex flex-col'
          )}
        >
          {options.map((option) => {
            return (
              <button
                key={option.value}
                className="text-gray-700 text-xs hover:bg-primary-lighter hover:text-white p-3 text-left rtl:text-right"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
