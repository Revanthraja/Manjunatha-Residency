import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '@/src/constants/theme';
import { Button, Card, Field, IconButton, MoneyRow } from '@/src/components';
import { H1, Label, Name, Serif, Sub } from '@/src/components/Text';
import { ScreenBody, ScreenRoot } from '@/src/components/Screen';
import { formatDayMonth, formatRupees } from '@/src/lib/format';
import { useExpensesController } from '@/src/controllers/useExpensesController';

type Props = ReturnType<typeof useExpensesController>;

export function ExpensesView(props: Props) {
  const {
    loading,
    monthLabel,
    prevMonth,
    nextMonth,
    spent,
    collected,
    left,
    byCategory,
    recent,
    addOpen,
    setAddOpen,
    category,
    setCategory,
    amount,
    setAmount,
    note,
    setNote,
    submitting,
    error,
    submitExpense,
  } = props;

  return (
    <ScreenRoot>
      <View style={styles.top}>
        <Label>More</Label>
        <H1>Expenses</H1>
      </View>
      <ScreenBody>
        <View style={styles.monthRow}>
          <IconButton name="left" accessibilityLabel="Previous month" onPress={prevMonth} />
          <Name>{monthLabel}</Name>
          <IconButton name="right" accessibilityLabel="Next month" onPress={nextMonth} />
        </View>

        <Card>
          <View style={styles.between}>
            <Label>Spent so far</Label>
            <Serif style={styles.spent}>{formatRupees(spent)}</Serif>
          </View>
          {loading ? (
            <Sub>Loading…</Sub>
          ) : byCategory.length === 0 ? (
            <Sub>No expenses logged this month.</Sub>
          ) : (
            byCategory.map((c) => (
              <View key={c.category} style={{ gap: 6 }}>
                <View style={styles.between}>
                  <Text style={styles.catLabel}>{c.category}</Text>
                  <Text style={styles.catAmount}>{formatRupees(c.amount)}</Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${c.pct}%` }]} />
                </View>
              </View>
            ))
          )}
        </Card>

        <Card>
          <MoneyRow label="Collected" amount={collected} />
          <MoneyRow label="Spent" amount={-spent} />
          <View style={styles.divider} />
          <MoneyRow label="Left this month" amount={left} strong color={colors.paidFg} />
        </Card>

        {addOpen ? (
          <Card>
            <Label>New expense</Label>
            <Field label="Category" value={category} onChangeText={setCategory} placeholder="Repairs, Water, Salary, Tax…" />
            <Field label="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" />
            <Field label="Note" value={note} onChangeText={setNote} placeholder="Optional" />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.row}>
              <Button variant="neutral" style={{ flex: 1 }} onPress={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button style={{ flex: 1 }} loading={submitting} onPress={submitExpense}>
                Save
              </Button>
            </View>
          </Card>
        ) : null}

        <Label>Recent</Label>
        <View style={styles.list}>
          {recent.length === 0 ? (
            <Sub style={{ padding: spacing.lg }}>Nothing logged yet.</Sub>
          ) : (
            recent.map((e, i) => (
              <View key={e.id} style={[styles.row2, i > 0 && styles.rowDivider]}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Name numberOfLines={1}>{e.note || e.category}</Name>
                  <Sub>
                    {formatDayMonth(e.spent_on)} · {e.category}
                  </Sub>
                </View>
                <Text style={styles.amountText}>{formatRupees(e.amount)}</Text>
              </View>
            ))
          )}
        </View>
      </ScreenBody>
      {!addOpen ? (
        <View style={styles.footer}>
          <Button icon="plus" onPress={() => setAddOpen(true)}>
            Add expense
          </Button>
        </View>
      ) : null}
    </ScreenRoot>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12, gap: 4 },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  spent: { fontSize: 26 },
  catLabel: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.ink },
  catAmount: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.ink, fontVariant: ['tabular-nums'] },
  track: { height: 8, borderRadius: 99, backgroundColor: colors.doorBg },
  fill: { height: 8, borderRadius: 99, backgroundColor: colors.teal },
  divider: { height: 1, backgroundColor: colors.divider },
  row: { flexDirection: 'row', gap: 8 },
  row2: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.divider },
  amountText: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: colors.ink, fontVariant: ['tabular-nums'] },
  list: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, overflow: 'hidden' },
  error: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.overdueFg },
  footer: { padding: spacing.xl, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.paper },
});
