import {
  Bell,
  BellOff,
  ChevronRight,
  FileText,
  HelpCircle,
  LogOut,
  Settings,
  User,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/useTheme';

interface ProfileScreenProps {
  onLogout?: () => void;
  onRestartTutorial?: () => void;
  onNavigateToSaved?: () => void;
}

type NotificationKey = 'savedProjects' | 'interests' | 'dailyDigest';

export function ProfileScreen({
  onLogout,
  onRestartTutorial,
  onNavigateToSaved,
}: ProfileScreenProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<Record<NotificationKey, boolean>>({
    savedProjects: true,
    interests: true,
    dailyDigest: false,
  });
  const { colors } = useTheme();
  const { user } = useApp();

  const displayName =
    user?.name && user.name.trim().length > 0
      ? user.name
      : 'Usuário';

  const displayEmail = user?.email ?? 'E-mail não informado';

  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0]?.toUpperCase() ?? '')
    .join('');

  const menuItems: Array<{
    icon: typeof User;
    label: string;
    description: string;
    onClick?: () => void;
  }> = [
    { icon: User, label: 'Configurações da Conta', description: 'Gerencie seu perfil' },
    {
      icon: Bell,
      label: 'Notificações',
      description: 'Configure alertas',
      onClick: () => setShowNotifications(!showNotifications),
    },
    { icon: FileText, label: 'Minha Atividade', description: 'Ver histórico' },
    { icon: Settings, label: 'Preferências', description: 'Configurações do app' },
    {
      icon: HelpCircle,
      label: 'Ajuda & Tutorial',
      description: 'Obter assistência',
      onClick: onRestartTutorial,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={['#1e40af', '#1e3a8a']}
        style={{ paddingHorizontal: 16, paddingVertical: 32 }}
      >
        <SafeAreaView edges={['top']}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View
              style={{
                height: 80,
                width: 80,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 40,
                backgroundColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>{initials}</Text>
            </View>
            <View>
              <Text style={{ marginBottom: 4, fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                {displayName}
              </Text>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
                {displayEmail}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 96, gap: 8 }}
      >
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <View key={index}>
              <Pressable
                onPress={item.onClick}
                style={{
                  minHeight: 68,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  padding: 16,
                }}
              >
                <View
                  style={{
                    height: 40,
                    width: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                    backgroundColor: colors.primary,
                  }}
                >
                  <Icon size={20} color="#fff" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '500', color: colors.text }}>{item.label}</Text>
                  <Text style={{ fontSize: 14, color: colors.textMuted }}>{item.description}</Text>
                </View>

                <ChevronRight size={20} color={colors.textMuted} />
              </Pressable>

              {item.label === 'Notificações' && showNotifications && (
                <View
                  style={{
                    marginTop: 8,
                    gap: 16,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    padding: 16,
                  }}
                >
                  <Text style={{ fontWeight: '500', color: colors.text }}>
                    Configurações de Notificação
                  </Text>

                  {[
                    {
                      key: 'savedProjects' as NotificationKey,
                      title: 'Projetos Salvos',
                      desc: 'Notificar quando projeto salvo tiver atualização',
                    },
                    {
                      key: 'interests' as NotificationKey,
                      title: 'Temas de Interesse',
                      desc: 'Notificar sobre temas favoritos',
                    },
                    {
                      key: 'dailyDigest' as NotificationKey,
                      title: 'Resumo Diário',
                      desc: 'Receber resumo todo dia pela manhã',
                    },
                  ].map(({ key, title, desc }) => (
                    <View
                      key={key}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minHeight: 44,
                      }}
                    >
                      <View style={{ flex: 1, paddingRight: 16 }}>
                        <Text style={{ fontWeight: '500', color: colors.text }}>{title}</Text>
                        <Text style={{ fontSize: 14, color: colors.textMuted }}>{desc}</Text>
                      </View>

                      <Switch
                        value={notificationSettings[key]}
                        onValueChange={(v) =>
                          setNotificationSettings((prev) => ({ ...prev, [key]: v }))
                        }
                        trackColor={{ false: colors.border, true: colors.primary }}
                      />
                    </View>
                  ))}

                  <View style={{ gap: 8 }}>
                    <Text style={{ fontWeight: '500', color: colors.text }}>
                      Histórico de Notificações
                    </Text>
                    <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                      <BellOff size={48} color={colors.textMuted} />
                      <Text style={{ color: colors.textMuted }}>Nenhuma notificação ainda.</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        <Pressable
          onPress={onLogout}
          style={{
            marginTop: 24,
            minHeight: 68,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            padding: 16,
          }}
        >
          <View
            style={{
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              backgroundColor: colors.surface,
            }}
          >
            <LogOut size={20} color="#EF4444" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '500', color: '#EF4444' }}>Sair da Conta</Text>
            <Text style={{ fontSize: 14, color: colors.textMuted }}>Encerrar sua sessão</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}