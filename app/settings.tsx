import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch } from 'react-native';

export default function Settings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [language, setLanguage] = useState('english');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSoundToggle = await AsyncStorage.getItem('soundToggle');
      const savedLanguage = await AsyncStorage.getItem('appLanguage');
      
      if (savedSoundToggle !== null) {
        setIsEnabled(savedSoundToggle === 'true');
      }
      
      if (savedLanguage !== null) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSwitch = async () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    
    try {
      await AsyncStorage.setItem('soundToggle', String(newValue));
    } catch (error) {
      console.error('Error saving sound setting:', error);
      Alert.alert('Error', 'Failed to save sound setting');
      // Revert the state if saving failed
      setIsEnabled(!newValue);
    }
  };

  const setLanguageValue = async (itemValue: string) => {
    setLanguage(itemValue);
    
    try {
      await AsyncStorage.setItem('appLanguage', itemValue);
    } catch (error) {
      console.error('Error saving language setting:', error);
      Alert.alert('Error', 'Failed to save language setting');
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.loadingText}>Loading settings...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>Settings</ThemedText>
          <ThemedText style={styles.subtitle}>
            Customize your app preferences
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.settingsContainer}>
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingHeader}>
              <ThemedText style={styles.settingLabel}>Sound Effects</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Enable or disable sound effects
              </ThemedText>
            </ThemedView>
            <Switch
              trackColor={{ false: '#767577', true: '#0a7ea4' }}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </ThemedView>

          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingHeader}>
              <ThemedText style={styles.settingLabel}>Language</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Choose your preferred language
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.pickerContainer}>
              <Picker
                selectedValue={language}
                style={styles.picker}
                onValueChange={setLanguageValue}
              >
                <Picker.Item label="English" value="english" />
                <Picker.Item label="Türkçe" value="turkish" />
              </Picker>
            </ThemedView>
          </ThemedView>
        </ThemedView>
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
  settingsContainer: {
    gap: 20,
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingHeader: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  pickerContainer: {
    minWidth: 120,
  },
  picker: {
    height: 50,
    width: 120,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
});
