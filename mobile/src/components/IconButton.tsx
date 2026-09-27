import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radii } from '@/src/constants/theme';
import { Icon } from './Icon';
import { IconName } from '@/src/constants/icons';

type Props = {
  name: IconName;
  onPress?: () => void;
  accessibilityLabel: string;
  size?: number;
};

/** 44×44 `.iconbtn` — a bordered square tap target, teal glyph. */
export function IconButton({ name, onPress, accessibilityLabel, size = 44 }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Icon name={name} size={20} color={colors.teal} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
