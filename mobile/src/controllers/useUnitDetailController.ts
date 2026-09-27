import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUnit } from '@/src/models/units.model';
import { getCurrentTenancyForUnit, endTenancy } from '@/src/models/tenancies.model';
import { listBillsForTenancy } from '@/src/models/bills.model';
import { getLatestReading } from '@/src/models/meterReadings.model';
import { useHideTabBar } from '@/src/lib/navigation';

export function useUnitDetailController() {
  useHideTabBar();
  const { id } = useLocalSearchParams<{ id: string }>();
  const unitId = Number(id);
  const router = useRouter();
  const queryClient = useQueryClient();

  const unitQuery = useQuery({ queryKey: ['unit', unitId], queryFn: () => getUnit(unitId), enabled: !!unitId });
  const tenancyQuery = useQuery({
    queryKey: ['unit-current-tenancy', unitId],
    queryFn: () => getCurrentTenancyForUnit(unitId),
    enabled: !!unitId,
  });
  const readingQuery = useQuery({
    queryKey: ['latest-reading', unitId],
    queryFn: () => getLatestReading(unitId),
    enabled: !!unitId,
  });
  const billsQuery = useQuery({
    queryKey: ['bills-for-tenancy', tenancyQuery.data?.id],
    queryFn: () => listBillsForTenancy(tenancyQuery.data!.id),
    enabled: !!tenancyQuery.data,
  });

  const latestUnpaidBill = (billsQuery.data ?? []).find((b) => (b.summary?.balance ?? 0) > 0);

  const moveOut = () => {
    if (!tenancyQuery.data) return;
    Alert.alert(
      'Move out this tenant?',
      'This ends the tenancy today. You can set the exact deposit refund from the tenancy record afterwards.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Move out',
          style: 'destructive',
          onPress: async () => {
            await endTenancy(tenancyQuery.data!.id, new Date().toISOString().slice(0, 10), tenancyQuery.data!.deposit);
            queryClient.invalidateQueries({ queryKey: ['unit-current-tenancy', unitId] });
            queryClient.invalidateQueries({ queryKey: ['units-for-building'] });
            router.back();
          },
        },
      ]
    );
  };

  return {
    loading: unitQuery.isLoading || tenancyQuery.isLoading,
    unit: unitQuery.data,
    tenancy: tenancyQuery.data,
    reading: readingQuery.data,
    bills: billsQuery.data ?? [],
    latestUnpaidBill,
    goToRecordPayment: () => latestUnpaidBill && router.push(`/(staff)/bills/${latestUnpaidBill.id}/pay`),
    moveOut,
  };
}
