import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

export default function Tour() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // TODO this should fetch the tours
  // You can access route parameters via: params.tourId, params.city, etc.
  
  return (
    <View style={styles.page}>
      <Button title="Go back" onPress={() => router.back()} />
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
