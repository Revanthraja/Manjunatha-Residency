import React from 'react';
import { useRepairsController } from '@/src/controllers/useRepairsController';
import { RepairsView } from '@/src/views/RepairsView';

export default function RepairsRoute() {
  const controller = useRepairsController();
  return <RepairsView {...controller} />;
}
