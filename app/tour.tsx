import { BackButton } from '@/components/back-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { GeneratedTour, TourStop } from '@/data/mockData';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

function TourHeader({ tour }: { tour: GeneratedTour }) {
  return (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.badge}>
        <IconSymbol name="sparkles" size={14} color="#8B5CF6" />
        <ThemedText style={styles.badgeText}>AI Generated</ThemedText>
      </ThemedView>
      <ThemedText type="title" style={styles.tourName}>{tour.tourName}</ThemedText>
      <ThemedText style={styles.description}>{tour.shortDescription}</ThemedText>
      <ThemedView style={styles.statsRow}>
        <ThemedView style={styles.stat}>
          <IconSymbol name="clock" size={16} color="#666" />
          <ThemedText style={styles.statText}>{tour.estimatedDuration}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stat}>
          <IconSymbol name="figure.walk" size={16} color="#666" />
          <ThemedText style={styles.statText}>{tour.distanceKm} km</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stat}>
          <IconSymbol name="mappin" size={16} color="#666" />
          <ThemedText style={styles.statText}>{tour.stops.length} stops</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

function StopCard({ stop }: { stop: TourStop }) {
  return (
    <ThemedView style={styles.stopCard}>
      <ThemedView style={styles.stopOrder}>
        <ThemedText style={styles.stopOrderText}>{stop.order}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stopContent}>
        <ThemedText type="defaultSemiBold" style={styles.stopName}>{stop.name}</ThemedText>
        <ThemedText style={styles.stopDescription}>{stop.description}</ThemedText>
        <ThemedView style={styles.stopMeta}>
          <IconSymbol name="clock" size={14} color="#999" />
          <ThemedText style={styles.stopMetaText}>{stop.estimatedMinutes} min</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

export default function Tour() {
  const params = useLocalSearchParams();

  let tour: GeneratedTour | null = null;
  if (params.tourData) {
    try {
      tour = JSON.parse(params.tourData as string);
    } catch {
      tour = null;
    }
  }

  if (!tour) {
    return (
      <View style={styles.page}>
        <BackButton />
        <ThemedView style={styles.emptyState}>
          <IconSymbol name="map" size={48} color="#ccc" />
          <ThemedText style={styles.emptyText}>No tour data available</ThemedText>
        </ThemedView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.page}>
      <BackButton />
      <TourHeader tour={tour} />
      <ThemedView style={styles.stopsSection}>
        <ThemedText type="subtitle" style={styles.stopsTitle}>Tour Stops</ThemedText>
        {tour.stops.map((stop) => (
          <StopCard key={stop.order} stop={stop} />
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3E8FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
  },
  tourName: {
    marginBottom: 8,
  },
  description: {
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#666',
    fontSize: 14,
  },
  stopsSection: {
    padding: 20,
    paddingTop: 10,
  },
  stopsTitle: {
    marginBottom: 16,
  },
  stopCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stopOrder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopOrderText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  stopContent: {
    flex: 1,
  },
  stopName: {
    marginBottom: 4,
  },
  stopDescription: {
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  stopMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stopMetaText: {
    color: '#999',
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});
