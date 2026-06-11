import { useCallback, useEffect, useState } from 'react';
import { politiciansService } from '@/services/politiciansService';
import type { ApiPolitician } from '@/types/politician';

type Filters = {
  nome?: string;
  partido?: string;
  estado?: string;
  casa?: string;
  pagina?: number;
  porPagina?: number;
};

type UsePoliticiansResult = {
  politicians: ApiPolitician[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => void;
};

export function usePoliticians(filters: Filters = {}): UsePoliticiansResult {
  const [politicians, setPoliticians] = useState<ApiPolitician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchPoliticians = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await politiciansService.listar({
        nome: filters.nome,
        partido: filters.partido,
        estado: filters.estado,
        casa: filters.casa,
        pagina: filters.pagina ?? 1,
        por_pagina: filters.porPagina ?? 20,
      });
      setPoliticians(response.resultados ?? []);
      setTotal(response.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar parlamentares.');
    } finally {
      setLoading(false);
    }
  }, [filters.nome, filters.partido, filters.estado, filters.casa, filters.pagina, filters.porPagina]);

  useEffect(() => {
    fetchPoliticians();
  }, [fetchPoliticians]);

  return { politicians, loading, error, total, refetch: fetchPoliticians };
}