import * as Clipboard from 'expo-clipboard';
import { useQuery } from '@tanstack/react-query';
import { listBillsForTenancy } from '@/src/models/bills.model';
import { listRecentReadings } from '@/src/models/meterReadings.model';
import { useSession } from './useSession';

// No per-building UPI ID exists in the schema yet — shown as a placeholder
// until the owner decides whether it's one ID for both blocks or one each.
const UPI_PLACEHOLDER = '[OWNER UPI ID]';

export function useTenantHomeController() {
  const { profile, myTenancy } = useSession();

  const billsQuery = useQuery({
    queryKey: ['bills-for-tenancy', myTenancy?.id],
    queryFn: () => listBillsForTenancy(myTenancy!.id),
    enabled: !!myTenancy,
  });
  const readingsQuery = useQuery({
    queryKey: ['recent-readings', myTenancy?.unit.id],
    queryFn: () => listRecentReadings(myTenancy!.unit.id),
    enabled: !!myTenancy,
  });

  const currentBill = billsQuery.data?.[0] ?? null;
  const readings = readingsQuery.data ?? [];
  const thisMonthUnits = readings.length >= 2 ? Math.max(readings[0].reading - readings[1].reading, 0) : null;
  const lastMonthUnits =
    readings.length >= 3 ? Math.max(readings[1].reading - readings[2].reading, 0) : null;

  const copyUpi = async () => {
    await Clipboard.setStringAsync(UPI_PLACEHOLDER);
  };

  return {
    loading: billsQuery.isLoading,
    fullName: profile?.full_name ?? '',
    unit: myTenancy?.unit ?? null,
    bill: currentBill,
    upiId: UPI_PLACEHOLDER,
    copyUpi,
    latestReading: readings[0] ?? null,
    thisMonthUnits,
    lastMonthUnits,
  };
}
