import React from 'react';
import { useBillingController } from '@/src/controllers/useBillingController';
import { BillingView } from '@/src/views/BillingView';

export default function BillingRoute() {
  const controller = useBillingController();
  return <BillingView {...controller} />;
}
