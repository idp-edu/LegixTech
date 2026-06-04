import { api } from './api';
import { clearAuthStorage, saveToken, saveUser } from './storage';
import type {
  AuthResponse,
  AuthUser,
  LoginGooglePayload,
  LoginPasswordPayload,
} from '@/types/auth';

async function persistAuth(response: AuthResponse) {
  const token = response.access_token;
  const user = response.user ?? null;

  if (token) {
    await saveToken(token);
  }

  if (user) {
    await saveUser(user);
  }
}

export const authService = {
  async loginWithPassword(payload: LoginPasswordPayload) {
    const response = await api.post<AuthResponse>('/auth/login', payload, undefined, false);
    await persistAuth(response);
    return response;
  },

  async loginWithGoogle(payload: LoginGooglePayload) {
    const response = await api.post<AuthResponse>('/auth/google', payload, undefined, false);
    await persistAuth(response);
    return response;
  },

  async logout() {
    await clearAuthStorage();
  },

  async me(token: string) {
    return api.get<AuthUser>('/auth/me', token);
  },
};