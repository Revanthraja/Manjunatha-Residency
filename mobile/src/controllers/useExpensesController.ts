import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listExpenses, createExpense } from '@/src/models/expenses.model';
import { listMonthBills } from '@/src/models/dashboard.model';
import { firstOfMonth, formatMonth } from '@/src/lib/format';
import { useStaffScope } from './useStaffScope';

function addMonths(date: Date, n: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

export function useExpensesController() {
  const scope = useStaffScope();
  const queryClient = useQueryClient();
  const [buildingId, setBuildingId] = useState<number | null>(null);
  const [cursor, setCursor] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  useEffect(() => {
    if (buildingId === null && scope.buildings.length > 0) setBuildingId(scope.buildings[0].id);
  }, [scope.buildings, buildingId]);

  const monthStart = firstOfMonth(cursor);
  const monthEnd = firstOfMonth(addMonths(cursor, 1));

  const expensesQuery = useQuery({
    queryKey: ['expenses', buildingId, monthStart],
    queryFn: () => listExpenses(buildingId!, monthStart, monthEnd),
    enabled: buildingId !== null,
  });
  const billsQuery = useQuery({
    queryKey: ['month-bills', buildingId ? [buildingId] : [], monthStart],
    queryFn: () => listMonthBills(buildingId ? [buildingId] : [], monthStart),
    enabled: buildingId !== null,
  });

  const expenses = expensesQuery.data ?? [];
  const spent = expenses.reduce((s, e) => s + e.amount, 0);
  const collected = (billsQuery.data ?? []).reduce((s, b) => s + b.paid, 0);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
    const rows = Array.from(map.entries()).map(([category, amount]) => ({ category, amount }));
    rows.sort((a, b) => b.amount - a.amount);
    const max = rows[0]?.amount ?? 1;
    return rows.map((r) => ({ ...r, pct: Math.round((r.amount / max) * 100) }));
  }, [expenses]);

  const [addOpen, setAddOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitExpense = async () => {
    const amountNum = Number(amount.replace(/[^\d.]/g, ''));
    if (!buildingId || !category.trim() || !amountNum) {
      setError('Category and amount are required.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await createExpense({ building_id: buildingId, category: category.trim(), amount: amountNum, note: note.trim() || null });
      setCategory('');
      setAmount('');
      setNote('');
      setAddOpen(false);
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    } catch (e: any) {
      setError(e?.message ?? 'Could not add the expense. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading: scope.loading || expensesQuery.isLoading,
    buildings: scope.buildings,
    buildingId,
    setBuildingId,
    monthLabel: formatMonth(monthStart),
    prevMonth: () => setCursor((c) => addMonths(c, -1)),
    nextMonth: () => setCursor((c) => addMonths(c, 1)),
    spent,
    collected,
    left: collected - spent,
    byCategory,
    recent: expenses.slice(0, 8),
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
  };
}
