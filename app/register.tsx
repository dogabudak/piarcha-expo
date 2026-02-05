import Button from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ImageBackground,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

type FormValues = {
  username: string;
  password: string;
  passwordDuplication: string;
};

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordDuplication, setPasswordDuplication] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormValues, boolean>> = {};
    if (!username.trim()) next.username = true;
    if (!password.trim()) next.password = true;
    if (!passwordDuplication.trim()) next.passwordDuplication = true;
    if (password !== passwordDuplication) next.passwordDuplication = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      // TODO: Replace with your actual register API endpoint
      const response = await fetch('http://localhost:3020/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.token) {
        await login(result.token);
        router.replace('/(tabs)');
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert(
        'Registration Failed',
        error instanceof Error ? error.message : 'Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/icon.png')}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView style={styles.form}>
            <ThemedView style={styles.header}>
              <ThemedText type="title" style={styles.title}>
                Create account
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Enter your details to register
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.inputGroup}>
              <TextInput
                style={styles.formInput}
                placeholder="Username or email"
                placeholderTextColor="#999"
                value={username}
                onChangeText={(value) => {
                  setUsername(value);
                  if (errors.username) setErrors((e) => ({ ...e, username: false }));
                }}
                onBlur={() => setErrors((e) => ({ ...e, username: !username.trim() }))}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.username && (
                <ThemedText style={styles.error}>Please enter a user name</ThemedText>
              )}
            </ThemedView>

            <ThemedView style={styles.inputGroup}>
              <TextInput
                style={styles.formInput}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (errors.password) setErrors((e) => ({ ...e, password: false }));
                }}
                onBlur={() => {
                  setErrors((e) => ({
                    ...e,
                    password: !password.trim(),
                    passwordDuplication: password !== passwordDuplication,
                  }));
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.password && (
                <ThemedText style={styles.error}>Please enter a password</ThemedText>
              )}
            </ThemedView>

            <ThemedView style={styles.inputGroup}>
              <TextInput
                style={styles.formInput}
                placeholder="Re-enter password"
                placeholderTextColor="#999"
                value={passwordDuplication}
                onChangeText={(value) => {
                  setPasswordDuplication(value);
                  if (errors.passwordDuplication) setErrors((e) => ({ ...e, passwordDuplication: false }));
                }}
                onBlur={() =>
                  setErrors((e) => ({ ...e, passwordDuplication: password !== passwordDuplication || !passwordDuplication.trim() }))
                }
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {(errors.passwordDuplication || (passwordDuplication !== '' && password !== passwordDuplication)) && (
                <ThemedText style={styles.error}>Please re-enter your password</ThemedText>
              )}
            </ThemedView>

            <Button
              title={isLoading ? 'Registering...' : 'Register'}
              onPress={onSubmit}
              disabled={isLoading}
              backgroundColor="#007AFF"
              style={styles.submitButton}
            />
          </ThemedView>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  form: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
  inputGroup: {
    marginBottom: 16,
  },
  formInput: {
    height: 50,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 4,
    paddingHorizontal: 16,
    textAlign: 'center',
    letterSpacing: 2,
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
});
