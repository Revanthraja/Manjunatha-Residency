import { useState } from 'react';
import { Alert } from 'react-native';
import { setPassword as savePassword, signOut } from '@/src/models/auth.model';
import { useSession } from './useSession';

export function useProfileController() {
  const { profile, myTenancy } = useSession();

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const savePasswordNow = async () => {
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords don’t match.');
      return;
    }
    setPasswordError(null);
    setSaving(true);
    try {
      await savePassword(newPassword);
      setPasswordSaved(true);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordOpen(false);
    } catch (e: any) {
      setPasswordError(e?.message ?? 'Could not save the password. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const confirmSignOut = () => {
    Alert.alert('Sign out?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return {
    fullName: profile?.full_name ?? '',
    role: profile?.role ?? 'tenant',
    unit: myTenancy?.unit ?? null,
    passwordOpen,
    setPasswordOpen,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    saving,
    passwordError,
    passwordSaved,
    savePasswordNow,
    confirmSignOut,
  };
}
