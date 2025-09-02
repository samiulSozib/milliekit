import { useState, useEffect } from 'react';
import { appDesktopScreenSize, appSmallScreenSize } from '@/config';

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return { width: 0, height: 0 };
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initial size
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    width: screenSize.width,
    height: screenSize.height,
    isDesktop: screenSize.width > appDesktopScreenSize,
    isSmallScreen: screenSize.width <= appSmallScreenSize,
  };
};

export default useScreenSize;
