export const colors = {
  // Modern blue-green theme for real estate
  primary: '#059669', // Emerald green - trust, growth, money
  primaryDark: '#047857',
  primaryLight: '#34D399', 
  primaryLighter: '#D1FAE5',
  
  // Gold accent for premium feel
  accent: '#F59E0B',
  accentLight: '#FEF3C7',
  
  // Clean backgrounds
  background: '#FFFFFF',
  backgroundGray: '#F9FAFB',
  backgroundDark: '#F3F4F6',
  
  // Better text hierarchy
  text: '#111827', // Darker for better contrast
  textSecondary: '#6B7280', 
  textLight: '#9CA3AF',
  
  // Softer borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Status colors
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  
  white: '#FFFFFF',
  black: '#000000',
  
  // Enhanced shadows
  shadow: 'rgba(0, 0, 0, 0.04)',
  shadowMedium: 'rgba(0, 0, 0, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.12)',
  
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  gradient: {
    primary: ['#059669', '#047857'],
    accent: ['#F59E0B', '#EF4444'],
    subtle: ['#F9FAFB', '#F3F4F6'],
  },
} as const;

export default colors;
