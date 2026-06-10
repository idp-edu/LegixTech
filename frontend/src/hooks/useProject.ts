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
      const temQuery = q.trim().length > 0;

      const resp = await projectsService.listar(
        temQuery
          ? { q: q.trim(), por_pagina: 20 }   // busca específica: 20 resultados
          : { por_pagina: 100 }                 // lista geral: até 100
      );

      setResults(mapApiListToUiList(resp.dados));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Sem query: carrega imediatamente (sem debounce)
    // Com query: aguarda 400ms para não disparar a cada letra
    const delay = query.trim().length > 0 ? 400 : 0;

    debounceRef.current = setTimeout(() => search(query), delay);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  return { results, loading };
}