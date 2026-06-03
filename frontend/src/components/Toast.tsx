import { CheckCircle, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <View className="absolute bottom-24 left-4 right-4 z-50 items-center">
      <View className="w-full max-w-md flex-row items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg">
        <CheckCircle size={20} color="#15803d" />
        <Text className="flex-1 font-medium text-foreground">{message}</Text>
        <Pressable onPress={onClose} className="min-h-8 min-w-8 items-center justify-center rounded-full">
          <X size={16} color="#6b7280" />
        </Pressable>
      </View>
    </View>
  );
}
