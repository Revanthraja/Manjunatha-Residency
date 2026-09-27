import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listUnitsForBuilding } from '@/src/models/units.model';
import { getLatestReading } from '@/src/models/meterReadings.model';
import { createBill } from '@/src/models/bills.model';
import { firstOfMonth, formatMonth } from '@/src/lib/format';
import { useStaffScope } from './useStaffScope';

export function useBillingController() {
  const scope = useStaffScope();
  const [buildingId, setBuildingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (buildingId === null && scope.buildings.length > 0) setBuildingId(scope.buildings[0].id);
  }, [scope.buildings, buildingId]);

  const building = scope.buildings.find((b) => b.id === buildingId) ?? null;
  const month = firstOfMonth();

  const unitsQuery = useQuery({
    queryKey: ['units-for-building', buildingId],
    queryFn: () => listUnitsForBuilding(buildingId!),
    enabled: buildingId !== null,
  });
  const occupied = (unitsQuery.data ?? []).filter((u) => u.current_tenancy);

  const readingsQuery = useQuery({
    queryKey: ['previous-readings', buildingId, occupied.map((u) => u.id)],
    queryFn: async () => {
      const entries = await Promise.all(
        occupied.map(async (u) => [u.id, await getLatestReading(u.id)] as const)
      );
      return Object.fromEntries(entries);
    },
    enabled: occupied.length > 0,
  });

  const [inputs, setInputs] = useState<Record<number, string>>({});
  const setReading = (unitId: number, value: string) => setInputs((prev) => ({ ...prev, [unitId]: value }));

  const rows = useMemo(
    () =>
      occupied.map((u) => {
        const previous = readingsQuery.data?.[u.id]?.reading ?? null;
        const raw = inputs[u.id] ?? '';
        const newReading = raw ? Number(raw) : null;
        const delta = previous !== null && newReading !== null ? Math.max(newReading - previous, 0) : null;
        const rate = building?.electricity_rate ?? 0;
        const amount = delta !== null ? Math.round(delta * rate) : null;
        return { unit: u, previous, raw, newReading, delta, amount };
      }),
    [occupied, readingsQuery.data, inputs, building]
  );

  const readyCount = rows.filter((r) => r.newReading !== null).length;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      for (const r of rows) {
        if (r.newReading === null || !r.unit.current_tenancy) continue;
        await createBill({ tenancyId: r.unit.current_tenancy.id, month, meterReading: r.newReading });
      }
      setInputs({});
      queryClient.invalidateQueries({ queryKey: ['month-bills'] });
      queryClient.invalidateQueries({ queryKey: ['units-for-building'] });
    } catch (e: any) {
      setError(e?.message ?? 'Could not create the bills. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading: scope.loading || unitsQuery.isLoading,
    buildings: scope.buildings,
    buildingId,
    setBuildingId,
    monthLabel: formatMonth(month),
    rate: building?.electricity_rate ?? 0,
    rows,
    setReading,
    readyCount,
    submitting,
    error,
    submit,
    vacantCount: (unitsQuery.data ?? []).length - occupied.length,
  };
}
