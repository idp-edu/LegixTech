import { Calendar, ChevronDown, RotateCcw, TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

interface DailySummary {
  data: string;
  destaques: string[];
}

interface DailyDigestCardProps {
  onClick: () => void;
  dailySummary?: DailySummary;
}

const FALLBACK_HIGHLIGHTS = [
  'Projetos de saúde e educação em tramitação',
  'Comissões analisam propostas de reforma',
  'Votações previstas para esta semana',
];

export function DailyDigestCard({ onClick, dailySummary }: DailyDigestCardProps) {
  const [isRead, setIsRead] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { colors } = useTheme();

  const today = dailySummary?.data ?? new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const highlights = dailySummary?.destaques?.length
    ? dailySummary.destaques
    : FALLBACK_HIGHLIGHTS;

  if (isMinimized && isRead) {
    return (
      <Pressable
        onPress={() => setIsMinimized(false)}
        style={{
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          padding: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Calendar size={18} color={colors.textMuted} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text }}>Resumo do dia — Lido</Text>
            <Text style={{ fontSize: 12, textTransform: 'capitalize', color: colors.textMuted }}>{today}</Text>
          </View>
          <Pressable
            onPress={() => { setIsRead(false); setIsMinimized(false); }}
            style={{ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' }}
          >
            <RotateCcw size={18} color={colors.textMuted} />
          </Pressable>
          <ChevronDown size={20} color={colors.textMuted} />
        </View>
      </Pressable>
    );
  }

  return (
    <View style={{ width: '100%', borderRadius: 16, overflow: 'hidden' }}>
      <LinearGradient colors={['#1e40af', '#1e3a8a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Pressable onPress={onClick} style={{ width: '100%', padding: 20 }}>
          <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Calendar size={20} color="white" />
            <Text style={{ fontSize: 14, textTransform: 'capitalize', color: 'rgba(255,255,255,0.9)' }}>
              {today}
            </Text>
          </View>
          <Text style={{ marginBottom: 12, fontSize: 18, fontWeight: 'bold', color: 'white' }}>
            Resumo do Dia
          </Text>
          <View style={{ marginBottom: 16, gap: 8 }}>
            {highlights.map((h, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <TrendingUp size={16} color="rgba(255,255,255,0.8)" style={{ marginTop: 2 }} />
                <Text style={{ flex: 1, fontSize: 14, lineHeight: 20, color: 'rgba(255,255,255,0.95)' }}>
                  {h}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ alignSelf: 'flex-start', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>Ler Resumo Completo →</Text>
          </View>
        </Pressable>
        {!isRead && (
          <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
            <Pressable
              onPress={() => { setIsRead(true); setIsMinimized(true); }}
              style={{
                minHeight: 44,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.15)',
                paddingVertical: 10,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>Marcar como lido</Text>
            </Pressable>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}
