import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoadingSkeleton from './LoadingSkeleton';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoadingSkeleton from './LoadingSkeleton';
import colors from '@/constants/colors';

export default function PropertyCardSkeleton() {
  return (
    <View style={styles.card}>
      <LoadingSkeleton 
        width="100%" 
        height={130} 
        borderRadius={0}
        style={styles.image}
      />
      <View style={styles.content}>
        <LoadingSkeleton width="65%" height={18} borderRadius={6} />
        <View style={styles.spacer} />
        <LoadingSkeleton width="95%" height={15} borderRadius={4} />
        <View style={styles.smallSpacer} />
        <LoadingSkeleton width="75%" height={15} borderRadius={4} />
        <View style={styles.spacer} />
        <View style={styles.footer}>
          <LoadingSkeleton width="35%" height={13} borderRadius={4} />
          <LoadingSkeleton width="45%" height={13} borderRadius={4} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: colors.borderLight,
  },
  image: {
    aspectRatio: 4 / 3,
  },
  content: {
    padding: 16,
  },
  spacer: {
    height: 10,
  },
  smallSpacer: {
    height: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
