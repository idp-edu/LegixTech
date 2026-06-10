import { 
  ArrowLeft, 
  Bot, 
  Building2, 
  Calendar, 
  CheckCircle, 
  ExternalLink, 
  MessageCircle, 
  Share2, 
  Users,
  Bookmark
} from 'lucide-react-native'; 
import { Pressable, ScrollView, Text, View } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useTheme } from '@/hooks/useTheme'; 
import { getODSColorByNumber } from '@/data/odsMapping'; 
import type { UiProject } from '@/types/project'; 
import { StatusBadge } from './StatusBadge'; 

interface ProjectDetailProps { 
  project: UiProject; 
  onBack: () => void; 
  onChatbotClick?: () => void; 
  saved?: boolean;
  onSave?: () => void;
} 

export function ProjectDetail({ project, onBack, onChatbotClick, saved, onSave }: ProjectDetailProps) { 
  const { colors } = useTheme(); 
  const firstOds = project.ods?.[0]; 

  return ( 
    <View style={{ flex: 1, backgroundColor: colors.background }}> 
      <SafeAreaView 
        edges={['top']} 
        style={{ 
          borderBottomWidth: 1, 
          borderBottomColor: colors.divider, 
          backgroundColor: colors.surface, 
          paddingHorizontal: 16, 
          paddingVertical: 16, 
        }} 
      > 
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}> 
          <Pressable 
            onPress={onBack} 
            style={{ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center', marginLeft: -8, borderRadius: 22 }} 
          > 
            <ArrowLeft size={24} color={colors.text} /> 
          </Pressable> 
          
          <Text style={{ flex: 1, fontSize: 18, fontWeight: 'bold', color: colors.text }}>Detalhes do Projeto</Text> 
          
          {onSave && (
            <Pressable 
              onPress={onSave} 
              style={{ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 }}
            > 
              <Bookmark size={20} color={saved ? colors.primary : colors.textMuted} fill={saved ? colors.primary : 'none'} /> 
            </Pressable> 
          )}

          <Pressable style={{ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 }}> 
            <Share2 size={20} color={colors.primary} /> 
          </Pressable> 
        </View> 
      </SafeAreaView> 

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} contentContainerStyle={{ paddingTop: 24, paddingBottom: 112, gap: 24 }}> 
        <View style={{ gap: 12 }}> 
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}> 
            <StatusBadge status={project.status ?? 'pending'} /> 
            {firstOds ? ( 
              <Text 
                style={{ 
                  borderRadius: 4, 
                  paddingHorizontal: 12, 
                  paddingVertical: 4, 
                  fontSize: 14, 
                  fontWeight: '500', 
                  backgroundColor: getODSColorByNumber(firstOds, true), 
                  color: getODSColorByNumber(firstOds, false), 
                  borderWidth: 1, 
                  borderColor: getODSColorByNumber(firstOds, false), 
                }} 
              > 
                ODS {firstOds} 
              </Text> 
            ) : null} 
          </View> 
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.text }}>{project.title}</Text> 
        </View> 

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16 }}> 
          <View style={{ minWidth: '45%', flex: 1, gap: 4 }}> 
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}> 
              <Building2 size={16} color={colors.textMuted} /> 
              <Text style={{ fontSize: 14, color: colors.textMuted }}>Autor</Text> 
            </View> 
            <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text }}>{project.sponsor ?? 'Não informado'}</Text> 
          </View> 
          <View style={{ minWidth: '45%', flex: 1, gap: 4 }}> 
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}> 
              <Calendar size={16} color={colors.textMuted} /> 
              <Text style={{ fontSize: 14, color: colors.textMuted }}>Ano</Text> 
            </View> 
            <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text }}>{project.year ?? 'Não informado'}</Text> 
          </View> 
        </View> 

        <View style={{ borderBottomWidth: 1, borderBottomColor: colors.divider, paddingBottom: 4 }}> 
          <Text style={{ fontWeight: '500', color: colors.primary }}>Entenda a Lei</Text> 
          <View style={{ marginTop: 8, height: 2, width: '100%', backgroundColor: colors.primary }} /> 
        </View> 

        <View style={{ gap: 12 }}> 
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>O Resumo</Text> 
          <Text style={{ lineHeight: 24, color: colors.text }}> 
            {project.summary ?? 'Resumo não disponível para este projeto.'} 
          </Text> 
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}> 
            <Bot size={13} color={colors.textMuted} /> 
            <Text style={{ fontSize: 12, fontStyle: 'italic', color: colors.textMuted }}> 
              Resumo gerado com auxílio de IA 
            </Text> 
          </View> 
        </View> 

        {project.themes?.length ? ( 
          <View style={{ gap: 12 }}> 
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}> 
              <Users size={20} color={colors.primary} /> 
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>Temas relacionados</Text> 
            </View> 
            {project.themes.map((theme, index) => ( 
              <View key={`${theme}-${index}`} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 8, backgroundColor: colors.surface, padding: 12 }}> 
                <View style={{ marginTop: 8, height: 6, width: 6, borderRadius: 3, backgroundColor: colors.primary }} /> 
                <Text style={{ flex: 1, lineHeight: 24, color: colors.text }}>{theme}</Text> 
              </View> 
            ))} 
          </View> 
        ) : null} 

        <View style={{ gap: 12 }}> 
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>Linha do Tempo do Projeto</Text> 
          <View style={{ gap: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16 }}> 
            <View style={{ flexDirection: 'row', gap: 16 }}> 
              <View style={{ alignItems: 'center' }}> 
                <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: colors.primary }} /> 
                <View style={{ marginTop: 4, width: 2, flex: 1, backgroundColor: colors.border, minHeight: 40 }} /> 
              </View> 
              <View style={{ flex: 1, paddingBottom: 8 }}> 
                <Text style={{ fontSize: 14, color: colors.textMuted }}>{project.year ?? 'Ano não informado'}</Text> 
                <Text style={{ fontWeight: '500', color: colors.text }}>Projeto apresentado</Text> 
                <Text style={{ marginTop: 4, fontSize: 14, color: colors.textMuted }}> 
                  Apresentado por {project.sponsor ?? 'autor não informado'} 
                </Text> 
              </View> 
            </View> 

            {project.status === 'approved' && ( 
              <View style={{ flexDirection: 'row', gap: 16 }}> 
                <CheckCircle size={16} color="#15803d" style={{ marginTop: 4 }} /> 
                <View style={{ flex: 1 }}> 
                  <Text style={{ fontWeight: '500', color: '#15803d' }}>Aprovado</Text> 
                </View> 
              </View> 
            )} 

            {project.status === 'active' && ( 
              <View style={{ flexDirection: 'row', gap: 16 }}> 
                <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: colors.kpiAmberText, marginTop: 4 }} /> 
                <View style={{ flex: 1 }}> 
                  <Text style={{ fontSize: 14, color: colors.textMuted }}>Atual</Text> 
                  <Text style={{ fontWeight: '500', color: colors.text }}>Em análise na comissão</Text> 
                </View> 
              </View> 
            )} 
          </View> 
        </View> 

        <Pressable style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 8, backgroundColor: colors.primary, paddingVertical: 16 }}> 
          <ExternalLink size={20} color="#fff" /> 
          <Text style={{ fontWeight: '500', color: '#fff' }}>Acessar Texto Oficial</Text> 
        </Pressable> 
      </ScrollView> 

      {onChatbotClick && ( 
        <Pressable 
          onPress={onChatbotClick} 
          style={{ 
            position: 'absolute', 
            bottom: 32, 
            right: 24, 
            height: 56, 
            width: 56, 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: 28, 
            backgroundColor: colors.primary, 
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 4 }, 
            shadowOpacity: 0.3, 
            shadowRadius: 8, 
            elevation: 8, 
          }} 
        > 
          <MessageCircle size={24} color="#fff" /> 
        </Pressable> 
      )} 
    </View> 
  ); 
}
