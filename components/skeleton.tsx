import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

// Since react-native-linear-gradient might not be installed, we'll use a pure animated approach
// with opacity-based shimmer effect

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Base Skeleton component with shimmer animation
 */
export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}: SkeletonProps) {
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, {
        duration: 1200,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmerValue.value,
      [0, 0.5, 1],
      [0.3, 0.7, 0.3]
    );
    return { opacity };
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

/**
 * Skeleton for text lines - commonly used for titles, descriptions
 */
interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
  lineHeight?: number;
  gap?: number;
  style?: ViewStyle;
}

export function SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
  lineHeight = 14,
  gap = 8,
  style,
}: SkeletonTextProps) {
  return (
    <View style={[styles.textContainer, { gap }, style]}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={lineHeight}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          borderRadius={lineHeight / 2}
        />
      ))}
    </View>
  );
}

/**
 * Skeleton for circular elements like avatars
 */
interface SkeletonCircleProps {
  size?: number;
  style?: ViewStyle;
}

export function SkeletonCircle({ size = 48, style }: SkeletonCircleProps) {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={size / 2}
      style={style}
    />
  );
}

/**
 * Skeleton for card layouts - tour cards, city cards, etc.
 */
interface SkeletonCardProps {
  imageHeight?: number;
  showImage?: boolean;
  lines?: number;
  style?: ViewStyle;
}

export function SkeletonCard({
  imageHeight = 160,
  showImage = true,
  lines = 2,
  style,
}: SkeletonCardProps) {
  return (
    <View style={[styles.card, style]}>
      {showImage && (
        <Skeleton
          height={imageHeight}
          borderRadius={12}
          style={styles.cardImage}
        />
      )}
      <View style={styles.cardContent}>
        <Skeleton height={18} width="70%" borderRadius={4} />
        <View style={styles.cardMeta}>
          <Skeleton height={14} width="40%" borderRadius={4} />
          <Skeleton height={14} width="30%" borderRadius={4} />
        </View>
        {lines > 1 && (
          <SkeletonText lines={lines - 1} lineHeight={12} gap={6} />
        )}
      </View>
    </View>
  );
}

/**
 * Skeleton for list items
 */
interface SkeletonListItemProps {
  showAvatar?: boolean;
  avatarSize?: number;
  lines?: number;
  style?: ViewStyle;
}

export function SkeletonListItem({
  showAvatar = true,
  avatarSize = 48,
  lines = 2,
  style,
}: SkeletonListItemProps) {
  return (
    <View style={[styles.listItem, style]}>
      {showAvatar && <SkeletonCircle size={avatarSize} />}
      <View style={styles.listItemContent}>
        <Skeleton height={16} width="60%" borderRadius={4} />
        {lines > 1 && (
          <Skeleton
            height={12}
            width="80%"
            borderRadius={4}
            style={{ marginTop: 6 }}
          />
        )}
        {lines > 2 && (
          <Skeleton
            height={12}
            width="40%"
            borderRadius={4}
            style={{ marginTop: 6 }}
          />
        )}
      </View>
    </View>
  );
}

/**
 * Skeleton for the map bottom panel
 */
export function SkeletonMapPanel() {
  return (
    <View style={styles.mapPanel}>
      <Skeleton height={20} width="60%" borderRadius={4} />
      <Skeleton height={14} width="40%" borderRadius={4} style={{ marginTop: 8 }} />

      <View style={styles.mapPanelRow}>
        <View style={styles.mapPanelButtons}>
          <Skeleton height={36} width={80} borderRadius={18} />
          <Skeleton height={36} width={80} borderRadius={18} />
        </View>
        <View style={styles.mapPanelTime}>
          <Skeleton height={32} width={50} borderRadius={4} />
          <Skeleton height={14} width={30} borderRadius={4} />
        </View>
      </View>

      <View style={styles.mapPanelActions}>
        <Skeleton height={48} borderRadius={8} style={{ marginTop: 12 }} />
        <Skeleton height={48} borderRadius={8} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

/**
 * Skeleton for profile sections
 */
export function SkeletonProfileSection() {
  return (
    <View style={styles.profileSection}>
      <Skeleton height={20} width="40%" borderRadius={4} style={{ marginBottom: 16 }} />

      <View style={styles.profileField}>
        <Skeleton height={14} width="30%" borderRadius={4} />
        <Skeleton height={44} borderRadius={8} style={{ marginTop: 8 }} />
      </View>

      <View style={styles.profileField}>
        <Skeleton height={14} width="25%" borderRadius={4} />
        <Skeleton height={44} borderRadius={8} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

/**
 * Skeleton for chip/tag selections
 */
interface SkeletonChipsProps {
  count?: number;
  style?: ViewStyle;
}

export function SkeletonChips({ count = 6, style }: SkeletonChipsProps) {
  const widths = [70, 90, 60, 85, 75, 95, 65, 80];

  return (
    <View style={[styles.chipsContainer, style]}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          height={36}
          width={widths[index % widths.length]}
          borderRadius={18}
        />
      ))}
    </View>
  );
}

/**
 * Skeleton for destination/city hero section
 */
export function SkeletonHero() {
  return (
    <View style={styles.hero}>
      <Skeleton height={250} borderRadius={0} />
      <View style={styles.heroContent}>
        <Skeleton height={32} width="50%" borderRadius={4} />
        <Skeleton height={16} width="70%" borderRadius={4} style={{ marginTop: 8 }} />
        <View style={styles.heroStats}>
          <Skeleton height={40} width={80} borderRadius={8} />
          <Skeleton height={40} width={80} borderRadius={8} />
          <Skeleton height={40} width={80} borderRadius={8} />
        </View>
      </View>
    </View>
  );
}

/**
 * Full screen loading skeleton for tours/destinations
 */
export function SkeletonScreen() {
  return (
    <View style={styles.screen}>
      <SkeletonHero />
      <View style={styles.screenContent}>
        <SkeletonCard />
        <SkeletonCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E5EA',
  },
  textContainer: {
    flexDirection: 'column',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  cardImage: {
    marginBottom: 0,
  },
  cardContent: {
    padding: 16,
    gap: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  listItemContent: {
    flex: 1,
  },
  mapPanel: {
    padding: 20,
    paddingBottom: 34,
  },
  mapPanelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  mapPanelButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  mapPanelTime: {
    alignItems: 'flex-end',
    gap: 4,
  },
  mapPanelActions: {
    marginTop: 4,
  },
  profileSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
  },
  profileField: {
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hero: {
    position: 'relative',
  },
  heroContent: {
    padding: 20,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  screen: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  screenContent: {
    padding: 20,
  },
});
