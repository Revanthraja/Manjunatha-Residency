import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts } from '@/src/constants/theme';
import { Button, Card, Field } from '@/src/components';
import { H1, Label, Name, Sub } from '@/src/components/Text';
import { ScreenBody, ScreenRoot } from '@/src/components/Screen';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { initials } from '@/src/lib/format';
import { useProfileController } from '@/src/controllers/useProfileController';

type Props = ReturnType<typeof useProfileController>;

// Not in the original mockups — added because a real app needs a way to sign
// out, and the tenant tab bar already reserves a "Profile" slot for it.
export function ProfileView(props: Props) {
  const {
    fullName,
    role,
    unit,
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
  } = props;
  const router = useRouter();
  const canGoBack = router.canGoBack();

  return (
    <ScreenRoot>
      {canGoBack ? (
        <ScreenHeader backLabel="Home" title="Profile" />
      ) : (
        <View style={styles.top}>
          <H1>Profile</H1>
        </View>
      )}
      <ScreenBody>
        <Card>
          <View style={styles.row}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(fullName || '?')}</Text>
            </View>
            <View style={{ gap: 2 }}>
              <Name>{fullName}</Name>
              <Sub>{role === 'owner' ? 'Owner' : role === 'manager' ? 'Manager' : 'Tenant'}</Sub>
            </View>
          </View>
          {unit ? (
            <>
              <View style={styles.divider} />
              <Label>House</Label>
              <Sub>
                {unit.building_name} · House {unit.unit_number}
              </Sub>
            </>
          ) : null}
        </Card>

        <Card>
          <Label>Sign in faster</Label>
          {passwordOpen ? (
            <>
              <Sub>Set a password so you can skip the emailed code next time.</Sub>
              <Field label="New password" value={newPassword} onChangeText={setNewPassword} placeholder="At least 6 characters" secureTextEntry />
              <Field label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Type it again" secureTextEntry />
              {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
              <View style={styles.row}>
                <Button variant="neutral" style={{ flex: 1 }} onPress={() => setPasswordOpen(false)}>
                  Cancel
                </Button>
                <Button style={{ flex: 1 }} loading={saving} onPress={savePasswordNow}>
                  Save
                </Button>
              </View>
            </>
          ) : (
            <>
              <Sub>{passwordSaved ? 'Password set — you can sign in with it next time.' : 'Set a password to skip the emailed code next time you sign in.'}</Sub>
              <Button variant="secondary" onPress={() => setPasswordOpen(true)}>
                {passwordSaved ? 'Change password' : 'Set a password'}
              </Button>
            </>
          )}
        </Card>

        <Button variant="neutral" icon="signOut" onPress={confirmSignOut}>
          Sign out
        </Button>
      </ScreenBody>
    </ScreenRoot>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.paidBg, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.sansBold, fontSize: 16, color: colors.paidFg },
  divider: { height: 1, backgroundColor: colors.divider },
  error: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.overdueFg },
});
