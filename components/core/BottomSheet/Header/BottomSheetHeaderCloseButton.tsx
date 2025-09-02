import Icon from '@/components/core/Icon';

interface Props {
  onClose?: () => void;
}

export function BottomSheetHeaderCloseButton({ onClose }: Props) {
  return (
    <div
      onClick={onClose}
      className="bg-gray-100 text-gray-700 w-10 h-10 flex items-center justify-center rounded-full p-1 cursor-pointer mr-3"
    >
      <Icon name="close" />
    </div>
  );
}
