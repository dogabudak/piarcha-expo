import Button from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  View,
  Alert,
} from 'react-native';

// Mock data adapting to available assets
const defaultFriendsList = [
  {
    id: '1',
    username: 'Your Best Friend',
    // Using available asset as placeholder
    avatarImage: require('@/assets/images/react-logo.png'),
    details: 'Hey, how are you',
  },
  {
    id: '2',
    username: 'A Girl from somewhere',
    avatarImage: require('@/assets/images/react-logo.png'),
    details: 'Hello',
  },
  {
    id: '3',
    username: 'A Guy from somewhere',
    avatarImage: require('@/assets/images/react-logo.png'),
    details: 'Hello',
  },
];

export default function Friends() {
  const [friends, setFriends] = useState(defaultFriendsList);
  const [displayList, setDisplayList] = useState(defaultFriendsList);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate initial data fetch
    // dispatch(getPublicUser('dogabudak'))
    // This is just a mock effect
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.length > 2) {
      // Simulate searchUser API call
      // In a real app, you might debounce this
      const filtered = friends.filter(user => 
        user.username.toLowerCase().includes(text.toLowerCase())
      );
      setDisplayList(filtered);
    } else {
      setDisplayList(friends);
    }
  };

  const searchClosestUsers = async () => {
    setIsLoading(true);
    // Simulate API call props.searchClosestUsers()
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Travel Buddies', 'Found 3 travel buddies near you!');
      // Here we would setClosestUsers with result
      // For now, just reshuffling or showing the default list
      setDisplayList([...defaultFriendsList].reverse());
    }, 1000);
  };

  const renderItem = ({ item }: { item: typeof defaultFriendsList[0] }) => (
    <ThemedView style={styles.listItem}>
      <Image source={item.avatarImage} style={styles.avatar} />
      <View style={styles.listItemContent}>
        <ThemedText type="defaultSemiBold">{item.username}</ThemedText>
        <ThemedText style={styles.listItemSubtitle}>{item.details}</ThemedText>
      </View>
      <IconSymbol name="chevron.right" size={20} color="#ccc" />
    </ThemedView>
  );

  return (
    <ThemedView style={styles.page}>
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color="#666" style={styles.searchIcon} /> 
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={search}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.actionButtonContainer}>
        <Button
          title={isLoading ? "Searching..." : "Find Travel Buddies"}
          onPress={searchClosestUsers}
          backgroundColor="green"
          disabled={isLoading}
        />
      </View>

      <FlatList
        data={displayList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#000',
  },
  actionButtonContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 0,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'transparent', // Inherit from parent ThemedView if needed, or set specific
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#eee', // Fallback for transparent images
  },
  listItemContent: {
    flex: 1,
  },
  listItemSubtitle: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 80, // Indent separator to align with text
  },
});
