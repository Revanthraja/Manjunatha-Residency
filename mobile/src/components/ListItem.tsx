import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '@/src/constants/theme';
import { BillStatus } from '@/src/constants/theme';
import { Chip } from './Chip';
import { Icon } from './Icon';

type Props = {
  door: string;
  name: string;
  sub: string;
  status: BillStatus;
  statusLabel?: string;
  onPress?: () => void;
};

/** A house row: door badge, name/sub, status chip. `.item` in the mockups. */
export function UnitListItem({ door, name, sub, status, statusLabel, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, onPress && pressed && { backgroundColor: '#FBF9F5' }]}
    >
      <View style={styles.door}>
        <Text style={styles.doorText}>{door}</Text>
      </View>
      <View style={styles.mid}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {sub}
        </Text>
      </View>
      <Chip status={status} label={statusLabel} />
      {onPress ? <Icon name="right" size={18} color={colors.placeholder} /> : null}
    </Pressable>
  );
}

/** A plain list container — `.list` — wraps ListItem/UnitListItem rows. */
export function List({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children);
  return (
    <View style={styles.list}>
      {items.map((child, i) => (
        <View key={i} style={i > 0 ? styles.divider : undefined}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  divider: { borderTopWidth: 1, borderTopColor: colors.divider },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  door: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.doorBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doorText: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.ink },
  mid: { flex: 1, gap: 2, minWidth: 0 },
  name: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: colors.ink },
  sub: { fontFamily: fonts.sansRegular, fontSize: 14, color: colors.muted },
});
