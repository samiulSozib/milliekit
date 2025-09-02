import { classnames } from '@/utils';
import styles from './Backdrop.module.scss';

interface IBackdrop {
  zIndex?: string;
  onClick?: () => void;
}

export default function Backdrop({ zIndex = 'z-40', onClick }: IBackdrop) {
  return <div onClick={onClick} className={classnames(styles.Backdrop, zIndex)} />;
}
