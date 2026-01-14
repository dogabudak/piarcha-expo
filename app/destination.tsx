import { Dropdown } from '@/components/dropdown';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Attraction, Tour } from '@/data/mockData';
import { ApiService } from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from 'react-native';

interface LocationSelectorProps {
  countries: string[];
  cities: string[];
  selectedCountry: string;
  selectedCity: string;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
}

function LocationSelector({ 
  countries, 
  cities, 
  selectedCountry, 
  selectedCity, 
  onCountryChange, 
  onCityChange 
}: LocationSelectorProps) {
  return (
    <ThemedView style={styles.selectorContainer}>
      <Dropdown
        label="Country"
        options={countries}
        selectedValue={selectedCountry}
        onValueChange={onCountryChange}
        placeholder="Select a country"
      />
      
      <Dropdown
        label="City"
        options={cities}
        selectedValue={selectedCity}
        onValueChange={onCityChange}
        placeholder="Select a city"
      />
    </ThemedView>
  );
}

interface TourListSectionProps {
  tours: Tour[];
  onTourPress: (tourId: number) => void;
}

function TourListSection({ tours, onTourPress }: TourListSectionProps) {
  return (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Available Tours</ThemedText>
      {tours.map((tour) => (
        <Pressable
          key={tour.id}
          style={styles.tourItem}
          onPress={() => onTourPress(tour.id)}
        >
          <ThemedView style={styles.tourContent}>
            <ThemedText type="defaultSemiBold">{tour.name}</ThemedText>
            <ThemedText style={styles.tourDetails}>
              {tour.duration} • {tour.price}
            </ThemedText>
          </ThemedView>
          <IconSymbol name="chevron.right" size={20} color="#666" />
        </Pressable>
      ))}
    </ThemedView>
  );
}

interface AttractionsListSectionProps {
  attractions: Attraction[];
}

function AttractionsListSection({ attractions }: AttractionsListSectionProps) {
  return (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Popular Attractions</ThemedText>
      {attractions.map((attraction) => (
        <ThemedView key={attraction.id} style={styles.attractionItem}>
          <ThemedView style={styles.attractionContent}>
            <ThemedText type="defaultSemiBold">{attraction.name}</ThemedText>
            <ThemedText style={styles.attractionType}>{attraction.type}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={16} color="#FFD700" />
            <ThemedText style={styles.rating}>{attraction.rating}</ThemedText>
          </ThemedView>
        </ThemedView>
      ))}
    </ThemedView>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <ThemedView style={styles.headerContainer}>
      <ThemedText type="title" style={styles.headerTitle}>{title}</ThemedText>
      <ThemedText style={styles.headerSubtitle}>{subtitle}</ThemedText>
    </ThemedView>
  );
}

interface LoadingStates {
  countries: boolean;
  cities: boolean;
  tours: boolean;
  attractions: boolean;
}

