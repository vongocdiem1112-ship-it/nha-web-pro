import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable, Platform } from 'react-native';
import { Heart } from 'lucide-react-native';
import { Listing } from '@/mocks/listings';
import { formatPrice, formatArea } from '@/utils/format';
import colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

interface PropertyCardProps {
  listing: Listing;
  onPress: () => void;
  onFavoritePress: () => void;
  isFavorite: boolean;
}

export default function PropertyCard({ listing, onPress, onFavoritePress, isFavorite }: PropertyCardProps) {
  const handleFavoritePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onFavoritePress();
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: listing.images[0] }} style={styles.image} resizeMode="cover" />
        {listing.isHot && (
          <View style={styles.hotBadge}>
            <Text style={styles.hotText}>HOT</Text>
          </View>
        )}
        <Pressable style={styles.favoriteButton} onPress={handleFavoritePress}>
          <Heart
            size={20}
            color={isFavorite ? colors.error : colors.white}
            fill={isFavorite ? colors.error : 'transparent'}
          />
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={styles.price}>{formatPrice(listing.price)}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {listing.title}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.area}>{formatArea(listing.area)}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.address} numberOfLines={1}>
            {listing.district}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: colors.backgroundGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hotBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  hotText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.white,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  content: {
    padding: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 21,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  area: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  separator: {
    fontSize: 12,
    color: colors.textLight,
    marginHorizontal: 8,
  },
  address: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
});
