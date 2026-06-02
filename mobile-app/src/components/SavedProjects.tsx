import { Bookmark, UserCircle, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Politician } from '@/data/mockPoliticians';
import type { ProjectStatus } from '@/types/project';

import { ProjectCard } from './ProjectCard';

interface SavedProjectsProps {
  projects: Array<{
    id: string;
    title: string;
    year: string;
    status: ProjectStatus;
    category: string;
  }>;
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
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
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
  const savedPoliticiansList = politicians.filter((p) => savedPoliticians.includes(p.id));

  const TabButton = ({ id, label }: { id: typeof activeTab; label: string }) => (
    <Pressable onPress={() => setActiveTab(id)} className="relative min-h-11 px-4 py-3">
      <Text className={activeTab === id ? 'font-medium text-primary' : 'text-muted-foreground'}>{label}</Text>
      {activeTab === id && <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
    </Pressable>
  );

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']} className="border-b border-border bg-card px-4 py-4">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Bookmark size={20} color="#fff" fill="#fff" />
          </View>
          <View>
            <Text className="font-display text-xl font-bold text-foreground">Salvos</Text>
            <Text className="text-sm text-muted-foreground">Seus projetos e parlamentares</Text>
          </View>
        </View>
      </SafeAreaView>

      <View className="flex-row border-b border-border bg-card px-4">
        <TabButton id="projetos" label={`Projetos (${projects.length})`} />
        <TabButton id="politicos" label={`Seguindo (${savedPoliticiansList.length})`} />
      </View>

      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 96, gap: 16 }}>
        {activeTab === 'projetos' &&
          (projects.length === 0 ? (
            <View className="items-center py-16">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Bookmark size={32} color="#6b7280" />
              </View>
              <Text className="mb-2 font-display text-lg font-bold text-foreground">Nenhum projeto salvo ainda</Text>
              <Text className="text-center text-muted-foreground">
                Marque projetos para acompanhar legislações que você se importa
              </Text>
            </View>
          ) : (
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
            <View className="items-center py-16">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-muted">
                <UserCircle size={32} color="#6b7280" />
              </View>
              <Text className="mb-2 font-display text-lg font-bold text-foreground">
                Você ainda não está seguindo nenhum parlamentar
              </Text>
              <Text className="mb-6 text-center text-muted-foreground">
                Siga parlamentares para acompanhar suas votações
              </Text>
              {onNavigateToSearch && (
                <Pressable onPress={onNavigateToSearch} className="min-h-11 rounded-lg bg-primary px-6 py-3">
                  <Text className="font-medium text-primary-foreground">Buscar Parlamentares</Text>
                </Pressable>
              )}
            </View>
          ) : (
            savedPoliticiansList.map((politician) => (
              <View key={politician.id} className="rounded-lg border border-border bg-card p-4">
                <View className="flex-row items-center gap-4">
                  <Pressable onPress={() => onPoliticianClick(politician.id)} className="flex-1 flex-row items-center gap-4">
                    <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
                      <Text className="font-display font-bold text-primary-foreground">
                        {getInitials(politician.name)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="mb-1 font-medium text-foreground">{politician.name}</Text>
                      <Text className="text-sm text-muted-foreground">
                        {politician.party} • {politician.state}
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      onRemovePolitician(politician.id);
                      onShowToast?.('Deixou de seguir parlamentar');
                    }}
                    className="min-h-11 min-w-11 items-center justify-center rounded-full"
                  >
                    <X size={20} color="#ef4444" />
                  </Pressable>
                </View>
              </View>
            ))
          ))}
      </ScrollView>
    </View>
  );
}
