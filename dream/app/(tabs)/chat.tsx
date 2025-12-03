import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import { useApp } from '../../contexts/AppContext';

export default function ChatScreen() {
  const { isAuthenticated, user, messages, sendMessage, refreshMessages } = useApp();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        await refreshMessages();
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [refreshMessages]);

  useEffect(() => {
    if (messages.length === 0) return;
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to send messages in the chat');
      return;
    }

    if (!message.trim()) {
      return;
    }

    setSending(true);

    try {
      await sendMessage(message);
      setMessage('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: typeof messages[number] }) => {
    const isCurrentUser = item.userId === user?.id;
    const isSystem = item.userId === 'system';
    
    return (
      <View style={[
        styles.messageBubble,
        isCurrentUser ? styles.myMessage : 
        isSystem ? styles.systemMessage : styles.otherMessage
      ]}>
        {!isCurrentUser && !isSystem && (
          <Text style={styles.userName}>{item.userName}</Text>
        )}
        {isSystem && (
          <Text style={styles.systemName}>📢 {item.userName}</Text>
        )}
        <Text style={[
          styles.messageText,
          isCurrentUser ? styles.myMessageText : 
          isSystem ? styles.systemMessageText : styles.otherMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timeText,
          isCurrentUser && styles.myTimeText
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Player Chat</Text>
        <Text style={styles.subtitle}>Connect with other DLS players</Text>
        {!isAuthenticated && (
          <Text style={styles.loginWarning}>Login to participate in chat</Text>
        )}
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Loading messages...</Text>
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No messages yet</Text>
          <Text style={styles.emptyStateSubtext}>
            {isAuthenticated ? 'Be the first to start the conversation!' : 'Login to start chatting'}
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderMessage}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.textInput,
            !isAuthenticated && styles.textInputDisabled
          ]}
          value={message}
          onChangeText={setMessage}
          placeholder={isAuthenticated ? "Type your message..." : "Please login to chat"}
          placeholderTextColor="#666"
          multiline
          maxLength={500}
          editable={isAuthenticated}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            (!message.trim() || !isAuthenticated || sending) && styles.sendButtonDisabled
          ]} 
          onPress={handleSendMessage}
          disabled={!message.trim() || !isAuthenticated || sending}
        >
          <Text style={styles.sendButtonText}>{sending ? 'Sending...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#2a2a2a',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 4,
  },
  loginWarning: {
    fontSize: 12,
    color: '#ffd700',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#ccc',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
    paddingBottom: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
    maxWidth: '85%',
  },
  myMessage: {
    backgroundColor: '#ffd700',
    alignSelf: 'flex-end',
    marginLeft: '15%',
  },
  otherMessage: {
    backgroundColor: '#2a2a2a',
    alignSelf: 'flex-start',
    marginRight: '15%',
  },
  systemMessage: {
    backgroundColor: '#1e3a5f',
    alignSelf: 'center',
    maxWidth: '95%',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#ffd700',
    fontSize: 12,
  },
  systemName: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#93c5fd',
    fontSize: 12,
  },
  messageText: {
    marginBottom: 4,
    lineHeight: 18,
  },
  myMessageText: {
    color: '#000',
  },
  otherMessageText: {
    color: '#fff',
  },
  systemMessageText: {
    color: '#e0f2fe',
  },
  timeText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
  },
  myTimeText: {
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'flex-end',
    backgroundColor: '#2a2a2a',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 20,
    color: '#fff',
    marginRight: 10,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#444',
  },
  textInputDisabled: {
    backgroundColor: '#333',
    color: '#666',
  },
  sendButton: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#666',
  },
  sendButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});