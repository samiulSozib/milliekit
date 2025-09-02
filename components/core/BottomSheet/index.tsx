import { useRef, useEffect, useState, ReactNode, ComponentProps, MouseEventHandler } from 'react';
import { classnames } from '@/utils/classNames';
import { isEmpty } from '@/utils/helpers';
import Portal from '@/components/core/Portal';
import useScroll from '../hooks/useScroll';
import { Header } from './Header';
import { BottomSheetHeaderTitle } from './Header/BottomSheetHeaderTitle';
import { BottomSheetHeaderCloseButton } from './Header/BottomSheetHeaderCloseButton';
import { MODAL_ROOT_ID } from '@/constants/layoutConstants';
import styles from './bottom-sheet.module.scss';

interface Props {
  className?: string;
  children: ReactNode;
  isOpen: boolean;
  onClose?: (isNative: boolean) => void;
  headerTitle?: ComponentProps<typeof Header>['title'];
  headerDescription?: ComponentProps<typeof Header>['description'];
  headerTitleColor?: ComponentProps<typeof Header>['titleColor'];
  headerDescriptionColor?: ComponentProps<typeof Header>['descriptionColor'];
  customHeader?: ComponentProps<typeof Header>['customHeader'];
  isHeaderSticky?: boolean;
  hasHeaderBorder?: boolean;
  footer?: ReactNode;
  isFooterSticky?: boolean;
  isFullSize?: boolean;
  hideCloseIcon?: boolean;
  contentClassName?: string;
  zIndex?: `z-${number}`;
  umMountOnClose?: boolean;
  autoClose?: boolean;
  autoCloseTimeout?: number;
  modalId?: `#${string}`;
  customWidth?: string;
}

export function BottomSheet({
  className,
  children,
  isOpen,
  onClose,
  headerTitle,
  headerDescription,
  headerTitleColor,
  headerDescriptionColor,
  customHeader,
  isHeaderSticky,
  hasHeaderBorder = false,
  footer,
  isFooterSticky,
  isFullSize,
  hideCloseIcon,
  contentClassName,
  zIndex = 'z-4',
  umMountOnClose = false,
  autoClose = false,
  autoCloseTimeout = 3000,
  modalId,
  customWidth,
  ...props
}: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenWithDelay, setIsOpenWithDelay] = useState(false);
  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const componentClassName = classnames(
    'fixed top-0 left-0 flex items-center justify-center',
    {
      'flex w-full h-full': isOpenWithDelay,
      'overflow-hidden': !isOpenWithDelay,
    },
    zIndex,
    className,
    styles.BottomSheet
  );

  const fullContentClassName = classnames(
    'bg-white absolute w-full bottom-0 overflow-hidden flex flex-col',
    { 'h-[80vh]': isFullSize },
    customWidth ? customWidth : 'w-full',
    contentClassName,
    styles.BottomSheet__content,
    styles['BottomSheet__content--mobile']
  );

  const footerClassName = classnames('bg-white', {
    'sticky bottom-0 right-0 z-20': isFooterSticky,
  });

  const childrenClassName = 'h-full grow';
  const contentRef = useRef<HTMLDivElement>(null);
  const containerEl = useRef<HTMLDivElement>(null);
  const childrenEl = useRef<HTMLDivElement>(null);

  useScroll({
    shouldLockScroll: isOpen,
    contentRef,
    containerEl,
  });

  const handleAnimation = (open: boolean) => {
    const el = contentRef.current;
    if (!el) return;
    el.style.transform = open ? 'translateY(0)' : 'translateY(100%)';
  };

  useEffect(() => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }

    if (!umMountOnClose) {
      handleAnimation(isOpen);

      if (isOpen) {
        setIsOpenWithDelay(true);
      } else {
        // Add a delay for close animation
        timeOutRef.current = setTimeout(() => {
          setIsOpenWithDelay(false);
        }, 300);
      }
    } else {
      if (isOpen) {
        setIsMounted(true);
        timeOutRef.current = setTimeout(() => {
          handleAnimation(false);
        }, 0);

        timeOutRef.current = setTimeout(() => {
          setIsOpenWithDelay(true);
          handleAnimation(true);
        }, 100);
      } else {
        handleAnimation(false);

        timeOutRef.current = setTimeout(() => {
          setIsMounted(false);
          setIsOpenWithDelay(false);
        }, 300);
      }
    }

    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    };
  }, [isOpen, umMountOnClose]);

  useEffect(() => {
    if (!autoClose) return;

    if (isOpen) {
      const timer = setTimeout(() => {
        onClose?.(false);
      }, autoCloseTimeout);

      return () => clearTimeout(timer);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoClose, autoCloseTimeout, isOpen]);

  // const { openModal, closeModal } = useOnNativeBack({
  //   onClose: () => {
  //     onClose?.(true);
  //   },
  // });

  // const isMountedRef = useRef(false);
  // useEffect(() => {
  //   if (!isMountedRef.current) {
  //     isMountedRef.current = true;
  //     return;
  //   }
  //   if (!modalId) {
  //     return;
  //   }
  //   if (isOpen) {
  //     openModal(modalId);
  //   } else {
  //     closeModal(modalId);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isOpen, modalId]);

  const containerOnClick = () => {
    onClose?.(false);
  };

  const contentOnClick: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
  };

  const hasHeader = !isEmpty(headerTitle) || !!customHeader || !hideCloseIcon;

  const bottomSheetHeader = (
    <div
      className={classnames('h-16', {
        'flex justify-between items-center border-b border-borderPrimary': hasHeaderBorder,
      })}
    >
      {customHeader || (
        <BottomSheetHeaderTitle
          title={headerTitle}
          description={headerDescription}
          titleColor={headerTitleColor}
          descriptionColor={headerDescriptionColor}
        />
      )}
      {!hideCloseIcon && <BottomSheetHeaderCloseButton onClose={() => onClose?.(false)} />}
    </div>
  );

  return (
    <Portal position="left/bottom" rootId={MODAL_ROOT_ID}>
      {(isMounted || !umMountOnClose) && (
        <div {...props} className={componentClassName} onClick={containerOnClick} ref={containerEl}>
          <div ref={contentRef} className={fullContentClassName} onClick={contentOnClick}>
            {hasHeader && <Header isHeaderSticky={isHeaderSticky} customHeader={bottomSheetHeader} />}
            {!!children && (
              <div ref={childrenEl} className={childrenClassName}>
                {children}
              </div>
            )}
            {!!footer && <div className={footerClassName}>{footer}</div>}
          </div>
        </div>
      )}
    </Portal>
  );
}
