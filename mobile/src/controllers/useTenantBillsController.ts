import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { listBillsForTenancy } from '@/src/models/bills.model';
import { listPaymentsForBill } from '@/src/models/payments.model';
import { useSession } from './useSession';

export function useTenantBillsController() {
  const { myTenancy } = useSession();
  const router = useRouter();

  const billsQuery = useQuery({
    queryKey: ['bills-for-tenancy', myTenancy?.id],
    queryFn: () => listBillsForTenancy(myTenancy!.id),
    enabled: !!myTenancy,
  });

  const current = billsQuery.data?.[0];
  const paymentsQuery = useQuery({
    queryKey: ['payments-for-bill', current?.id],
    queryFn: () => listPaymentsForBill(current!.id),
    enabled: !!current,
  });

  return {
    loading: billsQuery.isLoading,
    unit: myTenancy?.unit ?? null,
    current,
    currentPayments: paymentsQuery.data ?? [],
    earlier: billsQuery.data?.slice(1) ?? [],
    openReceipt: (paymentId: number) => router.push(`/receipt/${paymentId}`),
  };
}
