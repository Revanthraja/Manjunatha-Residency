import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, spacing } from '@/src/constants/theme';
import { Icon } from './Icon';
import { H1, Label, Sub } from './Text';

type Props = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  /** Shows a "‹ label" back link above the title, routing back. */
  backLabel?: string;
  right?: React.ReactNode;
};

export function ScreenHeader({ title, eyebrow, subtitle, backLabel, right }: Props) {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      {backLabel ? (
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          style={styles.back}
          hitSlop={8}
        >
          <Icon name="left" size={22} color={colors.teal} />
          <Text style={styles.backText}>{backLabel}</Text>
        </Pressable>
      ) : null}
      {eyebrow ? <Label>{eyebrow}</Label> : null}
      <View style={styles.titleRow}>
        <H1 style={styles.title}>{title}</H1>
        {right}
      </View>
      {subtitle ? <Sub>{subtitle}</Sub> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12, gap: 4 },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 44,
    marginLeft: -6,
    marginBottom: -4,
  },
  backText: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: colors.teal },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  title: { flexShrink: 1 },
});
