import React from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '@/src/constants/theme';
import { Button, Card, Chip, IconButton } from '@/src/components';
import { Icon } from '@/src/components/Icon';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { ScreenBody, ScreenRoot } from '@/src/components/Screen';
import { Label, Name, Sub } from '@/src/components/Text';
import { formatDate, formatMonth, formatRupees, initials } from '@/src/lib/format';
import { BillStatus } from '@/src/constants/theme';
import { useUnitDetailController } from '@/src/controllers/useUnitDetailController';

type Props = ReturnType<typeof useUnitDetailController>;

export function UnitDetailView(props: Props) {
  const { loading, unit, tenancy, reading, bills, goToRecordPayment, moveOut } = props;

  if (loading || !unit) {
    return (
      <ScreenRoot>
        <View style={styles.center}>
          <ActivityIndicator color={colors.teal} />
        </View>
      </ScreenRoot>
    );
  }

  const latestBill = bills[0];
  const status = (latestBill?.summary?.status ?? 'vacant') as BillStatus;

  return (
    <ScreenRoot>
      <ScreenHeader
        backLabel="Units"
        eyebrow={`${unit.building.name} · Floor ${unit.floor}`}
        title={`House ${unit.unit_number}`}
        right={tenancy && latestBill ? <Chip status={status} /> : undefined}
      />
      <ScreenBody>
        {tenancy ? (
          <>
            <Card>
              <View style={styles.row}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials(tenancy.tenant.full_name)}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Name>{tenancy.tenant.full_name}</Name>
                  <Sub>{tenancy.tenant.phone}</Sub>
                </View>
                <IconButton
                  name="phone"
                  accessibilityLabel={`Call ${tenancy.tenant.full_name}`}
                  onPress={() => Linking.openURL(`tel:${tenancy.tenant.phone}`)}
                />
              </View>
              <View style={styles.divider} />
              <View style={styles.statGrid}>
                <View style={{ gap: 2 }}>
                  <Label>Rent</Label>
                  <Name style={styles.num}>{formatRupees(tenancy.rent)}</Name>
                </View>
                <View style={{ gap: 2 }}>
                  <Label>Deposit</Label>
                  <Name style={styles.num}>{formatRupees(tenancy.deposit)}</Name>
                </View>
                <View style={{ gap: 2 }}>
                  <Label>Since</Label>
                  <Name>{formatDate(tenancy.start_date)}</Name>
                </View>
              </View>
            </Card>

            {reading ? (
              <Card style={styles.readingCard}>
                <View style={styles.boltBadge}>
                  <Icon name="bolt" size={22} color={colors.partialFg} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Name style={styles.num}>Meter {reading.reading}</Name>
                  <Sub>Read {formatDate(reading.reading_date)}</Sub>
                </View>
              </Card>
            ) : null}

            <Label>Bills</Label>
            <Card style={{ padding: 0, gap: 0, overflow: 'hidden' }}>
              {bills.length === 0 ? (
                <Sub style={{ padding: spacing.lg }}>No bills made yet.</Sub>
              ) : (
                bills.map((b, i) => (
                  <View key={b.id} style={[styles.billRow, i > 0 && styles.billDivider]}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Name>{formatMonth(b.month)}</Name>
                      <Sub style={styles.num}>{formatRupees(b.total)}</Sub>
                    </View>
                    <Chip status={(b.summary?.status ?? 'unpaid') as BillStatus} />
                  </View>
                ))
              )}
            </Card>

            <View style={styles.row}>
              <Button variant="secondary" style={{ flex: 1 }} onPress={goToRecordPayment}>
                Record payment
              </Button>
              <Button variant="neutral" style={{ flex: 1 }} onPress={moveOut}>
                Move out
              </Button>
            </View>
          </>
        ) : (
          <Card>
            <Label>Vacant</Label>
            <Sub>Asking {formatRupees(unit.rent)} a month. Move a tenant in from the Units list.</Sub>
          </Card>
        )}
      </ScreenBody>
    </ScreenRoot>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.paidBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.paidFg },
  divider: { height: 1, backgroundColor: colors.divider },
  statGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  num: { fontVariant: ['tabular-nums'] },
  readingCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  boltBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.partialBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  billDivider: { borderTopWidth: 1, borderTopColor: colors.divider },
});
