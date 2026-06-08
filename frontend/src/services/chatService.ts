import { api } from './api';

export interface ChatRequest {
  mensagem: string;
  contexto_projeto?: string | null;
}

export interface ChatResponse {
  resposta: string;
}

export const chatService = {
  sendMessage: (mensagem: string, contexto_projeto?: string | null) => {
    return api.post<ChatResponse>('/chat/', {
      mensagem,
      contexto_projeto: contexto_projeto ?? null,
    });
  },
};