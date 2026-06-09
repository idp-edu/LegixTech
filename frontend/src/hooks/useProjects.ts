import { useCallback, useEffect, useState } from 'react'; 
import { mockProjects } from '@/data/mockProjects'; 
// 🚀 CORRIGIDO: Importação universal para evitar o erro ts(2305)
import * as projectsServiceModule from '@/services/projectsService'; 
import { mapApiListToUiList } from '@/mappers/projectMapper'; 
import type { UiProject } from '@/types/project'; 

const projectsService = (projectsServiceModule as any).projectsService || (projectsServiceModule as any).default || projectsServiceModule;

type Filters = { 
  q?: string; 
  tipo?: string; 
  ano?: number; 
  ods?: number; 
  pagina?: number; 
  porPagina?: number; 
}; 

type UseProjectsResult = { 
  projects: UiProject[]; 
  loading: boolean; 
  error: string | null; 
  total: number; 
  refetch: () => void; 
}; 

const USE_MOCK = true; // mude para false quando o back estiver rodando 

export function useProjects(filters: Filters = {}): UseProjectsResult { 
  const [projects, setProjects] = useState<UiProject[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const [total, setTotal] = useState(0); 

  const fetchProjects = useCallback(async () => { 
    setLoading(true); 
    setError(null); 
    try { 
      if (USE_MOCK) { 
        let filtered = [...mockProjects]; 
        if (filters.q) { 
          const q = filters.q.toLowerCase(); 
          filtered = filtered.filter( 
            (p) => p.title.toLowerCase().includes(q) || p.summary?.toLowerCase().includes(q) || p.category.toLowerCase().includes(q), 
          ); 
        } 
        if (filters.tipo) { 
          filtered = filtered.filter((p) => p.category.toLowerCase().includes(filters.tipo!.toLowerCase()), 
          ); 
        } 
        if (filters.ano) { 
          filtered = filtered.filter((p) => p.year === String(filters.ano)); 
        } 
        if (filters.ods) { 
          filtered = filtered.filter((p) => p.ods.includes(filters.ods!)); 
        } 
        setProjects(filtered); 
        setTotal(filtered.length); 
      } else { 
        const response = await projectsService.listar(filters); 
        const mapped = mapApiListToUiList(response.dados); 
        setProjects(mapped); 
        setTotal(response.total); 
      } 
    } catch (err) { 
      setError(err instanceof Error ? err.message : 'Erro ao carregar projetos.'); 
    } finally { 
      setLoading(false); 
    } 
  }, [filters.q, filters.tipo, filters.ano, filters.ods, filters.pagina, filters.porPagina]); 

  useEffect(() => { 
    fetchProjects(); 
  }, [fetchProjects]); 

  return { projects, loading, error, total, refetch: fetchProjects }; 
}
