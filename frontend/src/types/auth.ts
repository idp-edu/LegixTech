export type AuthMode = 'password' | 'google' | 'guest' | null;

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  photoUrl?: string;
  provider?: 'password' | 'google';
}

export interface LoginPasswordPayload {
  email: string;
  password: string;
}

export interface LoginGooglePayload {
  id_token: string;
  email?: string;
  name?: string;
  photoUrl?: string;
}