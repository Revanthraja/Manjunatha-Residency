import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { sendEmailOtp, verifyEmailOtp } from '@/src/models/auth.model';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useSignInController() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendCode = useCallback(async () => {
    if (!EMAIL_RE.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await sendEmailOtp(email.trim());
      setStep('code');
    } catch (e: any) {
      setError(e?.message ?? 'Could not send the code. Try again.');
    } finally {
      setLoading(false);
    }
  }, [email]);

  const verify = useCallback(async () => {
    if (code.trim().length < 6) {
      setError('Enter the 6-digit code.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await verifyEmailOtp(email.trim(), code.trim());
      router.replace('/');
    } catch (e: any) {
      setError(e?.message ?? 'That code is wrong or expired.');
    } finally {
      setLoading(false);
    }
  }, [email, code, router]);

  const changeEmail = useCallback(() => {
    setStep('email');
    setCode('');
    setError(null);
  }, []);

  return { step, email, setEmail, code, setCode, loading, error, sendCode, verify, changeEmail };
}
