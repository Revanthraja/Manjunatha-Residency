import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createRepair, listMyRepairs } from '@/src/models/repairs.model';
import { pickImage, uploadAttachment } from '@/src/models/storage.model';
import { useSession } from './useSession';

export function useRaiseRepairController() {
  const { session, myTenancy } = useSession();
  const queryClient = useQueryClient();
  const unitId = myTenancy?.unit.id;

  const repairsQuery = useQuery({
    queryKey: ['my-repairs', unitId, session?.user.id],
    queryFn: () => listMyRepairs(unitId!, session!.user.id),
    enabled: !!unitId && !!session,
  });

  const [description, setDescription] = useState('');
  const [image, setImage] = useState<{ base64: string; ext: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPhoto = async () => {
    try {
      const picked = await pickImage();
      if (picked) setImage(picked);
    } catch (e: any) {
      setError(e?.message ?? 'Could not open the photo library.');
    }
  };

  const submit = async () => {
    if (!unitId) return;
    if (!description.trim()) {
      setError('Describe what needs fixing.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      let photoPath: string | null = null;
      if (image) photoPath = await uploadAttachment('repairs', unitId, image);
      await createRepair({ unit_id: unitId, description: description.trim(), photo_path: photoPath });
      setDescription('');
      setImage(null);
      queryClient.invalidateQueries({ queryKey: ['my-repairs'] });
    } catch (e: any) {
      setError(e?.message ?? 'Could not send the request. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading: repairsQuery.isLoading,
    myRepairs: repairsQuery.data ?? [],
    description,
    setDescription,
    image,
    addPhoto,
    submitting,
    error,
    submit,
  };
}
