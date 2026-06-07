import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useRTLStyle } from '../../theme/RTLContext';

export default function AIChatScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();

  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: "Hello! I am your safe space AI assistant. I'm here to listen, support, and talk with you. How are you feeling today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const flatListRef = useRef(null);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: inputText.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await api.sendChatMessage(userMessage.content);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: response.data.role,
        content: response.data.content
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: "Sorry, I'm having trouble connecting right now." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? [styles.userBubble, { backgroundColor: theme.colors.primary }] : [styles.aiBubble, { backgroundColor: theme.colors.surface }]]}>
        {!isUser && <Ionicons name="sparkles" size={16} color={theme.colors.primary} style={styles.aiIcon} />}
        <Text style={[styles.messageText, { color: isUser ? '#FFF' : theme.colors.text }]}>
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[styles.header, rtl.row, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('RemindMe AI')}</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.primary }]}>{t('Anonymous & Private')}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {loading && (
        <View style={[styles.typingIndicator, rtl.row, rtl.row]}>
          <ActivityIndicator color={theme.colors.primary} size="small" />
          <Text style={{ color: theme.colors.text + '80', marginStart: 8 }}>{t('AI is typing...')}</Text>
        </View>
      )}

      <View style={[styles.inputContainer, rtl.row, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <TextInput
          style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1 }]}
          placeholder={t("Type your message...")}
          placeholderTextColor={theme.colors.text + '50'}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: inputText.trim() ? theme.colors.primary : theme.colors.primary + '50' }]}
          onPress={handleSend}
          disabled={!inputText.trim() || loading}
        >
          <Ionicons name="send" size={20} color="#FFF" style={{ marginStart: 4 }} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    padding: 8,
    marginStart: -8,
  },
  headerInfo: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  chatList: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#8b5cf6',
    borderBottomEndRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomStartRadius: 4,
    flexDirection: 'row',
  },
  aiIcon: {
    marginEnd: 8,
    marginTop: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 16,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 120,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 16 : 12,
    paddingBottom: Platform.OS === 'ios' ? 16 : 12,
    fontSize: 16,
    marginEnd: 12,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
