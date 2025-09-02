import { useEffect, RefObject } from 'react';

interface Props {
  shouldLockScroll?: boolean;
  contentRef?: RefObject<HTMLElement | null>;
  containerEl?: RefObject<HTMLElement | null>;
}

function useScroll({ shouldLockScroll, contentRef, containerEl }: Props) {
  const addOverflowClass = () => document.body?.classList.add?.('overflow-hidden');

  const removeOverflowClass = () => document.body?.classList.remove?.('overflow-hidden');

  useEffect(() => {
    if (shouldLockScroll) addOverflowClass();
    else removeOverflowClass();
  }, [shouldLockScroll]);
  useEffect(() => {
    return () => removeOverflowClass();
  }, []);
  useEffect(() => {
    const handleContentTouchMove = (e: TouchEvent) => {
      if (!!contentRef?.current && contentRef?.current?.scrollHeight <= contentRef?.current?.clientHeight) return;
      e.stopPropagation();
    };

    const handleContainerTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    contentRef?.current?.addEventListener?.('touchmove', handleContentTouchMove, {
      passive: true,
    });
    containerEl?.current?.addEventListener?.('touchmove', handleContainerTouchMove);

    return () => {
      contentRef?.current?.removeEventListener('touchmove', handleContentTouchMove);
      containerEl?.current?.removeEventListener('touchmove', handleContainerTouchMove);
    };
  }, []);
}

export default useScroll;
