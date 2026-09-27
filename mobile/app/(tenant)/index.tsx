import React from 'react';
import { useTenantHomeController } from '@/src/controllers/useTenantHomeController';
import { TenantHomeView } from '@/src/views/TenantHomeView';

export default function TenantHomeRoute() {
  const controller = useTenantHomeController();
  return <TenantHomeView {...controller} />;
}
