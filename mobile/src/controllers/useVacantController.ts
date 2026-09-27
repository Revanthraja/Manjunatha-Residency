import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listVacantUnits } from '@/src/models/units.model';
import { listMyApplications } from '@/src/models/applications.model';
import { useSession } from './useSession';

export function useVacantController() {
  const { session, profile } = useSession();
  const [block, setBlock] = useState<string>('All');

  const unitsQuery = useQuery({ queryKey: ['vacant-units'], queryFn: listVacantUnits });
  const applicationsQuery = useQuery({
    queryKey: ['my-applications', session?.user.id],
    queryFn: () => listMyApplications(session!.user.id),
    enabled: !!session,
  });

  const blocks = useMemo(() => {
    const names = Array.from(new Set((unitsQuery.data ?? []).map((u) => u.building)));
    return ['All', ...names];
  }, [unitsQuery.data]);

  const units = useMemo(() => {
    const all = unitsQuery.data ?? [];
    return block === 'All' ? all : all.filter((u) => u.building === block);
  }, [unitsQuery.data, block]);

  return {
    loading: unitsQuery.isLoading,
    refreshing: unitsQuery.isRefetching,
    refresh: unitsQuery.refetch,
    fullName: profile?.full_name ?? '',
    units,
    blocks,
    block,
    setBlock,
    applications: applicationsQuery.data ?? [],
  };
}
