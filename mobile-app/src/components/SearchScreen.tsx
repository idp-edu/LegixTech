import { Search, UserCheck, UserCircle, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Politician } from '@/data/mockPoliticians';
import type { ProjectStatus } from '@/types/project';

import { ProjectCard } from './ProjectCard';

interface SearchScreenProps {
  projects: Array<{
    id: string;
    title: string;
    year: string;
    status: ProjectStatus;
    category: string;
  }>;
  politicians: Politician[];
  savedProjects: string[];
  savedPoliticians?: string[];
  onProjectClick: (id: string) => void;
  onToggleSave: (id: string) => void;
  onPoliticianClick: (id: string) => void;
  onToggleSavePolitician?: (id: string) => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function SearchScreen({
  projects,
  politicians,
  savedProjects,
  savedPoliticians = [],
  onProjectClick,
  onToggleSave,
  onPoliticianClick,
  onToggleSavePolitician,
}: SearchScreenProps) {
  const [activeTab, setActiveTab] = useState<'projetos' | 'parlamentares'>('projetos');
  const [searchQuery, setSearchQuery] = useState('');
  const [houseFilter, setHouseFilter] = useState<'Todos' | 'Senado' | 'Câmara'>('Todos');
  const [stateFilter, setStateFilter] = useState('Todos');

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const availableStates = ['Todos', ...Array.from(new Set(politicians.map((p) => p.state)))].sort();

  const filteredPoliticians = politicians.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) || p.party.toLowerCase().includes(q) || p.state.toLowerCase().includes(q);
    const matchesHouse = houseFilter === 'Todos' || p.house === houseFilter;
    const matchesState = stateFilter === 'Todos' || p.state === stateFilter;
    return matchesSearch && matchesHouse && matchesState;
  });

  const shouldShowPoliticians = searchQuery.length > 0 || houseFilter !== 'Todos' || stateFilter !== 'Todos';

  const TabButton = ({ id, label }: { id: typeof activeTab; label: string }) => (
    <Pressable onPress={() => { setActiveTab(id); setSearchQuery(''); }} className="relative min-h-11 px-4 py-3">
      <Text
        className={activeTab === id ? 'font-medium text-primary' : 'text-muted-foreground'}
      >
        {label}
      </Text>
      {activeTab === id && <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
    </Pressable>
  );

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']} className="border-b border-border bg-card px-4 py-4">
        <Text className="font-display text-xl font-bold text-foreground">Busca & Descoberta</Text>
        <Text className="mt-1 text-sm text-muted-foreground">Encontre legislação e parlamentares</Text>
      </SafeAreaView>

      <View className="flex-row border-b border-border bg-card px-4">
        <TabButton id="projetos" label="Projetos" />
        <TabButton id="parlamentares" label="Parlamentares" />
      </View>

      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 96, gap: 16 }}>
        <View className="flex-row items-center gap-3 rounded-xl border border-border bg-input-background px-4 py-3">
          <Search size={20} color="#6b7280" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={
              activeTab === 'projetos'
                ? 'Buscar projetos por palavra-chave...'
                : 'Buscar por nome, partido ou estado...'
            }
            placeholderTextColor="#6b7280"
            className="min-h-11 flex-1 text-foreground"
          />
        </View>

        {activeTab === 'projetos' && (
          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-display text-lg font-bold text-foreground">
                {searchQuery ? 'Resultados da Busca' : 'Todos os Projetos'}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'projeto' : 'projetos'}
              </Text>
            </View>
            {filteredProjects.length === 0 ? (
              <View className="items-center py-16">
                <Search size={48} color="#6b7280" />
                <Text className="mt-3 text-muted-foreground">
                  {searchQuery ? 'Nenhum projeto encontrado' : 'Digite para buscar projetos'}
                </Text>
              </View>
            ) : (
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                  saved={savedProjects.includes(project.id)}
                  onClick={onProjectClick}
                  onSave={onToggleSave}
                />
              ))
            )}
          </View>
        )}

        {activeTab === 'parlamentares' && (
          <View className="gap-4">
            <View>
              <Text className="mb-2 text-sm font-medium text-muted-foreground">Casa Legislativa</Text>
              <View className="flex-row flex-wrap gap-2">
                {(['Todos', 'Senado', 'Câmara'] as const).map((house) => (
                  <Pressable
                    key={house}
                    onPress={() => setHouseFilter(house)}
                    className={`min-h-11 rounded-full px-4 py-2 ${houseFilter === house ? 'bg-primary' : 'border border-border bg-surface'}`}
                  >
                    <Text className={houseFilter === house ? 'font-medium text-primary-foreground' : 'text-foreground'}>
                      {house}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View>
              <Text className="mb-2 text-sm font-medium text-muted-foreground">Estado</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 pb-2">
                {availableStates.map((state) => (
                  <Pressable
                    key={state}
                    onPress={() => setStateFilter(state)}
                    className={`min-h-11 rounded-full px-4 py-2 ${stateFilter === state ? 'bg-primary' : 'border border-border bg-surface'}`}
                  >
                    <Text className={stateFilter === state ? 'font-medium text-primary-foreground' : 'text-foreground'}>
                      {state}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {!shouldShowPoliticians ? (
              <View className="items-center py-16">
                <UserCircle size={48} color="#6b7280" />
                <Text className="mt-3 font-medium text-foreground">Pesquise ou filtre para encontrar parlamentares</Text>
                <Text className="text-sm text-muted-foreground">Use a busca ou selecione filtros acima</Text>
              </View>
            ) : filteredPoliticians.length === 0 ? (
              <View className="items-center py-16">
                <UserCircle size={48} color="#6b7280" />
                <Text className="text-muted-foreground">Nenhum parlamentar encontrado</Text>
              </View>
            ) : (
              filteredPoliticians.map((politician) => {
                const isFollowing = savedPoliticians.includes(politician.id);
                return (
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
                            {politician.party} • {politician.state} • {politician.house}
                          </Text>
                        </View>
                      </Pressable>
                      {onToggleSavePolitician && (
                        <Pressable
                          onPress={() => onToggleSavePolitician(politician.id)}
                          className={`min-h-11 min-w-[100px] flex-row items-center justify-center gap-2 rounded-lg px-4 py-2 ${isFollowing ? 'border border-primary bg-primary-light' : 'border border-border bg-surface'}`}
                        >
                          {isFollowing ? (
                            <>
                              <UserCheck size={18} color="#1e40af" />
                              <Text className="text-sm font-medium text-primary">Seguindo</Text>
                            </>
                          ) : (
                            <>
                              <UserPlus size={18} color="#1a1a1a" />
                              <Text className="text-sm font-medium text-foreground">Seguir</Text>
                            </>
                          )}
                        </Pressable>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
