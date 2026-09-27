import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '@/src/constants/theme';
import { Button, Field } from '@/src/components';
import { ScreenBody, ScreenRoot } from '@/src/components/Screen';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { Sub } from '@/src/components/Text';
import { formatFloor, formatRupees } from '@/src/lib/format';
import { useApplyController } from '@/src/controllers/useApplyController';

type Props = ReturnType<typeof useApplyController>;

export function ApplyView(props: Props) {
  const {
    unit,
    loading,
    fullName,
    setFullName,
    phone,
    setPhone,
    moveInDate,
    setMoveInDate,
    message,
    setMessage,
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

  return (
    <ScreenRoot>
      <ScreenHeader
        backLabel="Houses"
        title={`Apply for ${unit.unit_number}`}
        subtitle={`${unit.building} · ${formatFloor(unit.floor)} · ${formatRupees(unit.rent)} a month`}
      />
      <ScreenBody>
        <Field label="Full name" value={fullName} onChangeText={setFullName} autoComplete="name" />
        <Field label="Mobile number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoComplete="tel" />
        <Field
          label="When would you like to move in?"
          value={moveInDate}
          onChangeText={setMoveInDate}
          placeholder="15 Oct 2026"
        />
        <Field
          label="Message for the owner"
          value={message}
          onChangeText={setMessage}
          placeholder="Family size, where you work, anything the owner should know"
          multiline
          numberOfLines={4}
          style={styles.textarea}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Sub>No payment is taken in the app. The owner or manager will call you to arrange a visit.</Sub>
      </ScreenBody>
      <View style={styles.footer}>
        <Button onPress={submit} loading={submitting}>
          Send application
        </Button>
      </View>
    </ScreenRoot>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  textarea: { height: 112, paddingTop: 12, textAlignVertical: 'top' },
  error: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.overdueFg },
  footer: {
    padding: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.paper,
  },
});
