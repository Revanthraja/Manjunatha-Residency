import React from 'react';
import { useSignInController } from '@/src/controllers/useSignInController';
import { SignInView } from '@/src/views/SignInView';

export default function SignInRoute() {
  const controller = useSignInController();
  return <SignInView {...controller} />;
}
