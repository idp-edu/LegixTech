import { RefreshCw, Send, ThumbsDown, ThumbsUp, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { chatService } from '@/services/chatService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  isError?: boolean;
  feedback?: 'helpful' | 'not-helpful';
}

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
  projectTitle?: string;
}

function buildWelcomeMessage(context: string, projectTitle?: string): string {
  if (projectTitle) {
    return `Olá! Posso te ajudar a entender o projeto "${projectTitle}". O que você gostaria de saber?`;
  }
  return `Olá! Posso te ajudar a entender esta ${context}. O que deseja saber?`;
}

export function ChatbotDrawer({
  isOpen,
  onClose,
  context = 'projeto de lei',
  projectTitle,
}: ChatbotDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: buildWelcomeMessage(context, projectTitle),
      sender: 'assistant',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const lastFailedText = useRef<string | null>(null);

  const quickActions = ['O que significa este status?', 'Quem pode ser afetado?', 'Como acompanhar?'];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    lastFailedText.current = null;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // context já carrega o título do projeto quando aberto via ProjectDetail
      const data = await chatService.sendMessage(text.trim(), context);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: data.resposta,
          sender: 'assistant',
        },
      ]);
    } catch {
      lastFailedText.current = text.trim();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'Não foi possível conectar ao assistente agora. Verifique sua conexão ou tente novamente.',
          sender: 'assistant',
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (!lastFailedText.current) return;
    setMessages((prev) => prev.filter((m) => !m.isError));
    handleSendMessage(lastFailedText.current);
  };

  const handleFeedback = (messageId: string, feedback: 'helpful' | 'not-helpful') => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)));
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ maxHeight: '70%' }}
      >
        <View className="rounded-t-3xl bg-card">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-border px-6 py-4">
            <View style={{ flex: 1 }}>
              <Text className="font-display text-base font-medium text-foreground">
                Assistente LegixTech
              </Text>
              {projectTitle && (
                <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                  {projectTitle}
                </Text>
              )}
            </View>
            <Pressable onPress={onClose} className="min-h-11 min-w-11 items-center justify-center">
              <X size={24} color="#1a1a1a" />
            </Pressable>
          </View>

          {/* Mensagens */}
          <ScrollView className="max-h-64 px-6 py-4" contentContainerStyle={{ gap: 16 }}>
            {messages.map((message) => (
              <View
                key={message.id}
                className={`flex-row ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <View className="max-w-[80%] gap-2">
                  <View
                    className="rounded-2xl px-4 py-3"
                    style={{
                      backgroundColor: message.sender === 'user'
                        ? '#1e40af'
                        : message.isError
                          ? '#fee2e2'
                          : '#f9fafb',
                    }}
                  >
                    <Text
                      className="leading-relaxed"
                      style={{
                        color: message.sender === 'user'
                          ? '#fff'
                          : message.isError
                            ? '#b91c1c'
                            : '#1a1a1a',
                      }}
                    >
                      {message.text}
                    </Text>
                  </View>

                  {message.isError && lastFailedText.current && (
                    <Pressable
                      onPress={handleRetry}
                      className="flex-row items-center gap-2 rounded-lg px-3 py-2"
                      style={{ backgroundColor: '#fee2e2' }}
                    >
                      <RefreshCw size={14} color="#b91c1c" />
                      <Text style={{ fontSize: 12, color: '#b91c1c', fontWeight: '500' }}>
                        Tentar novamente
                      </Text>
                    </Pressable>
                  )}

                  {message.sender === 'assistant' && !message.isError && (
                    <View className="flex-row gap-2 px-2">
                      <Pressable
                        onPress={() => handleFeedback(message.id, 'helpful')}
                        className="flex-row items-center gap-1 rounded-lg px-3 py-2"
                        style={{ backgroundColor: message.feedback === 'helpful' ? '#dcfce7' : 'transparent' }}
                      >
                        <ThumbsUp size={16} color={message.feedback === 'helpful' ? '#15803d' : '#6b7280'} />
                        <Text className="text-xs text-muted-foreground">Útil</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleFeedback(message.id, 'not-helpful')}
                        className="flex-row items-center gap-1 rounded-lg px-3 py-2"
                        style={{ backgroundColor: message.feedback === 'not-helpful' ? '#fee2e2' : 'transparent' }}
                      >
                        <ThumbsDown size={16} color={message.feedback === 'not-helpful' ? '#ef4444' : '#6b7280'} />
                        <Text className="text-xs text-muted-foreground">Não foi útil</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            ))}

            {isLoading && (
              <View className="flex-row justify-start">
                <View className="rounded-2xl bg-[#f9fafb] px-4 py-3">
                  <ActivityIndicator size="small" color="#6b7280" />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick actions */}
          <View className="border-t border-border px-6 py-3">
            <View className="flex-row flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSendMessage(action)}
                  disabled={isLoading}
                  className="min-h-11 rounded-full border border-border bg-surface px-4 py-2"
                  style={{ opacity: isLoading ? 0.5 : 1 }}
                >
                  <Text className="text-sm font-medium text-foreground">{action}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Input */}
          <View className="border-t border-border px-6 py-4">
            <View className="flex-row items-center gap-3 rounded-xl border border-border bg-input-background px-4 py-2">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => handleSendMessage(inputText)}
                placeholder="Digite sua pergunta..."
                placeholderTextColor="#6b7280"
                className="min-h-11 flex-1 text-foreground"
                editable={!isLoading}
              />
              <Pressable
                onPress={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="min-h-11 min-w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: inputText.trim() && !isLoading ? '#1e40af' : '#f3f4f6' }}
              >
                <Send size={20} color={inputText.trim() && !isLoading ? '#fff' : '#6b7280'} />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}