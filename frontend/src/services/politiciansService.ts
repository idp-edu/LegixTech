import { api } from './api';

export interface FollowedPolitician {
  id: number;
  user_id: number;
  politician_id: number;
  created_at: string;
  politician_name: string | null;
  politician_party: string | null;
  politician_state: string | null;
  politician_photo_url: string | null;
}

async function request<T>(path: string): Promise<T> {
  return api.get<T>(path);
}

export const politiciansService = {
  getSeguindo: () => {
    return request<FollowedPolitician[]>('/seguindo/');
  },

  seguir: (politicianId: number) => {
    return api.post<FollowedPolitician>(`/seguindo/${politicianId}`);
  },

  deixarDeSeguir: (politicianId: number) => {
    return api.delete(`/seguindo/${politicianId}`);
  },
};