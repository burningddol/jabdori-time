import { useState, useEffect, useCallback } from 'react';

export function useModal<T = number>() {
  const [selected, setSelected] = useState<T | null>(null);
  const isOpen = selected !== null;

  const open = useCallback((value: T) => setSelected(value), []);
  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  return { selected, isOpen, open, close };
}
