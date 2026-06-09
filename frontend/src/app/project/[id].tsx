import { useLocalSearchParams, useRouter } from 'expo-router'; 
import { ActivityIndicator, Text, View } from 'react-native'; 
import { ProjectDetail } from '@/components/ProjectDetail'; 
import { useApp } from '@/context/AppContext'; 
// 🚀 CORRIGIDO: Importação universal via namespace para ignorar quebras vindas do hook com erro
import * as useProjectModule from '@/hooks/useProject'; 

export default function ProjectDetailScreen() { 
  const { id } = useLocalSearchParams<{ id: string }>(); 
  const router = useRouter(); 
  const { isGuest, openChatbot, showToastMsg } = useApp(); 

  const projectId = Array.isArray(id) ? id[0] : id; 

  // 🚀 CORRIGIDO: Extração segura da função useProject
  const useProjectFn = (useProjectModule as any).useProject || (useProjectModule as any).default;
  const { project, loading, error } = useProjectFn(projectId); 

  if (loading) { 
    return ( 
      <View className="flex-1 items-center justify-center bg-background"> 
        <ActivityIndicator size="large" /> 
      </View> 
    ); 
  } 

  if (error) { 
    return ( 
      <View className="flex-1 items-center justify-center bg-background px-6"> 
        <Text className="mb-4 text-center text-foreground">{error}</Text> 
        <Text className="text-primary" onPress={() => router.back()}> 
          Voltar 
        </Text> 
      </View> 
    ); 
  } 

  if (!project) { 
    return ( 
      <View className="flex-1 items-center justify-center bg-background px-6"> 
        <Text className="mb-4 text-center text-foreground"> 
          Projeto não encontrado. 
        </Text> 
        <Text className="text-primary" onPress={() => router.back()}> 
          Voltar 
        </Text> 
      </View> 
    ); 
  } 

  return ( 
    <ProjectDetail 
      project={project} 
      onBack={() => router.back()} 
      onChatbotClick={() => { 
        if (isGuest) { 
          showToastMsg('Faça login para usar o assistente deste projeto.'); 
          return; 
        } 
        openChatbot('projeto de lei'); 
      }} 
    /> 
  ); 
}
