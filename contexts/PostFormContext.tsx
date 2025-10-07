import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PostFormData {
  type: 'nha' | 'dat' | 'chung_cu' | 'cho_thue';
  images: string[];
  title: string;
  price: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  direction: string;
  address: string;
  district: string;
  description: string;
}

export type FormStep = 'type' | 'basic' | 'details' | 'location' | 'images' | 'preview';

interface PostFormContextType {
  formData: PostFormData;
  currentStep: FormStep;
  completedSteps: Set<FormStep>;
  updateFormData: (data: Partial<PostFormData>) => void;
  goToStep: (step: FormStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetForm: () => void;
  isStepValid: (step: FormStep) => boolean;
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
  clearDraft: () => Promise<void>;
}

const DRAFT_KEY = '@vungtauland_post_draft';

const INITIAL_FORM_DATA: PostFormData = {
  type: 'nha',
  images: [],
  title: '',
  price: '',
  area: '',
  bedrooms: '',
  bathrooms: '',
  direction: '',
  address: '',
  district: '',
  description: '',
};

const STEP_ORDER: FormStep[] = ['type', 'basic', 'details', 'location', 'images', 'preview'];

const PostFormContext = createContext<PostFormContextType | undefined>(undefined);

export function PostFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<PostFormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState<FormStep>('type');
  const [completedSteps, setCompletedSteps] = useState<Set<FormStep>>(new Set());

  useEffect(() => {
    loadDraft();
  }, []);

  const saveDraft = useCallback(async () => {
    try {
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify({
        formData,
        currentStep,
        completedSteps: Array.from(completedSteps),
      }));
      console.log('Draft saved');
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }, [formData, currentStep, completedSteps]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft();
    }, 1000);

    return () => clearTimeout(timer);
  }, [saveDraft]);

  const updateFormData = useCallback((data: Partial<PostFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const isStepValid = useCallback((step: FormStep): boolean => {
    switch (step) {
      case 'type':
        return !!formData.type;
      case 'basic':
        return !!formData.title && !!formData.price && !!formData.area;
      case 'details':
        if (formData.type === 'dat') return true;
        return !!formData.bedrooms && !!formData.bathrooms;
      case 'location':
        return !!formData.address && !!formData.district;
      case 'images':
        return formData.images.length > 0;
      case 'preview':
        return true;
      default:
        return false;
    }
  }, [formData]);

  const goToStep = useCallback((step: FormStep) => {
    setCurrentStep(step);
    if (isStepValid(step)) {
      setCompletedSteps((prev) => new Set([...prev, step]));
    }
  }, [isStepValid]);

  const nextStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      const nextStepValue = STEP_ORDER[currentIndex + 1];
      if (isStepValid(currentStep)) {
        setCompletedSteps((prev) => new Set([...prev, currentStep]));
      }
      setCurrentStep(nextStepValue);
    }
  }, [currentStep, isStepValid]);

  const previousStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
    }
  }, [currentStep]);

  const clearDraft = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_KEY);
      console.log('Draft cleared');
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep('type');
    setCompletedSteps(new Set());
    clearDraft();
  }, [clearDraft]);



  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem(DRAFT_KEY);
      if (draft) {
        const parsed = JSON.parse(draft);
        setFormData(parsed.formData);
        setCurrentStep(parsed.currentStep);
        setCompletedSteps(new Set(parsed.completedSteps));
        console.log('Draft loaded');
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };



  const value = useMemo(
    () => ({
      formData,
      currentStep,
      completedSteps,
      updateFormData,
      goToStep,
      nextStep,
      previousStep,
      resetForm,
      isStepValid,
      saveDraft,
      loadDraft,
      clearDraft,
    }),
    [formData, currentStep, completedSteps, updateFormData, goToStep, nextStep, previousStep, resetForm, isStepValid, saveDraft, clearDraft]
  );

  return (
    <PostFormContext.Provider value={value}>
      {children}
    </PostFormContext.Provider>
  );
}

export function usePostForm() {
  const context = useContext(PostFormContext);
  if (!context) {
    throw new Error('usePostForm must be used within PostFormProvider');
  }
  return context;
}
