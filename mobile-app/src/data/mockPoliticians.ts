export interface Politician {
  id: string;
  name: string;
  party: string;
  state: string;
  house: 'Senado' | 'Câmara';
  photo?: string;
  bio: string;
  stats: {
    totalVotes: number;
    votesInFavor: number;
    votesAgainst: number;
    abstentions: number;
    projectsPresented: number;
    attendance: number;
  };
}

export interface Vote {
  id: string;
  politicianId: string;
  projectId: string;
  projectTitle: string;
  projectDescription: string;
  vote: 'favor' | 'contra' | 'abstencao';
  status: 'active' | 'pending' | 'approved' | 'archived';
  date: string;
  category: string;
}

export const mockPoliticians: Politician[] = [
  {
    id: '1',
    name: 'Maria Silva Santos',
    party: 'PSB',
    state: 'SP',
    house: 'Senado',
    bio: 'Senadora com mais de 15 anos de experiência em políticas públicas de saúde e educação. Defensora do SUS e da educação pública de qualidade.',
    stats: {
      totalVotes: 156,
      votesInFavor: 98,
      votesAgainst: 42,
      abstentions: 16,
      projectsPresented: 12,
      attendance: 87,
    },
  },
  {
    id: '2',
    name: 'João Pedro Oliveira',
    party: 'PSOL',
    state: 'RJ',
    house: 'Câmara',
    bio: 'Deputado federal comprometido com a pauta ambiental e direitos humanos. Autor de importantes projetos de preservação da Amazônia.',
    stats: {
      totalVotes: 203,
      votesInFavor: 145,
      votesAgainst: 38,
      abstentions: 20,
      projectsPresented: 8,
      attendance: 92,
    },
  },
  {
    id: '3',
    name: 'Ana Carolina Ferreira',
    party: 'PT',
    state: 'MG',
    house: 'Senado',
    bio: 'Senadora focada em políticas de combate à pobreza e desenvolvimento regional. Coordenadora da Comissão de Assistência Social.',
    stats: {
      totalVotes: 178,
      votesInFavor: 132,
      votesAgainst: 28,
      abstentions: 18,
      projectsPresented: 15,
      attendance: 89,
    },
  },
  {
    id: '4',
    name: 'Roberto Martinez Souza',
    party: 'PSDB',
    state: 'RS',
    house: 'Câmara',
    bio: 'Deputado federal com atuação destacada em economia e desenvolvimento de pequenas empresas. Ex-empresário e economista.',
    stats: {
      totalVotes: 189,
      votesInFavor: 112,
      votesAgainst: 56,
      abstentions: 21,
      projectsPresented: 10,
      attendance: 85,
    },
  },
  {
    id: '5',
    name: 'Juliana Costa Lima',
    party: 'PDT',
    state: 'BA',
    house: 'Câmara',
    bio: 'Deputada federal dedicada à educação pública e tecnologia. Professora universitária e defensora da inovação no ensino.',
    stats: {
      totalVotes: 167,
      votesInFavor: 124,
      votesAgainst: 31,
      abstentions: 12,
      projectsPresented: 18,
      attendance: 94,
    },
  },
  {
    id: '6',
    name: 'Carlos Eduardo Mendes',
    party: 'PP',
    state: 'PR',
    house: 'Senado',
    bio: 'Senador com forte atuação no agronegócio e infraestrutura rural. Engenheiro agrônomo e produtor rural.',
    stats: {
      totalVotes: 142,
      votesInFavor: 95,
      votesAgainst: 35,
      abstentions: 12,
      projectsPresented: 7,
      attendance: 81,
    },
  },
  {
    id: '7',
    name: 'Beatriz Almeida Rocha',
    party: 'NOVO',
    state: 'SC',
    house: 'Câmara',
    bio: 'Deputada federal focada em desburocratização e modernização do Estado. Advogada especialista em direito administrativo.',
    stats: {
      totalVotes: 134,
      votesInFavor: 78,
      votesAgainst: 42,
      abstentions: 14,
      projectsPresented: 6,
      attendance: 88,
    },
  },
  {
    id: '8',
    name: 'Fernando Henrique Castro',
    party: 'MDB',
    state: 'PE',
    house: 'Senado',
    bio: 'Senador veterano com ampla experiência em relações internacionais e comércio exterior. Ex-embaixador e diplomata.',
    stats: {
      totalVotes: 198,
      votesInFavor: 156,
      votesAgainst: 28,
      abstentions: 14,
      projectsPresented: 22,
      attendance: 90,
    },
  },
];

