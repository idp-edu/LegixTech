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
    } catch (err: unknown) {
      // ✅ CORRIGIDO: api.ts lança Error com mensagem string, não objetos com .response
      if (err instanceof Error) {
        const msg = err.message;

        if (msg.includes('Sessão expirada') || msg.includes('401')) {
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        if (msg.includes('422')) {
          throw new Error('Mensagem inválida. Tente reformular.');
        }
        if (msg.includes('500') || msg.includes('503') || msg.includes('indisponível')) {
          throw new Error('O servidor está indisponível. Tente mais tarde.');
        }
        if (msg.includes('conectar ao servidor') || msg.includes('connect')) {
          throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
        }

        throw err;
      }

      throw new Error('Não foi possível enviar a mensagem. Verifique sua conexão.');
    }
  },
};