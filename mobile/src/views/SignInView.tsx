import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '@/src/constants/theme';
import { Button, Field } from '@/src/components';
import { H1, Sub } from '@/src/components/Text';

type Props = ReturnType<typeof import('@/src/controllers/useSignInController').useSignInController>;

export function SignInView(props: Props) {
  const {
    step,
    usePassword,
    setUsePassword,
    email,
    setEmail,
    code,
    setCode,
    password,
    setPassword,
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
  } = props;

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
              returnKeyType={usePassword ? 'next' : 'send'}
              onSubmitEditing={usePassword ? undefined : sendCode}
            />
            {usePassword ? (
              <Field
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                secureTextEntry
                returnKeyType="go"
                onSubmitEditing={signInWithPasswordNow}
              />
            ) : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {usePassword ? (
              <Button onPress={signInWithPasswordNow} loading={loading}>
                Sign in
              </Button>
            ) : (
              <Button onPress={sendCode} loading={loading}>
                Send me a code
              </Button>
            )}
            <Pressable
              onPress={() => {
                setUsePassword(!usePassword);
              }}
              hitSlop={8}
            >
              <Sub style={styles.center}>
                {usePassword ? 'Sign in with an emailed code instead' : 'Have a password? Sign in with it instead'}
              </Sub>
            </Pressable>
          </>
        ) : step === 'code' ? (
          <>
            <Sub>We sent a sign-in code to {email}.</Sub>
            <Field
              label="Code from the email"
              value={code}
              onChangeText={setCode}
              placeholder="Enter the code"
              keyboardType="number-pad"
              maxLength={12}
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
        ) : (
          <>
            <Sub>Set a password so you can skip the emailed code next time. You can always do this later from your profile.</Sub>
            <Field
              label="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="At least 6 characters"
              secureTextEntry
              returnKeyType="next"
            />
            <Field
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Type it again"
              secureTextEntry
              returnKeyType="go"
              onSubmitEditing={savePasswordAndContinue}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={{ gap: 12 }}>
              <Button onPress={savePasswordAndContinue} loading={loading}>
                Save and continue
              </Button>
              <Pressable onPress={skipPassword} hitSlop={8}>
                <Sub style={styles.center}>Skip for now</Sub>
              </Pressable>
            </View>
          </>
        )}
      </View>
      {step === 'email' ? (
        <Sub style={styles.footer}>
          Looking for a house? Sign in with your email to see what’s available and apply.
        </Sub>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper, justifyContent: 'space-between' },
  content: { flexGrow: 1, justifyContent: 'center', gap: 20, paddingHorizontal: 28 },
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
  codeInput: { textAlign: 'center', letterSpacing: 4, fontSize: 20 },
  error: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.overdueFg },
  center: { textAlign: 'center' },
  footer: { textAlign: 'center', paddingHorizontal: 32, paddingBottom: spacing.xxl, fontSize: 13 },
});
