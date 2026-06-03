import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'legixtech:token';
const USER_KEY = 'legixtech:user';

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function removeToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function saveUser(user: unknown) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser<T = unknown>() {
  const value = await AsyncStorage.getItem(USER_KEY);
  return value ? (JSON.parse(value) as T) : null;
}

export async function removeUser() {
  await AsyncStorage.removeItem(USER_KEY);
}

export async function clearAuthStorage() {
  await Promise.all([removeToken(), removeUser()]);
}