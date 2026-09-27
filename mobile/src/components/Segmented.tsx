import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '@/src/constants/theme';

type Props<T extends string | number> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
};

/** `.seg` — the pill-group segmented control used for block/status filters. */
export function Segmented<T extends string | number>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.wrap} accessibilityRole="tablist">
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={[styles.btn, on && styles.btnOn]}
          >
            <Text style={[styles.text, on && styles.textOn]} numberOfLines={1}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 4, padding: 4, backgroundColor: colors.chipNeutralBg, borderRadius: radii.md },
  btn: { flex: 1, height: 40, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  btnOn: {
    backgroundColor: colors.card,
    shadowColor: '#1F1D1A',
    shadowOpacity: 0.12,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  text: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.mutedStrong },
  textOn: { color: colors.teal },
});
