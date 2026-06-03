import {
  Bell,
  BellOff,
  Bookmark,
  ChevronRight,
  FileText,
  HelpCircle,
  LogOut,
  Settings,
  User,
  Users,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ProjectStatus } from '@/types/project';

import { StatusBadge } from './StatusBadge';

interface ProfileScreenProps {
  onLogout?: () => void;
  onRestartTutorial?: () => void;
  onNavigateToSaved?: () => void;
  savedProjects?: Array<{ id: string; title: string; status: ProjectStatus }>;
  followedPoliticians?: Array<{ id: string; name: string; party: string; focus: string }>;
}

export function ProfileScreen({
  onLogout,
  onRestartTutorial,
  onNavigateToSaved,
  savedProjects = [],
  followedPoliticians = [],
}: ProfileScreenProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSavedDetails, setShowSavedDetails] = useState(false);
  const [showFollowingDetails, setShowFollowingDetails] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    savedProjects: true,
    interests: true,
    dailyDigest: false,
  });

  const menuItems = [
    {
      icon: Bookmark,
      label: 'Salvos',
      description: 'Ver projetos salvos',
      onClick: () => setShowSavedDetails(!showSavedDetails),
      badge: savedProjects.length,
    },
    {
      icon: Users,
      label: 'Seguindo',
      description: 'Políticos que você segue',
      onClick: () => setShowFollowingDetails(!showFollowingDetails),
      badge: followedPoliticians.length,
    },
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
    <View className="flex-1 bg-background">
      <LinearGradient colors={['#1e40af', '#1e3a8a']} style={{ paddingHorizontal: 16, paddingVertical: 32 }}>
        <SafeAreaView edges={['top']}>
          <View className="flex-row items-center gap-4">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <Text className="font-display text-2xl font-bold text-white">JD</Text>
            </View>
            <View>
              <Text className="mb-1 font-display text-xl font-bold text-white">John Doe</Text>
              <Text className="text-sm text-white/90">john.doe@example.com</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 96, gap: 8 }}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <View key={index}>
              <Pressable
                onPress={item.onClick}
                className="min-h-[68px] flex-row items-center gap-4 rounded-lg border border-border bg-card p-4"
              >
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
                  <Icon size={20} color="#fff" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-medium text-foreground">{item.label}</Text>
                    {item.badge !== undefined && (
                      <View className="rounded-full bg-primary px-2 py-0.5">
                        <Text className="text-xs font-bold text-primary-foreground">{item.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-sm text-muted-foreground">{item.description}</Text>
                </View>
                <ChevronRight size={20} color="#6b7280" />
              </Pressable>

              {item.label === 'Salvos' && showSavedDetails && (
                <View className="mt-2 gap-2 rounded-lg border border-border bg-surface p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-display font-bold text-foreground">
                      Projetos Salvos ({savedProjects.length})
                    </Text>
                    {onNavigateToSaved && (
                      <Pressable onPress={onNavigateToSaved}>
                        <Text className="text-sm font-medium text-primary">Ver todos</Text>
                      </Pressable>
                    )}
                  </View>
                  {savedProjects.map((p) => (
                    <View key={p.id} className="rounded-lg border border-border bg-card p-3">
                      <Text className="mb-2 text-sm font-medium text-foreground">{p.title}</Text>
                      <StatusBadge status={p.status} size="sm" />
                    </View>
                  ))}
                </View>
              )}

              {item.label === 'Seguindo' && showFollowingDetails && (
                <View className="mt-2 gap-2 rounded-lg border border-border bg-surface p-4">
                  <Text className="font-display font-bold text-foreground">
                    Seguindo ({followedPoliticians.length} Políticos)
                  </Text>
                  {followedPoliticians.map((p) => (
                    <View key={p.id} className="flex-row gap-3 rounded-lg border border-border bg-card p-3">
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
                        <Text className="text-sm font-bold text-primary-foreground">
                          {p.name.split(' ')[0][0]}
                          {p.name.split(' ')[1]?.[0] ?? ''}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-foreground">{p.name}</Text>
                        <Text className="text-xs text-muted-foreground">{p.party}</Text>
                        <Text className="text-xs text-muted-foreground">Foco: {p.focus}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {item.label === 'Notificações' && showNotifications && (
                <View className="mt-2 gap-4 rounded-lg border border-border bg-surface p-4">
                  <Text className="font-medium text-foreground">Configurações de Notificação</Text>
                  {[
                    { key: 'savedProjects' as const, title: 'Projetos Salvos', desc: 'Notificar quando projeto salvo tiver atualização' },
                    { key: 'interests' as const, title: 'Temas de Interesse', desc: 'Notificar sobre temas favoritos' },
                    { key: 'dailyDigest' as const, title: 'Resumo Diário', desc: 'Receber resumo todo dia pela manhã' },
                  ].map(({ key, title, desc }) => (
                    <View key={key} className="flex-row items-center justify-between min-h-11">
                      <View className="flex-1 pr-4">
                        <Text className="font-medium text-foreground">{title}</Text>
                        <Text className="text-sm text-muted-foreground">{desc}</Text>
                      </View>
                      <Switch
                        value={notificationSettings[key]}
                        onValueChange={(v) => setNotificationSettings((prev) => ({ ...prev, [key]: v }))}
                        trackColor={{ false: '#f3f4f6', true: '#1e40af' }}
                      />
                    </View>
                  ))}
                  <View className="gap-2">
                    <Text className="font-medium text-foreground">Histórico de Notificações</Text>
                    <View className="items-center py-8">
                      <BellOff size={48} color="#6b7280" />
                      <Text className="text-muted-foreground">Nenhuma notificação ainda.</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        <Pressable
          onPress={onLogout}
          className="mt-6 min-h-[68px] flex-row items-center gap-4 rounded-lg border border-border bg-card p-4"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-error-light">
            <LogOut size={20} color="#ef4444" />
          </View>
          <View className="flex-1">
            <Text className="font-medium text-error">Sair da Conta</Text>
            <Text className="text-sm text-muted-foreground">Encerrar sua sessão</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}
