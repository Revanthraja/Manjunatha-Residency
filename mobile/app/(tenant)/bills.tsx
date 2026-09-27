import React from 'react';
import { useTenantBillsController } from '@/src/controllers/useTenantBillsController';
import { TenantBillsView } from '@/src/views/TenantBillsView';

export default function TenantBillsRoute() {
  const controller = useTenantBillsController();
  return <TenantBillsView {...controller} />;
}
