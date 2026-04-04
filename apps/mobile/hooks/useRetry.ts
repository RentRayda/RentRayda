import { useState, useCallback } from 'react';

interface UseRetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
}

export function useRetry<T>(
  fn: () => Promise<T>,
  options: UseRetryOptions = {},
) {
  const { maxAttempts = 3, baseDelay = 1000 } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await fn();
        setData(result);
        setLoading(false);
        return result;
      } catch (err) {
        if (attempt === maxAttempts - 1) {
          const message = err instanceof Error ? err.message : 'Something went wrong. Try again.';
          setError(message);
          setLoading(false);
          return null;
        }
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
      }
    }
    setLoading(false);
    return null;
  }, [fn, maxAttempts, baseDelay]);

  return { execute, loading, error, data };
}
