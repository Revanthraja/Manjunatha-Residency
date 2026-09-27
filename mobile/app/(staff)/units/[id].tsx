import React from 'react';
import { useUnitDetailController } from '@/src/controllers/useUnitDetailController';
import { UnitDetailView } from '@/src/views/UnitDetailView';

export default function UnitDetailRoute() {
  const controller = useUnitDetailController();
  return <UnitDetailView {...controller} />;
}
