import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { colors } from '@/src/constants/theme';
import { useSession } from '@/src/controllers/useSession';

/**
 * The whole app opens here. Sends the signed-in person straight to the
 * screens for their role — see the "How the app opens" board in the design.
 */
export default function Index() {
  const { status, profile, myTenancy } = useSession();

  if (status === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.teal} />
      </View>
    );
  }

  if (status === 'signedOut' || !profile) {
    return <Redirect href="/sign-in" />;
  }

  if (profile.role === 'owner' || profile.role === 'manager') {
    return <Redirect href="/(staff)" />;
  }

  if (profile.role === 'tenant' && myTenancy) {
    return <Redirect href="/(tenant)" />;
  }

  return <Redirect href="/(applicant)" />;
}
