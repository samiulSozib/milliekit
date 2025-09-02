import { useCallback, useState } from 'react';
import { Checkbox } from 'antd';
import Icon from '@/components/core/Icon';

export type FilterOption = {
  label: string;
  value: string;
};

type FilterGroupPropsType = {
  type: 'checkbox' | 'radio';
  title: string;
  options: FilterOption[];
  selectedOptions?: FilterOption[];

  onOptionSelect?(option: FilterOption, selected: boolean): void;
};

export function FilterGroup({ title, options, type, selectedOptions, onOptionSelect }: FilterGroupPropsType) {
  const [isOpen, setIsOpen] = useState(true);

  const onToggleGroup = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const _onOptionSelect = useCallback(
    (option: FilterOption, selected: boolean) => {
      onOptionSelect?.(option, selected);
    },
    [onOptionSelect]
  );

  return (
    <div className="filter-panel-group">
      <div className="flex justify-between">
        <div className="flex items-center gap-x-2">
          <i className="heading-symbol" />
          <div className="font-semibold text-md">
            <h3>{title}</h3>
          </div>
        </div>
        <button
          onClick={onToggleGroup}
          className="text-gray-800 border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center select-none"
        >
          <Icon name="arrow-bottom" size={17} className={isOpen ? 'rotate-180' : ''} />
        </button>
      </div>
      <div className={`filter-panel-group-content ${isOpen ? 'block' : 'hidden'}`}>
        {type === 'checkbox' && (
          <div className="mt-6 flex flex-col gap-y-5">
            {options.map((option) => (
              <Checkbox
                key={option.value}
                onChange={(event) => _onOptionSelect(option, event.target.checked)}
                defaultChecked={(selectedOptions ?? []).findIndex((item) => item.value === option.value) > -1}
                className="select-none text-xmd text-gray-700 font-normal"
              >
                {option.label}
              </Checkbox>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
