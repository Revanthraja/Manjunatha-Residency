import React from 'react';
import { useProfileController } from '@/src/controllers/useProfileController';
import { ProfileView } from '@/src/views/ProfileView';

export default function TenantProfileRoute() {
  const controller = useProfileController();
  return <ProfileView {...controller} />;
}
