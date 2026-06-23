import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import Button from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSideMenu } from '@/contexts/SideMenuContext';
import { MOCK_GENERATED_TOUR, TourStop } from '@/data/mockData';
import {
  estimateTravelTime,
  sortByNearest,
  TravelEstimate,
} from '@/utils/travel-time';

const { height, width } = Dimensions.get('window');

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const INITIAL_REGION: Region = {
  latitude: 41.0082, // Istanbul
  longitude: 28.9784,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

type TravelMode = 'walking' | 'biking';

export default function MapScreen() {
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('Initializing…');
  const [isLoading, setIsLoading] = useState(true);
  const [travelMode, setTravelMode] = useState<TravelMode>('walking');
  const [routeDuration, setRouteDuration] = useState<number | null>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [selectedStop, setSelectedStop] = useState<TourStop | null>(null);
  const { open } = useSideMenu();

  const stops = MOCK_GENERATED_TOUR.stops;

  // Sort stops by distance from user
  const sortedStops = useMemo(() => {
    if (!userLocation) return stops;
    return sortByNearest(stops, userLocation.latitude, userLocation.longitude);
  }, [userLocation, stops]);

  // Active stop: user-selected, or nearest by default
  const activeStop: TourStop | null = selectedStop ?? sortedStops[0] ?? null;

  // Haversine-based estimate (shown immediately, before route API responds)
  const haversineEstimate: TravelEstimate | null = useMemo(() => {
    if (!userLocation || !activeStop) return null;
    return estimateTravelTime(
      userLocation.latitude,
      userLocation.longitude,
      activeStop.x,
      activeStop.y,
    );
  }, [userLocation, activeStop]);

  const handleSelectStop = (stop: TourStop) => {
    setSelectedStop(stop);
    setRouteDuration(null);
    setRouteDistance(null);
  };

  const handleNextAttraction = () => {
    if (sortedStops.length === 0) return;
    const currentIndex = sortedStops.findIndex((s) => s.order === activeStop?.order);
    const nextIndex = (currentIndex + 1) % sortedStops.length;
    handleSelectStop(sortedStops[nextIndex]);
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationStatus('Location permission denied');
          setIsLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setUserLocation(coords);
        setRegion({
          ...coords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setLocationStatus('Location ready');
      } catch (error) {
        console.warn('Error getting location, using default:', error);
        setUserLocation({
          latitude: INITIAL_REGION.latitude,
          longitude: INITIAL_REGION.longitude,
        });
        setRegion(INITIAL_REGION);
        setLocationStatus('Using default location');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const origin = userLocation
    ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
    : null;

  const destination = activeStop
    ? { latitude: activeStop.x, longitude: activeStop.y }
    : null;

  // Use Google Directions duration if available, otherwise haversine estimate
  const displayMinutes =
    routeDuration != null
      ? Math.round(routeDuration)
      : travelMode === 'walking'
        ? haversineEstimate?.walkingMinutes ?? null
        : haversineEstimate?.bikingMinutes ?? null;

  const displayDistance =
    routeDistance != null
      ? Math.round(routeDistance * 100) / 100
      : haversineEstimate?.distanceKm ?? null;

  const hasApiKey = GOOGLE_MAPS_API_KEY.length > 0;

  return (
    <ThemedView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>{locationStatus}</ThemedText>
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {origin && (
            <Marker coordinate={origin} title="You are here" />
          )}

          {/* Show all tour stops as markers — tap to select */}
          {stops.map((stop) => (
            <Marker
              key={stop.order}
              coordinate={{ latitude: stop.x, longitude: stop.y }}
              title={stop.name}
              description={stop.description}
              pinColor={stop.order === activeStop?.order ? '#8B5CF6' : '#FF6B6B'}
              onPress={() => handleSelectStop(stop)}
            />
          ))}

          {/* Draw route from user to nearest stop */}
          {hasApiKey && origin && destination && (
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_MAPS_API_KEY}
              mode={travelMode === 'biking' ? 'BICYCLING' : 'WALKING'}
              strokeWidth={4}
              strokeColor={travelMode === 'walking' ? '#4CAF50' : '#2196F3'}
              onReady={(result) => {
                setRouteDuration(result.duration);
                setRouteDistance(result.distance);
              }}
              onError={(error) => {
                console.warn('Directions error:', error);
                // Fall back to haversine estimates (already displayed)
                setRouteDuration(null);
                setRouteDistance(null);
              }}
            />
          )}
        </MapView>
      )}

      <View style={styles.bottomContainer}>
        <View style={styles.panel}>
          {activeStop && displayMinutes != null ? (
            <>
              <ThemedText style={styles.panelTitle}>
                Next: {activeStop.name}
              </ThemedText>
              {displayDistance != null && (
                <ThemedText style={styles.distanceText}>
                  {displayDistance} km away
                  {!hasApiKey && '  (estimate)'}
                </ThemedText>
              )}

              {/* Travel mode toggle + time in one row */}
              <View style={styles.travelRow}>
                <View style={styles.modeToggle}>
                  <TouchableOpacity
                    style={[
                      styles.modeButton,
                      travelMode === 'walking' && styles.modeButtonActive,
                    ]}
                    onPress={() => {
                      setTravelMode('walking');
                      setRouteDuration(null);
                      setRouteDistance(null);
                    }}
                  >
                    <FontAwesome
                      name="male"
                      size={16}
                      color={travelMode === 'walking' ? '#fff' : '#4CAF50'}
                    />
                    <ThemedText
                      style={[
                        styles.modeText,
                        travelMode === 'walking' && styles.modeTextActive,
                      ]}
                    >
                      Walk
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modeButton,
                      travelMode === 'biking' && styles.modeButtonBikeActive,
                    ]}
                    onPress={() => {
                      setTravelMode('biking');
                      setRouteDuration(null);
                      setRouteDistance(null);
                    }}
                  >
                    <FontAwesome
                      name="bicycle"
                      size={16}
                      color={travelMode === 'biking' ? '#fff' : '#2196F3'}
                    />
                    <ThemedText
                      style={[
                        styles.modeText,
                        travelMode === 'biking' && styles.modeTextActive,
                      ]}
                    >
                      Bike
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                <View style={styles.timeDisplay}>
                  <ThemedText style={styles.timeMinutes}>{displayMinutes}</ThemedText>
                  <ThemedText style={styles.timeLabel}>min</ThemedText>
                </View>
              </View>

              <View style={styles.buttons}>
                <Button
                  title="Create a route plan!"
                  onPress={() => console.log('Create a route plan! Pressed')}
                />
                <Button title="Go to Next attraction!" onPress={handleNextAttraction} />
              </View>
            </>
          ) : (
            <ThemedText>Calculating travel time...</ThemedText>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.menuButton} onPress={open}>
        <FontAwesome name="bars" size={22} color="#333" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttons: {
    width: '100%',
    marginTop: 12,
  },
  panel: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    paddingBottom: 34,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
    color: '#333',
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  travelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
  },
  modeToggle: {
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  modeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  modeButtonBikeActive: {
    backgroundColor: '#2196F3',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  modeTextActive: {
    color: '#fff',
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  timeMinutes: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  timeLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  menuButton: {
    position: 'absolute',
    top: 54,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
  },
});
