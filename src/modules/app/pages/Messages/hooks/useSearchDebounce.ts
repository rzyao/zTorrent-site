import { useEffect, useState } from 'react';

export function useSearchDebounce(delay = 300) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), delay);
    return () => clearTimeout(timer);
  }, [searchQuery, delay]);

  return { searchQuery, setSearchQuery, debouncedQuery } as const;
}

