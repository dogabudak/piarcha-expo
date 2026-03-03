import { BackButton } from '@/components/back-button';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Tour() {
  const params = useLocalSearchParams();

  // TODO this should fetch the tours
  // You can access route parameters via: params.tourId, params.city, etc.

  return (
    <View style={styles.page}>
      <BackButton />
    </View>
  );
}
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    flex: 1,
  },
});
