import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { List } from 'lucide-react-native';
import colors from '@/constants/colors';
import { formatPrice } from '@/utils/format';

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
  const initialRegion = {
    latitude: 10.3459,
    longitude: 107.0843,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            coordinate={listing.coordinates}
            pinColor={colors.primary}
            onPress={() => onMarkerPress(listing.id)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <Text style={styles.markerText}>{formatPrice(listing.price)}</Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity style={styles.listButton}>
        <List size={20} color={colors.white} />
        <Text style={styles.listButtonText}>Danh sách</Text>
      </TouchableOpacity>

      {selectedListing && (
        <View style={styles.miniCard}>
          <Text style={styles.miniCardTitle}>
            {listings.find((l) => l.id === selectedListing)?.title}
          </Text>
          <Text style={styles.miniCardPrice}>
            {formatPrice(listings.find((l) => l.id === selectedListing)?.price || 0)}
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.white,
  },
  markerText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700' as const,
  },
  listButton: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  listButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  miniCard: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  miniCardTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  miniCardPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.error,
  },
});
