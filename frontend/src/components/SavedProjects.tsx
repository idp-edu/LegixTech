import { Bookmark, UserCircle, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import type { Politician } from '@/data/mockPoliticians';
import type { UiProject } from '@/types/project';

import { ProjectCard } from './ProjectCard';

interface SavedProjectsProps {
  projects: UiProject[];           // ← era tipo inline mínimo, agora é UiProject completo
  politicians: Politician[];
  savedPoliticians: string[];
  onProjectClick: (id: string) => void;
  onToggleSave: (id: string) => void;
  onPoliticianClick: (id: string) => void;
  onRemovePolitician: (id: string) => void;
  onNavigateToSearch?: () => void;
  onShowToast?: (message: string) => void;
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export function SavedProjects({
  projects,
  politicians,
  savedPoliticians,
  onProjectClick,
  onToggleSave,
  onPoliticianClick,
  onRemovePolitician,
  onNavigateToSearch,
  onShowToast,
}: SavedProjectsProps) {
  const [activeTab, setActiveTab] = useState<'projetos' | 'politicos'>('projetos');
  const { colors } = useTheme();
  const savedPoliticiansList = politicians.filter((p) => savedPoliticians.includes(p.id));

  const TabButton = ({ id, label }: { id: typeof activeTab; label: string }) => (
    <Pressable
      onPress={() => setActiveTab(id)}
      style={{ position: 'relative', minHeight: 44, paddingHorizontal: 16, paddingVertical: 12 }}
    >
      <Text style={{ color: activeTab === id ? colors.primary : colors.textMuted, fontWeight: activeTab === id ? '500' : '400' }}>
        {label}
      </Text>
      {activeTab === id && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: colors.primary }} />
      )}
    </Pressable>
  );

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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: colors.primary }}>
            <Bookmark size={20} color="#fff" fill="#fff" />
          </View>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>Salvos</Text>
            <Text style={{ fontSize: 14, color: colors.textMuted }}>Seus projetos e parlamentares</Text>
          </View>
        </View>
      </SafeAreaView>

      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.divider, backgroundColor: colors.surface, paddingHorizontal: 16 }}>
        <TabButton id="projetos" label={`Projetos (${projects.length})`} />
        <TabButton id="politicos" label={`Seguindo (${savedPoliticiansList.length})`} />
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} contentContainerStyle={{ paddingTop: 24, paddingBottom: 96, gap: 16 }}>
        {activeTab === 'projetos' &&
          (projects.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 64 }}>
              <View style={{ marginBottom: 16, height: 80, width: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 40, backgroundColor: colors.surface }}>
                <Bookmark size={32} color={colors.textMuted} />
              </View>
              <Text style={{ marginBottom: 8, fontSize: 18, fontWeight: 'bold', color: colors.text }}>Nenhum projeto salvo ainda</Text>
              <Text style={{ textAlign: 'center', color: colors.textMuted }}>
                Marque projetos para acompanhar legislações que você se importa
              </Text>
            </View>
          ) : (
            // Usa UiProject completo — título, summary, sponsor, ods chegam corretamente
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                {...project}
                saved
                onClick={onProjectClick}
                onSave={onToggleSave}
              />
            ))
          ))}

        {activeTab === 'politicos' &&
          (savedPoliticiansList.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 64 }}>
              <View style={{ marginBottom: 16, height: 80, width: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 40, backgroundColor: colors.surface }}>
                <UserCircle size={32} color={colors.textMuted} />
              </View>
              <Text style={{ marginBottom: 8, fontSize: 18, fontWeight: 'bold', color: colors.text }}>
                Você ainda não está seguindo nenhum parlamentar
              </Text>
              <Text style={{ marginBottom: 24, textAlign: 'center', color: colors.textMuted }}>
                Siga parlamentares para acompanhar suas votações
              </Text>
              {onNavigateToSearch && (
                <Pressable
                  onPress={onNavigateToSearch}
                  style={{ minHeight: 44, borderRadius: 8, backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12 }}
                >
                  <Text style={{ fontWeight: '500', color: '#fff' }}>Buscar Parlamentares</Text>
                </Pressable>
              )}
            </View>
          ) : (
            savedPoliticiansList.map((politician) => (
              <View key={politician.id} style={{ borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <Pressable onPress={() => onPoliticianClick(politician.id)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <View style={{ height: 56, width: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 28, backgroundColor: colors.primary }}>
                      <Text style={{ fontWeight: 'bold', color: '#fff' }}>{getInitials(politician.name)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ marginBottom: 4, fontWeight: '500', color: colors.text }}>{politician.name}</Text>
                      <Text style={{ fontSize: 14, color: colors.textMuted }}>
                        {politician.party} • {politician.state}
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      onRemovePolitician(politician.id);
                      onShowToast?.('Deixou de seguir parlamentar');
                    }}
                    style={{ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 }}
                  >
                    <X size={20} color="#EF4444" />
                  </Pressable>
                </View>
              </View>
            ))
          ))}
      </ScrollView>
    </View>
  );
}