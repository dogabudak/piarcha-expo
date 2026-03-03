import { SideMenu } from '@/components/side-menu';
import { SideMenuProvider } from '@/contexts/SideMenuContext';
import { Slot } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <SideMenuProvider>
      <View style={styles.container}>
        <Slot />
        <SideMenu />
      </View>
    </SideMenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
