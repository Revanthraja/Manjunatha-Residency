import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, radii } from '@/src/constants/theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

/** `.pill` — a single toggle chip (payment method, status filter). */
export function Pill({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={[styles.base, selected && styles.on]}
    >
      <Text style={[styles.text, selected && styles.textOn]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  on: { backgroundColor: colors.teal, borderColor: colors.teal },
  text: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.mutedStrong },
  textOn: { color: '#FFFFFF' },
});
