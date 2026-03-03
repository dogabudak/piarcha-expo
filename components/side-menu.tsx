import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useSideMenu } from '@/contexts/SideMenuContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MENU_WIDTH = SCREEN_WIDTH * 0.65;

type MenuItem = {
  label: string;
  icon: keyof typeof FontAwesome.glyphMap;
  route: string;
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'Map', icon: 'map', route: '/(tabs)' },
  { label: 'Destination', icon: 'compass', route: '/destination' },
  { label: 'Friends', icon: 'users', route: '/(tabs)/friends' },
  { label: 'Profile', icon: 'user', route: '/profile' },
  { label: 'Inbox', icon: 'envelope', route: '/inbox' },
  { label: 'Settings', icon: 'cog', route: '/settings' },
  { label: 'Tutorial', icon: 'book', route: '/tutorial' },
];

export function SideMenu() {
  const { isOpen, close } = useSideMenu();
  const router = useRouter();
  const translateX = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: isOpen ? 0 : -MENU_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: isOpen ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  const handleNavigate = (route: string) => {
    close();
    setTimeout(() => {
      router.push(route as any);
    }, 200);
  };

  return (
    <>
      {isOpen && (
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        </Animated.View>
      )}

      <Animated.View style={[styles.menu, { transform: [{ translateX }] }]}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <FontAwesome name="globe" size={28} color="#fff" />
          </View>
          <ThemedText style={styles.appName}>Piarcha</ThemedText>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuItems}>
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item.route}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => handleNavigate(item.route)}>
              <FontAwesome
                name={item.icon}
                size={18}
                color="#555"
                style={styles.menuIcon}
              />
              <ThemedText style={styles.menuLabel}>{item.label}</ThemedText>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 98,
  },
  menu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: MENU_WIDTH,
    backgroundColor: '#fff',
    zIndex: 99,
    paddingTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
    color: '#1a1a1a',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 20,
  },
  menuItems: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuItemPressed: {
    backgroundColor: '#f0f4ff',
  },
  menuIcon: {
    width: 24,
    textAlign: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 14,
    color: '#333',
  },
});
