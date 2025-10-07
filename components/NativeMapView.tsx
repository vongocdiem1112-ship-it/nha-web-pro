import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/colors';

interface Listing {
  id: string;
  title: string;
  price: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface NativeMapViewProps {
  listings: Listing[];
  selectedListing: string | null;
  onMarkerPress: (id: string) => void;
}

export default function NativeMapView({ listings, selectedListing, onMarkerPress }: NativeMapViewProps) {
  return (
    <View style={styles.webFallback}>
      <Text style={styles.webText}>Bản đồ chỉ khả dụng trên thiết bị di động</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
  },
  webText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
