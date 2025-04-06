import { useEffect, useRef, useCallback } from "react";

type ClickOutsideHandler = (event: MouseEvent) => void;

function useClickOutside<T extends HTMLElement = HTMLElement>() {
  const containerRef = useRef<T | null>(null);
  const handlerRef = useRef<ClickOutsideHandler | null>(null);

  const setHandler = useCallback((handler: ClickOutsideHandler | null) => {
    handlerRef.current = handler;
  }, []);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const el = containerRef.current;
      const handler = handlerRef.current;

      if (!el || el.contains(event.target as Node)) return;
      if (handler) handler(event);
    };

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, []);

  return { containerRef, setHandler };
}

export default useClickOutside;
