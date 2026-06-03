import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
  UserCircle,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Politician, Vote } from '@/data/mockPoliticians';
import { getODSColor } from '@/data/odsMapping';

import { StatusBadge } from './StatusBadge';

interface PoliticianProfileProps {
  politician: Politician;
  votes: Vote[];
  onBack: () => void;
  onProjectClick?: (id: string) => void;
  onChatbotClick?: () => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
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

function getVoteStyle(vote: Vote['vote']) {
  switch (vote) {
    case 'favor':
      return { bg: '#dcfce7', border: '#15803d', text: '#15803d', label: 'Votou a Favor' };
    case 'contra':
      return { bg: '#fee2e2', border: '#dc2626', text: '#dc2626', label: 'Votou Contra' };
    default:
      return { bg: '#f3f4f6', border: '#6b7280', text: '#6b7280', label: 'Abstenção' };
  }
}

export function PoliticianProfile({
  politician,
  votes,
  onBack,
  onProjectClick,
  onChatbotClick,
  isSaved = false,
  onToggleSave,
  onShowToast,
}: PoliticianProfileProps) {
  const [activeTab, setActiveTab] = useState<'resumo' | 'votos'>('resumo');
  const [selectedVoteFilter, setSelectedVoteFilter] = useState<'todos' | 'favor' | 'contra'>('todos');

  const filteredVotes =
    selectedVoteFilter === 'todos'
      ? votes
      : votes.filter((v) => v.vote === selectedVoteFilter);

  const voteCounts = {
    todos: votes.length,
    favor: votes.filter((v) => v.vote === 'favor').length,
    contra: votes.filter((v) => v.vote === 'contra').length,
  };

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
          <Pressable onPress={onBack} className="min-h-11 min-w-11 items-center justify-center -ml-2">
            <ArrowLeft size={24} color="#1a1a1a" />
          </Pressable>
          <Text className="flex-1 font-display text-lg font-bold text-foreground">Perfil do Parlamentar</Text>
        </View>
      </SafeAreaView>

      <View className="bg-card px-4 py-6">
        <View className="flex-row items-start gap-4">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-primary">
            <Text className="font-display text-2xl font-bold text-primary-foreground">
              {getInitials(politician.name)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="mb-1 font-display text-xl font-bold text-foreground">{politician.name}</Text>
            <Text className="text-sm text-muted-foreground">
              {politician.party} • {politician.state} • {politician.house}
            </Text>
          </View>
          {onToggleSave && (
            <Pressable
              onPress={() => {
                onToggleSave(politician.id);
                onShowToast?.(isSaved ? 'Deixou de seguir parlamentar' : 'Seguindo parlamentar!');
              }}
              className={`min-h-11 items-center justify-center rounded-lg px-3 py-2 ${isSaved ? 'border border-primary bg-primary-light' : 'border border-border bg-surface'}`}
            >
              {isSaved ? <BookmarkCheck size={20} color="#1e40af" /> : <Bookmark size={20} color="#6b7280" />}
              <Text className={`text-xs font-medium ${isSaved ? 'text-primary' : 'text-muted-foreground'}`}>
                {isSaved ? 'Seguindo' : 'Seguir'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <View className="flex-row border-b border-border bg-card px-4">
        <TabButton id="resumo" label="Resumo" />
        <TabButton id="votos" label="Votações" />
      </View>

      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 112, gap: 24 }}>
        {activeTab === 'resumo' && (
          <>
            <View>
              <Text className="mb-3 font-display text-lg font-bold text-foreground">Estatísticas de Votação</Text>
              <View className="flex-row gap-3">
                <View className="flex-1 items-center rounded-lg border border-[#15803d] bg-[#dcfce7] p-4">
                  <Text className="font-display text-2xl font-bold text-[#15803d]">{politician.stats.votesInFavor}</Text>
                  <Text className="text-xs font-medium text-[#15803d]">A Favor</Text>
                </View>
                <View className="flex-1 items-center rounded-lg border border-[#dc2626] bg-[#fee2e2] p-4">
                  <Text className="font-display text-2xl font-bold text-[#dc2626]">{politician.stats.votesAgainst}</Text>
                  <Text className="text-xs font-medium text-[#dc2626]">Contra</Text>
                </View>
                <View className="flex-1 items-center rounded-lg border border-border bg-muted p-4">
                  <Text className="font-display text-2xl font-bold text-muted-foreground">
                    {politician.stats.abstentions}
                  </Text>
                  <Text className="text-xs font-medium text-muted-foreground">Abstenções</Text>
                </View>
              </View>
            </View>
            <View className="rounded-lg border border-border bg-surface p-4 gap-2">
              <Text className="font-display text-lg font-bold text-foreground">Informações Gerais</Text>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Presença:</Text>
                <Text className="font-medium text-foreground">{politician.stats.attendance}%</Text>
              </View>
            </View>
            <View>
              <Text className="mb-3 font-display text-lg font-bold text-foreground">Biografia</Text>
              <Text className="leading-relaxed text-muted-foreground">{politician.bio}</Text>
            </View>
          </>
        )}

        {activeTab === 'votos' && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              {(['todos', 'favor', 'contra'] as const).map((f) => (
                <Pressable
                  key={f}
                  onPress={() => setSelectedVoteFilter(f)}
                  className={`min-h-11 flex-row items-center gap-2 rounded-full px-4 py-2 ${selectedVoteFilter === f ? 'bg-primary' : 'border border-border bg-surface'}`}
                >
                  {f === 'favor' && <ThumbsUp size={16} color={selectedVoteFilter === f ? '#fff' : '#1a1a1a'} />}
                  {f === 'contra' && <ThumbsDown size={16} color={selectedVoteFilter === f ? '#fff' : '#1a1a1a'} />}
                  <Text className={selectedVoteFilter === f ? 'font-medium text-primary-foreground' : 'text-foreground'}>
                    {f === 'todos' ? 'Todos' : f === 'favor' ? 'A Favor' : 'Contra'} ({voteCounts[f]})
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            {filteredVotes.length === 0 ? (
              <View className="items-center py-12">
                <UserCircle size={48} color="#6b7280" />
                <Text className="text-muted-foreground">Nenhuma votação encontrada</Text>
              </View>
            ) : (
              filteredVotes.map((vote) => {
                const vs = getVoteStyle(vote.vote);
                return (
                  <Pressable
                    key={vote.id}
                    onPress={() => onProjectClick?.(vote.projectId)}
                    className="overflow-hidden rounded-lg"
                    style={{ backgroundColor: vs.bg, borderWidth: 2, borderColor: vs.border }}
                  >
                    <View className="flex-row">
                      <View className="w-1" style={{ backgroundColor: vs.border }} />
                      <View className="flex-1 gap-2 p-4">
                        <View className="flex-row items-center gap-2">
                          <View className="flex-row items-center gap-2 rounded-full px-3 py-1.5" style={{ backgroundColor: vs.border }}>
                            {vote.vote === 'favor' ? <ThumbsUp size={16} color="#fff" /> : vote.vote === 'contra' ? <ThumbsDown size={16} color="#fff" /> : null}
                            <Text className="text-sm font-bold text-white">{vs.label}</Text>
                          </View>
                          <Text className="text-xs text-muted-foreground">{vote.date}</Text>
                        </View>
                        <Text className="font-medium text-foreground">{vote.projectTitle}</Text>
                        <Text className="text-sm text-muted-foreground">{vote.projectDescription}</Text>
                        <StatusBadge status={vote.status} size="sm" />
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </>
        )}
      </ScrollView>

      {onChatbotClick && (
        <Pressable
          onPress={onChatbotClick}
          className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary"
        >
          <MessageCircle size={24} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}
