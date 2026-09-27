import React from 'react';
import { useStaffHomeController } from '@/src/controllers/useStaffHomeController';
import { StaffHomeView } from '@/src/views/StaffHomeView';

export default function StaffHomeRoute() {
  const controller = useStaffHomeController();
  return <StaffHomeView {...controller} />;
}
