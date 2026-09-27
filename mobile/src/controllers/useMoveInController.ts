import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUnit } from '@/src/models/units.model';
import { listApplicationsForUnit, setApplicationStatus, Application } from '@/src/models/applications.model';
import { createTenant, setTenantIdProof } from '@/src/models/tenants.model';
import { createTenancy } from '@/src/models/tenancies.model';
import { recordReading } from '@/src/models/meterReadings.model';
import { pickImage, uploadAttachment } from '@/src/models/storage.model';
import { formatDate } from '@/src/lib/format';
import { useHideTabBar } from '@/src/lib/navigation';

export function useMoveInController() {
  useHideTabBar();
  const { unitId } = useLocalSearchParams<{ unitId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = Number(unitId);

  const unitQuery = useQuery({ queryKey: ['unit', id], queryFn: () => getUnit(id), enabled: !!id });
  const applicationsQuery = useQuery({
    queryKey: ['applications-for-unit', id],
    queryFn: () => listApplicationsForUnit(id),
    enabled: !!id,
  });

  const [fromApplication, setFromApplication] = useState<Application | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [startDate, setStartDate] = useState(formatDate(new Date().toISOString()));
  const [meterReading, setMeterReading] = useState('');
  const [idProofImage, setIdProofImage] = useState<{ base64: string; ext: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickIdProof = async () => {
    try {
      const image = await pickImage();
      if (image) setIdProofImage(image);
    } catch (e: any) {
      setError(e?.message ?? 'Could not open the photo library.');
    }
  };

  // Prefill rent once the unit loads.
  if (unitQuery.data && rent === '') setRent(String(unitQuery.data.rent));

  const applyFromApplication = (app: Application) => {
    setFromApplication(app);
    setFullName(app.full_name);
    setPhone(app.phone);
    if (app.move_in_date) setStartDate(formatDate(app.move_in_date));
  };

  const submit = async () => {
    if (!unitQuery.data) return;
    const rentNum = Number(rent.replace(/[^\d.]/g, ''));
    const depositNum = Number(deposit.replace(/[^\d.]/g, '')) || 0;
    if (!fullName.trim() || !phone.trim() || !rentNum) {
      setError('Name, mobile number and rent are required.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const tenant = await createTenant({
        full_name: fullName.trim(),
        phone: phone.trim(),
        profile_id: fromApplication?.profile_id ?? null,
      });
      if (idProofImage) {
        const path = await uploadAttachment('id-proofs', tenant.id, idProofImage);
        await setTenantIdProof(tenant.id, path);
      }
      const isoStart = new Date(startDate).toISOString().slice(0, 10);
      await createTenancy({
        unit_id: id,
        tenant_id: tenant.id,
        rent: rentNum,
        deposit: depositNum,
        start_date: isoStart,
      });
      const readingNum = Number(meterReading.replace(/[^\d.]/g, ''));
      if (readingNum) await recordReading(id, readingNum, isoStart);
      if (fromApplication) await setApplicationStatus(fromApplication.id, 'approved');

      queryClient.invalidateQueries({ queryKey: ['units-for-building'] });
      queryClient.invalidateQueries({ queryKey: ['vacant-units'] });
      router.replace(`/(staff)/units/${id}`);
    } catch (e: any) {
      setError(e?.message ?? 'Could not complete the move-in. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading: unitQuery.isLoading,
    unit: unitQuery.data,
    applications: applicationsQuery.data ?? [],
    fromApplication,
    applyFromApplication,
    fullName,
    setFullName,
    phone,
    setPhone,
    rent,
    setRent,
    deposit,
    setDeposit,
    startDate,
    setStartDate,
    meterReading,
    setMeterReading,
    idProofImage,
    pickIdProof,
    submitting,
    error,
    submit,
  };
}
