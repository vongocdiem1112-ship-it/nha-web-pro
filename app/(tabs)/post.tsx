import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { AlertCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { usePostForm, FormStep } from '@/contexts/PostFormContext';
import FormProgress from '@/components/FormProgress';
import TypeStep from '@/components/post-steps/TypeStep';
import BasicInfoStep from '@/components/post-steps/BasicInfoStep';
import DetailsStep from '@/components/post-steps/DetailsStep';
import LocationStep from '@/components/post-steps/LocationStep';
import ImagesStep from '@/components/post-steps/ImagesStep';
import PreviewStep from '@/components/post-steps/PreviewStep';
import { LISTING_TEMPLATES, ListingTemplate } from '@/constants/listingTemplates';

const STEPS: Array<{ key: FormStep; label: string; icon: string }> = [
  { key: 'type', label: 'Loại', icon: '📋' },
  { key: 'basic', label: 'Cơ bản', icon: '📝' },
  { key: 'details', label: 'Chi tiết', icon: '🏠' },
  { key: 'location', label: 'Vị trí', icon: '📍' },
  { key: 'images', label: 'Hình ảnh', icon: '📷' },
  { key: 'preview', label: 'Xem trước', icon: '👁️' },
];

export default function PostScreen() {
  const { user } = useApp();
  const {
    formData,
    currentStep,
    completedSteps,
    updateFormData,
    goToStep,
    nextStep,
    previousStep,
    resetForm,
    isStepValid,
  } = usePostForm();

  const [showTemplates, setShowTemplates] = useState(false);

  const handleApplyTemplate = (template: ListingTemplate) => {
    updateFormData({
      type: template.type,
      title: template.fields.title,
      description: template.fields.description,
      bedrooms: template.fields.bedrooms?.toString() || '',
      bathrooms: template.fields.bathrooms?.toString() || '',
      direction: template.fields.direction || '',
    });

    if (template.fields.priceRange) {
      const avgPrice = (template.fields.priceRange.min + template.fields.priceRange.max) / 2;
      updateFormData({ price: avgPrice.toString() });
    }

    if (template.fields.areaRange) {
      const avgArea = (template.fields.areaRange.min + template.fields.areaRange.max) / 2;
      updateFormData({ area: avgArea.toString() });
    }

    setShowTemplates(false);
    Alert.alert('Thành công', 'Đã áp dụng mẫu. Vui lòng điền thông tin còn thiếu.');
  };

  const handleSubmit = () => {
    if (!isStepValid('basic') || !isStepValid('location') || !isStepValid('images')) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    console.log('Submit listing:', formData);
    Alert.alert(
      'Thành công',
      'Tin đăng của bạn đã được gửi và đang chờ duyệt!',
      [
        {
          text: 'OK',
          onPress: () => resetForm(),
        },
      ]
    );
  };

  const handleNext = () => {
    if (!isStepValid(currentStep)) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường bắt buộc (*)');
      return;
    }
    nextStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'type':
        return <TypeStep />;
      case 'basic':
        return <BasicInfoStep />;
      case 'details':
        return <DetailsStep />;
      case 'location':
        return <LocationStep />;
      case 'images':
        return <ImagesStep />;
      case 'preview':
        return <PreviewStep />;
      default:
        return null;
    }
  };

  const filteredTemplates = LISTING_TEMPLATES.filter((t) => t.type === formData.type);
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === STEPS.length - 1;

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Đăng tin',
            headerShown: true,
          }}
        />
        <View style={styles.guardContainer}>
          <AlertCircle size={64} color={colors.warning} />
          <Text style={styles.guardTitle}>Bạn cần đăng nhập</Text>
          <Text style={styles.guardDescription}>
            Vui lòng đăng nhập để đăng tin bất động sản
          </Text>
          <TouchableOpacity style={styles.guardButton}>
            <Text style={styles.guardButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (user.role !== 'broker') {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Đăng tin',
            headerShown: true,
          }}
        />
        <View style={styles.guardContainer}>
          <AlertCircle size={64} color={colors.warning} />
          <Text style={styles.guardTitle}>Cần đăng ký môi giới</Text>
          <Text style={styles.guardDescription}>
            Bạn cần đăng ký làm môi giới để đăng tin bất động sản
          </Text>
          <TouchableOpacity style={styles.guardButton}>
            <Text style={styles.guardButtonText}>Đăng ký môi giới</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (user.brokerStatus === 'pending') {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Đăng tin',
            headerShown: true,
          }}
        />
        <View style={styles.guardContainer}>
          <AlertCircle size={64} color={colors.info} />
          <Text style={styles.guardTitle}>Đang chờ phê duyệt</Text>
          <Text style={styles.guardDescription}>
            Tài khoản môi giới của bạn đang chờ admin phê duyệt (1-2 ngày)
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Đăng tin',
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowTemplates(true)}>
              <Sparkles size={22} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <FormProgress
        steps={STEPS}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepPress={goToStep}
      />

      <View style={styles.content}>{renderStep()}</View>

      <View style={styles.footer}>
        {!isFirstStep && (
          <TouchableOpacity style={styles.backButton} onPress={previousStep}>
            <ChevronLeft size={20} color={colors.primary} />
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        )}

        {!isLastStep ? (
          <TouchableOpacity
            style={[styles.nextButton, isFirstStep && styles.nextButtonFull]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Tiếp tục</Text>
            <ChevronRight size={20} color={colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.submitButton, isFirstStep && styles.nextButtonFull]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Đăng tin</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showTemplates}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTemplates(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn mẫu nhanh</Text>
              <TouchableOpacity onPress={() => setShowTemplates(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.templateList}>
              {filteredTemplates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={styles.templateItem}
                  onPress={() => handleApplyTemplate(template)}
                >
                  <Text style={styles.templateIcon}>{template.icon}</Text>
                  <View style={styles.templateInfo}>
                    <Text style={styles.templateName}>{template.name}</Text>
                    <Text style={styles.templateDesc} numberOfLines={2}>
                      {template.fields.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  guardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  guardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  guardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  guardButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  guardButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.backgroundGray,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  submitButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.success,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
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
  modalClose: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  templateList: {
    padding: 16,
  },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.backgroundGray,
    borderRadius: 12,
    marginBottom: 12,
  },
  templateIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  templateDesc: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
