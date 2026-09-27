import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, spacing } from '@/src/constants/theme';
import { Button, Card, Chip, IconButton } from '@/src/components';
import { Icon } from '@/src/components/Icon';
import { H1, Label, Serif, Sub } from '@/src/components/Text';
import { ScreenBody, ScreenRoot } from '@/src/components/Screen';
import { formatRupees } from '@/src/lib/format';
import { BillStatus } from '@/src/constants/theme';
import { useStaffHomeController } from '@/src/controllers/useStaffHomeController';

type Props = ReturnType<typeof useStaffHomeController>;

function Tile({ value, label, danger, onPress }: { value: number; label: string; danger?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.tile}>
      <Text style={[styles.tileValue, danger && { color: colors.overdueFg }]}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </Pressable>
  );
}

export function StaffHomeView(props: Props) {
  const { scope, loading, refreshing, refresh, totals, vacantCount, openRepairs, followUp, monthLabel } = props;
  const router = useRouter();
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <ScreenRoot>
      <View style={styles.top}>
        <View style={styles.topRow}>
          <View style={{ gap: 4 }}>
            <Label>{today}</Label>
            <H1>Good morning</H1>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {scope.showPicker ? (
              <Pressable onPress={scope.cycle} style={styles.pickerBtn}>
                <Text style={styles.pickerText} numberOfLines={1}>
                  {scope.label}
                </Text>
                <Icon name="down" size={18} color={colors.mutedStrong} />
              </Pressable>
            ) : null}
            <IconButton name="user" accessibilityLabel="Your profile" onPress={() => router.push('/profile')} />
          </View>
        </View>
      </View>
      <ScreenBody onRefresh={refresh} refreshing={refreshing}>
        <Card>
          <Label>{monthLabel} collection</Label>
          <View style={styles.amountRow}>
            <Serif style={styles.amount}>{formatRupees(totals.collected)}</Serif>
            <Sub>of {formatRupees(totals.totalDue)}</Sub>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.min(totals.pct, 100)}%` }]} />
          </View>
          <View style={styles.between}>
            <Sub>{totals.pct}% collected</Sub>
            <Text style={styles.pendingText}>{formatRupees(totals.pending)} pending</Text>
          </View>
        </Card>

        <View style={styles.tileGrid}>
          <Tile value={totals.overdueCount} label="Overdue" danger onPress={() => router.push('/(staff)/units')} />
          <Tile value={totals.unpaidCount} label="Unpaid" onPress={() => router.push('/(staff)/units')} />
          <Tile value={vacantCount} label="Vacant" onPress={() => router.push('/(staff)/units')} />
          <Tile value={openRepairs} label="Repairs" onPress={() => router.push('/(staff)/repairs')} />
        </View>

        <View style={styles.row}>
          <Button variant="secondary" icon="bolt" style={{ flex: 1 }} onPress={() => router.push('/(staff)/bills')}>
            Make bills
          </Button>
          <Button variant="secondary" icon="plus" style={{ flex: 1 }} onPress={() => router.push('/(staff)/units')}>
            Move in
          </Button>
        </View>

        <Label style={{ marginTop: 4 }}>Follow up</Label>
        <View style={styles.list}>
          {loading ? (
            <Sub style={{ padding: spacing.lg }}>Loading…</Sub>
          ) : followUp.length === 0 ? (
            <Sub style={{ padding: spacing.lg }}>Nothing pending — everyone is paid up.</Sub>
          ) : (
            followUp.map((b, i) => (
              <Pressable
                key={b.bill_id}
                onPress={() => router.push(`/(staff)/bills/${b.bill_id}/pay`)}
                style={[styles.followRow, i > 0 && styles.followDivider]}
              >
                <View style={styles.door}>
                  <Text style={styles.doorText}>{b.unit_number}</Text>
                </View>
                <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
                  <Text style={styles.tenantName} numberOfLines={1}>
                    {b.tenant_name}
                  </Text>
                  <Sub numberOfLines={1}>
                    {b.status === 'partial' ? `${formatRupees(b.balance)} left` : `${formatRupees(b.total)} unpaid`}
                  </Sub>
                </View>
                <Chip status={b.status as BillStatus} />
                {b.tenant_phone ? (
                  <IconButton
                    name="phone"
                    accessibilityLabel={`Call ${b.tenant_name}`}
                    onPress={() => Linking.openURL(`tel:${b.tenant_phone}`)}
                  />
                ) : null}
              </Pressable>
            ))
          )}
        </View>
      </ScreenBody>
    </ScreenRoot>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    maxWidth: 160,
  },
  pickerText: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.mutedStrong, flexShrink: 1 },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  amount: { fontSize: 34 },
  track: { height: 10, borderRadius: 99, backgroundColor: colors.chipNeutralBg, overflow: 'hidden' },
  fill: { height: 10, borderRadius: 99, backgroundColor: colors.teal },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pendingText: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.mutedStrong },
  tileGrid: { flexDirection: 'row', gap: 8 },
  tile: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 2,
  },
  tileValue: { fontFamily: fonts.serif, fontSize: 26, color: colors.ink },
  tileLabel: { fontFamily: fonts.sansSemiBold, fontSize: 12, color: colors.muted },
  row: { flexDirection: 'row', gap: 8 },
  list: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    overflow: 'hidden',
  },
  followRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, paddingHorizontal: 16, minHeight: 44 },
  followDivider: { borderTopWidth: 1, borderTopColor: colors.divider },
  door: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.doorBg, alignItems: 'center', justifyContent: 'center' },
  doorText: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.ink },
  tenantName: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: colors.ink },
});
