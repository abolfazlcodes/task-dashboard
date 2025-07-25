'use client';

import { useEffect, useRef } from 'react';

export type UseClickOutsideOptions = {
  onOutsideClick?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
  touchThreshold?: number;
};

const useClickOutside = (
  ref: React.RefObject<HTMLElement | null>,
  { onOutsideClick, onEscape, enabled = true, touchThreshold = 10 }: UseClickOutsideOptions
) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick?.();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        touchStartRef.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStartRef.current && event.changedTouches.length === 1) {
        const touchEnd = event.changedTouches[0];
        const deltaX = touchEnd.clientX - touchStartRef.current.x!;
        const deltaY = touchEnd.clientY - touchStartRef.current.y!;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < touchThreshold) {
          handleClickOutside(event);
        }
      }
      touchStartRef.current = null;
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [ref, onOutsideClick, onEscape, enabled, touchThreshold]);
};

export default useClickOutside;
