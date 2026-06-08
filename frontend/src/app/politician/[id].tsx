import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { PoliticianProfile } from '@/components/PoliticianProfile';
import { useApp } from '@/context/AppContext';
import { mockPoliticians, mockVotes } from '@/data/mockPoliticians';
import { politiciansService } from '@/services/politiciansService';

export default function PoliticianDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, openChatbot, showToastMsg } = useApp();

  const [isSaved, setIsSaved] = useState(false);

  const politician = mockPoliticians.find((p) => p.id === id);

  // Verifica se já está seguindo ao abrir a tela
  useEffect(() => {
    if (!isAuthenticated || !politician) return;
    politiciansService.getSeguindo().then((lista) => {
      setIsSaved(lista.some((p) => String(p.politician_id) === String(politician.id)));
    }).catch(() => {});
  }, [isAuthenticated, politician]);

  if (!politician) { router.back(); return null; }

  const votes = mockVotes.filter((v) => v.politicianId === id);

  const handleToggleSave = async (politicianLocalId: string) => {
    if (!isAuthenticated) {
      showToastMsg('Faça login para seguir parlamentares');
      return;
    }
    try {
      if (isSaved) {
        const lista = await politiciansService.getSeguindo();
        const entrada = lista.find((p) => String(p.politician_id) === String(politicianLocalId));
        if (entrada) await politiciansService.deixarDeSeguir(entrada.politician_id);
        setIsSaved(false);
        showToastMsg('Deixou de seguir parlamentar');
      } else {
        await politiciansService.salvar(politicianLocalId);
        const lista = await politiciansService.getSeguindo();
        const entrada = lista.find((p) => String(p.politician_id) === String(politicianLocalId));
        if (entrada) await politiciansService.seguir(entrada.politician_id);
        setIsSaved(true);
        showToastMsg('Seguindo parlamentar!');
      }
    } catch {
      showToastMsg('Erro ao atualizar. Tente novamente.');
    }
  };

  return (
    <PoliticianProfile
      politician={politician}
      votes={votes}
      onBack={() => router.back()}
      onProjectClick={(projectId) => router.push(`/project/${projectId}`)}
      onChatbotClick={isAuthenticated ? () => openChatbot('parlamentar') : undefined}
      isSaved={isSaved}
      onToggleSave={handleToggleSave}
      onShowToast={showToastMsg}
    />
  );
}