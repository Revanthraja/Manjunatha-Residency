import React from 'react';
import { useApplyController } from '@/src/controllers/useApplyController';
import { ApplyView } from '@/src/views/ApplyView';

export default function ApplyRoute() {
  const controller = useApplyController();
  return <ApplyView {...controller} />;
}
