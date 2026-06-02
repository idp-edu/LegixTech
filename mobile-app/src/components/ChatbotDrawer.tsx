import { Send, ThumbsDown, ThumbsUp, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  feedback?: 'helpful' | 'not-helpful';
}

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
}

export function ChatbotDrawer({ isOpen, onClose, context = 'projeto de lei' }: ChatbotDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Olá! Posso te ajudar a entender esta ${context}. O que deseja saber?`,
      sender: 'assistant',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickActions = ['O que significa este status?', 'Quem pode ser afetado?', 'Como acompanhar?'];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), text: text.trim(), sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: `Esta é uma resposta de exemplo para: "${text}". O chatbot fornecerá informações detalhadas sobre a lei em linguagem simples e acessível.`,
          sender: 'assistant',
        },
      ]);
    }, 1000);
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
        <View className="flex-row items-center justify-between border-b border-border px-6 py-4">
          <Text className="font-display text-base font-medium text-foreground">Assistente LegixTech</Text>
          <Pressable onPress={onClose} className="min-h-11 min-w-11 items-center justify-center">
            <X size={24} color="#1a1a1a" />
          </Pressable>
        </View>

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
                    backgroundColor: message.sender === 'user' ? '#1e40af' : '#f9fafb',
                  }}
                >
                  <Text
                    className="leading-relaxed"
                    style={{ color: message.sender === 'user' ? '#fff' : '#1a1a1a' }}
                  >
                    {message.text}
                  </Text>
                </View>
                {message.sender === 'assistant' && (
                  <View className="flex-row gap-2 px-2">
                    <Pressable
                      onPress={() => handleFeedback(message.id, 'helpful')}
                      className="flex-row items-center gap-1 rounded-lg px-3 py-2"
                      style={{
                        backgroundColor: message.feedback === 'helpful' ? '#dcfce7' : 'transparent',
                      }}
                    >
                      <ThumbsUp size={16} color={message.feedback === 'helpful' ? '#15803d' : '#6b7280'} />
                      <Text className="text-xs text-muted-foreground">Útil</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleFeedback(message.id, 'not-helpful')}
                      className="flex-row items-center gap-1 rounded-lg px-3 py-2"
                      style={{
                        backgroundColor: message.feedback === 'not-helpful' ? '#fee2e2' : 'transparent',
                      }}
                    >
                      <ThumbsDown size={16} color={message.feedback === 'not-helpful' ? '#ef4444' : '#6b7280'} />
                      <Text className="text-xs text-muted-foreground">Não foi útil</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        <View className="border-t border-border px-6 py-3">
          <View className="flex-row flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Pressable
                key={index}
                onPress={() => handleSendMessage(action)}
                className="min-h-11 rounded-full border border-border bg-surface px-4 py-2"
              >
                <Text className="text-sm font-medium text-foreground">{action}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="border-t border-border px-6 py-4">
          <View className="flex-row items-center gap-3 rounded-xl border border-border bg-input-background px-4 py-2">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSendMessage(inputText)}
              placeholder="Digite sua pergunta..."
              placeholderTextColor="#6b7280"
              className="min-h-11 flex-1 text-foreground"
            />
            <Pressable
              onPress={() => handleSendMessage(inputText)}
              disabled={!inputText.trim()}
              className="min-h-11 min-w-11 items-center justify-center rounded-full"
              style={{ backgroundColor: inputText.trim() ? '#1e40af' : '#f3f4f6' }}
            >
              <Send size={20} color={inputText.trim() ? '#fff' : '#6b7280'} />
            </Pressable>
          </View>
        </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
