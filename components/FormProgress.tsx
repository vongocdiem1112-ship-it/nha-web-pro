import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import colors from '@/constants/colors';
import { FormStep } from '@/contexts/PostFormContext';

interface FormProgressProps {
  steps: Array<{ key: FormStep; label: string; icon: string }>;
  currentStep: FormStep;
  completedSteps: Set<FormStep>;
  onStepPress: (step: FormStep) => void;
}

export default function FormProgress({
  steps,
  currentStep,
  completedSteps,
  onStepPress,
}: FormProgressProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.key);
          const isCurrent = step.key === currentStep;
          const isPast = index < currentIndex;
          const isAccessible = isPast || isCurrent;

          return (
            <React.Fragment key={step.key}>
              <TouchableOpacity
                style={styles.stepWrapper}
                onPress={() => isAccessible && onStepPress(step.key)}
                disabled={!isAccessible}
              >
                <View
                  style={[
                    styles.stepCircle,
                    isCurrent && styles.stepCircleCurrent,
                    isCompleted && styles.stepCircleCompleted,
                    !isAccessible && styles.stepCircleDisabled,
                  ]}
                >
                  {isCompleted ? (
                    <Check size={16} color={colors.white} strokeWidth={3} />
                  ) : (
                    <Text
                      style={[
                        styles.stepIcon,
                        isCurrent && styles.stepIconCurrent,
                        !isAccessible && styles.stepIconDisabled,
                      ]}
                    >
                      {step.icon}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isCurrent && styles.stepLabelCurrent,
                    !isAccessible && styles.stepLabelDisabled,
                  ]}
                  numberOfLines={1}
                >
                  {step.label}
                </Text>
              </TouchableOpacity>

              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    isCompleted && styles.connectorCompleted,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundGray,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepCircleCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepCircleCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  stepCircleDisabled: {
    backgroundColor: colors.backgroundGray,
    borderColor: colors.border,
    opacity: 0.5,
  },
  stepIcon: {
    fontSize: 18,
  },
  stepIconCurrent: {
    fontSize: 18,
  },
  stepIconDisabled: {
    opacity: 0.5,
  },
  stepLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  stepLabelCurrent: {
    color: colors.primary,
    fontWeight: '600',
  },
  stepLabelDisabled: {
    opacity: 0.5,
  },
  connector: {
    height: 2,
    flex: 0.3,
    backgroundColor: colors.border,
    marginBottom: 30,
  },
  connectorCompleted: {
    backgroundColor: colors.success,
  },
});
