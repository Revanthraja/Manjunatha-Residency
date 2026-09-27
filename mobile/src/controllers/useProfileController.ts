import { Alert } from 'react-native';
import { signOut } from '@/src/models/auth.model';
import { useSession } from './useSession';

export function useProfileController() {
  const { profile, myTenancy } = useSession();

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
    confirmSignOut,
  };
}
