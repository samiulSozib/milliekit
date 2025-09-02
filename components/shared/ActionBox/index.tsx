import { ReactElement } from 'react';
import styles from './ActionBox.module.scss';
import { classnames } from '@/utils';

interface IActionBoxProps {
  children: ReactElement;
  marginTop?: string;
}

export default function ActionBox({ children, marginTop = '-mt-[7.3rem]' }: IActionBoxProps) {
  return (
    <div className={classnames(styles.ActionBox, marginTop)}>
      <div className="container-fluid">
        <div className={classnames(styles.ActionBox__inner, 'bg-white rounded-2xl w-full p-5')}>{children}</div>
      </div>
    </div>
  );
}
