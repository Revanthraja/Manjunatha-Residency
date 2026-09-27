import React from 'react';
import { useRaiseRepairController } from '@/src/controllers/useRaiseRepairController';
import { RaiseRepairView } from '@/src/views/RaiseRepairView';

export default function TenantRepairsRoute() {
  const controller = useRaiseRepairController();
  return <RaiseRepairView {...controller} />;
}
