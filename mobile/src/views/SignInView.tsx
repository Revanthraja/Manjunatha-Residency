import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '@/src/constants/theme';
import { Button, Field } from '@/src/components';
import { H1, Sub } from '@/src/components/Text';

type Props = ReturnType<typeof import('@/src/controllers/useSignInController').useSignInController>;

export function SignInView(props: Props) {
  const { step, email, setEmail, code, setCode, loading, error, sendCode, verify, changeEmail } = props;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <View style={styles.mark}>
          <Text style={styles.markText}>MR</Text>
        </View>
        <View style={{ gap: 8 }}>
          <H1 style={styles.title}>Manjunatha Residency</H1>
          <Sub style={styles.tagline}>Rent, bills and repairs for your home, in one place.</Sub>
        </View>

        {step === 'email' ? (
          <>
            <Field
              label="Email address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="send"
              onSubmitEditing={sendCode}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button onPress={sendCode} loading={loading}>
              Send me a code
            </Button>
          </>
        ) : (
          <>
            <Sub>We sent a 6-digit code to {email}.</Sub>
            <Field
              label="6-digit code"
              value={code}
              onChangeText={setCode}
              placeholder="······"
              keyboardType="number-pad"
              maxLength={6}
              style={styles.codeInput}
              returnKeyType="go"
              onSubmitEditing={verify}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={{ gap: 12 }}>
              <Button onPress={verify} loading={loading}>
                Verify and continue
              </Button>
              <Pressable onPress={changeEmail} hitSlop={8}>
                <Sub style={styles.center}>Wrong email? Change it</Sub>
              </Pressable>
            </View>
          </>
        )}
      </View>
      <Sub style={styles.footer}>
        Looking for a house? Sign in with your email to see what’s available and apply.
      </Sub>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper, justifyContent: 'space-between' },
  content: { flexGrow: 1, justifyContent: 'center', gap: 28, paddingHorizontal: 28 },
  mark: {
    width: 64,
    height: 64,
    borderRadius: radii.xl,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: { fontFamily: fonts.serif, fontSize: 28, color: '#FFFFFF' },
  title: { fontSize: 36, lineHeight: 40 },
  tagline: { fontSize: 16 },
  codeInput: { textAlign: 'center', letterSpacing: 8, fontSize: 20 },
  error: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.overdueFg },
  center: { textAlign: 'center' },
  footer: { textAlign: 'center', paddingHorizontal: 32, paddingBottom: spacing.xxl, fontSize: 13 },
});
