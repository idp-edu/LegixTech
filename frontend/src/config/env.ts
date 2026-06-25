// frontend/src/config/env.ts

// Para desenvolvimento local, crie um arquivo .env na raiz do frontend com:
// EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:8000
// Exemplo: EXPO_PUBLIC_API_URL=http://192.168.1.100:8000

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://legixtech.onrender.com';