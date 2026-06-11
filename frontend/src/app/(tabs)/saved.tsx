import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogIn } from 'lucide-react-native';

import { SavedProjects } from '@/components/SavedProjects';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/useTheme';
import { projectsService } from '@/services/projectsService';
import { mapApiListToUiList } from '@/mappers/projectMapper';
import type { UiProject } from '@/types/project';

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

  useEffect(() => {
    if (!isAuthenticated || savedProjects.length === 0) {
      setProjects([]);
      return;
    }
    projectsService
      .listar({ por_pagina: 20 })
      .then((res) => {
        const todos = mapApiListToUiList(res.dados ?? []);
        setProjects(todos.filter((p) => savedProjects.includes(p.id)));
      })
      .catch(() => setProjects([]));
  }, [isAuthenticated, savedProjects]);

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
      politicians={[]}
      savedPoliticians={savedPoliticians}
      onProjectClick={(id) => router.push(`/project/${id}` as never)}
      onToggleSave={(id) => {
        if (isGuest) { requireLogin(); return; }
        toggleSaveProject(id);
      }}
      onPoliticianClick={(id) => router.push(`/politician/${id}` as never)}
      onRemovePolitician={(id) => {
        if (isGuest) { requireLogin(); return; }
        removePolitician(id);
      }}
      onNavigateToSearch={() => router.push('/(tabs)/search' as never)}
      onShowToast={showToastMsg}
    />
  );
}