import Icon from '@/components/core/Icon';

type ControlItemPropsType = {
  name: string | number;
  value: string | number;
  isCurrency?: boolean;
};

export const ControlItem: React.FC<ControlItemPropsType> = (props) => {
  const { name, value, isCurrency } = props;

  return (
    <div className="flex justify-between items-center bg-gray-200 text-gray-500 rounded p-4 text-xs">
      <div className="select-none">{name}:</div>
      <div className="text-gray-700 font-semibold flex items-center">
        {value} {isCurrency && <Icon className="mr-1.5" name="afghan-currency" size={16} />}
      </div>
    </div>
  );
};
