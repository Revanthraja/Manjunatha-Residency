import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '@/src/constants/theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Matches the mockups' `.card` background used for a highlighted/tinted card. */
  tint?: boolean;
};

export function Card({ children, style, tint }: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: tint ? '#FBF9F5' : colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.xl,
          padding: spacing.lg,
          gap: spacing.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
