import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { listVacantUnits } from '@/src/models/units.model';
import { createApplication } from '@/src/models/applications.model';
import { useSession } from './useSession';

export function useApplyController() {
  const { unitId } = useLocalSearchParams<{ unitId: string }>();
  const router = useRouter();
  const { session, profile } = useSession();

  const unitsQuery = useQuery({ queryKey: ['vacant-units'], queryFn: listVacantUnits });
  const unit = (unitsQuery.data ?? []).find((u) => String(u.unit_id) === unitId);

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!session || !unit) return;
    if (!fullName.trim() || !phone.trim()) {
      setError('Name and mobile number are required.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await createApplication({
        unit_id: unit.unit_id,
        profile_id: session.user.id,
        full_name: fullName.trim(),
        phone: phone.trim(),
        move_in_date: moveInDate.trim() || null,
        message: message.trim() || null,
      });
      router.back();
    } catch (e: any) {
      setError(e?.message ?? 'Could not send the application. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    unit,
    loading: unitsQuery.isLoading,
    fullName,
    setFullName,
    phone,
    setPhone,
    moveInDate,
    setMoveInDate,
    message,
    setMessage,
    submitting,
    error,
    submit,
  };
}
