import { AlertCircle, CheckCircle, Info, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message:   string;
  isVisible: boolean;
  onClose:   () => void;
  duration?: number;
  type?:     ToastType;
}

const TOAST_CONFIG: Record<ToastType, { icon: React.ReactNode; bg: string; border: string }> = {
  success: {
    icon:   <CheckCircle size={20} color="#15803d" />,
    bg:     '#f0fdf4',
    border: '#bbf7d0',
  },
  error: {
    icon:   <AlertCircle size={20} color="#dc2626" />,
    bg:     '#fef2f2',
    border: '#fecaca',
  },
  warning: {
    icon:   <AlertCircle size={20} color="#d97706" />,
    bg:     '#fffbeb',
    border: '#fde68a',
  },
  info: {
    icon:   <Info size={20} color="#2563eb" />,
    bg:     '#eff6ff',
    border: '#bfdbfe',
  },
};

export function Toast({ message, isVisible, onClose, duration = 3000, type = 'success' }: ToastProps) {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const config = TOAST_CONFIG[type];

  return (
    <View className="absolute bottom-24 left-4 right-4 z-50 items-center">
      <View
        style={{ backgroundColor: config.bg, borderColor: config.border }}
        className="w-full max-w-md flex-row items-center gap-3 rounded-lg border px-4 py-3 shadow-lg"
      >
        {config.icon}
        <Text className="flex-1 font-medium text-foreground">{message}</Text>
        <Pressable onPress={onClose} className="min-h-8 min-w-8 items-center justify-center rounded-full">
          <X size={16} color="#6b7280" />
        </Pressable>
      </View>
    </View>
  );
}