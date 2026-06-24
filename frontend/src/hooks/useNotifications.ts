import { useCallback, useEffect, useState } from 'react';
import { api } from '@/services/api';

export interface Notification {
  id: number;
  message: string;
  read: boolean;
  created_at: string;
}

export function useNotifications(isAuthenticated: boolean) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<Notification[]>('/notificacoes/');
      setNotifications(data ?? []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await api.patch(`/notificacoes/${id}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      // silencia erro
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    try {
      await api.delete(`/notificacoes/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      // silencia erro
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, loading, unreadCount, markAsRead, remove, refresh: fetchNotifications };
}