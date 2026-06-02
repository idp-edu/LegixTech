import '../global.css';

import {
  Fraunces_400Regular,
  Fraunces_700Bold,
  useFonts as useFraunces,
} from '@expo-google-fonts/fraunces';
import { Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold, useFonts as useManrope } from '@expo-google-fonts/manrope';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppOverlays } from '@/components/AppOverlays';
import { AppProvider, useApp } from '@/context/AppContext';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isDark } = useApp();

  return (
    <View className="flex-1 bg-background" style={isDark ? { backgroundColor: '#0f172a' } : undefined}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="project/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="politician/[id]" options={{ presentation: 'card' }} />
      </Stack>
      <AppOverlays />
    </View>
  );
}

export default function RootLayout() {
  const [frauncesLoaded] = useFraunces({ Fraunces_400Regular, Fraunces_700Bold });
  const [manropeLoaded] = useManrope({ Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold });

  useEffect(() => {
    if (frauncesLoaded && manropeLoaded) SplashScreen.hideAsync();
  }, [frauncesLoaded, manropeLoaded]);

  if (!frauncesLoaded || !manropeLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <RootNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
