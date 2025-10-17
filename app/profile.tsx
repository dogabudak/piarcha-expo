import { Dropdown } from '@/components/dropdown';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput
} from 'react-native';

// Sample data - replace with your actual data source
const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
  'Russian', 'Japanese', 'Chinese', 'Arabic', 'Hindi', 'Turkish'
];

const COUNTRIES = [
  'Turkey', 'United States', 'United Kingdom', 'France', 'Germany', 
  'Italy', 'Spain', 'Japan', 'China', 'India'
];

const INTERESTS = [
  'Coffee', 'Long walks', 'Beer tasting', 'Photography', 'Museums',
  'Food tours', 'Hiking', 'Art galleries', 'Local markets', 'History'
];

export default function Profile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // TODO country and city that he is from
  // TODO intrested in ? (like coffee, long walks beer etc.)
  // TODO countries you want to visit from the list
  // TODO Privacy
  // TODO User shouldnt be able to open here if he did not logged in
  // TODO style here is horrible
   const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setBirthdate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAuthToken = async (): Promise<string> => {
    try {
      
       const token = await AsyncStorage.getItem('auth_token');
       if (!token) {
         throw new Error('No authentication token found');
       }
       return token;
      
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw new Error('Authentication required. Please log in again.');
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please fill in your first and last name');
      return;
    }

    setIsLoading(true);
    try {
      const userDetails = {
        firstName,
        lastName,
        birthdate: birthdate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        country: selectedCountry,
        city: selectedCity,
        languages: selectedLanguages,
        interests: selectedInterests,
      };

      // Get authentication token
      const token = await getAuthToken();
      
      const payload = {
        client: 'user',
        request: {
          method: 'post',
          url: '/update-user',
          data: {
            user: userDetails,
          },
          headers: {
            authorize: `jwt ${token}`,
          },
        },
      };

      const response = await fetch('http://localhost:3020', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Profile saved successfully:', result);
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      
      // Show more specific error messages
      let errorMessage = 'Failed to save profile. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Authentication')) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('HTTP error')) {
          errorMessage = 'Server error. Please try again later.';
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>Profile</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Tell us about yourself to get personalized recommendations
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Basic Information</ThemedText>
        
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>First Name</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Last Name</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Birth Date</ThemedText>
          <Pressable 
            style={styles.datePickerButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <ThemedText style={styles.datePickerText}>
              {formatDate(birthdate)}
            </ThemedText>
            <IconSymbol name="chevron.right" size={20} color="#666" />
          </Pressable>
          
          {showDatePicker && (
            <DateTimePicker
              value={birthdate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
            />
          )}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Location</ThemedText>
        
        <ThemedView style={styles.inputGroup}>
          <Dropdown
            label="Country"
            options={COUNTRIES}
            selectedValue={selectedCountry}
            onValueChange={setSelectedCountry}
            placeholder="Select your country"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>City</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your city"
            value={selectedCity}
            onChangeText={setSelectedCity}
            autoCapitalize="words"
          />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Languages</ThemedText>
        <ThemedText style={styles.sectionDescription}>
          Select languages you can speak (tap to select multiple)
        </ThemedText>
        
        <ThemedView style={styles.chipContainer}>
          {LANGUAGES.map((language) => (
            <Pressable
              key={language}
              style={[
                styles.chip,
                selectedLanguages.includes(language) && styles.chipSelected
              ]}
              onPress={() => {
                if (selectedLanguages.includes(language)) {
                  setSelectedLanguages(prev => prev.filter(l => l !== language));
                } else {
                  setSelectedLanguages(prev => [...prev, language]);
                }
              }}
            >
              <ThemedText style={[
                styles.chipText,
                selectedLanguages.includes(language) && styles.chipTextSelected
              ]}>
                {language}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Interests</ThemedText>
        <ThemedText style={styles.sectionDescription}>
          What activities interest you? (tap to select multiple)
        </ThemedText>
        
        <ThemedView style={styles.chipContainer}>
          {INTERESTS.map((interest) => (
            <Pressable
              key={interest}
              style={[
                styles.chip,
                selectedInterests.includes(interest) && styles.chipSelected
              ]}
              onPress={() => {
                if (selectedInterests.includes(interest)) {
                  setSelectedInterests(prev => prev.filter(i => i !== interest));
                } else {
                  setSelectedInterests(prev => [...prev, interest]);
                }
              }}
            >
              <ThemedText style={[
                styles.chipText,
                selectedInterests.includes(interest) && styles.chipTextSelected
              ]}>
                {interest}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <Pressable 
          style={[styles.saveButton, isLoading && styles.disabledButton]} 
          onPress={handleSaveProfile}
          disabled={isLoading}
        >
          <IconSymbol 
            name={isLoading ? "arrow.clockwise" : "checkmark.circle.fill"} 
            size={20} 
            color="#fff" 
          />
          <ThemedText style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Profile'}
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerTitle: {
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#666',
    lineHeight: 22,
  },
  section: {
    margin: 20,
    marginTop: 10,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionDescription: {
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 16,
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
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonContainer: {
    margin: 20,
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
});
