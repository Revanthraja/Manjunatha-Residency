import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { sendEmailOtp, setPassword as savePassword, signInWithPassword, verifyEmailOtp } from '@/src/models/auth.model';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useSignInController() {
  const router = useRouter();
  // 'email' -> enter address, choose code or password
  // 'code' -> enter the emailed code
  // 'setPassword' -> optional, shown once right after a code-based sign-in
  const [step, setStep] = useState<'email' | 'code' | 'setPassword'>('email');
  const [usePassword, setUsePassword] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goHome = useCallback(() => router.replace('/'), [router]);

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

  const signInWithPasswordNow = useCallback(async () => {
    if (!EMAIL_RE.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Enter your password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signInWithPassword(email.trim(), password);
      goHome();
    } catch (e: any) {
      setError('Wrong email or password. If you haven’t set a password yet, sign in with a code instead.');
    } finally {
      setLoading(false);
    }
  }, [email, password, goHome]);

  const verify = useCallback(async () => {
    if (code.trim().length < 4) {
      setError('Enter the code from the email.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await verifyEmailOtp(email.trim(), code.trim());
      setStep('setPassword');
    } catch (e: any) {
      setError(e?.message ?? 'That code is wrong or expired.');
    } finally {
      setLoading(false);
    }
  }, [email, code]);

  const savePasswordAndContinue = useCallback(async () => {
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords don’t match.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await savePassword(newPassword);
      goHome();
    } catch (e: any) {
      setError(e?.message ?? 'Could not save the password. You can set it later from Profile.');
    } finally {
      setLoading(false);
    }
  }, [newPassword, confirmPassword, goHome]);

  const skipPassword = useCallback(() => goHome(), [goHome]);

  const changeEmail = useCallback(() => {
    setStep('email');
    setCode('');
    setError(null);
  }, []);

  return {
    step,
    usePassword,
    setUsePassword,
    email,
    setEmail,
    code,
    setCode,
    password,
    setPassword: setPasswordInput,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    sendCode,
    signInWithPasswordNow,
    verify,
    savePasswordAndContinue,
    skipPassword,
    changeEmail,
  };
}
