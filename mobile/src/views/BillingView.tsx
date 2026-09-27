import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts, radii, spacing } from '@/src/constants/theme';
import { Button, Segmented } from '@/src/components';
import { ScreenBody, ScreenRoot } from '@/src/components/Screen';
import { Label, Name, Sub } from '@/src/components/Text';
import { formatRupees } from '@/src/lib/format';
import { useBillingController } from '@/src/controllers/useBillingController';

type Props = ReturnType<typeof useBillingController>;

export function BillingView(props: Props) {
  const {
    loading,
    buildings,
    buildingId,
    setBuildingId,
    monthLabel,
    rate,
    rows,
    setReading,
    readyCount,
    submitting,
    error,
    submit,
    vacantCount,
  } = props;

  return (
    <ScreenRoot>
      <View style={styles.top}>
        <Text style={styles.h1}>{monthLabel.split(' ')[0]} bills</Text>
        <Sub>
          Enter the meter readings taken on the 1st. Electricity is {formatRupees(rate)} a unit. Bills are due on the
          5th.
        </Sub>
      </View>
      <ScreenBody>
        {buildings.length > 1 ? (
          <Segmented
            options={buildings.map((b) => ({ value: b.id, label: b.name }))}
            value={buildingId ?? buildings[0]?.id}
            onChange={setBuildingId}
          />
        ) : null}

        <View style={styles.between}>
          <Label>
            {readyCount} of {rows.length} readings entered
          </Label>
          {vacantCount > 0 ? <Sub>{vacantCount} vacant skipped</Sub> : null}
        </View>

        <View style={styles.list}>
          {loading ? (
            <Sub style={{ padding: spacing.lg }}>Loading…</Sub>
          ) : (
            rows.map((r, i) => (
              <View key={r.unit.id} style={[styles.row, i > 0 && styles.divider]}>
                <View style={styles.door}>
                  <Text style={styles.doorText}>{r.unit.unit_number}</Text>
                </View>
                <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
                  <Name numberOfLines={1}>{r.unit.current_tenancy?.tenant.full_name}</Name>
                  <Sub style={styles.num}>Last {r.previous ?? '—'}</Sub>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <TextInput
                    value={r.raw}
                    onChangeText={(v) => setReading(r.unit.id, v)}
                    keyboardType="numeric"
                    placeholder="New"
                    placeholderTextColor={colors.placeholder}
                    style={styles.input}
                    accessibilityLabel={`New reading for ${r.unit.unit_number}`}
                  />
                  {r.amount !== null ? (
                    <Text style={styles.result}>
                      {r.delta} units · {formatRupees(r.amount)}
                    </Text>
                  ) : (
                    <Text style={styles.waiting}>Waiting</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScreenBody>
      <View style={styles.footer}>
        <Button onPress={submit} loading={submitting} disabled={readyCount === 0}>
          {`Create ${readyCount} bill${readyCount === 1 ? '' : 's'}`}
        </Button>
        <Sub style={styles.footerNote}>Other charges can be added to each bill afterwards.</Sub>
      </View>
    </ScreenRoot>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12, gap: 4 },
  h1: { fontFamily: fonts.serif, fontSize: 30, color: colors.ink },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  list: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radii.xl, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, paddingHorizontal: 16, minHeight: 44 },
  divider: { borderTopWidth: 1, borderTopColor: colors.divider },
  door: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.doorBg, alignItems: 'center', justifyContent: 'center' },
  doorText: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.ink },
  num: { fontVariant: ['tabular-nums'] },
  input: {
    width: 104,
    height: 44,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radii.md,
    textAlign: 'right',
    paddingHorizontal: 12,
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.card,
  },
  result: { fontFamily: fonts.sansBold, fontSize: 12, color: colors.paidFg },
  waiting: { fontFamily: fonts.sansSemiBold, fontSize: 12, color: colors.placeholder },
  error: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.overdueFg },
  footer: {
    padding: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.paper,
    gap: 8,
  },
  footerNote: { textAlign: 'center', fontSize: 13 },
});
