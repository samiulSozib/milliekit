import { ReactNode } from 'react';
import { BottomSheetHeaderTitle } from './BottomSheetHeaderTitle';
import { classnames } from '@/utils';

interface Props {
  title?: string;
  description?: string;
  titleColor?: string;
  descriptionColor?: string;
  customHeader?: ReactNode;
  isHeaderSticky?: boolean;
}

export function Header({ title, description, customHeader = null, isHeaderSticky }: Props) {
  const headerFullClassName = classnames('px-5 w-full shrink-0 bg-white z-10', {
    'sticky top-0 left-0': isHeaderSticky,
  });
  return (
    <div className={classnames(headerFullClassName)}>
      {customHeader || <BottomSheetHeaderTitle title={title} description={description} />}
    </div>
  );
}
