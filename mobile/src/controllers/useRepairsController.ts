import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listRepairs, MaintenanceStatus, updateRepairStatus } from '@/src/models/repairs.model';
import { useStaffScope } from './useStaffScope';

const FILTERS: { value: MaintenanceStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
];

export function useRepairsController() {
  const scope = useStaffScope();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<MaintenanceStatus>('open');

  const repairsQuery = useQuery({
    queryKey: ['repairs', scope.buildingIds],
    queryFn: () => listRepairs(scope.buildingIds),
    enabled: scope.buildingIds.length > 0,
  });

  const all = repairsQuery.data ?? [];
  const counts = useMemo(
    () => ({
      open: all.filter((r) => r.status === 'open').length,
      in_progress: all.filter((r) => r.status === 'in_progress').length,
      resolved: all.filter((r) => r.status === 'resolved').length,
    }),
    [all]
  );
  const filtered = all.filter((r) => r.status === filter);

  const setStatus = async (id: number, status: MaintenanceStatus) => {
    await updateRepairStatus(id, status);
    queryClient.invalidateQueries({ queryKey: ['repairs'] });
    queryClient.invalidateQueries({ queryKey: ['open-repairs-count'] });
  };

  return {
    loading: scope.loading || repairsQuery.isLoading,
    refreshing: repairsQuery.isRefetching,
    refresh: repairsQuery.refetch,
    filters: FILTERS,
    filter,
    setFilter,
    counts,
    repairs: filtered,
    setStatus,
  };
}
