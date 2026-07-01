import { useCallback, useEffect, useRef, useState } from 'react';
import { projectsService } from '@/services/projectsService';
import { mapApiListToUiList } from '@/mappers/projectMapper';
import type { UiProject } from '@/types/project';

export function useProjectSearch(query: string, odsFilter?: number) {
  const [results, setResults]         = useState<UiProject[]>([]);
  const [loading, setLoading]         = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [isWakingUp, setIsWakingUp]   = useState(false);

  const debounceRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchKeyRef    = useRef('');
  const wakeUpShownRef  = useRef(false); // só avisa "acordando" uma vez por sessão

  const search = useCallback(async (q: string, ods?: number) => {
    const key = `${q}|${ods}`;
    searchKeyRef.current = key;

    setLoading(true);
    setPage(1);
    setHasMore(true);
    setError(null);

    // Após 4s sem resposta, exibe aviso de cold start (só na primeira vez)
    let wakeUpTimer: ReturnType<typeof setTimeout> | null = null;
    if (!wakeUpShownRef.current) {
      wakeUpTimer = setTimeout(() => {
        if (searchKeyRef.current === key) {
          setIsWakingUp(true);
        }
      }, 4_000);
    }

    try {
      const resp = await projectsService.listar({
        por_pagina: 50,
        pagina: 1,
        ...(q.trim() ? { q: q.trim() } : {}),
        ...(ods       ? { ods }         : {}),
      });

      if (searchKeyRef.current !== key) return;

      wakeUpShownRef.current = true;
      setIsWakingUp(false);

      const mapped = mapApiListToUiList(resp.dados);
      setResults(mapped);
      setHasMore(mapped.length >= 50);
    } catch (err) {
      if (searchKeyRef.current !== key) return;
      setResults([]);
      setHasMore(false);
      setIsWakingUp(false);

      if (err instanceof Error && err.message.includes('acordando')) {
        setError('O servidor está acordando. Aguarde alguns segundos e tente novamente.');
      } else if (
        err instanceof TypeError ||
        (err instanceof Error && err.message.includes('conectar'))
      ) {
        setError('Sem conexão com o servidor. Verifique sua internet.');
      } else if (err instanceof Error && err.message.includes('503')) {
        setError('Serviço temporariamente indisponível. Tente novamente.');
      } else {
        setError('Erro ao buscar projetos. Tente novamente.');
      }
    } finally {
      if (wakeUpTimer) clearTimeout(wakeUpTimer);
      if (searchKeyRef.current === key) setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query, odsFilter), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, odsFilter, search]);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchNextPage(query, odsFilter, page + 1);
    }
  }, [loading, loadingMore, hasMore, query, odsFilter, page, fetchNextPage]);

  return { results, loading, loadingMore, hasMore, loadMore, error, isWakingUp, search };
}