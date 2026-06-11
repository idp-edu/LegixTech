import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogIn } from 'lucide-react-native';

import { SavedProjects } from '@/components/SavedProjects';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/useTheme';
import { projectsService } from '@/services/projectsService';
import { politiciansService } from '@/services/politiciansService';
import { mapApiListToUiList } from '@/mappers/projectMapper';
import type { UiProject } from '@/types/project';
import type { Politician } from '@/data/mockPoliticians';

export default function SavedTab() {
  const router = useRouter();
  const { colors } = useTheme();
  const {
    isGuest,
    isAuthenticated,
    savedProjects,
    savedPoliticians,
    toggleSaveProject,
    removePolitician,
    showToastMsg,
  } = useApp();

  const [projects, setProjects] = useState<UiProject[]>([]);
  const [politicians, setPoliticians] = useState<Politician[]>([]);

  // Busca projetos salvos
  useEffect(() => {
    if (!isAuthenticated) {
      setProjects([]);
      return;
    }
    if (savedProjects.length === 0) {
      setProjects([]);
      return;
    }
    projectsService
      .listar({ por_pagina: 100 })
      .then((res) => {
        const todos = mapApiListToUiList(res?.dados ?? []);
        setProjects(todos.filter((p) => savedProjects.includes(p.id)));
      })
      .catch(() => setProjects([]));
  }, [isAuthenticated, savedProjects]);

  // Busca parlamentares seguidos — sempre do backend, sem depender de savedPoliticians
  useEffect(() => {
    if (!isAuthenticated) {
      setPoliticians([]);
      return;
    }
    politiciansService
      .getSeguindo()
      .then((lista: any[]) => {
        const mapped: Politician[] = lista.map((p) => ({
          // usa external_id como id para bater com savedPoliticians
          id: p.politician_external_id ?? String(p.politician_id),
          name: p.politician_name ?? 'Parlamentar',
          party: p.politician_party ?? '',
          state: p.politician_state ?? '',
          house: 'Câmara' as const,
          photo: p.politician_photo_url ?? undefined,
          bio: '',
          stats: {
            totalVotes: 0,
            votesInFavor: 0,
            votesAgainst: 0,
            abstentions: 0,
            projectsPresented: 0,
            attendance: 0,
          },
        }));
        setPoliticians(mapped);
      })
      .catch(() => setPoliticians([]));
  }, [isAuthenticated]); // ← não depende mais de savedPoliticians, busca sempre do backend

  // ── Não logado ────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <SafeAreaView
          edges={['top']}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.divider,
            backgroundColor: colors.surface,
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>Salvos</Text>
          <Text style={{ fontSize: 14, color: colors.textMuted }}>Seus projetos e parlamentares</Text>
        </SafeAreaView>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <View style={{
            marginBottom: 16, height: 80, width: 80,
            alignItems: 'center', justifyContent: 'center',
            borderRadius: 40, backgroundColor: colors.surface,
          }}>
            <LogIn size={32} color={colors.textMuted} />
          </View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 }}>
            Faça login para continuar
          </Text>
          <Text style={{ textAlign: 'center', color: colors.textMuted, marginBottom: 24 }}>
            Esta funcionalidade só está disponível para usuários logados
          </Text>
          <Pressable
            onPress={() => router.push('/welcome' as never)}
            style={{
              borderRadius: 8, backgroundColor: colors.primary,
              paddingHorizontal: 24, paddingVertical: 12,
            }}
          >
            <Text style={{ fontWeight: '500', color: '#fff' }}>Entrar ou criar conta</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Logado ────────────────────────────────────────────────────────────────
  const requireLogin = () =>
    showToastMsg('Faça login para acessar e gerenciar seus itens salvos.');

  return (
    <SavedProjects
      projects={projects}
      politicians={politicians}
      savedPoliticians={politicians.map((p) => p.id)} // ← sempre mostra todos os seguidos
      onProjectClick={(id) => router.push(`/project/${id}` as never)}
      onToggleSave={(id) => {
        if (isGuest) { requireLogin(); return; }
        toggleSaveProject(id);
      }}
      onPoliticianClick={(id) => router.push(`/politician/${id}` as never)}
      onRemovePolitician={async (id) => {
        if (isGuest) { requireLogin(); return; }
        try {
          await politiciansService.deixarDeSeguir(id);
          removePolitician(id);
          setPoliticians((prev) => prev.filter((p) => p.id !== id));
          showToastMsg('Deixou de seguir parlamentar');
        } catch {
          showToastMsg('Erro ao deixar de seguir. Tente novamente.');
        }
      }}
      onNavigateToSearch={() => router.push('/(tabs)/search' as never)}
      onShowToast={showToastMsg}
    />
  );
}