import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { SearchScreen } from '@/components/SearchScreen';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { useApp } from '@/context/AppContext';
import { politiciansService } from '@/services/politiciansService';
import type { Politician } from '@/types/politician'; // ← importa do tipo correto, não do mock
import type { ApiPolitician } from '@/types/politician';

function mapParaPolitician(p: ApiPolitician): Politician {
  // Fallback duplo: suporta campos em português (nome/partido/estado/foto)
  // e em inglês (name/party/state/photo_url) para cobrir ambos os schemas da API
  const name  = p.nome      ?? p.name      ?? '';
  const party = p.partido   ?? p.party     ?? '';
  const state = p.estado    ?? p.state     ?? '';
  const photo = p.foto      ?? p.photo_url ?? undefined;

  if (!name) {
    console.warn('[search.tsx] Parlamentar sem nome recebido da API:', JSON.stringify(p));
  }

  return {
    id:    p.external_id ?? String(p.id ?? ''),
    name,
    party,
    state,
    house: (p.casa === 'Senado' ? 'Senado' : 'Câmara') as 'Senado' | 'Câmara',
    photo,
    bio:   '',
    stats: {
      totalVotes:        0,
      votesInFavor:      0,
      votesAgainst:      0,
      abstentions:       0,
      projectsPresented: 0,
      attendance:        0,
    },
  };
}

async function buscarTodos(casa: 'Câmara' | 'Senado'): Promise<Politician[]> {
  const todos: Politician[] = [];
  let pagina = 1;
  const porPagina = 100;
  while (true) {
    const res = await politiciansService.listar({ casa, pagina, por_pagina: porPagina });
    const resultados = res.resultados ?? [];
    todos.push(...resultados.map(mapParaPolitician));
    if (resultados.length < porPagina) break;
    pagina += 1;
  }
  return todos;
}

export default function SearchTab() {
  const router = useRouter();
  const {
    isGuest,
    isAuthenticated,
    savedProjects,
    savedPoliticians,
    toggleSaveProject,
    toggleSavePolitician,
    showToastMsg,
  } = useApp();

  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  const carregar = async () => {
    setLoading(true);
    setError(null);
    try {
      const [deputados, senadores] = await Promise.all([
        buscarTodos('Câmara'),
        buscarTodos('Senado'),
      ]);
      setPoliticians([...deputados, ...senadores]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar parlamentares.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  if (loading) return <LoadingState message="Carregando parlamentares..." />;
  if (error)   return <ErrorState message={error} onRetry={carregar} />;

  const handleToggleSavePolitician = async (id: string) => {
    if (isGuest || !isAuthenticated) {
      showToastMsg('Faça login para seguir parlamentares.');
      return;
    }
    const jaSeguindo = savedPoliticians.includes(id);
    try {
      if (jaSeguindo) {
        await politiciansService.deixarDeSeguir(id);
        showToastMsg('Deixou de seguir parlamentar', 'success');
      } else {
        await politiciansService.seguir(id);
        showToastMsg('Seguindo parlamentar!', 'success');
      }
      toggleSavePolitician(id);
    } catch {
      showToastMsg('Erro ao atualizar. Tente novamente.', 'error'); // ← fix issue #39
    }
  };

  return (
    <SearchScreen
      politicians={politicians}
      savedProjects={savedProjects}
      savedPoliticians={savedPoliticians}
      onProjectClick={(id) => router.push(`/project/${id}` as never)}
      onToggleSave={(id) => {
        if (isGuest) { showToastMsg('Faça login para salvar.'); return; }
        toggleSaveProject(id);
      }}
      onPoliticianClick={(id) => router.push(`/politician/${id}` as never)}
      onToggleSavePolitician={handleToggleSavePolitician}
    />
  );
}