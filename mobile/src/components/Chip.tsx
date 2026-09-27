import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BillStatus, colors, fonts, radii, statusStyle } from '@/src/constants/theme';

type Props = {
  status: BillStatus;
  /** Override the default label for this status (e.g. "₹2,904 left"). */
  label?: string;
};

export function Chip({ status, label }: Props) {
  const s = statusStyle[status];
  return (
    <View style={[styles.chip, { backgroundColor: s.bg }, status === 'vacant' && styles.vacantBorder]}>
      <Text style={[styles.text, { color: s.fg }]} numberOfLines={1}>
        {label ?? s.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 26,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  vacantBorder: {
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
  },
  text: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
  },
});
