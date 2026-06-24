import {
  Bell,
  BellOff,
  ChevronRight,
  FileText,
  HelpCircle,
  LogOut,
  Pencil,
  Settings,
  User,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/useTheme';
import { useNotifications } from '@/hooks/useNotifications';
import { authService } from '@/services/authService';

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [notificationSettings, setNotificationSettings] = useState<Record<NotificationKey, boolean>>({
    savedProjects: true,
    interests: true,
    dailyDigest: false,
  });
  const { colors } = useTheme();
  const { user, setUser, isAuthenticated } = useApp();
  const { notifications, unreadCount, markAsRead, remove: removeNotification } = useNotifications(isAuthenticated);

  const displayName =
    user?.name && user.name.trim().length > 0 ? user.name : 'Usuário';
  const displayEmail = user?.email ?? 'E-mail não informado';
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0]?.toUpperCase() ?? '')
    .join('');

  const openEditModal = () => {
    setEditName(user?.name ?? '');
    setSaveError('');
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    const trimmed = editName.trim();
    if (trimmed.length < 2) {
      setSaveError('Nome deve ter pelo menos 2 caracteres.');
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      const updated = await authService.updateProfile({ name: trimmed });
      await setUser({ ...user!, ...updated });
      setShowEditModal(false);
    } catch (e: any) {
      setSaveError(e?.message ?? 'Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const menuItems: Array<{
    icon: typeof User;
    label: string;
    description: string;
    onClick?: () => void;
  }> = [
    {
      icon: User,
      label: 'Configurações da Conta',
      description: 'Edite seu nome de exibição',
      onClick: openEditModal,
    },
    {
      icon: Bell,
      label: 'Notificações',
      description: unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Configure alertas',
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

      {/* ── Modal de edição de nome ───────────────────────────────────────── */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <View
            style={{
              width: '100%',
              borderRadius: 12,
              backgroundColor: colors.surface,
              padding: 24,
              gap: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
              Editar Perfil
            </Text>

            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 14, color: colors.textMuted }}>Nome de exibição</Text>
              <TextInput
                value={editName}
                onChangeText={(t) => { setEditName(t); setSaveError(''); }}
                placeholder="Seu nome"
                placeholderTextColor={colors.textMuted}
                style={{
                  borderWidth: 1,
                  borderColor: saveError ? '#EF4444' : colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.text,
                  fontSize: 16,
                  minHeight: 44,
                }}
              />
              {saveError ? (
                <Text style={{ fontSize: 13, color: '#EF4444' }}>{saveError}</Text>
              ) : null}
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                onPress={() => setShowEditModal(false)}
                disabled={saving}
                style={{
                  flex: 1,
                  minHeight: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ color: colors.textMuted, fontWeight: '500' }}>Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleSaveProfile}
                disabled={saving}
                style={{
                  flex: 1,
                  minHeight: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  backgroundColor: saving ? colors.border : colors.primary,
                }}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ color: '#fff', fontWeight: '500' }}>Salvar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Header ────────────────────────────────────────────────────────── */}
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
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ marginBottom: 4, fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                  {displayName}
                </Text>
                <Pressable onPress={openEditModal} hitSlop={8}>
                  <Pencil size={16} color="rgba(255,255,255,0.8)" />
                </Pressable>
              </View>
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
                {item.label === 'Notificações' && unreadCount > 0 ? (
                  <View style={{ backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 }}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{unreadCount}</Text>
                  </View>
                ) : null}
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
                  {([
                    { key: 'savedProjects' as NotificationKey, title: 'Projetos Salvos', desc: 'Notificar quando projeto salvo tiver atualização' },
                    { key: 'interests' as NotificationKey, title: 'Temas de Interesse', desc: 'Notificar sobre temas favoritos' },
                    { key: 'dailyDigest' as NotificationKey, title: 'Resumo Diário', desc: 'Receber resumo todo dia pela manhã' },
                  ]).map(({ key, title, desc }) => (
                    <View key={key} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 }}>
                      <View style={{ flex: 1, paddingRight: 16 }}>
                        <Text style={{ fontWeight: '500', color: colors.text }}>{title}</Text>
                        <Text style={{ fontSize: 14, color: colors.textMuted }}>{desc}</Text>
                      </View>
                      <Switch
                        value={notificationSettings[key]}
                        onValueChange={(v) => setNotificationSettings((prev) => ({ ...prev, [key]: v }))}
                        trackColor={{ false: colors.border, true: colors.primary }}
                      />
                    </View>
                  ))}

                  {/* ── Histórico de notificações do backend ─── */}
                  <View style={{ gap: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ fontWeight: '500', color: colors.text }}>Histórico de Notificações</Text>
                      {unreadCount > 0 && (
                        <View style={{ backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 }}>
                          <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{unreadCount}</Text>
                        </View>
                      )}
                    </View>

                    {notifications.length === 0 ? (
                      <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                        <BellOff size={48} color={colors.textMuted} />
                        <Text style={{ color: colors.textMuted }}>Nenhuma notificação ainda.</Text>
                      </View>
                    ) : (
                      notifications.map((n) => (
                        <View
                          key={n.id}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            gap: 12,
                            padding: 12,
                            borderRadius: 8,
                            backgroundColor: n.read ? colors.surface : colors.primary + '18',
                            borderWidth: 1,
                            borderColor: colors.border,
                          }}
                        >
                          <Bell size={16} color={n.read ? colors.textMuted : colors.primary} style={{ marginTop: 2 }} />
                          <View style={{ flex: 1, gap: 4 }}>
                            <Text style={{ fontSize: 14, color: colors.text }}>{n.message}</Text>
                            <Text style={{ fontSize: 12, color: colors.textMuted }}>{n.created_at?.slice(0, 10)}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', gap: 8 }}>
                            {!n.read && (
                              <Pressable onPress={() => markAsRead(n.id)} hitSlop={8}>
                                <Text style={{ fontSize: 12, color: colors.primary }}>Lida</Text>
                              </Pressable>
                            )}
                            <Pressable onPress={() => removeNotification(n.id)} hitSlop={8}>
                              <Text style={{ fontSize: 12, color: '#EF4444' }}>✕</Text>
                            </Pressable>
                          </View>
                        </View>
                      ))
                    )}
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
          <View style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: colors.surface }}>
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