import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Camera, X } from 'lucide-react-native';
import colors from '@/constants/colors';
import { usePostForm } from '@/contexts/PostFormContext';
import * as ImagePicker from 'expo-image-picker';

export default function ImagesStep() {
  const { formData, updateFormData } = usePostForm();

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      updateFormData({ images: [...formData.images, ...newImages].slice(0, 10) });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    updateFormData({ images: newImages });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hình ảnh</Text>
        <Text style={styles.subtitle}>Tối đa 10 ảnh ({formData.images.length}/10)</Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={handlePickImage}
          disabled={formData.images.length >= 10}
        >
          <Camera size={32} color={colors.textLight} />
          <Text style={styles.imagePickerText}>Thêm ảnh</Text>
        </TouchableOpacity>

        {formData.images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveImage(index)}
            >
              <X size={16} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.imageNumber}>
              <Text style={styles.imageNumberText}>{index + 1}</Text>
            </View>
          </View>
        ))}
      </View>

      {formData.images.length === 0 && (
        <View style={styles.emptyState}>
          <Camera size={48} color={colors.textLight} />
          <Text style={styles.emptyText}>Chưa có ảnh nào</Text>
          <Text style={styles.emptySubtext}>Thêm ít nhất 1 ảnh để tiếp tục</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
  },
  imagePickerText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNumber: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  imageNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
});
