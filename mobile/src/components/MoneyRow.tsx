import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/src/constants/theme';
import { formatRupees } from '@/src/lib/format';

type Props = {
  label: string;
  amount: number;
  strong?: boolean;
  color?: string;
};

/** A "Rent — ₹8,000" line used inside bill/payment cards. */
export function MoneyRow({ label, amount, strong, color }: Props) {
  const weight = strong ? fonts.sansBold : fonts.sansMedium;
  const textColor = color ?? colors.ink;
  return (
    <View style={styles.row}>
      <Text style={[styles.text, { fontFamily: weight, color: textColor }]}>{label}</Text>
      <Text style={[styles.text, { fontFamily: weight, color: textColor }]}>{formatRupees(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  text: { fontSize: 15 },
});
