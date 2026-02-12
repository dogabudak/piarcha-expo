import Button from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  TextInput,
  View,
  ScrollView,
} from 'react-native';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your E-Mail address');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', `Password reset link sent to ${email}`);
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/react-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText type="title" style={styles.title}>Forgot Password</ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              placeholder="Please enter your E-Mail address"
              value={email}
              maxLength={40}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>
          
          <Button
            title={isLoading ? "Processing..." : "Forward"}
            onPress={handleForgotPassword}
            disabled={isLoading}
            backgroundColor="#007AFF"
            style={styles.button}
          />
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: 50,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    height: 50,
    width: '85%', // Approximating width / 1.5 but more responsive
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  button: {
    width: '85%', // Match input width
    marginTop: 10,
  },
});
