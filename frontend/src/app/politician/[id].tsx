import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { PoliticianProfile } from '@/components/PoliticianProfile';
import { useApp } from '@/context/AppContext';
import { politiciansService } from '@/services/politiciansService';
import type { Politician, Vote } from '@/data/mockPoliticians';

export default function PoliticianDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, openChatbot, showToastMsg, toggleSavePolitician } = useApp();

  const [politician, setPolitician] = useState<Politician | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    politiciansService
      .detalhe(String(id))
      .then((data: any) => {
        const mapped: Politician = {
          id: String(data.id ?? data.external_id ?? id),
          name: data.nome ?? data.name ?? 'Parlamentar',
          party: data.siglaPartido ?? data.party ?? '',
          state: data.siglaUf ?? data.state ?? '',
          house:
            data.tipoCargo === 'Senador' || data.house === 'Senado'
              ? 'Senado'
              : 'Câmara',
          photo: data.urlFoto ?? data.photo ?? undefined,
          bio: data.ultimoStatus?.descricaoStatus ?? data.bio ?? '',
          stats: {
            totalVotes: data.stats?.totalVotes ?? 0,
            votesInFavor: data.stats?.votesInFavor ?? 0,
            votesAgainst: data.stats?.votesAgainst ?? 0,
            abstentions: data.stats?.abstentions ?? 0,
            projectsPresented: data.stats?.projectsPresented ?? 0,
            attendance: data.stats?.attendance ?? 0,
          },
        };
        setPolitician(mapped);
      })
      .catch(() => setError('Não foi possível carregar os dados do parlamentar.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    politiciansService
      .votacoes(String(id))
      .then((data: any) => {
        const lista = Array.isArray(data) ? data : data?.dados ?? [];
        const mapped: Vote[] = lista.map((v: any, idx: number) => ({
          id: String(v.id ?? idx),
          politicianId: String(id),
          projectId: String(v.idProposicao ?? v.projectId ?? idx),
          projectTitle: v.proposicao?.ementa ?? v.projectTitle ?? 'Votação',
          projectDescription: v.proposicao?.descricaoTipo ?? v.projectDescription ?? '',
          vote:
            v.voto === 'Sim' || v.voto === 'favor'
              ? 'favor'
              : v.voto === 'Não' || v.voto === 'contra'
              ? 'contra'
              : 'abstencao',
          status: 'active',
          date: v.dataHoraVoto
            ? new Date(v.dataHoraVoto).toLocaleDateString('pt-BR')
            : v.date ?? '',
          category: v.proposicao?.tema ?? v.category ?? '',
        }));
        setVotes(mapped);
      })
      .catch(() => setVotes([]));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || !id) return;
    politiciansService
      .getSeguindo()
      .then((lista: any[]) => {
        // Cruza pelo external_id que agora vem no retorno
        setIsSaved(
          lista.some(
            (p) =>
              String(p.politician_external_id) === String(id) ||
              String(p.politician_id) === String(id),
          ),
        );
      })
      .catch(() => {});
  }, [isAuthenticated, id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#1e40af" />
        <Text className="mt-3 text-sm text-muted-foreground">
          Carregando parlamentar...
        </Text>
      </View>
    );
  }

  if (error || !politician) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-8">
        <Text className="mb-2 text-center text-base font-semibold text-foreground">
          {error ?? 'Parlamentar não encontrado'}
        </Text>
        <Text onPress={() => router.back()} className="mt-4 text-sm text-primary underline">
          Voltar
        </Text>
      </View>
    );
  }

  const handleToggleSave = async (politicianLocalId: string) => {
    if (!isAuthenticated) {
      showToastMsg('Faça login para seguir parlamentares');
      return;
    }
    try {
      if (isSaved) {
        await politiciansService.deixarDeSeguir(politicianLocalId); // ← era Number(), agora string
        setIsSaved(false);
        toggleSavePolitician(politicianLocalId);
        showToastMsg('Deixou de seguir parlamentar');
      } else {
        await politiciansService.seguir(politicianLocalId);         // ← era Number(), agora string
        setIsSaved(true);
        toggleSavePolitician(politicianLocalId);
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
      onProjectClick={(projectId) => router.push(`/project/${projectId}` as never)}
      onChatbotClick={isAuthenticated ? () => openChatbot('parlamentar') : undefined}
      isSaved={isSaved}
      onToggleSave={handleToggleSave}
      onShowToast={showToastMsg}
    />
  );
}