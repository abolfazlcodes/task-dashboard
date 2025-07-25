import { useEffect, useRef, useState, RefObject } from 'react';

/**
 * useInView - React hook for lazy loading components using the Intersection Observer API.
 * Returns a ref and a boolean indicating if the element is in the viewport (or has been).
 *
 * Usage:
 *   const [ref, isInView] = useInView();
 *   <div ref={ref}>{isInView ? <ExpensiveComponent /> : null}</div>
 */
export function useInView(
  options?: IntersectionObserverInit
): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      options || { rootMargin: '200px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView];
}
