import { ReactElement, ComponentProps, useEffect } from 'react';
import { classnames } from '@/utils';
import ModalBase from 'react-modal';
import { MODAL_ROOT_ID } from '@/constants/layoutConstants';
import styles from './Modal.module.scss';

interface ModalProps extends ComponentProps<typeof ModalBase> {
  zIndex?: `z-${number}`;
  header?: ReactElement;
  footer?: ReactElement;
  modalId?: `#${string}`;
  onClose?: (isNative: boolean) => void;
  autoClose?: boolean;
  autoCloseTimeout?: number;
  width?: string;
}

const parentSelector = () => document.getElementById(MODAL_ROOT_ID) as HTMLElement;

export const Modal = ({
  className,
  zIndex = 'z-50',
  header,
  footer,
  children,
  modalId,
  onClose,
  autoClose = false,
  autoCloseTimeout = 3000,
  width,
  ...modalBaseProps
}: ModalProps): ReactElement => {
  useEffect(() => {
    if (!autoClose) return;

    if (modalBaseProps.isOpen) {
      const timer = setTimeout(() => {
        onClose?.(false);
      }, autoCloseTimeout);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTimeout, modalBaseProps.isOpen]);

  return (
    <ModalBase
      parentSelector={parentSelector}
      className={classnames('bg-white absolute overflow-y-hidden rounded-2xl', styles.Modal__content, className)}
      overlayClassName={classnames(styles.Modal__overlay, zIndex)}
      onRequestClose={() => onClose?.(false)}
      ariaHideApp={false}
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
        content: {
          width: width ? width : '460px',
        },
      }}
      closeTimeoutMS={500}
      {...modalBaseProps}
    >
      <div className="flex flex-col h-full overflow-y-hidden">
        {header}
        <div className="overflow-y-auto">
          {children}
          {footer}
        </div>
      </div>
    </ModalBase>
  );
};
