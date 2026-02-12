import Button from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from 'react-native';

//Should have a go back button
export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      // DEV ONLY: Skeleton key bypass
      if (__DEV__ && password === 'skeleton') {
        console.log('🔓 DEV MODE: Skeleton key accepted');
        await login('DEV_SKELETON_KEY_TOKEN');
        Alert.alert('Success', 'Logged in with skeleton key (dev only)');
        return;
      }

      // TODO: Replace with your actual login API endpoint
      const response = await fetch('http://localhost:3020/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Store the token and update auth state
      if (result.token) {
        await login(result.token);
        console.log('Login successful, user authenticated');
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
          <ThemedText style={styles.subtitle}>
            Sign in to your account to continue
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Username</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={40}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Password</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={40}
            />
          </ThemedView>

          <Button
            title={isLoading ? 'Signing In...' : 'Sign In'}
            onPress={handleLogin}
            disabled={isLoading}
            backgroundColor="#007AFF"
            style={styles.loginButton}
          />
        </ThemedView>
        
        <View style={styles.footer}>
          <Link href="/forgot-password" asChild>
            <Pressable style={styles.forgotPasswordLink}>
              <IconSymbol name="lock.fill" size={16} color="#666" style={{ marginRight: 8 }}/>
              <ThemedText style={styles.footerText}>Forgot Password?</ThemedText>
            </Pressable>
          </Link>
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
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  loginButton: {
    marginTop: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  footerText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
});
