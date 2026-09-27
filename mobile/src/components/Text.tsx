import React from 'react';
import { StyleSheet, Text as RNText, TextProps } from 'react-native';
import { colors, fonts } from '@/src/constants/theme';

/** "Manjunatha Residency" style — Fraunces, for headings and money amounts. */
export function Serif({ style, ...rest }: TextProps) {
  return <RNText style={[styles.serif, style]} {...rest} />;
}

export function H1({ style, ...rest }: TextProps) {
  return <RNText style={[styles.h1, style]} {...rest} />;
}

export function Label({ style, ...rest }: TextProps) {
  return <RNText style={[styles.label, style]} {...rest} />;
}

export function Sub({ style, ...rest }: TextProps) {
  return <RNText style={[styles.sub, style]} {...rest} />;
}

export function Name({ style, ...rest }: TextProps) {
  return <RNText style={[styles.name, style]} {...rest} />;
}

const styles = StyleSheet.create({
  serif: { fontFamily: fonts.serif, color: colors.ink },
  h1: { fontFamily: fonts.serif, fontSize: 30, lineHeight: 34, color: colors.ink, letterSpacing: -0.2 },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  sub: { fontFamily: fonts.sansRegular, fontSize: 14, lineHeight: 19, color: colors.muted },
  name: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: colors.ink },
});
