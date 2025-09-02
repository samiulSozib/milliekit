import { classnames } from '@/utils';

interface Props {
  title?: string;
  description?: string;
  titleColor?: string;
  descriptionColor?: string;
}

export function BottomSheetHeaderTitle({ title, description, titleColor = '', descriptionColor = '' }: Props) {
  return (
    <div className="shrink-0 select-none">
      {title && <div className={classnames('font-semibold text-xmd', titleColor)}>{title}</div>}
      {description && <div className={classnames('mt-1', descriptionColor)}>{description}</div>}
    </div>
  );
}
