import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Wand2 } from 'lucide-react-native';
import colors from '@/constants/colors';
import { usePostForm } from '@/contexts/PostFormContext';
import { trpc } from '@/lib/trpc';

export default function BasicInfoStep() {
  const { formData, updateFormData } = usePostForm();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const getSuggestionsMutation = trpc.templates.getSuggestions.useMutation();

  const handleAISuggestions = async () => {
    if (!formData.type) {
      Alert.alert('Lỗi', 'Vui lòng chọn loại bất động sản trước.');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Requesting AI suggestions for type:', formData.type);
      const result = await getSuggestionsMutation.mutateAsync({
        type: formData.type,
      });

      console.log('AI suggestions received:', result);

      updateFormData({
        title: result.title,
        description: result.description,
        price: result.price,
        area: result.area,
      });

      Alert.alert(
        '✨ Đã điền thông tin',
        'AI đã tự động điền các trường. Bạn có thể chỉnh sửa lại thông tin nếu cần.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Error getting AI suggestions:', error);
      const errorMessage = error?.message || 'Không thể tạo gợi ý. Vui lòng thử lại.';
      Alert.alert(
        'Lỗi',
        errorMessage.includes('fetch') 
          ? 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'
          : errorMessage
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thông tin cơ bản</Text>
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

      <View style={styles.section}>
        <Text style={styles.label}>Tiêu đề *</Text>
        <TextInput
          style={styles.input}
          placeholder="VD: Nhà phố 3 tầng mặt tiền đường..."
          value={formData.title}
          onChangeText={(text) => updateFormData({ title: text })}
          placeholderTextColor={colors.textLight}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.section, styles.halfWidth]}>
          <Text style={styles.label}>Giá (VNĐ) *</Text>
          <TextInput
            style={styles.input}
            placeholder="8500000000"
            value={formData.price}
            onChangeText={(text) => updateFormData({ price: text })}
            keyboardType="numeric"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={[styles.section, styles.halfWidth]}>
          <Text style={styles.label}>Diện tích (m²) *</Text>
          <TextInput
            style={styles.input}
            placeholder="120"
            value={formData.area}
            onChangeText={(text) => updateFormData({ area: text })}
            keyboardType="numeric"
            placeholderTextColor={colors.textLight}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Mô tả *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mô tả chi tiết về bất động sản..."
          value={formData.description}
          onChangeText={(text) => updateFormData({ description: text })}
          multiline
          numberOfLines={8}
          maxLength={2000}
          placeholderTextColor={colors.textLight}
        />
        <Text style={styles.charCount}>{formData.description.length}/2000</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
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
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'right',
    marginTop: 4,
  },
});