export const mockVotes: Vote[] = [
  {
    id: '1',
    politicianId: '1',
    projectId: '1',
    projectTitle: 'Lei de Acessibilidade e Custo da Saúde',
    projectDescription: 'Expande a cobertura de saúde para comunidades carentes e estabelece novos centros de saúde',
    vote: 'favor',
    status: 'active',
    date: '10/04/2026',
    category: 'Saúde',
  },
  {
    id: '2',
    politicianId: '1',
    projectId: '2',
    projectTitle: 'Lei de Investimento em Energia Limpa e Criação de Empregos',
    projectDescription: 'Fornece créditos fiscais para energia renovável e cria programas de capacitação profissional',
    vote: 'favor',
    status: 'pending',
    date: '05/04/2026',
    category: 'Meio Ambiente',
  },
  {
    id: '3',
    politicianId: '1',
    projectId: '3',
    projectTitle: 'Lei de Proteção da Privacidade Digital',
    projectDescription: 'Exige consentimento explícito para coleta de dados e estabelece penalidades por vazamentos',
    vote: 'contra',
    status: 'active',
    date: '28/03/2026',
    category: 'Tecnologia',
  },
  {
    id: '4',
    politicianId: '1',
    projectId: '4',
    projectTitle: 'Lei de Modernização e Financiamento da Educação Pública',
    projectDescription: 'Aumenta financiamento para educação básica com foco em programas STEM e salários de professores',
    vote: 'abstencao',
    status: 'approved',
    date: '15/03/2026',
    category: 'Educação',
  },
  {
    id: '5',
    politicianId: '1',
    projectId: '5',
    projectTitle: 'Lei de Apoio e Recuperação para Pequenas Empresas',
    projectDescription: 'Oferece subsídios e empréstimos com juros baixos para pequenas empresas',
    vote: 'favor',
    status: 'active',
    date: '01/03/2026',
    category: 'Economia',
  },
  {
    id: '6',
    politicianId: '2',
    projectId: '2',
    projectTitle: 'Lei de Investimento em Energia Limpa e Criação de Empregos',
    projectDescription: 'Fornece créditos fiscais para energia renovável e cria programas de capacitação profissional',
    vote: 'favor',
    status: 'pending',
    date: '05/04/2026',
    category: 'Meio Ambiente',
  },
  {
    id: '7',
    politicianId: '2',
    projectId: '3',
    projectTitle: 'Lei de Proteção da Privacidade Digital',
    projectDescription: 'Exige consentimento explícito para coleta de dados e estabelece penalidades por vazamentos',
    vote: 'favor',
    status: 'active',
    date: '28/03/2026',
    category: 'Tecnologia',
  },
  {
    id: '8',
    politicianId: '3',
    projectId: '1',
    projectTitle: 'Lei de Acessibilidade e Custo da Saúde',
    projectDescription: 'Expande a cobertura de saúde para comunidades carentes e estabelece novos centros de saúde',
    vote: 'favor',
    status: 'active',
    date: '10/04/2026',
    category: 'Saúde',
  },
  {
    id: '9',
    politicianId: '3',
    projectId: '5',
    projectTitle: 'Lei de Apoio e Recuperação para Pequenas Empresas',
    projectDescription: 'Oferece subsídios e empréstimos com juros baixos para pequenas empresas',
    vote: 'favor',
    status: 'active',
    date: '01/03/2026',
    category: 'Economia',
  },
  {
    id: '10',
    politicianId: '4',
    projectId: '5',
    projectTitle: 'Lei de Apoio e Recuperação para Pequenas Empresas',
    projectDescription: 'Oferece subsídios e empréstimos com juros baixos para pequenas empresas',
    vote: 'favor',
    status: 'active',
    date: '01/03/2026',
    category: 'Economia',
  },
  {
    id: '11',
    politicianId: '4',
    projectId: '3',
    projectTitle: 'Lei de Proteção da Privacidade Digital',
    projectDescription: 'Exige consentimento explícito para coleta de dados e estabelece penalidades por vazamentos',
    vote: 'contra',
    status: 'active',
    date: '28/03/2026',
    category: 'Tecnologia',
  },
];
