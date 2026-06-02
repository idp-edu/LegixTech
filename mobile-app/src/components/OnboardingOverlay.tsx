import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

interface OnboardingOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const steps = [
  { id: 1, title: 'Pesquise Projetos', description: 'Pesquise projetos de lei por tema ou palavra-chave' },
  { id: 2, title: 'Navegue pelo App', description: 'Navegue entre Home, Busca, Salvos e Perfil' },
  { id: 3, title: 'Salve Projetos', description: 'Salve projetos para acompanhar de perto' },
];

export function OnboardingOverlay({ isVisible, onComplete, onSkip }: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isVisible) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) onComplete();
    else setCurrentStep((p) => p + 1);
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onSkip}>
      <View className="flex-1 justify-center bg-black/80 px-6">
        <View className="rounded-2xl border-2 border-primary bg-card p-6">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row gap-2">
              {steps.map((_, index) => (
                <View
                  key={index}
                  className="h-1.5 rounded-full"
                  style={{
                    width: index === currentStep ? 32 : 8,
                    backgroundColor: index <= currentStep ? '#1e40af' : '#f3f4f6',
                  }}
                />
              ))}
            </View>
            <Pressable onPress={onSkip} className="min-h-11 min-w-11 items-center justify-center">
              <X size={20} color="#1a1a1a" />
            </Pressable>
          </View>

          <Text className="mb-2 font-display text-lg font-bold text-foreground">{step.title}</Text>
          <Text className="mb-6 leading-relaxed text-muted-foreground">{step.description}</Text>

          <View className="flex-row gap-3">
            <Pressable onPress={onSkip} className="min-h-11 flex-1 items-center justify-center rounded-lg border border-border">
              <Text className="font-medium text-muted-foreground">Pular Tutorial</Text>
            </Pressable>
            <Pressable onPress={handleNext} className="min-h-11 flex-1 items-center justify-center rounded-lg bg-primary">
              <Text className="font-medium text-primary-foreground">{isLastStep ? 'Concluir' : 'Entendi'}</Text>
            </Pressable>
          </View>

          {isLastStep && (
            <View className="mt-4 rounded-lg border border-success bg-success-light p-4">
              <Text className="text-center text-sm text-success">
                Você está pronto! Tutorial disponível em Perfil → Ajuda.
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
