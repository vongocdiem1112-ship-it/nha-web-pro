import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import colors from '@/constants/colors';
import { PROPERTY_TYPES } from '@/constants/listingTemplates';
import { usePostForm } from '@/contexts/PostFormContext';

const TYPE_ICONS: Record<string, string> = {
  nha: '🏠',
  dat: '🏗️',
  chung_cu: '🏢',
  cho_thue: '🏘️',
};

export default function TypeStep() {
  const { formData, updateFormData, nextStep } = usePostForm();

  const handleSelectType = (type: 'nha' | 'dat' | 'chung_cu' | 'cho_thue') => {
    updateFormData({ type });
    setTimeout(() => nextStep(), 300);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chọn loại bất động sản</Text>
        <Text style={styles.subtitle}>Bạn muốn đăng tin gì?</Text>
      </View>

      <View style={styles.grid}>
        {PROPERTY_TYPES.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.typeCard,
              formData.type === item.value && styles.typeCardSelected,
            ]}
            onPress={() => handleSelectType(item.value as typeof formData.type)}
          >
            <Text style={styles.typeIcon}>{TYPE_ICONS[item.value]}</Text>
            <Text
              style={[
                styles.typeLabel,
                formData.type === item.value && styles.typeLabelSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  typeCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  typeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  typeIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  typeLabelSelected: {
    color: colors.primary,
  },
});
