import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '@/src/constants/theme';
import { Card, Chip } from '@/src/components';
import { Icon } from '@/src/components/Icon';
import { H1, Label, Name, Sub } from '@/src/components/Text';
import { ScreenBody, ScreenRoot } from '@/src/components/Screen';
import { formatMonth, formatRupees } from '@/src/lib/format';
import { BillStatus } from '@/src/constants/theme';
import { useTenantBillsController } from '@/src/controllers/useTenantBillsController';

type Props = ReturnType<typeof useTenantBillsController>;

export function TenantBillsView(props: Props) {
  const { loading, unit, current, currentPayments, earlier, openReceipt } = props;

  return (
    <ScreenRoot>
      <View style={styles.top}>
        <H1>Bills &amp; receipts</H1>
        {unit ? (
          <Sub>
            {unit.building_name} · House {unit.unit_number}
          </Sub>
        ) : null}
      </View>
      <ScreenBody>
        {loading ? (
          <Sub>Loading…</Sub>
        ) : current ? (
          <Card style={{ padding: 0, gap: 0, overflow: 'hidden' }}>
            <View style={styles.head}>
              <Name>{formatMonth(current.month)}</Name>
              <Chip
                status={(current.summary?.status ?? 'unpaid') as BillStatus}
                label={
                  current.summary?.status === 'partial'
                    ? `${formatRupees(current.summary?.balance ?? 0)} left`
                    : undefined
                }
              />
            </View>
            <View style={styles.headSub}>
              <Sub>
                {formatRupees(current.total)} · due {formatMonth(current.due_date)}
              </Sub>
            </View>
            {currentPayments.length > 0 ? <View style={styles.divider} /> : null}
            {currentPayments.map((p) => (
              <Pressable key={p.id} onPress={() => openReceipt(p.id)} style={styles.paymentRow}>
                <View style={{ gap: 2 }}>
                  <Text style={styles.paymentAmount}>
                    {formatRupees(p.amount)} by {p.method === 'upi' ? 'UPI' : p.method.replace('_', ' ')} ·{' '}
                    {formatMonth(p.paid_on).split(' ')[0]}
                  </Text>
                  <Text style={styles.receiptNo}>Receipt No. {p.id}</Text>
                </View>
                <Icon name="right" size={18} color={colors.placeholder} />
              </Pressable>
            ))}
          </Card>
        ) : (
          <Card>
            <Sub>No bill has been made for this month yet.</Sub>
          </Card>
        )}

        {earlier.length > 0 ? (
          <>
            <Label>Earlier</Label>
            <Card style={{ padding: 0, gap: 0, overflow: 'hidden' }}>
              {earlier.map((b, i) => (
                <View key={b.id} style={[styles.billRow, i > 0 && styles.divider]}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Name>{formatMonth(b.month)}</Name>
                    <Sub style={{ fontVariant: ['tabular-nums'] }}>{formatRupees(b.total)}</Sub>
                  </View>
                  <Chip status={(b.summary?.status ?? 'unpaid') as BillStatus} />
                </View>
              ))}
            </Card>
          </>
        ) : null}
      </ScreenBody>
    </ScreenRoot>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12, gap: 4 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 4 },
  headSub: { paddingHorizontal: 16, paddingBottom: 12 },
  divider: { height: 1, backgroundColor: colors.divider, marginHorizontal: 0 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, minHeight: 44 },
  paymentAmount: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: colors.ink },
  receiptNo: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.mutedStrong },
  billRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
});
