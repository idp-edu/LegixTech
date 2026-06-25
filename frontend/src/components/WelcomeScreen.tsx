import { Fingerprint, Globe, Scale, UserCircle, Mail, Lock, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WelcomeScreenProps {
  loading?: boolean;
  onLogin: (
    type: 'google' | 'biometric' | 'guest' | 'password' | 'register',
    credentials?: { email: string; password: string; name?: string },
  ) => void;
}

export function WelcomeScreen({ onLogin, loading = false }: WelcomeScreenProps) {
  const [mode, setMode] = useState<'options' | 'login' | 'register'>('options');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = () => {
    setFormError('');

    if (mode === 'register') {
      if (!name.trim() || name.trim().length < 2) {
        setFormError('Nome deve ter pelo menos 2 caracteres.');
        return;
      }
      if (!isValidEmail(email)) {
        setFormError('Digite um e-mail válido.');
        return;
      }
      if (password.length < 6) {
        setFormError('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
      onLogin('register', { email, password, name });
      return;
    }

    if (mode === 'login') {
      if (!isValidEmail(email)) {
        setFormError('Digite um e-mail válido.');
        return;
      }
      if (!password) {
        setFormError('Digite sua senha.');
        return;
      }
      onLogin('password', { email, password });
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setFormError('');
  };

  const ErrorBox = () =>
    formError ? (
      <View style={{ backgroundColor: '#FEE2E2', borderRadius: 8, padding: 12 }}>
        <Text style={{ color: '#991B1B', fontSize: 13 }}>{formError}</Text>
      </View>
    ) : null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingVertical: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View className="mb-10 items-center">
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

          {/* Tela de opções */}
          {mode === 'options' && (
            <View className="w-full max-w-sm gap-4">
              <Pressable
                onPress={() => { resetForm(); setMode('login'); }}
                className="min-h-14 w-full flex-row items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 active:opacity-80"
              >
                <Mail size={22} color="white" />
                <Text className="font-semibold text-white">Entrar com e-mail</Text>
              </Pressable>

              <Pressable
                onPress={() => { resetForm(); setMode('register'); }}
                className="min-h-14 w-full flex-row items-center justify-center gap-3 rounded-xl border-2 border-primary bg-card px-6 py-4 active:opacity-80"
              >
                <User size={22} color="#1e40af" />
                <Text className="font-semibold text-primary">Criar conta</Text>
              </Pressable>

              <Pressable
                onPress={() => !loading && onLogin('google')}
                className="min-h-14 w-full flex-row items-center justify-center gap-3 rounded-xl border-2 border-border bg-card px-6 py-4 active:border-primary"
                disabled={loading}
              >
                <Globe size={22} color="#1e40af" />
                <Text className="font-medium text-foreground">Entrar com Google</Text>
              </Pressable>

              {/* ✅ Biometria oculta no web — AsyncStorage não funciona no browser */}
              {Platform.OS !== 'web' && (
                <Pressable
                  onPress={() => onLogin('biometric')}
                  className="min-h-14 w-full flex-row items-center justify-center gap-3 rounded-xl border-2 border-border bg-card px-6 py-4 active:border-primary"
                >
                  <Fingerprint size={22} color="#1e40af" />
                  <Text className="font-medium text-foreground">Entrar com Biometria</Text>
                </Pressable>
              )}

              <Pressable
                onPress={() => onLogin('guest')}
                className="min-h-14 w-full flex-row items-center justify-center gap-3 rounded-xl bg-surface px-6 py-4"
              >
                <UserCircle size={22} color="#6b7280" />
                <Text className="font-medium text-muted-foreground">Entrar como Visitante</Text>
              </Pressable>

              <View className="rounded-lg border border-warning bg-warning-light p-4">
                <Text className="text-xs leading-relaxed text-warning">
                  Algumas funções desabilitadas em modo visitante
                </Text>
              </View>
            </View>
          )}

          {/* Formulário de login */}
          {mode === 'login' && (
            <View className="w-full max-w-sm gap-4">
              <Text className="text-center text-2xl font-bold text-foreground">Entrar</Text>

              <View className="gap-1">
                <Text className="text-sm font-medium text-foreground">E-mail</Text>
                <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                  <Mail size={18} color="#6b7280" />
                  <TextInput
                    className="flex-1 text-base text-foreground"
                    placeholder="seu@email.com"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={(v) => { setEmail(v); setFormError(''); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View className="gap-1">
                <Text className="text-sm font-medium text-foreground">Senha</Text>
                <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                  <Lock size={18} color="#6b7280" />
                  <TextInput
                    className="flex-1 text-base text-foreground"
                    placeholder="••••••••"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={(v) => { setPassword(v); setFormError(''); }}
                    secureTextEntry
                  />
                </View>
              </View>

              <ErrorBox />

              <Pressable
                onPress={handleSubmit}
                disabled={loading || !email || !password}
                className="min-h-14 w-full items-center justify-center rounded-xl bg-primary px-6 py-4 active:opacity-80"
                style={{ opacity: loading || !email || !password ? 0.6 : 1 }}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-semibold text-white">Entrar</Text>
                )}
              </Pressable>

              <Pressable onPress={() => { resetForm(); setMode('options'); }}>
                <Text className="text-center text-sm text-muted-foreground">← Voltar</Text>
              </Pressable>

              <Pressable onPress={() => { resetForm(); setMode('register'); }}>
                <Text className="text-center text-sm text-muted-foreground">
                  Não tem conta?{' '}
                  <Text className="font-semibold text-primary">Criar conta</Text>
                </Text>
              </Pressable>
            </View>
          )}

          {/* Formulário de cadastro */}
          {mode === 'register' && (
            <View className="w-full max-w-sm gap-4">
              <Text className="text-center text-2xl font-bold text-foreground">Criar conta</Text>

              <View className="gap-1">
                <Text className="text-sm font-medium text-foreground">Nome</Text>
                <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                  <User size={18} color="#6b7280" />
                  <TextInput
                    className="flex-1 text-base text-foreground"
                    placeholder="Seu nome"
                    placeholderTextColor="#9ca3af"
                    value={name}
                    onChangeText={(v) => { setName(v); setFormError(''); }}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View className="gap-1">
                <Text className="text-sm font-medium text-foreground">E-mail</Text>
                <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                  <Mail size={18} color="#6b7280" />
                  <TextInput
                    className="flex-1 text-base text-foreground"
                    placeholder="seu@email.com"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={(v) => { setEmail(v); setFormError(''); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View className="gap-1">
                <Text className="text-sm font-medium text-foreground">Senha</Text>
                <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                  <Lock size={18} color="#6b7280" />
                  <TextInput
                    className="flex-1 text-base text-foreground"
                    placeholder="••••••••"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={(v) => { setPassword(v); setFormError(''); }}
                    secureTextEntry
                  />
                </View>
              </View>

              <ErrorBox />

              <Pressable
                onPress={handleSubmit}
                disabled={loading || !name || !email || !password}
                className="min-h-14 w-full items-center justify-center rounded-xl bg-primary px-6 py-4 active:opacity-80"
                style={{ opacity: loading || !name || !email || !password ? 0.6 : 1 }}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-semibold text-white">Criar conta</Text>
                )}
              </Pressable>

              <Pressable onPress={() => { resetForm(); setMode('options'); }}>
                <Text className="text-center text-sm text-muted-foreground">← Voltar</Text>
              </Pressable>

              <Pressable onPress={() => { resetForm(); setMode('login'); }}>
                <Text className="text-center text-sm text-muted-foreground">
                  Já tem conta?{' '}
                  <Text className="font-semibold text-primary">Entrar</Text>
                </Text>
              </Pressable>
            </View>
          )}

          {/* Termos */}
          {mode === 'options' && (
            <View className="mt-10 items-center">
              <Text className="text-center text-sm text-muted-foreground">
                Ao continuar, você concorda com nossos{'\n'}
                <Text className="text-primary underline">Termos de Uso</Text> e{' '}
                <Text className="text-primary underline">Política de Privacidade</Text>
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}