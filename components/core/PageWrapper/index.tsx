import { classnames } from '@/utils';
import styles from './PageWrapper.module.scss';

interface PageWrapperProps {
  name: string;
  className?: string;
  children: React.ReactNode;
  isContainer?: boolean;
  customBottomSpacing?: `${number}rem`;
  customBottomSpacingMobile?: `${number}rem`;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  name,
  className,
  children,
  isContainer = false,
  customBottomSpacing,
  customBottomSpacingMobile,
}) => {
  return (
    <div
      className={classnames(
        styles.AppPageWrapper,
        `${name}-page`,
        'pb-[var(--bottom-spacing-mobile)] md:pb-[var(--bottom-spacing)]',
        className
      )}
      style={{
        ['--bottom-spacing' as string]: customBottomSpacing || 'var(--wrapper-bottom-spacing-default)',
        ['--bottom-spacing-mobile' as string]: customBottomSpacingMobile || 'var(--wrapper-bottom-spacing-default)',
      }}
    >
      {isContainer ? <div className="container-fluid">{children}</div> : children}
    </div>
  );
};

export default PageWrapper;
