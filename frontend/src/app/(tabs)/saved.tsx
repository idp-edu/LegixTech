import { useEffect, useState } from 'react'; 
import { useRouter } from 'expo-router'; 
import { SavedProjects } from '@/components/SavedProjects'; 
import { useApp } from '@/context/AppContext'; 
// 🚀 CORRIGIDO: Importação universal para evitar o erro ts(1192)
import * as projectsServiceModule from '@/services/projectsService'; 
import { politiciansService } from '@/services/politiciansService'; 
import type { Politician } from '@/data/mockPoliticians'; 
import type { ProjectStatus } from '@/types/project'; 

const projectsService = (projectsServiceModule as any).projectsService || (projectsServiceModule as any).default || projectsServiceModule;

export default function SavedTab() { 
  const router = useRouter(); 
  const { 
    isGuest, 
    savedProjects, 
    savedPoliticians, 
    toggleSaveProject, 
    removePolitician, 
    showToastMsg, 
  } = useApp(); 

  const [allProjects, setAllProjects] = useState< 
    Array<{ id: string; title: string; year: string; status: ProjectStatus; category: string }> 
  >([]); 
  const [politicians, setPoliticians] = useState<Politician[]>([]); 

  useEffect(() => { 
    if (!projectsService?.listar) {
      console.warn('O método listar de projectsService não está disponível em saved.tsx.');
      return;
    }

    projectsService 
      .listar({ porPagina: 100 }) 
      .then((res: any) => 
        setAllProjects( 
          (res.dados ?? []).map((p: any) => ({ 
            id: String(p.id), 
            title: p.ementa ?? p.titulo ?? 'Sem título', 
            year: String(p.ano ?? ''), 
            status: 'pending' as ProjectStatus, 
            category: p.siglaTipo ?? 'Projeto', 
          })), 
        ), 
      ) 
      .catch(() => showToastMsg('Erro ao carregar projetos salvos.')); 

    politiciansService 
      .getSeguindo() 
      .then((lista) => 
        setPoliticians( 
          lista.map((p) => ({ 
            id: String(p.politician_id), 
            name: p.politician_name ?? 'Parlamentar', 
            party: p.politician_party ?? '', 
            state: p.politician_state ?? '', 
            house: 'Câmara' as 'Senado' | 'Câmara', 
            photo: p.politician_photo_url ?? undefined, 
            bio: '', 
            stats: { 
              totalVotes: 0, 
              votesInFavor: 0, 
              votesAgainst: 0, 
              abstentions: 0, 
              projectsPresented: 0, 
              attendance: 0, 
            }, 
          })), 
        ), 
      ) 
      .catch(() => {}); 
  }, []); 

  const projects = allProjects.filter((p) => savedProjects.includes(p.id)); 

  const requireLogin = () => { 
    showToastMsg('Faça login para acessar e gerenciar seus itens salvos.'); 
  }; 

  return ( 
    <SavedProjects 
      projects={projects} 
      politicians={politicians} 
      savedPoliticians={savedPoliticians} 
      onProjectClick={(id) => router.push(`/project/${id}` as never)} 
      onToggleSave={(id) => { 
        if (isGuest) { 
          requireLogin(); 
          return; 
        } 
        toggleSaveProject(id); 
      }} 
      onPoliticianClick={(id) => router.push(`/politician/${id}` as never)} 
      onRemovePolitician={(id) => { 
        if (isGuest) { 
          requireLogin(); 
          return; 
        } 
        removePolitician(id); 
      }} 
      onNavigateToSearch={() => router.push('/(tabs)/search' as never)} 
      onShowToast={showToastMsg} 
    /> 
  ); 
}
