import React from 'react';
import { useReceiptController } from '@/src/controllers/useReceiptController';
import { ReceiptView } from '@/src/views/ReceiptView';

export default function ReceiptRoute() {
  const controller = useReceiptController();
  return <ReceiptView {...controller} />;
}
