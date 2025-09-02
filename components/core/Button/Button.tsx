import { classnames } from '@/utils';
import styles from './Button.module.scss';
import Link from 'next/link';
import { Spinner } from '@/components/core/Spinner';

import type {  MouseEvent } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  className?: string;
  href?: string;
  color?: 'primary' | 'secondary' | 'white' | 'success' | 'danger';
  variant?: 'contained' | 'outlined';
  size?: 'large' | 'medium' | 'small' | 'xs';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
}

export const Button = ({
  children,
  type = 'button',
  className,
  href,
  color = 'primary',
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
}: ButtonProps) => {
  const commonClasses = classnames(
    'inline-flex items-center justify-center rounded-lg text-[.91rem] font-semibold text-center select-none transition-all',
    {
      'shadow-button-primary bg-primary text-white border border-transparent hover:bg-primary-darker shadow-md shadow-[#17428929]':
        variant === 'contained' && color === 'primary',
    },
    {
      'border border-primary text-primary hover:border-primary-darker hover:text-primary-darker':
        variant === 'outlined' && color === 'primary',
    },
    { 'bg-secondary text-white hover:bg-secondary-darker': variant === 'contained' && color === 'secondary' },
    { 'shadow-button-success bg-success text-white hover:shadow-lg': variant === 'contained' && color === 'success' },
    { 'border !border-error text-error bg-white hover:shadow-lg': variant === 'outlined' && color === 'danger' },
    { 'bg-error text-white hover:shadow-lg': variant === 'contained' && color === 'danger' },
    { 'bg-white text-global': variant === 'contained' && color === 'white' },
    { 'min-h-[3.4rem] px-10 text-md': size === 'large' },
    { 'min-h-[3rem] px-8 text-xsm': size === 'medium' },
    { 'min-h-[2.8rem] px-6 text-xs': size === 'small' },
    { 'min-h-[2.5rem] px-4 text-xs font-semibold [&__.button-text]:mt-[1px]': size === 'xs' },
    { 'w-full': fullWidth },
    { 'bg-opacity-80 pointer-events-none': loading },
    { 'pointer-events-none !bg-[var(--color-gray-400)] !shadow-none !border-transparent !text-white': disabled },
    className
  );

  if (href) {
    return (
      <Link href={href} className={commonClasses}>
        <span className="button-text inline-block mt-[2px]">{children}</span>
      </Link>
    );
  }

  return (
    <button type={type} className={classnames(commonClasses, styles.Button)} onClick={onClick} disabled={disabled}>
      {loading ? <Spinner /> : <div className="button-text inline-block mt-[2px]">{children}</div>}
    </button>
  );
};
