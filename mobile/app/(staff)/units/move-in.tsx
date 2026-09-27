import React from 'react';
import { useMoveInController } from '@/src/controllers/useMoveInController';
import { MoveInView } from '@/src/views/MoveInView';

export default function MoveInRoute() {
  const controller = useMoveInController();
  return <MoveInView {...controller} />;
}
