import { api } from './api';

export interface ChatRequest {
  mensagem: string;
  contexto_projeto?: string | null;
}

export interface ChatResponse {
  resposta: string;
}

export const chatService = {
  sendMessage: async (
    mensagem: string,
    contexto_projeto?: string | null,
  ): Promise<ChatResponse> => {
    try {
      const response = await api.post<ChatResponse>('/chat/', {
        mensagem,
        contexto_projeto: contexto_projeto ?? null,
      });
      return response;
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      if (status === 422) {
        throw new Error('Mensagem inválida. Tente reformular.');
      }
      if (status >= 500) {
        throw new Error('O servidor está indisponível. Tente mais tarde.');
      }

      throw new Error(
        'Não foi possível enviar a mensagem. Verifique sua conexão.',
      );
    }
  },
};