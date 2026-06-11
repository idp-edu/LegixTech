import { useCallback, useEffect, useRef, useState } from 'react';
import { projectsService } from '@/services/projectsService';
import { mapApiListToUiList } from '@/mappers/projectMapper';
import type { UiProject } from '@/types/project';

export function useProjectSearch(query: string, odsFilter?: number) {
  const [results, setResults] = useState<UiProject[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string, ods?: number) => {
    setLoading(true);
    try {
      const params: Parameters<typeof projectsService.listar>[0] = {
        por_pagina: 20,
        ...(q.trim() ? { q: q.trim() } : {}),
        ...(ods ? { ods } : {}),
      };
      const resp = await projectsService.listar(params);
      setResults(mapApiListToUiList(resp.dados));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query, odsFilter), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, odsFilter, search]);

  return { results, loading };
}