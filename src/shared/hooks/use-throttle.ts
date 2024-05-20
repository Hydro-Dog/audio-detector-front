import { useState, useEffect, useCallback, useRef } from 'react';

function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
  deps: any[] = [],
): T {
  const [lastCallTime, setLastCallTime] = useState(0);
  const savedCallback = useRef(callback);

  // Save the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallTime >= delay) {
        setLastCallTime(now);
        savedCallback.current(...args);
      }
    },
    [delay, lastCallTime, ...deps],
  ) as T;
}

export default useThrottle;
