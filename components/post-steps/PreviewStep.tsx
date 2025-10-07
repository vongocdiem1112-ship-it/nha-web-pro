import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { MapPin, Home, Bed, Bath, Compass } from 'lucide-react-native';
import colors from '@/constants/colors';
import { usePostForm } from '@/contexts/PostFormContext';
import { PROPERTY_TYPES } from '@/constants/listingTemplates';

export default function PreviewStep() {
  const { formData } = usePostForm();

  const typeLabel = PROPERTY_TYPES.find((t) => t.value === formData.type)?.label || '';
  const priceFormatted = parseFloat(formData.price || '0').toLocaleString('vi-VN');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Xem trước tin đăng</Text>
        <Text style={styles.subtitle}>Kiểm tra lại thông tin trước khi đăng</Text>
      </View>

      {formData.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {formData.images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </ScrollView>
      )}

      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{typeLabel}</Text>
        </View>

        <Text style={styles.propertyTitle}>{formData.title}</Text>

        <Text style={styles.price}>{priceFormatted} VNĐ</Text>

        <View style={styles.specs}>
          <View style={styles.spec}>
            <Home size={18} color={colors.textSecondary} />
            <Text style={styles.specText}>{formData.area} m²</Text>
          </View>

          {formData.bedrooms && (
            <View style={styles.spec}>
              <Bed size={18} color={colors.textSecondary} />
              <Text style={styles.specText}>{formData.bedrooms} PN</Text>
            </View>
          )}

          {formData.bathrooms && (
            <View style={styles.spec}>
              <Bath size={18} color={colors.textSecondary} />
              <Text style={styles.specText}>{formData.bathrooms} PT</Text>
            </View>
          )}

          {formData.direction && (
            <View style={styles.spec}>
              <Compass size={18} color={colors.textSecondary} />
              <Text style={styles.specText}>{formData.direction}</Text>
            </View>
          )}
        </View>

        <View style={styles.location}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={styles.locationText}>
            {formData.address}, {formData.district}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Mô tả</Text>
        <Text style={styles.description}>{formData.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  imageScroll: {
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  specs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  spec: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
