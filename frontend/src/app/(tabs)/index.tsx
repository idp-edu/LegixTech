import { useEffect, useState } from 'react'; 
import { useRouter } from 'expo-router'; 
import { HomeFeed } from '@/components/HomeFeed'; 
import { useApp } from '@/context/AppContext'; 
// 🚀 CORRIGIDO: Importação universal para evitar o erro ts(1192)
import * as projectsServiceModule from '@/services/projectsService'; 
import type { Project } from '@/types/project'; 

const projectsService = (projectsServiceModule as any).projectsService || (projectsServiceModule as any).default || projectsServiceModule;

export default function HomeTab() { 
  const router = useRouter(); 
  const { 
    isGuest, 
    savedProjects, 
    toggleSaveProject, 
    isDark, 
    toggleTheme, 
    setShowDigestStories, 
    showToastMsg, 
  } = useApp(); 

  const [projects, setProjects] = useState<Project[]>([]); 

  useEffect(() => { 
    if (!projectsService?.listar) { 
      console.warn('O método listar de projectsService não está disponível.'); 
      showToastMsg('Erro interno ao inicializar o serviço de projetos.'); 
      return; 
    } 

    projectsService 
      .listar({ porPagina: 20 }) 
      .then((res: any) => { 
        const mapped: Project[] = (res.dados ?? []).map((p: any) => ({ 
          id: p.id, 
          externalId: p.siglaTipo ? `${p.siglaTipo}-${p.numero}-${p.ano}` : String(p.id), 
          title: p.ementa ?? p.titulo ?? 'Sem título', 
          year: p.ano ?? new Date().getFullYear(), 
          status: 'pending', 
          source: p.siglaTipo ?? 'Projeto', 
          type: p.descricaoTipo ?? '', 
        })); 
        setProjects(mapped); 
      }) 
      .catch(() => showToastMsg('Erro ao carregar projetos.')); 
  }, []); 

  return ( 
    <HomeFeed 
      projects={projects} 
      savedProjects={savedProjects} 
      onProjectClick={(id) => router.push(`/project/${id}` as never)} 
      onToggleSave={(id) => { 
        if (isGuest) { 
          showToastMsg('Faça login para salvar projetos.'); 
          return; 
        } 
        toggleSaveProject(id); 
      }} 
      isDark={isDark} 
      onToggleTheme={toggleTheme} 
      onDigestClick={() => setShowDigestStories(true)} 
    /> 
  ); 
}
