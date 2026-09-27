import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '@/src/constants/theme';
import { Button, Field } from '@/src/components';
import { Icon } from '@/src/components/Icon';
import { ScreenBody, ScreenRoot } from '@/src/components/Screen';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { formatFloor } from '@/src/lib/format';
import { useMoveInController } from '@/src/controllers/useMoveInController';

type Props = ReturnType<typeof useMoveInController>;

export function MoveInView(props: Props) {
  const {
    loading,
    unit,
    applications,
    fromApplication,
    applyFromApplication,
    fullName,
    setFullName,
    phone,
    setPhone,
    rent,
    setRent,
    deposit,
    setDeposit,
    startDate,
    setStartDate,
    meterReading,
    setMeterReading,
    idProofImage,
    pickIdProof,
    submitting,
    error,
    submit,
  } = props;

  if (loading || !unit) {
    return (
      <ScreenRoot>
        <View style={styles.center}>
          <ActivityIndicator color={colors.teal} />
        </View>
      </ScreenRoot>
    );
  }

  const pendingApp = applications.find((a) => a.id !== fromApplication?.id) ?? applications[0];

  return (
    <ScreenRoot>
      <ScreenHeader
        backLabel="Units"
        title={`Move in to ${unit.unit_number}`}
        subtitle={`${unit.building.name} · ${formatFloor(unit.floor)}`}
      />
      <ScreenBody>
        {pendingApp && !fromApplication ? (
          <Pressable style={styles.appBtn} onPress={() => applyFromApplication(pendingApp)}>
            <Text style={styles.appBtnText} numberOfLines={1}>
              Fill from application · {pendingApp.full_name}
            </Text>
            <Icon name="right" size={20} color={colors.ink} />
          </Pressable>
        ) : null}

        <Field label="Tenant name" value={fullName} onChangeText={setFullName} autoComplete="name" />
        <Field label="Mobile number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <View style={styles.grid}>
          <Field label="Monthly rent" value={rent} onChangeText={setRent} keyboardType="numeric" containerStyle={styles.half} />
          <Field label="Deposit" value={deposit} onChangeText={setDeposit} keyboardType="numeric" containerStyle={styles.half} />
          <Field label="Move-in date" value={startDate} onChangeText={setStartDate} containerStyle={styles.half} />
          <Field
            label="Meter reading"
            value={meterReading}
            onChangeText={setMeterReading}
            keyboardType="numeric"
            containerStyle={styles.half}
          />
        </View>
        <View style={{ gap: 6 }}>
          <Text style={styles.label}>ID proof</Text>
          <Pressable style={styles.drop} onPress={pickIdProof}>
            <Icon name="camera" size={22} color={colors.mutedStrong} />
            <Text style={styles.dropText}>{idProofImage ? 'Photo added · tap to replace' : 'Photo of Aadhaar or other ID'}</Text>
          </Pressable>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScreenBody>
      <View style={styles.footer}>
        <Button onPress={submit} loading={submitting}>
          {`Move in ${fullName.trim().split(' ')[0] || 'tenant'}`}
        </Button>
      </View>
    </ScreenRoot>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  appBtn: {
    height: 48,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  appBtnText: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: colors.ink, flexShrink: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  half: { width: '47%' },
  label: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.mutedStrong },
  drop: {
    height: 64,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    backgroundColor: '#FBF9F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  dropText: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: colors.mutedStrong },
  error: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.overdueFg },
  footer: {
    padding: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.paper,
  },
});
