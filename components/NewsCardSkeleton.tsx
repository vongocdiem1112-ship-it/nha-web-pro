import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoadingSkeleton from './LoadingSkeleton';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export default function NewsCardSkeleton() {
  return (
    <View style={styles.card}>
      <LoadingSkeleton height={180} borderRadius={12} style={styles.image} />
      <View style={styles.content}>
        <LoadingSkeleton height={14} width={80} borderRadius={12} style={styles.badge} />
        <LoadingSkeleton height={18} width="100%" style={styles.title} />
        <LoadingSkeleton height={18} width="80%" style={styles.titleSecond} />
        <LoadingSkeleton height={14} width="100%" style={styles.desc} />
        <LoadingSkeleton height={14} width="70%" style={styles.descSecond} />
        <LoadingSkeleton height={12} width={120} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.base,
  },
  image: {
    width: '100%',
  },
  content: {
    padding: spacing.base,
  },
  badge: {
    marginBottom: spacing.sm,
  },
  title: {
    marginBottom: spacing.xs,
  },
  titleSecond: {
    marginBottom: spacing.sm,
  },
  desc: {
    marginBottom: spacing.xs,
  },
  descSecond: {
    marginBottom: spacing.sm,
  },
});
