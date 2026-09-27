import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { countOpenRepairs, countVacantUnits, listMonthBills } from '@/src/models/dashboard.model';
import { firstOfMonth } from '@/src/lib/format';
import { useStaffScope } from './useStaffScope';

export function useStaffHomeController() {
  const scope = useStaffScope();
  const month = firstOfMonth();

  const billsQuery = useQuery({
    queryKey: ['month-bills', scope.buildingIds, month],
    queryFn: () => listMonthBills(scope.buildingIds, month),
    enabled: scope.buildingIds.length > 0,
  });
  const vacantQuery = useQuery({
    queryKey: ['vacant-count', scope.buildingIds],
    queryFn: () => countVacantUnits(scope.buildingIds),
    enabled: scope.buildingIds.length > 0,
  });
  const repairsQuery = useQuery({
    queryKey: ['open-repairs-count', scope.buildingIds],
    queryFn: () => countOpenRepairs(scope.buildingIds),
    enabled: scope.buildingIds.length > 0,
  });

  const bills = billsQuery.data ?? [];
  const totals = useMemo(() => {
    const totalDue = bills.reduce((s, b) => s + b.total, 0);
    const collected = bills.reduce((s, b) => s + b.paid, 0);
    const pending = Math.max(totalDue - collected, 0);
    const pct = totalDue > 0 ? Math.round((collected / totalDue) * 100) : 0;
    const overdueCount = bills.filter((b) => b.status === 'overdue').length;
    const unpaidCount = bills.filter((b) => b.status === 'unpaid' || b.status === 'partial').length;
    return { totalDue, collected, pending, pct, overdueCount, unpaidCount };
  }, [bills]);

  const followUp = useMemo(
    () =>
      [...bills]
        .filter((b) => b.balance > 0)
        .sort((a, b) => {
          const rank = (s: string) => (s === 'overdue' ? 0 : s === 'partial' ? 1 : 2);
          return rank(a.status) - rank(b.status) || b.balance - a.balance;
        })
        .slice(0, 6),
    [bills]
  );

  const loading = scope.loading || billsQuery.isLoading || vacantQuery.isLoading || repairsQuery.isLoading;
  const refreshing = billsQuery.isRefetching || vacantQuery.isRefetching || repairsQuery.isRefetching;
  const refresh = () => {
    billsQuery.refetch();
    vacantQuery.refetch();
    repairsQuery.refetch();
  };

  return {
    scope,
    loading,
    refreshing,
    refresh,
    totals,
    vacantCount: vacantQuery.data ?? 0,
    openRepairs: repairsQuery.data ?? 0,
    followUp,
    monthLabel: new Date(`${month}T00:00:00`).toLocaleDateString('en-IN', { month: 'long' }),
  };
}
