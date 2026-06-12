import { useCallback, useEffect, useRef, useState } from 'react';
import { projectsService } from '@/services/projectsService';
import { mapApiListToUiList } from '@/mappers/projectMapper';
import type { UiProject } from '@/types/project';

export function useProjectSearch(query: string, odsFilter?: number) {
  const [results, setResults]     = useState<UiProject[]>([]);
  const [loading, setLoading]     = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(true);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // guarda a busca "atual" para evitar race conditions
  const searchKeyRef = useRef('');

  // ── busca primeira página (reset) ────────────────────────────────────
  const search = useCallback(async (q: string, ods?: number) => {
    const key = `${q}|${ods}`;
    searchKeyRef.current = key;

    setLoading(true);
    setPage(1);
    setHasMore(true);
    try {
      const resp = await projectsService.listar({
        por_pagina: 50,
        pagina: 1,
        ...(q.trim() ? { q: q.trim() } : {}),
        ...(ods       ? { ods }         : {}),
      });
      if (searchKeyRef.current !== key) return; // resultado obsoleto
      const mapped = mapApiListToUiList(resp.dados);
      setResults(mapped);
      setHasMore(mapped.length >= 50);
    } catch {
      if (searchKeyRef.current !== key) return;
      setResults([]);
      setHasMore(false);
    } finally {
      if (searchKeyRef.current === key) setLoading(false);
    }
  }, []);

  // ── busca próxima página (append) ────────────────────────────────────
  const fetchNextPage = useCallback(async (q: string, ods: number | undefined, nextPage: number) => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const resp = await projectsService.listar({
        por_pagina: 50,
        pagina: nextPage,
        ...(q.trim() ? { q: q.trim() } : {}),
        ...(ods       ? { ods }         : {}),
      });
      const mapped = mapApiListToUiList(resp.dados);
      setResults((prev) => [...prev, ...mapped]);
      setPage(nextPage);
      setHasMore(mapped.length >= 50);
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore]);

  // ── debounce no reset ─────────────────────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query, odsFilter), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, odsFilter, search]);

  // ── função exposta para o componente chamar no onEndReached ───────────
  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchNextPage(query, odsFilter, page + 1);
    }
  }, [loading, loadingMore, hasMore, query, odsFilter, page, fetchNextPage]);

  return { results, loading, loadingMore, hasMore, loadMore };
}