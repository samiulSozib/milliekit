import { ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './Portal.module.scss';
import { isServerSide } from '@/utils';

interface Props {
  position: string;
  id?: string;
  rootId: string;
  children: ReactNode;
  disableDefaultClasses?: boolean;
  delayOnLoad?: boolean;
}

const ChildrenWrapper = ({ children, delayOnLoad }: { children: ReactNode; delayOnLoad?: boolean }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  if (!show && delayOnLoad) return null;
  return <>{children}</>;
};

function Portal({ position, rootId, children, disableDefaultClasses, delayOnLoad }: Props) {
  if (isServerSide) return null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [element] = useState(document.createElement('div'));
  const [horizontal, vertical] = position.split('/');
  const classesArray = ['absolute', [styles[`Portal--${horizontal}`]], [styles[`Portal--${vertical}`]]];

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const rootElement = document.getElementById(rootId);
    if (!rootElement || !element) return undefined;
    rootElement?.appendChild?.(element);

    if (!disableDefaultClasses) {
      for (const classItem of classesArray) {
        element?.classList?.add?.(classItem as string);
      }
    }

    return () => {
      rootElement?.removeChild?.(element);
    };
  }, [rootId, element]);
  return ReactDOM.createPortal(<ChildrenWrapper delayOnLoad={delayOnLoad}>{children}</ChildrenWrapper>, element);
}

export default Portal;
