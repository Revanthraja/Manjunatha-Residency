import React from 'react';
import { useExpensesController } from '@/src/controllers/useExpensesController';
import { ExpensesView } from '@/src/views/ExpensesView';

// The "More" tab: expenses for now (the app plan's "More" also earmarks
// applications, tenants and settings for a later pass).
export default function MoreRoute() {
  const controller = useExpensesController();
  return <ExpensesView {...controller} />;
}
