import { Fingerprint, Globe, Scale, UserCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WelcomeScreenProps {
  onLogin: (type: 'google' | 'biometric' | 'guest') => void;
}

export function WelcomeScreen({ onLogin }: WelcomeScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingVertical: 32,
        }}
      >
        <View className="mb-12 items-center">
          <View className="mb-6 h-24 w-24 overflow-hidden rounded-3xl">
            <LinearGradient
              colors={['#1e40af', '#1e3a8a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <Scale size={48} color="white" />
            </LinearGradient>
          </View>

          <Text className="mb-2 text-center font-display text-4xl font-bold text-foreground">
            LegixTech
          </Text>
          <Text className="text-center text-muted-foreground">
            Monitoramento Legislativo Simplificado
          </Text>
        </View>

        <View className="w-full max-w-sm gap-4">
          <Pressable
            onPress={() => onLogin('google')}
            className="min-h-14 w-full flex-row items-center justify-center gap-3 rounded-xl border-2 border-border bg-card px-6 py-4 active:border-primary"
          >
            <Globe size={24} color="#1e40af" />
            <Text className="font-medium text-foreground">Entrar com Google</Text>
          </Pressable>

          <Pressable
            onPress={() => onLogin('biometric')}
            className="min-h-14 w-full flex-row items-center justify-center gap-3 rounded-xl border-2 border-border bg-card px-6 py-4 active:border-primary"
          >
            <Fingerprint size={24} color="#1e40af" />
            <Text className="font-medium text-foreground">Entrar com Biometria</Text>
          </Pressable>

          <Pressable
            onPress={() => onLogin('guest')}
            className="min-h-14 w-full flex-row items-center justify-center gap-3 rounded-xl bg-surface px-6 py-4"
          >
            <UserCircle size={24} color="#6b7280" />
            <Text className="font-medium text-muted-foreground">Entrar como Visitante</Text>
          </Pressable>

          <View className="rounded-lg border border-warning bg-warning-light p-4">
            <Text className="text-xs leading-relaxed text-warning">
              Algumas funções desabilitadas em modo visitante
            </Text>
          </View>
        </View>

        <View className="mt-12 items-center">
          <Text className="text-center text-sm text-muted-foreground">
            Ao continuar, você concorda com nossos{'\n'}
            <Text className="text-primary underline">Termos de Uso</Text> e{' '}
            <Text className="text-primary underline">Política de Privacidade</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}