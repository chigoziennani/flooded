import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Font } from '@/constants/fonts';
import type { FloodedColors, ThemedType } from '@/constants/Theme';
import { useFlooded } from '@/context/FloodedContext';
import { useTheme } from '@/context/ThemeContext';

export default function SignInScreen() {
  const { signInDemo } = useFlooded();
  const { colors, Type } = useTheme();
  const styles = useMemo(() => createStyles(colors, Type), [colors, Type]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    if (!email.trim()) {
      Alert.alert('Email required', 'Use any sample email for the demo.');
      return;
    }
    signInDemo(email);
    Alert.alert('Signed in', 'Sample session only — no backend.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}>
          <Text style={[Type.overline, styles.kickerMargin]}>SAMPLE SIGN IN</Text>
          <Text style={[styles.headline, Type.title]}>Welcome back</Text>
          <Text style={[styles.lead, Type.body]}>Sign in to sync your profile and alerts.</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@school.edu"
              placeholderTextColor={colors.placeholder}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Demo — not checked"
              placeholderTextColor={colors.placeholder}
              style={styles.input}
              secureTextEntry
            />
          </View>

          <Pressable style={styles.primary} onPress={onSubmit}>
            <Text style={styles.primaryText}>Sign in</Text>
          </Pressable>

          <Pressable style={styles.secondary} onPress={() => router.push('/auth/sign-up')}>
            <Text style={styles.secondaryText}>
              New here? <Text style={styles.secondaryBold}>Create account</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(colors: FloodedColors, _Type: ThemedType) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    flex: { flex: 1 },
    scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
    kickerMargin: { marginBottom: 8 },
    headline: { marginBottom: 8 },
    lead: { marginBottom: 28, maxWidth: 340 },
    field: { marginBottom: 18 },
    label: {
      fontFamily: Font.medium,
      color: colors.textSecondary,
      fontSize: 12,
      marginBottom: 8,
    },
    input: {
      fontFamily: Font.body,
      backgroundColor: colors.inputBg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.inputBorder,
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 15,
      color: colors.text,
    },
    primary: {
      marginTop: 12,
      backgroundColor: colors.primaryFill,
      paddingVertical: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    primaryText: {
      fontFamily: Font.body,
      color: colors.primaryOnDark,
      fontSize: 13,
      letterSpacing: 0.3,
    },
    secondary: { marginTop: 24, alignItems: 'center', padding: 8 },
    secondaryText: { fontFamily: Font.body, color: colors.textSecondary, fontSize: 14 },
    secondaryBold: { fontFamily: Font.medium, color: colors.text },
  });
}
