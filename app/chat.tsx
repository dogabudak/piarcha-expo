import { BackButton } from '@/components/back-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

type Message = {
  id: string;
  text: string;
  sent: boolean;
  timestamp: string;
};

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', text: 'Hey, how are you?', sent: false, timestamp: 'Jun 6, 10:30 AM' },
    { id: '2', text: "I'm good! How about you?", sent: true, timestamp: 'Jun 6, 10:31 AM' },
    { id: '3', text: 'Doing great, thanks!', sent: false, timestamp: 'Jun 6, 10:32 AM' },
    { id: '4', text: 'Want to grab coffee later?', sent: false, timestamp: 'Jun 7, 2:15 PM' },
    { id: '5', text: 'Sure, sounds good!', sent: true, timestamp: 'Jun 7, 2:16 PM' },
  ],
  '2': [
    { id: '1', text: 'Hello!', sent: false, timestamp: 'Jun 5, 9:00 AM' },
    { id: '2', text: 'Hi there!', sent: true, timestamp: 'Jun 5, 9:05 AM' },
    { id: '3', text: 'How was your trip?', sent: false, timestamp: 'Jun 6, 11:30 AM' },
  ],
  '3': [
    { id: '1', text: 'Hello', sent: false, timestamp: 'Jun 7, 8:00 AM' },
    { id: '2', text: 'Hey! Whats up?', sent: true, timestamp: 'Jun 7, 8:10 AM' },
  ],
};

export default function Chat() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [messages, setMessages] = useState<Message[]>(mockMessages[id ?? '1'] ?? []);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({ light: Colors.light.tint, dark: Colors.dark.tint }, 'tint');

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    const newMessage: Message = {
      id: String(Date.now()),
      text: trimmed,
      sent: true,
      timestamp: `${month} ${day}, ${displayHours}:${minutes} ${ampm}`,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageBubbleRow, item.sent ? styles.sentRow : styles.receivedRow]}>
      <View
        style={[
          styles.messageBubble,
          item.sent
            ? [styles.sentBubble, { backgroundColor: tintColor }]
            : styles.receivedBubble,
        ]}
      >
        <ThemedText
          style={[styles.messageText, item.sent && styles.sentMessageText]}
        >
          {item.text}
        </ThemedText>
        <ThemedText
          style={[styles.timestamp, item.sent && styles.sentTimestamp]}
        >
          {item.timestamp}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor }]}>
        <BackButton />
        <Image
          source={require('../assets/images/react-logo.png')}
          style={styles.headerAvatar}
        />
        <ThemedText style={styles.headerName}>{name ?? 'Chat'}</ThemedText>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input */}
        <View style={[styles.inputContainer, { borderTopColor: tintColor + '20' }]}>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: '#E0E0E0' }]}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <Pressable
            style={[styles.sendButton, { backgroundColor: tintColor }]}
            onPress={handleSend}
          >
            <IconSymbol name="send" size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingLeft: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubbleRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sentRow: {
    justifyContent: 'flex-end',
  },
  receivedRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  sentBubble: {
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#E8E8E8',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  sentMessageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  sentTimestamp: {
    color: '#fff',
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
