import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '@/src/constants/theme';
import { Button, Card, Field, MoneyRow, Pill } from '@/src/components';
import { ScreenBody, ScreenRoot } from '@/src/components/Screen';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { Label } from '@/src/components/Text';
import { formatMonth } from '@/src/lib/format';
import { useRecordPaymentController } from '@/src/controllers/useRecordPaymentController';

type Props = ReturnType<typeof useRecordPaymentController>;

export function RecordPaymentView(props: Props) {
  const { loading, bill, methods, amount, setAmount, method, setMethod, reference, setReference, paidOn, setPaidOn, submitting, error, submit } =
    props;

  if (loading || !bill) {
    return (
      <ScreenRoot>
        <View style={styles.center}>
          <ActivityIndicator color={colors.teal} />
        </View>
      </ScreenRoot>
    );
  }

  return (
    <ScreenRoot>
      <ScreenHeader
        backLabel={`House ${bill.unit_number}`}
        title="Record payment"
        subtitle={`${bill.tenant_name} · ${bill.building_name} · ${bill.unit_number}`}
      />
      <ScreenBody>
        <Card>
          <Label>{formatMonth(bill.month)} bill</Label>
          <MoneyRow label="Rent" amount={bill.rent} />
          <MoneyRow label={`Electricity · ${bill.electricityUnits} units`} amount={bill.electricity} />
          {bill.other ? <MoneyRow label={bill.note || 'Other'} amount={bill.other} /> : null}
          <View style={styles.divider} />
          <MoneyRow label="Total" amount={bill.total ?? 0} strong />
          <MoneyRow label="Already paid" amount={-(bill.summary?.paid ?? 0)} />
          <View style={styles.divider} />
          <MoneyRow label="Balance" amount={bill.summary?.balance ?? 0} strong color={colors.partialFg} />
        </Card>

        <Field
          label="Amount received"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.amountInput}
        />

        <View style={{ gap: 8 }}>
          <Text style={styles.label}>Paid by</Text>
          <View style={styles.row}>
            {methods.map((m) => (
              <Pill key={m.value} label={m.label} selected={method === m.value} onPress={() => setMethod(m.value)} />
            ))}
          </View>
        </View>

        <View style={styles.grid}>
          <Field
            label={method === 'upi' ? 'UPI reference' : 'Reference'}
            value={reference}
            onChangeText={setReference}
            placeholder="Optional"
            containerStyle={styles.half}
          />
          <Field label="Paid on" value={paidOn} onChangeText={setPaidOn} containerStyle={styles.half} />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScreenBody>
      <View style={styles.footer}>
        <Button onPress={submit} loading={submitting}>
          Save and make receipt
        </Button>
      </View>
    </ScreenRoot>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: colors.divider },
  amountInput: { fontFamily: fonts.sansBold, fontSize: 20 },
  label: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.mutedStrong },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  grid: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  error: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.overdueFg },
  footer: {
    padding: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.paper,
  },
});
