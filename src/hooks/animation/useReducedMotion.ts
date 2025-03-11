import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Default to false during SSR
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', onChange);
      return () => {
        mediaQuery.removeEventListener('change', onChange);
      };
    } 
    // Legacy API (Safari < 14)
    else {
      // @ts-ignore - older implementation
      mediaQuery.addListener(onChange);
      return () => {
        // @ts-ignore - older implementation
        mediaQuery.removeListener(onChange);
      };
    }
  }, []);

  return prefersReducedMotion;
} 