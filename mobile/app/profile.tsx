import React from 'react';
import { useProfileController } from '@/src/controllers/useProfileController';
import { ProfileView } from '@/src/views/ProfileView';

// Reached by the account icon on the staff home screen — owner/manager have
// no tab for it (the tenant tab bar has its own Profile tab instead).
export default function ProfileRoute() {
  const controller = useProfileController();
  return <ProfileView {...controller} />;
}
