import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import spacing from '@/constants/spacing';

type BadgeVariant = 'hot' | 'new' | 'featured';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  testID?: string;
}

export default function Badge({
  label,
  variant = 'new',
  style,
  testID,
}: BadgeProps) {
  return (
    <View
      style={[styles.badge, styles[`${variant}Badge` as keyof typeof styles] as ViewStyle, style]}
      testID={testID}
    >
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  hotBadge: {
    backgroundColor: colors.error,
  },
  newBadge: {
    backgroundColor: colors.primary,
  },
  featuredBadge: {
    backgroundColor: colors.warning,
  },
  text: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    textTransform: 'uppercase',
  },
});
