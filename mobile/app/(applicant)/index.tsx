import React from 'react';
import { useVacantController } from '@/src/controllers/useVacantController';
import { VacantView } from '@/src/views/VacantView';

export default function VacantRoute() {
  const controller = useVacantController();
  return <VacantView {...controller} />;
}
