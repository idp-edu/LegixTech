import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api } from '@/services/api';

interface Story {
  id: string;
  titulo: string;
  ementa: string;
  situacao: string;
  tipo: string;
  url_camara: string;
}

const mockStories: Story[] = [
  {
    id: '1',
    titulo: 'PL 1234/2024',
    ementa: 'Dispõe sobre medidas de acessibilidade e inclusão social em espaços públicos.',
    situacao: 'Em tramitação',
    tipo: 'PL',
    url_camara: 'https://www.camara.leg.br',
  },
  {
    id: '2',
    titulo: 'PEC 45/2024',
    ementa: 'Proposta de reforma tributária para simplificação do sistema de impostos.',
    situacao: 'Aguardando votação',
    tipo: 'PEC',
    url_camara: 'https://www.camara.leg.br',
  },
  {
    id: '3',
    titulo: 'MPV 1250/2024',
    ementa: 'Medida provisória sobre investimentos em energia renovável e sustentabilidade.',
    situacao: 'Aprovado',
    tipo: 'MPV',
    url_camara: 'https://www.camara.leg.br',
  },
];

interface DailyDigestStoriesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyDigestStories({ isOpen, onClose }: DailyDigestStoriesProps) {
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
      return;
    }

    setIsLoading(true);
    api
      .get<{ proposicoes: Story[] }>('/daily-summary/')
      .then((data) => {
        if (data.proposicoes?.length > 0) {
          setStories(data.proposicoes);
          setCurrentIndex(0);
        } else {
          setStories(mockStories);
        }
      })
      .catch(() => setStories(mockStories))
      .finally(() => setIsLoading(false));
  }, [isOpen]);

  const irParaAnterior = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const irParaProximo = () => {
    if (currentIndex < stories.length - 1) setCurrentIndex((i) => i + 1);
  };

  const abrirNaCamara = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) await Linking.openURL(url);
    } catch {
      // ignora erro silenciosamente
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <Modal visible animationType="fade" onRequestClose={onClose}>
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator size="large" color="#1e40af" />
          <Text className="mt-4 text-muted-foreground">Carregando destaques do dia...</Text>
        </View>
      </Modal>
    );
  }

  const story = stories[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === stories.length - 1;

  // Cor do badge de situação
  const situacaoCor = () => {
    const s = story.situacao.toLowerCase();
    if (s.includes('aprovad') || s.includes('sancion')) return 'bg-green-600';
    if (s.includes('vota') || s.includes('pauta')) return 'bg-orange-500';
    return 'bg-primary';
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-background">
        <SafeAreaView className="flex-1">

          {/* Header: contador + fechar */}
          <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
            <Text className="text-sm font-medium text-muted-foreground">
              {currentIndex + 1} de {stories.length}
            </Text>
            <Pressable
              onPress={onClose}
              className="min-h-11 min-w-11 items-center justify-center rounded-full bg-muted"
            >
              <X size={20} color="#6b7280" />
            </Pressable>
          </View>

          {/* Barra de progresso estática (sem animação automática) */}
          <View className="flex-row gap-1 px-4 pb-6">
            {stories.map((_, index) => (
              <View
                key={index}
                className={`h-1 flex-1 rounded-full ${index <= currentIndex ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </View>

          {/* Conteúdo do card */}
          <View className="flex-1 px-6">
            <View className={`self-start rounded-full px-3 py-1 ${situacaoCor()}`}>
              <Text className="text-xs font-semibold text-white">{story.situacao}</Text>
            </View>

            <Text className="mt-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {story.tipo}
            </Text>

            <Text className="mt-3 text-xl font-bold leading-snug text-foreground">
              {story.titulo}
            </Text>

            <Text className="mt-4 text-base leading-relaxed text-muted-foreground">
              {story.ementa}
            </Text>

            {/* Botão Saiba mais */}
            <Pressable
              onPress={() => abrirNaCamara(story.url_camara)}
              className="mt-6 flex-row items-center gap-2 self-start rounded-lg border border-primary px-4 py-3"
            >
              <ExternalLink size={16} color="#1e40af" />
              <Text className="text-sm font-semibold text-primary">Saiba mais na Câmara</Text>
            </Pressable>
          </View>

          {/* Navegação: setas */}
          <View className="flex-row items-center justify-between px-4 pb-8 pt-4">
            <Pressable
              onPress={irParaAnterior}
              disabled={isFirst}
              className="min-h-12 min-w-12 items-center justify-center rounded-full bg-muted"
              style={{ opacity: isFirst ? 0.3 : 1 }}
            >
              <ChevronLeft size={24} color="#1a1a1a" />
            </Pressable>

            <Text className="text-sm text-muted-foreground">
              {isLast ? 'Último destaque' : 'Próximo →'}
            </Text>

            <Pressable
              onPress={irParaProximo}
              disabled={isLast}
              className="min-h-12 min-w-12 items-center justify-center rounded-full bg-muted"
              style={{ opacity: isLast ? 0.3 : 1 }}
            >
              <ChevronRight size={24} color="#1a1a1a" />
            </Pressable>
          </View>

        </SafeAreaView>
      </View>
    </Modal>
  );
}