import { API_URL } from '@/config/env';
import { getToken } from './storage';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
  auth?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, auth = true } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const authToken = token || (auth ? await getToken() : null);

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!response.ok) {
    const errorPayload = isJson ? await response.json().catch(() => null) : null;
    const message = errorPayload?.detail || errorPayload?.message || `Erro HTTP ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (isJson) {
    return (await response.json()) as T;
  }

  return undefined as T;
}

export const api = {
  get: <T>(path: string, token?: string, auth = true) =>
    request<T>(path, { method: 'GET', token, auth }),

  post: <T>(path: string, body?: unknown, token?: string, auth = true) =>
    request<T>(path, { method: 'POST', body, token, auth }),

  put: <T>(path: string, body?: unknown, token?: string, auth = true) =>
    request<T>(path, { method: 'PUT', body, token, auth }),

  patch: <T>(path: string, body?: unknown, token?: string, auth = true) =>
    request<T>(path, { method: 'PATCH', body, token, auth }),

  delete: <T>(path: string, token?: string, auth = true) =>
    request<T>(path, { method: 'DELETE', token, auth }),
};

export { API_URL };