import { classnames } from '@/utils';
import styles from './Spinner.module.scss';

interface SpinnerProps {
  className?: string;
  center?: boolean;
  turbo?: boolean;
}

export const Spinner = ({ className, center, turbo }: SpinnerProps) => {
  return (
    <div
      className={classnames('inline-block leading-[0]', className, {
        'absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2': center,
      })}
    >
      <span
        role="img"
        aria-label="loading"
        className={classnames(styles.spinner, { [styles['spinner--turbo']]: turbo })}
      >
        <svg
          viewBox="0 0 1024 1024"
          focusable="false"
          data-icon="loading"
          width="1.4em"
          height="1.4em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            stroke="13"
            d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"
          ></path>
        </svg>
      </span>
    </div>
  );
};
