// Para testar no celular físico, troque pelo IP da sua máquina na rede local.
// Exemplo: http://192.168.1.100:8000
// Para produção, defina EXPO_PUBLIC_API_URL no arquivo .env

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';