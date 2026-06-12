import { Filter, Search, UserCheck, UserCircle, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import { useProjectSearch } from '@/hooks/useProjectSearch';
import type { Politician } from '@/data/mockPoliticians';
import { ProjectCard } from './ProjectCard';

const ODS_LIST = [
  { numero: 1,  nome: 'Erradicação da Pobreza' },
  { numero: 2,  nome: 'Fome Zero' },
  { numero: 3,  nome: 'Saúde e Bem-Estar' },
  { numero: 4,  nome: 'Educação de Qualidade' },
  { numero: 5,  nome: 'Igualdade de Gênero' },
  { numero: 6,  nome: 'Água Potável e Saneamento' },
  { numero: 7,  nome: 'Energia Limpa' },
  { numero: 8,  nome: 'Trabalho Decente' },
  { numero: 9,  nome: 'Indústria e Inovação' },
  { numero: 10, nome: 'Redução das Desigualdades' },
  { numero: 11, nome: 'Cidades Sustentáveis' },
  { numero: 12, nome: 'Consumo Responsável' },
  { numero: 13, nome: 'Ação Climática' },
  { numero: 14, nome: 'Vida na Água' },
  { numero: 15, nome: 'Vida Terrestre' },
  { numero: 16, nome: 'Paz e Justiça' },
  { numero: 17, nome: 'Parcerias e Meios de Implementação' },
];

interface SearchScreenProps {
  politicians: Politician[];
  savedProjects: string[];
  savedPoliticians?: string[];
  onProjectClick: (id: string) => void;
  onToggleSave: (id: string) => void;
  onPoliticianClick: (id: string) => void;
  onToggleSavePolitician?: (id: string) => void;
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export function SearchScreen({
  politicians,
  savedProjects,
  savedPoliticians = [],
  onProjectClick,
  onToggleSave,
  onPoliticianClick,
  onToggleSavePolitician,
}: SearchScreenProps) {
  const [activeTab, setActiveTab]   = useState<'projetos' | 'parlamentares'>('projetos');
  const [searchQuery, setSearchQuery] = useState('');
  const [odsFilter, setOdsFilter]   = useState<number | undefined>(undefined);
  const [houseFilter, setHouseFilter] = useState<'Todos' | 'Senado' | 'Câmara'>('Todos');
  const [stateFilter, setStateFilter] = useState('Todos');
  const { colors } = useTheme();

  const {
    results: filteredProjects,
    loading: searchLoading,
    loadingMore,
    loadMore,
  } = useProjectSearch(
    activeTab === 'projetos' ? searchQuery : '',
    activeTab === 'projetos' ? odsFilter   : undefined,
  );

  const availableStates = ['Todos', ...Array.from(new Set(politicians.map((p) => p.state)))].sort();

  const filteredPoliticians = politicians.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.party.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q);
    const matchesHouse = houseFilter === 'Todos' || p.house === houseFilter;
    const matchesState = stateFilter === 'Todos' || p.state === stateFilter;
    return matchesSearch && matchesHouse && matchesState;
  });

  const shouldShowPoliticians =
    searchQuery.length > 0 || houseFilter !== 'Todos' || stateFilter !== 'Todos';

  const TabButton = ({ id, label }: { id: typeof activeTab; label: string }) => (
    <Pressable
      onPress={() => { setActiveTab(id); setSearchQuery(''); setOdsFilter(undefined); }}
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

  // ── cabeçalho da lista de projetos (filtros + título) ─────────────────
  const ProjectListHeader = (
    <View style={{ gap: 16, paddingTop: 24 }}>
      {/* Filtro ODS */}
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Filter size={14} color={colors.textMuted} />
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textMuted }}>Filtrar por ODS</Text>
          {odsFilter !== undefined && (
            <Pressable
              onPress={() => setOdsFilter(undefined)}
              style={{ marginLeft: 8, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.primary }}
            >
              <Text style={{ fontSize: 12, color: '#fff', fontWeight: '500' }}>Limpar</Text>
            </Pressable>
          )}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
          {ODS_LIST.map((ods) => {
            const active = odsFilter === ods.numero;
            return (
              <Pressable
                key={ods.numero}
                onPress={() => setOdsFilter(active ? undefined : ods.numero)}
                style={{
                  minHeight: 44,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 999,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderWidth: active ? 0 : 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: active ? '#fff' : colors.primary }}>{ods.numero}</Text>
                <Text style={{ fontSize: 13, color: active ? '#fff' : colors.text }}>{ods.nome}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Título + contagem */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
          {odsFilter !== undefined
            ? `ODS ${odsFilter} — ${ODS_LIST.find((o) => o.numero === odsFilter)?.nome}`
            : searchQuery
            ? 'Resultados da Busca'
            : 'Todos os Projetos'}
        </Text>
        {!searchLoading && (
          <Text style={{ fontSize: 14, color: colors.textMuted }}>
            {filteredProjects.length} {filteredProjects.length === 1 ? 'projeto' : 'projetos'}
          </Text>
        )}
      </View>
    </View>
  );

  // ── rodapé da FlatList (spinner de "carregando mais") ─────────────────
  const ProjectListFooter = loadingMore ? (
    <View style={{ paddingVertical: 24, alignItems: 'center' }}>
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={{ marginTop: 8, fontSize: 13, color: colors.textMuted }}>Carregando mais projetos...</Text>
    </View>
  ) : null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView
        edges={['top']}
        style={{ borderBottomWidth: 1, borderBottomColor: colors.divider, backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 16 }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>Busca & Descoberta</Text>
        <Text style={{ marginTop: 4, fontSize: 14, color: colors.textMuted }}>Encontre legislação e parlamentares</Text>
      </SafeAreaView>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.divider, backgroundColor: colors.surface, paddingHorizontal: 16 }}>
        <TabButton id="projetos"     label="Projetos" />
        <TabButton id="parlamentares" label="Parlamentares" />
      </View>

      {/* ── ABA PROJETOS — usa FlatList ────────────────────────────────── */}
      {activeTab === 'projetos' && (
        <>
          {/* Campo de busca fora da FlatList para não rolar */}
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 12 }}>
              <Search size={20} color={colors.textMuted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar projetos por palavra-chave..."
                placeholderTextColor={colors.textMuted}
                style={{ flex: 1, minHeight: 44, color: colors.text, fontSize: 16 }}
              />
              {searchLoading && <ActivityIndicator size="small" color={colors.primary} />}
            </View>
          </View>

          {searchLoading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: 12, color: colors.textMuted }}>
                {searchQuery || odsFilter ? 'Buscando projetos...' : 'Carregando projetos...'}
              </Text>
            </View>
          ) : filteredProjects.length === 0 ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Search size={48} color={colors.textMuted} />
              <Text style={{ marginTop: 12, color: colors.textMuted }}>
                {odsFilter
                  ? `Nenhum projeto encontrado para ODS ${odsFilter}`
                  : searchQuery
                  ? `Nenhum projeto encontrado para "${searchQuery}"`
                  : 'Nenhum projeto disponível no momento'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredProjects}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96 }}
              ListHeaderComponent={ProjectListHeader}
              ListFooterComponent={ProjectListFooter}
              ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
              renderItem={({ item }) => (
                <ProjectCard
                  {...item}
                  saved={savedProjects.includes(item.id)}
                  onClick={onProjectClick}
                  onSave={onToggleSave}
                />
              )}
              onEndReached={loadMore}
              onEndReachedThreshold={0.3}
            />
          )}
        </>
      )}

      {/* ── ABA PARLAMENTARES — ScrollView normal ─────────────────────── */}
      {activeTab === 'parlamentares' && (
        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} contentContainerStyle={{ paddingTop: 24, paddingBottom: 96, gap: 16 }}>
          {/* Campo de busca */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 12 }}>
            <Search size={20} color={colors.textMuted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar por nome, partido ou estado..."
              placeholderTextColor={colors.textMuted}
              style={{ flex: 1, minHeight: 44, color: colors.text, fontSize: 16 }}
            />
          </View>

          <View>
            <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: '500', color: colors.textMuted }}>Casa Legislativa</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {(['Todos', 'Senado', 'Câmara'] as const).map((house) => (
                <Pressable
                  key={house}
                  onPress={() => setHouseFilter(house)}
                  style={{ minHeight: 44, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: houseFilter === house ? colors.primary : colors.surface, borderWidth: houseFilter === house ? 0 : 1, borderColor: colors.border, justifyContent: 'center' }}
                >
                  <Text style={{ fontWeight: houseFilter === house ? '500' : '400', color: houseFilter === house ? '#fff' : colors.text }}>{house}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: '500', color: colors.textMuted }}>Estado</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
              {availableStates.map((state) => (
                <Pressable
                  key={state}
                  onPress={() => setStateFilter(state)}
                  style={{ minHeight: 44, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: stateFilter === state ? colors.primary : colors.surface, borderWidth: stateFilter === state ? 0 : 1, borderColor: colors.border, justifyContent: 'center' }}
                >
                  <Text style={{ fontWeight: stateFilter === state ? '500' : '400', color: stateFilter === state ? '#fff' : colors.text }}>{state}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {!shouldShowPoliticians ? (
            <View style={{ alignItems: 'center', paddingVertical: 64 }}>
              <UserCircle size={48} color={colors.textMuted} />
              <Text style={{ marginTop: 12, fontWeight: '500', color: colors.text }}>Pesquise ou filtre para encontrar parlamentares</Text>
              <Text style={{ fontSize: 14, color: colors.textMuted }}>Use a busca ou selecione filtros acima</Text>
            </View>
          ) : filteredPoliticians.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 64 }}>
              <UserCircle size={48} color={colors.textMuted} />
              <Text style={{ color: colors.textMuted }}>Nenhum parlamentar encontrado</Text>
            </View>
          ) : (
            filteredPoliticians.map((politician) => {
              const isFollowing = savedPoliticians.includes(politician.id);
              return (
                <View key={politician.id} style={{ borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <Pressable onPress={() => onPoliticianClick(politician.id)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                      <View style={{ height: 56, width: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 28, backgroundColor: colors.primary }}>
                        <Text style={{ fontWeight: 'bold', color: '#fff' }}>{getInitials(politician.name)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ marginBottom: 4, fontWeight: '500', color: colors.text }}>{politician.name}</Text>
                        <Text style={{ fontSize: 14, color: colors.textMuted }}>{politician.party} • {politician.state} • {politician.house}</Text>
                      </View>
                    </Pressable>
                    {onToggleSavePolitician && (
                      <Pressable
                        onPress={() => onToggleSavePolitician(politician.id)}
                        style={{ minHeight: 44, minWidth: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: isFollowing ? colors.primary : colors.border }}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck size={18} color={colors.primary} />
                            <Text style={{ fontSize: 14, fontWeight: '500', color: colors.primary }}>Seguindo</Text>
                          </>
                        ) : (
                          <>
                            <UserPlus size={18} color={colors.text} />
                            <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text }}>Seguir</Text>
                          </>
                        )}
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}