import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Story {
  id: string;
  title: string;
  content: string;
  category: string;
}

const mockStories: Story[] = [
  {
    id: '1',
    title: 'Lei de Acessibilidade Aprovada',
    content:
      'O Senado aprovou hoje a Lei de Acessibilidade e Custo da Saúde, que expande a cobertura de saúde para comunidades carentes.',
    category: 'Saúde',
  },
  {
    id: '2',
    title: 'Energia Limpa em Votação',
    content:
      'A Lei de Investimento em Energia Limpa será votada amanhã na Câmara. A proposta prevê créditos fiscais de R$ 25 bilhões.',
    category: 'Meio Ambiente',
  },
  {
    id: '3',
    title: 'Privacidade Digital em Análise',
    content:
      'A Lei de Proteção da Privacidade Digital está sendo analisada nas comissões técnicas.',
    category: 'Tecnologia',
  },
  {
    id: '4',
    title: 'Educação Pública Modernizada',
    content: 'A Lei de Modernização da Educação Pública está em fase de implementação.',
    category: 'Educação',
  },
  {
    id: '5',
    title: 'Apoio a Pequenas Empresas',
    content: 'A Lei de Apoio para Pequenas Empresas prevê subsídios de até R$ 250 mil.',
    category: 'Economia',
  },
];

interface DailyDigestStoriesProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProjects?: () => void;
}

export function DailyDigestStories({ isOpen, onClose, onViewProjects }: DailyDigestStoriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
      setProgress(0);
      return;
    }
    const duration = 5000;
    const interval = 50;
    const increment = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < mockStories.length - 1) {
            setCurrentIndex((i) => i + 1);
            return 0;
          }
          return 100;
        }
        return prev + increment;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  const currentStory = mockStories[currentIndex];
  const isLastStory = currentIndex === mockStories.length - 1;

  return (
    <Modal visible animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-background">
        <SafeAreaView className="flex-1">
          <View className="absolute left-0 right-0 top-0 z-10 flex-row gap-1 p-4">
            {mockStories.map((_, index) => (
              <View key={index} className="h-1 flex-1 overflow-hidden rounded-full bg-black/20">
                <View
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${index < currentIndex ? 100 : index === currentIndex ? progress : 0}%`,
                  }}
                />
              </View>
            ))}
          </View>

          <Pressable onPress={onClose} className="absolute right-4 top-12 z-10 min-h-11 min-w-11 items-center justify-center rounded-full bg-black/30">
            <X size={24} color="white" />
          </Pressable>

          <View className="flex-1 justify-center px-6 py-20">
            <View className="self-start rounded-full bg-primary px-4 py-2">
              <Text className="text-sm font-medium text-primary-foreground">{currentStory.category}</Text>
            </View>
            <Text className="mt-6 font-display text-2xl font-bold leading-tight text-foreground">
              {currentStory.title}
            </Text>
            <Text className="mt-4 text-lg leading-relaxed text-foreground">{currentStory.content}</Text>

            {isLastStory && (
              <View className="mt-8 gap-3">
                <Pressable onPress={onViewProjects} className="min-h-[52px] items-center justify-center rounded-lg bg-primary py-4">
                  <Text className="font-medium text-primary-foreground">Ver projetos em detalhes</Text>
                </Pressable>
                <Pressable onPress={onClose} className="min-h-[52px] items-center justify-center rounded-lg border border-border bg-surface py-4">
                  <Text className="font-medium text-foreground">Fechar</Text>
                </Pressable>
              </View>
            )}
          </View>

          <View className="flex-row justify-between px-4 pb-8">
            <Pressable
              onPress={() => {
                if (currentIndex > 0) {
                  setCurrentIndex((i) => i - 1);
                  setProgress(0);
                }
              }}
              disabled={currentIndex === 0}
              className="min-h-11 min-w-11 items-center justify-center rounded-full bg-muted"
              style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
            >
              <ChevronLeft size={24} color="#1a1a1a" />
            </Pressable>
            <Text className="self-center text-sm font-medium text-muted-foreground">
              {currentIndex + 1} de {mockStories.length}
            </Text>
            <Pressable
              onPress={() => {
                if (!isLastStory) {
                  setCurrentIndex((i) => i + 1);
                  setProgress(0);
                }
              }}
              disabled={isLastStory}
              className="min-h-11 min-w-11 items-center justify-center rounded-full bg-muted"
              style={{ opacity: isLastStory ? 0.3 : 1 }}
            >
              <ChevronRight size={24} color="#1a1a1a" />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
