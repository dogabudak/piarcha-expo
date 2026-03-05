import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

import Button from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSideMenu } from '@/contexts/SideMenuContext';

const { height, width } = Dimensions.get('window');

const INITIAL_REGION: Region = {
  latitude: 41.0082, // Istanbul
  longitude: 28.9784,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [locationStatus, setLocationStatus] = useState<string>('Initializing…');
  const [isLoading, setIsLoading] = useState(true);
  const { open } = useSideMenu();

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
        const currentRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        
        setRegion(currentRegion);
        setLocationStatus('Location ready');
      } catch (error) {
        console.error('Error getting location:', error);
        setLocationStatus('Error getting location');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

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
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title="You are here"
          />
        </MapView>
      )}

      <View style={styles.bottomContainer}>
        <View style={styles.buttons}>
          <Button
            title="Create a route plan!"
            onPress={() => console.log('Create a route plan! Pressed')}
          />
          <Button title="Go to Next attraction!" onPress={() => {}} />
        </View>

        <View style={styles.panel}>
          <ThemedText>Here is the content inside panel</ThemedText>
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
    alignItems: 'center',
  },
  buttons: {
    paddingBottom: 20,
    width: '90%',
  },
  panel: {
    width: '100%',
    height: height / 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
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
