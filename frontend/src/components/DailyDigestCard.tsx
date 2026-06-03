import { Calendar, ChevronDown, RotateCcw, TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface DailyDigestCardProps {
  onClick: () => void;
}

export function DailyDigestCard({ onClick }: DailyDigestCardProps) {
  const [isRead, setIsRead] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const highlights = [
    'Lei de Acessibilidade aprovada no Senado',
    'Energia Limpa: votação prevista para amanhã',
    'Privacidade Digital em análise nas comissões',
  ];

  if (isMinimized && isRead) {
    return (
      <Pressable
        onPress={() => setIsMinimized(false)}
        className="w-full rounded-lg border border-border bg-card p-4"
      >
        <View className="flex-row items-center gap-3">
          <Calendar size={18} color="#6b7280" />
          <View className="flex-1">
            <Text className="text-sm font-medium text-foreground">Resumo do dia — Lido</Text>
            <Text className="text-xs capitalize text-muted-foreground">{today}</Text>
          </View>
          <Pressable
            onPress={() => {
              setIsRead(false);
              setIsMinimized(false);
            }}
            className="min-h-11 min-w-11 items-center justify-center"
          >
            <RotateCcw size={18} color="#6b7280" />
          </Pressable>
          <ChevronDown size={20} color="#6b7280" />
        </View>
      </Pressable>
    );
  }

  return (
    <View className="w-full overflow-hidden rounded-2xl">
      <LinearGradient colors={['#1e40af', '#1e3a8a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Pressable onPress={onClick} className="w-full p-5">
          <View className="mb-3 flex-row items-center gap-2">
            <Calendar size={20} color="white" />
            <Text className="text-sm capitalize text-white/90">{today}</Text>
          </View>
          <Text className="mb-3 font-display text-lg font-bold text-white">Resumo do Dia</Text>
          <View className="mb-4 gap-2">
            {highlights.map((h, i) => (
              <View key={i} className="flex-row items-start gap-2">
                <TrendingUp size={16} color="rgba(255,255,255,0.8)" style={{ marginTop: 2 }} />
                <Text className="flex-1 text-sm leading-relaxed text-white/95">{h}</Text>
              </View>
            ))}
          </View>
          <View className="self-start rounded-lg bg-white/20 px-4 py-2">
            <Text className="text-sm font-medium text-white">Ler Resumo Completo →</Text>
          </View>
        </Pressable>
        {!isRead && (
          <View className="px-5 pb-4">
            <Pressable
              onPress={() => {
                setIsRead(true);
                setIsMinimized(true);
              }}
              className="min-h-11 w-full items-center justify-center rounded-lg border border-white/20 bg-white/15 py-2.5"
            >
              <Text className="text-sm font-medium text-white">Marcar como lido</Text>
            </Pressable>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}
