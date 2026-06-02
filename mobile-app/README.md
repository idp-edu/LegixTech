# LegixTech — React Native (Expo)

Monitoramento legislativo em React Native com **Expo Router** e **NativeWind**.

## Executar

```bash
cd mobile-app
npm install
npx expo start
```

- Pressione `a` para Android ou `i` para iOS no terminal do Expo.
- Escaneie o QR code com o app **Expo Go** no celular.

## Estrutura

- `src/app/` — rotas (Expo Router): welcome, tabs, detalhes de projeto/politician
- `src/components/` — UI LegixTech (NativeWind + lucide-react-native)
- `src/data/` — mocks e mapeamento ODS
- `src/context/` — estado global (auth, salvos, tema, overlays)

## Stack

- Expo SDK 55
- React Native 0.83
- NativeWind 4 + Tailwind CSS 3
- expo-router, expo-font (Fraunces + Manrope)
