import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '@/src/constants/theme';
import { Button, Card, MoneyRow } from '@/src/components';
import { useRouter } from 'expo-router';
import { Icon } from '@/src/components/Icon';
import { ScreenBody, ScreenRoot } from '@/src/components/Screen';
import { Name, Sub } from '@/src/components/Text';
import { formatDate, formatMonth, formatRupees } from '@/src/lib/format';
import { useReceiptController } from '@/src/controllers/useReceiptController';

type Props = ReturnType<typeof useReceiptController>;

export function ReceiptView(props: Props) {
  const { loading, receipt, amountInWords, share, saveAsPdf } = props;
  const router = useRouter();

  if (loading || !receipt) {
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
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" style={styles.back} hitSlop={8}>
          <Icon name="left" size={22} color={colors.teal} />
          <Text style={styles.backText}>Bills</Text>
        </Pressable>
      </View>
      <ScreenBody>
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={styles.mark}>
              <Text style={styles.markText}>MR</Text>
            </View>
            <View style={{ gap: 2 }}>
              <Name>Manjunatha Residency</Name>
              <Sub>{receipt.building_address}</Sub>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.between}>
            <Text style={styles.label}>Payment receipt</Text>
            <Text style={styles.receiptNo}>No. {receipt.id}</Text>
          </View>
          <View>
            <Text style={styles.amount}>{formatRupees(receipt.amount)}</Text>
            <Sub style={{ marginTop: 6 }}>{amountInWords}</Sub>
          </View>
          <View style={styles.divider} />
          <Row label="Received from" value={receipt.tenant_name} />
          <Row label="House" value={`${receipt.building_name} · ${receipt.unit_number}`} />
          <Row label="For" value={`${formatMonth(receipt.bill_month)} bill`} />
          <Row label="Paid on" value={formatDate(receipt.paid_on)} />
          <Row label="Method" value={receipt.method === 'upi' ? 'UPI' : receipt.method === 'bank_transfer' ? 'Bank transfer' : receipt.method[0].toUpperCase() + receipt.method.slice(1)} />
          <Row label="Recorded by" value={receipt.received_by_name ?? '[MANAGER NAME]'} />
          <View style={styles.divider} />
          <MoneyRow label="Balance on this bill" amount={receipt.balance_after} strong />
        </Card>
      </ScreenBody>
      <View style={styles.footer}>
        <Button icon="share" onPress={share}>
          Share receipt
        </Button>
        <Button variant="secondary" icon="doc" onPress={saveAsPdf}>
          Save as PDF
        </Button>
      </View>
    </ScreenRoot>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.between}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  top: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 4 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 2, height: 44, marginLeft: -6 },
  backText: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: colors.teal },
  card: { padding: 20, gap: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mark: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center' },
  markText: { fontFamily: fonts.serif, fontSize: 18, color: '#FFFFFF' },
  divider: { height: 1, backgroundColor: colors.divider },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  label: { fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 0.7, textTransform: 'uppercase', color: colors.muted },
  receiptNo: { fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 0.7, textTransform: 'uppercase', color: colors.ink },
  amount: { fontFamily: fonts.serif, fontSize: 40, lineHeight: 44, color: colors.ink },
  rowLabel: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.ink },
  rowValue: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.ink, flexShrink: 1, textAlign: 'right' },
  footer: {
    padding: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.paper,
    gap: 8,
  },
});
