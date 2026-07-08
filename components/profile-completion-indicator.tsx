import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProfileField {
  label: string;
  isComplete: boolean;
}

interface ProfileCompletionIndicatorProps {
  fields: ProfileField[];
  size?: number;
  strokeWidth?: number;
  showMissingFields?: boolean;
}

export function ProfileCompletionIndicator({
  fields,
  size = 100,
  strokeWidth = 8,
  showMissingFields = true,
}: ProfileCompletionIndicatorProps) {
  const completedCount = fields.filter((f) => f.isComplete).length;
  const totalCount = fields.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const missingFields = fields.filter((f) => !f.isComplete);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(percentage / 100, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const getProgressColor = () => {
    if (percentage >= 80) return '#34C759'; // Green
    if (percentage >= 50) return '#FF9500'; // Orange
    return '#FF3B30'; // Red
  };

  const getStatusText = () => {
    if (percentage === 100) return 'Complete!';
    if (percentage >= 80) return 'Almost there!';
    if (percentage >= 50) return 'Good progress';
    return 'Just getting started';
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E5EA"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getProgressColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View style={[styles.percentageContainer, { width: size, height: size }]}>
          <ThemedText style={styles.percentageText}>{percentage}%</ThemedText>
          <ThemedText style={styles.countText}>
            {completedCount}/{totalCount}
          </ThemedText>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <ThemedText style={[styles.statusText, { color: getProgressColor() }]}>
          {getStatusText()}
        </ThemedText>

        {showMissingFields && missingFields.length > 0 && (
          <View style={styles.missingFieldsContainer}>
            <ThemedText style={styles.missingTitle}>Missing:</ThemedText>
            <View style={styles.missingList}>
              {missingFields.slice(0, 3).map((field, index) => (
                <View key={field.label} style={styles.missingItem}>
                  <View style={styles.missingDot} />
                  <ThemedText style={styles.missingText}>{field.label}</ThemedText>
                </View>
              ))}
              {missingFields.length > 3 && (
                <ThemedText style={styles.moreText}>
                  +{missingFields.length - 3} more
                </ThemedText>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  countText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  statusContainer: {
    flex: 1,
    marginLeft: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  missingFieldsContainer: {
    marginTop: 4,
  },
  missingTitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 6,
  },
  missingList: {
    gap: 4,
  },
  missingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF9500',
    marginRight: 8,
  },
  missingText: {
    fontSize: 13,
    color: '#666',
  },
  moreText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
});
