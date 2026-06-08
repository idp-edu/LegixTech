// UN Sustainable Development Goals (ODS) mapping
// Based on official UN SDG colors

export interface ODS {
  number: number;
  name: string;
  color: string;
  lightColor: string;
}

export const odsData: Record<number, ODS> = {
  1: { number: 1, name: 'Erradicação da Pobreza', color: '#E5243B', lightColor: '#FDEEF0' },
  2: { number: 2, name: 'Fome Zero', color: '#DDA63A', lightColor: '#FEF5E7' },
  3: { number: 3, name: 'Saúde e Bem-Estar', color: '#4C9F38', lightColor: '#E8F5E5' },
  4: { number: 4, name: 'Educação de Qualidade', color: '#C5192D', lightColor: '#FCEEF0' },
  5: { number: 5, name: 'Igualdade de Gênero', color: '#FF3A21', lightColor: '#FFEEE9' },
  6: { number: 6, name: 'Água Potável e Saneamento', color: '#26BDE2', lightColor: '#E9F8FC' },
  7: { number: 7, name: 'Energia Limpa', color: '#FCC30B', lightColor: '#FFF9E5' },
  8: { number: 8, name: 'Trabalho Decente', color: '#A21942', lightColor: '#F7E9EE' },
  9: { number: 9, name: 'Indústria e Inovação', color: '#FD6925', lightColor: '#FFF0E9' },
  10: { number: 10, name: 'Redução das Desigualdades', color: '#DD1367', lightColor: '#FCEEF5' },
  11: { number: 11, name: 'Cidades Sustentáveis', color: '#FD9D24', lightColor: '#FFF4E6' },
  12: { number: 12, name: 'Consumo Responsável', color: '#BF8B2E', lightColor: '#F9F4E8' },
  13: { number: 13, name: 'Ação Contra a Mudança do Clima', color: '#3F7E44', lightColor: '#E9F2E9' },
  14: { number: 14, name: 'Vida na Água', color: '#0A97D9', lightColor: '#E5F4FB' },
  15: { number: 15, name: 'Vida Terrestre', color: '#56C02B', lightColor: '#EBF8E5' },
  16: { number: 16, name: 'Paz e Justiça', color: '#00689D', lightColor: '#E5F1F7' },
  17: { number: 17, name: 'Parcerias pelas Metas', color: '#19486A', lightColor: '#E6ECF0' },
};

export const themeToODS: Record<string, number> = {
  Saúde: 3,
  Educação: 4,
  Economia: 8,
  'Meio Ambiente': 13,
  Tecnologia: 9,
  Habitação: 11,
  Segurança: 16,
  Energia: 7,
  Água: 6,
  Agricultura: 2,
  Infraestrutura: 9,
  Outro: 17,
};

export function getODSForTheme(theme: string): ODS | null {
  const odsNumber = themeToODS[theme];
  return odsNumber ? odsData[odsNumber] : null;
}

export function getODSColor(theme: string, light = false): string {
  const ods = getODSForTheme(theme);
  if (!ods) return light ? '#f9fafb' : '#6b7280';
  return light ? ods.lightColor : ods.color;
}

export function getODSByNumber(number: number): ODS | null {
  return odsData[number] ?? null;
}

export function getODSColorByNumber(number: number, light = false): string {
  const ods = getODSByNumber(number);
  if (!ods) return light ? '#f9fafb' : '#6b7280';
  return light ? ods.lightColor : ods.color;
}