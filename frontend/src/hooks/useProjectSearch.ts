import { useCallback, useEffect, useRef, useState } from 'react';
import { projectsService } from '@/services/projectsService';
import { mapApiListToUiList } from '@/mappers/projectMapper';
import type { UiProject } from '@/types/project';

export function useProjectSearch(query: string) {
  const [results, setResults] = useState<UiProject[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const resp = await projectsService.listar({ q: q || undefined });
      setResults(mapApiListToUiList(resp.dados));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  return { results, loading };
}
