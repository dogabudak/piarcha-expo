import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

import Button from '@/components/button';
import Images from '@/images/images';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

const { height } = Dimensions.get('window');

// TODO: Replace with your Google Maps API Key and add it to your app.json
const GOOGLE_MAPS_APIKEY = '';

const mockCoordinates = [
    { name: 'Hagia Sophia', x: 41.0086, y: 28.9800, type: 'Church' },
    { name: 'Blue Mosque', x: 41.0053, y: 28.9769, type: 'Museum' },
    { name: 'Topkapi Palace', x: 41.0116, y: 28.9834, type: 'Palace' },
    { name: 'Grand Bazaar', x: 41.0104, y: 28.9682, type: 'Shop' },
    { name: 'Galata Tower', x: 41.0256, y: 28.9744, type: 'Monument' },
];

// Utility function to find the closest coordinate
const getClosestCoordinate = (currentLocation, coordinates) => {
    if (!currentLocation || !coordinates || coordinates.length === 0) {
        return null;
    }

    let closest = null;
    let minDistance = Infinity;

    for (const coord of coordinates) {
        const distance = Math.sqrt(
            Math.pow(coord.x - currentLocation.latitude, 2) +
            Math.pow(coord.y - currentLocation.longitude, 2)
        );
        if (distance < minDistance) {
            minDistance = distance;
            closest = coord;
        }
    }
    return closest;
};

function MapScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isMapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    })();
  }, []);

  const handleMapReady = useCallback(() => {
    setMapReady(true);
  }, []);

  const handleGoToNextAttraction = () => {
    const closestAttraction = getClosestCoordinate(currentLocation, mockCoordinates);
    if (closestAttraction && mapRef.current) {
        // @ts-ignore
      mapRef.current.animateToRegion({
        latitude: closestAttraction.x,
        longitude: closestAttraction.y,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const Markers = mockCoordinates.map(eachCoordinate => (
    <Marker
      key={eachCoordinate.name}
      coordinate={{
        latitude: eachCoordinate.x,
        longitude: eachCoordinate.y,
      }}
      // @ts-ignore
      image={Images[eachCoordinate.type]}
    >
      <Callout tooltip>
        <ThemedView style={styles.calloutContainer}>
          <ThemedText>{eachCoordinate.name}</ThemedText>
        </ThemedView>
      </Callout>
    </Marker>
  ));

  return (
    <ThemedView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        style={styles.map}
        onMapReady={handleMapReady}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: 41.0094092,
          longitude: 28.9770532,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {currentLocation && mockCoordinates.length > 0 && (
          <MapViewDirections
            origin={currentLocation}
            destination={{ latitude: mockCoordinates[0].x, longitude: mockCoordinates[0].y }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="hotpink"
            onError={(errorMessage) => {
                 console.log(errorMessage);
            }}
          />
        )}
        {Markers}
      </MapView>

      <View style={styles.bottomContainer}>
        <View style={styles.buttons}>
            <Button
            title="Create a route plan !"
            onPress={() => {
                console.log('Create a route plan ! Pressed ');
            }}
            />
            <Button
            title="Go to Next attraction ! "
            onPress={handleGoToNextAttraction}
            />
        </View>

        <View style={styles.panel}>
            <ThemedText>Here is the content inside panel</ThemedText>
        </View>
      </View>
      
      <View style={styles.fabContainer}>
            <TouchableOpacity onPress={() => router.push('/inbox')} style={styles.fab}>
                <FontAwesome name="inbox" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/friends')} style={styles.fab}>
                <FontAwesome name="users" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile')} style={styles.fab}>
                <FontAwesome name="user" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/settings')} style={styles.fab}>
                <FontAwesome name="cog" size={24} color="white" />
            </TouchableOpacity>
      </View>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
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
    calloutContainer: {
        padding: 10,
        borderRadius: 5,
    },
    fabContainer: {
        position: 'absolute',
        right: 20,
        top: 50,
        alignItems: 'center',
    },
    fab: {
        backgroundColor: 'orange',
        borderRadius: 28,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default memo(MapScreen);
