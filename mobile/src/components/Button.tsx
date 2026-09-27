import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { colors, fonts, radii } from '@/src/constants/theme';
import { Icon } from './Icon';
import { IconName } from '@/src/constants/icons';

type Props = {
  children: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'neutral';
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Full-width `.btn` (primary) / `.btn2` (secondary, outlined). */
export function Button({ children, onPress, variant = 'primary', icon, disabled, loading, style }: Props) {
  const isPrimary = variant === 'primary';
  const isNeutral = variant === 'neutral';
  const iconColor = isPrimary ? '#FFFFFF' : isNeutral ? colors.mutedStrong : colors.teal;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary
          ? { backgroundColor: pressed ? colors.tealDark : colors.teal }
          : {
              backgroundColor: colors.card,
              borderWidth: 1.5,
              borderColor: isNeutral ? colors.borderStrong : colors.teal,
            },
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <>
          {icon ? <Icon name={icon} size={20} color={iconColor} /> : null}
          <Text
            style={[
              styles.label,
              { color: isPrimary ? '#FFFFFF' : isNeutral ? colors.mutedStrong : colors.teal },
            ]}
          >
            {children}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabled: { opacity: 0.5 },
  label: { fontFamily: fonts.sansSemiBold, fontSize: 16 },
});
