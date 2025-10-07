import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import colors from '@/constants/colors';
import typography from '@/constants/typography';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  testID?: string;
}

export default function Avatar({
  source,
  name,
  size = 'md',
  style,
  testID,
}: AvatarProps) {
  const getInitials = (fullName?: string) => {
    if (!fullName) return '?';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const sizeValue = size === 'sm' ? 32 : size === 'md' ? 48 : 64;
  const fontSize = size === 'sm' ? typography.fontSizes.sm : size === 'md' ? typography.fontSizes.lg : typography.fontSizes['2xl'];

  return (
    <View
      style={[
        styles.avatar,
        { width: sizeValue, height: sizeValue, borderRadius: sizeValue / 2 },
        style,
      ]}
      testID={testID}
    >
      {source ? (
        <Image
          source={{ uri: source }}
          style={[styles.image, { width: sizeValue, height: sizeValue, borderRadius: sizeValue / 2 }]}
        />
      ) : (
        <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
  },
});