export default function Destination() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('Turkey');
  const [selectedCity, setSelectedCity] = useState('');
  
  // Data states
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState<LoadingStates>({
    countries: true,
    cities: false,
    tours: false,
    attractions: false,
  });

  // Error states
  const [error, setError] = useState<string | null>(null);

  // Load countries on mount
  useEffect(() => {
    loadCountries();
  }, []);

  // Load cities when country changes
  useEffect(() => {
    if (selectedCountry) {
      loadCities(selectedCountry);
    }
  }, [selectedCountry]);

  // Load tours and attractions when city changes
  useEffect(() => {
    if (selectedCity && selectedCountry) {
      loadTours(selectedCountry, selectedCity);
      loadAttractions(selectedCountry, selectedCity);
    }
  }, [selectedCity, selectedCountry]);

  // Auto-select first city when cities load
  useEffect(() => {
    if (cities.length > 0 && !selectedCity) {
      setSelectedCity(cities[0]);
    }
  }, [cities, selectedCity]);

  const loadCountries = async () => {
    try {
      setLoading(prev => ({ ...prev, countries: true }));
      const data = await ApiService.getCountries();
      setCountries(data.countries);
      setError(null);
    } catch (err) {
      setError('Failed to load countries');
      console.error('Error loading countries:', err);
    } finally {
      setLoading(prev => ({ ...prev, countries: false }));
    }
  };

  const loadCities = async (country: string) => {
    try {
      setLoading(prev => ({ ...prev, cities: true }));
      const data = await ApiService.getCities(country);
      setCities(data);
      setSelectedCity(''); // Reset city selection
      setError(null);
    } catch (err) {
      setError('Failed to load cities');
      console.error('Error loading cities:', err);
    } finally {
      setLoading(prev => ({ ...prev, cities: false }));
    }
  };

  const loadTours = async (country: string, city: string) => {
    try {
      setLoading(prev => ({ ...prev, tours: true }));
      const data = await ApiService.getTours(country, city);
      setTours(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tours');
      console.error('Error loading tours:', err);
    } finally {
      setLoading(prev => ({ ...prev, tours: false }));
    }
  };

  const loadAttractions = async (country: string, city: string) => {
    try {
      setLoading(prev => ({ ...prev, attractions: true }));
      const data = await ApiService.getAttractions(country, city);
      setAttractions(data);
      setError(null);
    } catch (err) {
      setError('Failed to load attractions');
      console.error('Error loading attractions:', err);
    } finally {
      setLoading(prev => ({ ...prev, attractions: false }));
    }
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleTourPress = (tourId: number) => {
    router.push(`/tour?tourId=${tourId}` as any);
  };

  const handleDownload = async () => {
    if (!selectedCity || !selectedCountry) return;
    
    try {
      const coordinates = await ApiService.getCoordinates(selectedCity);
      console.log('Download guide for:', selectedCity, selectedCountry, coordinates);
    } catch (err) {
      console.error('Error getting coordinates:', err);
    }
  };

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <IconSymbol name="exclamationmark.triangle" size={48} color="#FF6B6B" />
        <ThemedText type="subtitle" style={styles.errorTitle}>Oops! Something went wrong</ThemedText>
        <ThemedText style={styles.errorMessage}>{error}</ThemedText>
        <Pressable style={styles.retryButton} onPress={loadCountries}>
          <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <PageHeader 
        title="Select your next destination"
        subtitle="Choose a country and city to explore amazing tours and attractions"
      />

      {loading.countries ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>Loading countries...</ThemedText>
        </ThemedView>
      ) : (
        <LocationSelector
          countries={countries}
          cities={cities}
          selectedCountry={selectedCountry}
          selectedCity={selectedCity}
          onCountryChange={handleCountryChange}
          onCityChange={handleCityChange}
        />
      )}

      {loading.cities && (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <ThemedText style={styles.loadingText}>Loading cities...</ThemedText>
        </ThemedView>
      )}
      
      {selectedCity && (
        <>
          {loading.tours ? (
            <ThemedView style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <ThemedText style={styles.loadingText}>Loading tours...</ThemedText>
            </ThemedView>
          ) : (
            <TourListSection
              tours={tours}
              onTourPress={handleTourPress}
            />
          )}

          {loading.attractions ? (
            <ThemedView style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <ThemedText style={styles.loadingText}>Loading attractions...</ThemedText>
            </ThemedView>
          ) : (
            <AttractionsListSection 
              attractions={attractions} 
            />
          )}
        </>
      )}
      
      <ThemedView style={styles.buttonContainer}>
        <Pressable 
          style={[
            styles.downloadButton,
            (!selectedCity || !selectedCountry) && styles.disabledButton
          ]} 
          onPress={handleDownload}
          disabled={!selectedCity || !selectedCountry}
        >
          <IconSymbol name="arrow.down.circle.fill" size={20} color="#fff" />
          <ThemedText style={styles.buttonText}>Download Guide</ThemedText>
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
  headerContainer: {
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
  selectorContainer: {
    padding: 20,
    paddingTop: 10,
  },
  section: {
    margin: 20,
    marginTop: 10,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  tourItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
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
  tourContent: {
    flex: 1,
  },
  tourDetails: {
    color: '#666',
    marginTop: 4,
  },
  attractionItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
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
  attractionContent: {
    flex: 1,
  },
  attractionType: {
    color: '#666',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontWeight: '600',
  },
  buttonContainer: {
    margin: 20,
    marginTop: 10,
    marginBottom: 40,
  },
  downloadButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});