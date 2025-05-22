import { useState, useEffect } from 'react';

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false); // Initial default, will be updated by effect

  useEffect(() => {
    // Ensure window is available (for SSR or testing environments)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    
    // Handler for when the media query status changes
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setMatches(event.matches);
    };

    // Set the initial state based on the current media query status
    handleChange(mediaQueryList);

    // Add the event listener for changes
    // Note: Safari < 14 requires the older addListener/removeListener syntax
    // However, modern bundlers and TypeScript might prefer addEventListener
    // For broader compatibility if issues arise, one might use:
    // if (mediaQueryList.addEventListener) { mediaQueryList.addEventListener('change', handleChange); } 
    // else { mediaQueryList.addListener(handleChange); }
    mediaQueryList.addEventListener('change', handleChange);

    // Cleanup function to remove the listener when the component unmounts or the query changes
    return () => {
      // if (mediaQueryList.removeEventListener) { mediaQueryList.removeEventListener('change', handleChange); }
      // else { mediaQueryList.removeListener(handleChange); }
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]); // Only re-run the effect if the query string changes

  return matches;
};

export default useMediaQuery;
