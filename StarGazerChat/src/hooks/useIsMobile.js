/*
Custom hook to detect if the user is on a mobile device based on screen width.
Uses window.matchMedia for better performance.
*/


import { useState, useEffect } from 'react';


export default function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches : false
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Create a media query object for the specified breakpoint
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
        
        // Handle screen size changes
        function handleResize(e) {
            setIsMobile(e.matches);
        }
        
        // Modern browsers check for screen changes
        mediaQuery.addEventListener('change', handleResize);
        
        // Initial check just in case the window size changed before mounting
        setIsMobile(mediaQuery.matches);

        // Cleanup listener when the component using this hook is removed
        return () => {
            mediaQuery.removeEventListener('change', handleResize);
        };
    }, [breakpoint]);

    return isMobile;
}
