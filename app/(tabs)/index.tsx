import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import Button from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSideMenu } from '@/contexts/SideMenuContext';

const { height } = Dimensions.get('window');

const MAP_PLACEHOLDER_MESSAGE =
  'Map requires a development build (react-native-maps). Run with a dev client to see the map.';

export default function MapScreen() {
  const [locationStatus, setLocationStatus] = useState<string>('Checking…');
  const { open } = useSideMenu();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStatus('Location permission denied');
        return;
      }
      setLocationStatus('Location ready (map placeholder)');
    })();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <ThemedText style={styles.placeholderText}>{MAP_PLACEHOLDER_MESSAGE}</ThemedText>
        <ThemedText style={styles.locationStatus}>{locationStatus}</ThemedText>
      </View>

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    padding: 24,
  },
  placeholderText: {
    textAlign: 'center',
    marginBottom: 12,
  },
  locationStatus: {
    fontSize: 12,
    color: '#666',
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
  },
  panel: {
    width: '100%',
    height: height / 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
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
