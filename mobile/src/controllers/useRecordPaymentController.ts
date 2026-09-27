import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBillWithContext } from '@/src/models/bills.model';
import { recordPayment } from '@/src/models/payments.model';
import { Enums } from '@/src/types/database';
import { formatDate } from '@/src/lib/format';
import { useHideTabBar } from '@/src/lib/navigation';

const METHODS: { value: Enums<'payment_method'>; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank' },
  { value: 'cheque', label: 'Cheque' },
];

export function useRecordPaymentController() {
  useHideTabBar();
  const { id } = useLocalSearchParams<{ id: string }>();
  const billId = Number(id);
  const router = useRouter();
  const queryClient = useQueryClient();

  const billQuery = useQuery({ queryKey: ['bill', billId], queryFn: () => getBillWithContext(billId), enabled: !!billId });

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<Enums<'payment_method'>>('upi');
  const [reference, setReference] = useState('');
  const [paidOn, setPaidOn] = useState(formatDate(new Date().toISOString()));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (billQuery.data && amount === '') {
      setAmount(String(billQuery.data.summary?.balance ?? billQuery.data.total));
    }
  }, [billQuery.data]);

  const submit = async () => {
    const amountNum = Number(amount.replace(/[^\d.]/g, ''));
    if (!amountNum) {
      setError('Enter the amount received.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const payment = await recordPayment({
        billId,
        amount: amountNum,
        method,
        paidOn: new Date(paidOn).toISOString().slice(0, 10),
        reference,
      });
      queryClient.invalidateQueries({ queryKey: ['bill', billId] });
      queryClient.invalidateQueries({ queryKey: ['month-bills'] });
      queryClient.invalidateQueries({ queryKey: ['units-for-building'] });
      router.replace(`/receipt/${payment.id}`);
    } catch (e: any) {
      setError(e?.message ?? 'Could not record the payment. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading: billQuery.isLoading,
    bill: billQuery.data,
    methods: METHODS,
    amount,
    setAmount,
    method,
    setMethod,
    reference,
    setReference,
    paidOn,
    setPaidOn,
    submitting,
    error,
    submit,
  };
}
