import React from 'react';
import { useUnitsController } from '@/src/controllers/useUnitsController';
import { UnitsView } from '@/src/views/UnitsView';

export default function UnitsRoute() {
  const controller = useUnitsController();
  return <UnitsView {...controller} />;
}
