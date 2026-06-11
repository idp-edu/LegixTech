import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthUser } from '@/types/auth';

const TOKEN_KEY = 'legixtech:token';
const USER_KEY = 'legixtech:user';
const SAVED_PROJECTS_KEY = 'legixtech:saved_projects';
const RECENT_PROJECTS_KEY = 'legixtech:recent_projects';
const SAVED_POLITICIANS_KEY = 'legixtech:saved_politicians';

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function removeToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function saveUser(user: AuthUser | null) {
  if (user) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem(USER_KEY);
  }
}

export async function getUser<T = AuthUser>() {
  const value = await AsyncStorage.getItem(USER_KEY);
  return value ? (JSON.parse(value) as T) : null;
}

export async function removeUser() {
  await AsyncStorage.removeItem(USER_KEY);
}

export async function clearAuthStorage() {
  await Promise.all([removeToken(), removeUser()]);
}

export async function getSavedProjects(): Promise<string[]> {
  const v = await AsyncStorage.getItem(SAVED_PROJECTS_KEY);
  return v ? JSON.parse(v) : [];
}

export async function saveSavedProjects(ids: string[]) {
  await AsyncStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(ids));
}

export async function getRecentProjects(): Promise<string[]> {
  const v = await AsyncStorage.getItem(RECENT_PROJECTS_KEY);
  return v ? JSON.parse(v) : [];
}

export async function saveRecentProjects(ids: string[]) {
  await AsyncStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(ids));
}

// ── Parlamentares salvos ───────────────────────────────────────────────────
export async function getSavedPoliticians(): Promise<string[]> {
  const v = await AsyncStorage.getItem(SAVED_POLITICIANS_KEY);
  return v ? JSON.parse(v) : [];
}

export async function saveSavedPoliticians(ids: string[]) {
  await AsyncStorage.setItem(SAVED_POLITICIANS_KEY, JSON.stringify(ids));
}