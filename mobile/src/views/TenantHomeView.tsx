import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '@/src/constants/theme';
import { Button, Card, Chip, MoneyRow } from '@/src/components';
import { Icon } from '@/src/components/Icon';
import { H1, Label, Serif, Sub } from '@/src/components/Text';
import { ScreenBody, ScreenRoot } from '@/src/components/Screen';
import { formatDate } from '@/src/lib/format';
import { BillStatus } from '@/src/constants/theme';
import { useTenantHomeController } from '@/src/controllers/useTenantHomeController';

type Props = ReturnType<typeof useTenantHomeController>;

export function TenantHomeView(props: Props) {
  const { loading, fullName, unit, bill, upiId, copyUpi, latestReading, thisMonthUnits, lastMonthUnits } = props;
  const balance = bill?.summary?.balance ?? 0;
  const status = (bill?.summary?.status ?? 'paid') as BillStatus;

  return (
    <ScreenRoot>
      <View style={styles.top}>
        {unit ? (
          <Label>
            {unit.building_name} · House {unit.unit_number}
          </Label>
        ) : null}
        <H1>Hello, {fullName.split(' ')[0] || 'there'}</H1>
      </View>
      <ScreenBody>
        {loading ? (
          <Sub>Loading…</Sub>
        ) : bill ? (
          <Card>
            <View style={styles.between}>
              <Label>{bill.month ? `${new Date(bill.month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} bill` : 'Current bill'}</Label>
              <Chip status={status} label={status === 'paid' ? 'Paid' : status === 'partial' ? 'Part paid' : undefined} />
            </View>
            <View>
              <Serif style={styles.amount}>{balance > 0 ? `₹${Math.round(balance).toLocaleString('en-IN')}` : '₹0'}</Serif>
              <Sub style={{ marginTop: 6 }}>
                {balance > 0 ? `left to pay · due ${formatDate(bill.due_date)}` : 'nothing due — thank you'}
              </Sub>
            </View>
            <View style={styles.divider} />
            <MoneyRow label="Rent" amount={bill.rent} />
            <MoneyRow label="Electricity" amount={bill.electricity} />
            {(bill.summary?.paid ?? 0) > 0 ? <MoneyRow label="Paid" amount={-(bill.summary?.paid ?? 0)} /> : null}
          </Card>
        ) : (
          <Card>
            <Sub>No bill has been made for this month yet.</Sub>
          </Card>
        )}

        <Card>
          <Label>How to pay</Label>
          <Text style={styles.payText}>
            Pay by UPI to <Text style={styles.bold}>{upiId}</Text> or in cash to the manager. Payments show here, with
            a receipt, once they’re recorded.
          </Text>
          <Button variant="secondary" icon="copy" onPress={copyUpi}>
            Copy UPI ID
          </Button>
        </Card>

        {latestReading ? (
          <Card style={styles.readingCard}>
            <View style={styles.boltBadge}>
              <Icon name="bolt" size={22} color={colors.partialFg} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.readingText}>
                Meter {latestReading.reading} on {formatDate(latestReading.reading_date)}
              </Text>
              {thisMonthUnits !== null ? (
                <Sub>
                  {thisMonthUnits} units this month{lastMonthUnits !== null ? ` · ${lastMonthUnits} last month` : ''}
                </Sub>
              ) : null}
            </View>
          </Card>
        ) : null}
      </ScreenBody>
    </ScreenRoot>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12, gap: 4 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  amount: { fontSize: 42, lineHeight: 46 },
  divider: { height: 1, backgroundColor: colors.divider },
  payText: { fontFamily: fonts.sansRegular, fontSize: 14, lineHeight: 20, color: colors.mutedStrong },
  bold: { fontFamily: fonts.sansBold, color: colors.ink },
  readingCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  boltBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.partialBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readingText: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: colors.ink, fontVariant: ['tabular-nums'] },
});
