import type { Project } from '@/types/project';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Lei de Acessibilidade e Custo da Saúde',
    year: '2026',
    status: 'active',
    trending: true,
    category: 'Saúde',
    summary:
      'Este projeto visa expandir a cobertura de saúde para comunidades carentes, fornecendo subsídios para famílias de baixa renda e estabelecendo novos centros de saúde comunitários em áreas rurais.',
    impact: [
      'Reduz custos de saúde para famílias com renda abaixo de 200% da linha de pobreza federal',
      'Estabelece 50 novos centros de saúde comunitários em municípios rurais',
      'Fornece incentivos fiscais para profissionais de saúde que atendem áreas carentes',
    ],
    affected: ['Famílias de baixa renda', 'Comunidades rurais', 'Profissionais de saúde', 'Operadoras de planos'],
    sponsor: 'Sen. Maria Silva',
    introduced: '15 de Janeiro de 2026',
  },
  {
    id: '2',
    title: 'Lei de Investimento em Energia Limpa e Criação de Empregos',
    year: '2026',
    status: 'pending',
    category: 'Meio Ambiente',
    summary:
      'Legislação para acelerar a transição para energia renovável, fornecendo créditos fiscais para empresas de energia limpa e financiando programas de capacitação profissional.',
    impact: [
      'Cria estimados 100.000 novos empregos no setor de energia renovável',
      'Fornece R$ 25 bilhões em créditos fiscais para projetos de energia solar e eólica',
      'Estabelece programas de capacitação em empregos verdes em 25 estados',
    ],
    affected: ['Empresas de energia', 'Trabalhadores', 'Grupos ambientais', 'Governos locais'],
    sponsor: 'Dep. David Chen',
    introduced: '3 de Fevereiro de 2026',
  },
  {
    id: '3',
    title: 'Lei de Proteção da Privacidade Digital',
    year: '2026',
    status: 'active',
    trending: true,
    category: 'Tecnologia',
    summary:
      'Legislação abrangente de privacidade de dados que exige que empresas obtenham consentimento explícito antes de coletar dados pessoais e estabelece penalidades para vazamentos de dados.',
    impact: [
      'Exige consentimento opt-in para todas as atividades de coleta de dados',
      'Estabelece direito à exclusão de dados para todos os usuários',
      'Impõe multas de até 4% da receita anual por violações de privacidade',
    ],
    affected: ['Empresas de tecnologia', 'Consumidores', 'Corretores de dados', 'Empresas de marketing'],
    sponsor: 'Sen. Sarah Williams',
    introduced: '10 de Março de 2026',
  },
  {
    id: '4',
    title: 'Lei de Modernização e Financiamento da Educação Pública',
    year: '2025',
    status: 'approved',
    category: 'Educação',
    summary:
      'Aumenta o financiamento federal para educação básica com foco em programas STEM, salários de professores e melhorias na infraestrutura escolar.',
    impact: [
      'Aumenta o financiamento por aluno em 15% em todo o país',
      'Eleva salários mínimos de professores para R$ 5.000 mensais',
      'Aloca R$ 50 bilhões para melhorias na infraestrutura escolar',
    ],
    affected: ['Professores', 'Estudantes', 'Distritos escolares', 'Pais'],
    sponsor: 'Dep. Michael Thompson',
    introduced: '22 de Junho de 2025',
  },
  {
    id: '5',
    title: 'Lei de Apoio e Recuperação para Pequenas Empresas',
    year: '2026',
    status: 'active',
    category: 'Economia',
    summary:
      'Fornece assistência financeira e alívio fiscal para pequenas empresas afetadas por desafios econômicos, incluindo subsídios e empréstimos com juros baixos.',
    impact: [
      'Oferece até R$ 250.000 em subsídios para pequenas empresas elegíveis',
      'Fornece empréstimos com 0% de juros nos primeiros dois anos',
      'Reduz impostos sobre folha de pagamento em 25% para empresas com menos de 50 funcionários',
    ],
    affected: ['Proprietários de pequenas empresas', 'Empreendedores', 'Economias locais', 'Bancos'],
    sponsor: 'Sen. Roberto Martinez',
    introduced: '28 de Janeiro de 2026',
  },
  {
    id: '6',
    title: 'Lei de Desenvolvimento de Habitação Popular',
    year: '2025',
    status: 'archived',
    category: 'Habitação',
    summary:
      'Legislação para aumentar a oferta de moradia acessível através de incentivos para construtoras e financiamento para projetos de habitação pública.',
    impact: [
      'Financia construção de 250.000 unidades habitacionais populares',
      'Fornece créditos fiscais para construtoras que constroem moradias de baixa renda',
      'Estabelece proteções de controle de aluguel em áreas de alto custo',
    ],
    affected: ['Inquilinos', 'Compradores de imóveis', 'Construtoras', 'Governos locais'],
    sponsor: 'Dep. Jennifer Lee',
    introduced: '5 de Agosto de 2025',
  },
];
