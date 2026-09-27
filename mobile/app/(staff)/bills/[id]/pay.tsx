import React from 'react';
import { useRecordPaymentController } from '@/src/controllers/useRecordPaymentController';
import { RecordPaymentView } from '@/src/views/RecordPaymentView';

export default function RecordPaymentRoute() {
  const controller = useRecordPaymentController();
  return <RecordPaymentView {...controller} />;
}
