import { BackButton } from '@/components/back-button';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';

// TODO messages should come from db
// TODO chatroom endpoints and users are ready in backend, but not here
// TODO find users should find !
const messageList = [
  {
    id: '1',
    name: 'Your Best Friend',
    avatarImage: require('../assets/images/react-logo.png'),
    subtitle: 'Hey, how are you',
  },
  {
    id: '2',
    name: 'A Girl from somewhere',
    avatarImage: require('../assets/images/react-logo.png'),
    subtitle: 'Hello',
  },
  {
    id: '3',
    name: 'A Guy from somewhere',
    avatarImage: require('../assets/images/react-logo.png'),
    subtitle: 'Hello',
  },
];

type MessageItemProps = {
  item: typeof messageList[0];
  onPress: () => void;
};

const MessageItem: React.FC<MessageItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.messageItem} onPress={onPress}>
      <Image source={item.avatarImage} style={styles.avatar} />
      <View style={styles.messageContent}>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        <ThemedText style={styles.subtitle} type="defaultSemiBold">
          {item.subtitle}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const Inbox: React.FC = () => {
  const router = useRouter();

  const renderMessage = ({ item }: { item: typeof messageList[0] }) => (
    <MessageItem
      item={item}
      onPress={() => router.push(`/chat?id=${item.id}&name=${encodeURIComponent(item.name)}`)}
    />
  );

  return (
    <ThemedView style={styles.page}>
      <BackButton />
      <FlatList
        data={messageList}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 50,
  },
  messageItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  messageContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 82,
  },
});

export default Inbox;