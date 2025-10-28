import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator } from 'react-native';

export default function Index() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={{ marginTop: 16, color: '#666', fontSize: 16 }}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/login" />;
  }
}
