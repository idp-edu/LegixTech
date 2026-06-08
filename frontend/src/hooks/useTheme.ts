import { Colors } from '@/config/colors';
import { useApp } from '@/context/AppContext';

export function useTheme() {
  const { isDark, toggleTheme } = useApp();
  const colors = isDark ? Colors.dark : Colors.light;

  return { colors, isDark, toggleTheme };
}