import { api } from './api';
import { clearAuthStorage, saveToken, saveUser } from './storage';

export type AuthMode = 'password' | 'google';

export type AuthUser = {
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  photoUrl?: string;
  provider?: AuthMode;
};

export type AuthResponse = {
  access_token: string;
  token_type?: string;
  user?: AuthUser;
};

export type LoginPasswordPayload = {
  email: string;
  password: string;
};

export type LoginGooglePayload = {
  id_token: string;
  email?: string;
  name?: string;
  photoUrl?: string;
};

async function persistAuth(response: AuthResponse) {
  if (response.access_token) {
    await saveToken(response.access_token);
  }

  if (response.user) {
    await saveUser(response.user);
  }
}

export const authService = {
  async loginWithPassword(payload: LoginPasswordPayload) {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    await persistAuth(response);
    return response;
  },

  async loginWithGoogle(payload: LoginGooglePayload) {
    const response = await api.post<AuthResponse>('/auth/google', payload);
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