import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listBuildings } from '@/src/models/buildings.model';
import { useSession } from './useSession';

/**
 * Which building(s) a staff member is looking at. An owner starts on "Both
 * blocks"; a manager only ever has their own building(s) in scope.
 */
export function useStaffScope() {
  const { profile } = useSession();
  const buildingsQuery = useQuery({ queryKey: ['buildings'], queryFn: listBuildings });

  const scoped = useMemo(() => {
    const all = buildingsQuery.data ?? [];
    if (profile?.role === 'manager') {
      return all.filter((b) => b.manager_id === profile.id);
    }
    return all;
  }, [buildingsQuery.data, profile]);

  const [selectedId, setSelectedId] = useState<number | 'all'>('all');

  const options = useMemo(() => ['all' as const, ...scoped.map((b) => b.id)], [scoped]);

  const cycle = () => {
    const idx = options.indexOf(selectedId);
    setSelectedId(options[(idx + 1) % options.length]);
  };

  const selectedBuilding = selectedId === 'all' ? null : scoped.find((b) => b.id === selectedId) ?? null;
  const label = selectedId === 'all' ? (scoped.length > 1 ? 'Both blocks' : scoped[0]?.name ?? '—') : selectedBuilding?.name ?? '—';
  const buildingIds = selectedId === 'all' ? scoped.map((b) => b.id) : [selectedId];

  return {
    loading: buildingsQuery.isLoading,
    buildings: scoped,
    selectedId,
    selectedBuilding,
    setSelectedId,
    cycle,
    label,
    buildingIds,
    showPicker: scoped.length > 1,
  };
}
