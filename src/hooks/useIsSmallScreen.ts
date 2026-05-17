import { useEffect, useState } from 'react';

const useIsSmallScreen = (width = 1023) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsSmallScreen(window.matchMedia(`(max-width: ${width}px)`).matches);
    };

    checkIsMobile(); // Initial check

    const mediaQuery = window.matchMedia(`(max-width: ${width}px)`);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsSmallScreen(event.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Clean up the event listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [width]);

  return isSmallScreen;
};

export default useIsSmallScreen;
