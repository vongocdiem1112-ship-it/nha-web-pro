import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { ChevronDown, X, Wand2 } from 'lucide-react-native';
import colors from '@/constants/colors';
import { usePostForm } from '@/contexts/PostFormContext';
import { DIRECTIONS } from '@/constants/listingTemplates';
import { trpc } from '@/lib/trpc';

export default function DetailsStep() {
  const { formData, updateFormData } = usePostForm();
  const [showDirectionSelector, setShowDirectionSelector] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const getSuggestionsMutation = trpc.templates.getSuggestions.useMutation();

  const isDatType = formData.type === 'dat';

  const handleAISuggestions = async () => {
    setIsGenerating(true);
    try {
      const result = await getSuggestionsMutation.mutateAsync({
        type: formData.type,
      });

      updateFormData({
        bedrooms: result.bedrooms,
        bathrooms: result.bathrooms,
        direction: result.direction,
      });

      Alert.alert(
        '✨ Đã điền thông tin',
        'AI đã tự động điền các trường chi tiết.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      Alert.alert('Lỗi', 'Không thể tạo gợi ý. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Chi tiết bất động sản</Text>
          {isDatType && (
            <Text style={styles.subtitle}>Đất không cần thông tin phòng ngủ/tắm</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.aiButton}
          onPress={handleAISuggestions}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Wand2 size={18} color={colors.white} />
          )}
          <Text style={styles.aiButtonText}>
            {isGenerating ? 'Đang tạo...' : 'AI Gợi ý'}
          </Text>
        </TouchableOpacity>
      </View>

      {!isDatType && (
        <View style={styles.row}>
          <View style={[styles.section, styles.halfWidth]}>
            <Text style={styles.label}>Phòng ngủ *</Text>
            <TextInput
              style={styles.input}
              placeholder="3"
              value={formData.bedrooms}
              onChangeText={(text) => updateFormData({ bedrooms: text })}
              keyboardType="numeric"
              placeholderTextColor={colors.textLight}
            />
          </View>

          <View style={[styles.section, styles.halfWidth]}>
            <Text style={styles.label}>Phòng tắm *</Text>
            <TextInput
              style={styles.input}
              placeholder="2"
              value={formData.bathrooms}
              onChangeText={(text) => updateFormData({ bathrooms: text })}
              keyboardType="numeric"
              placeholderTextColor={colors.textLight}
            />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Hướng</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowDirectionSelector(true)}
        >
          <Text style={[styles.selectorText, !formData.direction && styles.placeholder]}>
            {formData.direction || 'Chọn hướng'}
          </Text>
          <ChevronDown size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showDirectionSelector}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDirectionSelector(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDirectionSelector(false)}
        >
          <View style={styles.pickerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn hướng</Text>
              <TouchableOpacity onPress={() => setShowDirectionSelector(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerScroll}>
              {DIRECTIONS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.pickerItem}
                  onPress={() => {
                    updateFormData({ direction: item });
                    setShowDirectionSelector(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
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
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  aiButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selector: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 15,
    color: colors.text,
  },
  placeholder: {
    color: colors.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerModal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  pickerScroll: {
    maxHeight: 300,
  },
  pickerItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerItemText: {
    fontSize: 16,
    color: colors.text,
  },
});
