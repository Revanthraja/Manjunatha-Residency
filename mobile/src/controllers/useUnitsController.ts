import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listUnitsForBuilding } from '@/src/models/units.model';
import { countUnitsByBuilding } from '@/src/models/unitCounts.model';
import { formatFloor } from '@/src/lib/format';
import { useStaffScope } from './useStaffScope';

export function useUnitsController() {
  const scope = useStaffScope();
  const [buildingId, setBuildingId] = useState<number | null>(null);

  useEffect(() => {
    if (buildingId === null && scope.buildings.length > 0) {
      setBuildingId(scope.buildings[0].id);
    }
  }, [scope.buildings, buildingId]);

  const unitsQuery = useQuery({
    queryKey: ['units-for-building', buildingId],
    queryFn: () => listUnitsForBuilding(buildingId!),
    enabled: buildingId !== null,
  });

  const buildingIds = useMemo(() => scope.buildings.map((b) => b.id), [scope.buildings]);
  const countsQuery = useQuery({
    queryKey: ['unit-counts', buildingIds],
    queryFn: () => countUnitsByBuilding(buildingIds),
    enabled: buildingIds.length > 0,
  });

  const groups = useMemo(() => {
    const units = unitsQuery.data ?? [];
    const byFloor = new Map<number, typeof units>();
    for (const u of units) {
      const list = byFloor.get(u.floor) ?? [];
      list.push(u);
      byFloor.set(u.floor, list);
    }
    return Array.from(byFloor.entries())
      .sort(([a], [b]) => a - b)
      .map(([floor, units]) => ({ floor, label: formatFloor(floor), units }));
  }, [unitsQuery.data]);

  const counts = useMemo(() => {
    const units = unitsQuery.data ?? [];
    const occupied = units.filter((u) => u.current_tenancy).length;
    return { total: units.length, occupied, vacant: units.length - occupied };
  }, [unitsQuery.data]);

  return {
    loading: scope.loading || unitsQuery.isLoading,
    refreshing: unitsQuery.isRefetching,
    refresh: unitsQuery.refetch,
    buildings: scope.buildings,
    buildingCounts: countsQuery.data ?? {},
    buildingId,
    setBuildingId,
    groups,
    counts,
  };
}
