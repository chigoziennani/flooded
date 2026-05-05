/**
 * Welcome / Auth gate — shown on every cold start until a session is created.
 */
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

import { FloodedMark } from '@/components/FloodedMark';
import { Font } from '@/constants/fonts';
import { Space } from '@/constants/Theme';
import type { FloodedColors } from '@/constants/Theme';
import { useFlooded } from '@/context/FloodedContext';
import { useTheme } from '@/context/ThemeContext';

type Mode = 'landing' | 'signup' | 'signin';

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'words' | 'sentences';
  secureTextEntry?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View>
      <Text
        style={{
          fontFamily: Font.medium,
          fontSize: 10,
          letterSpacing: 1,
          color: colors.accent,
          marginBottom: Space.sm,
        }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        style={{
          fontFamily: Font.body,
          backgroundColor: colors.accentLight,
          borderWidth: 1,
          borderColor: colors.accent,
          borderRadius: 6,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 15,
          color: colors.text,
        }}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

export default function WelcomeScreen() {
  const { signUpDemo, signInDemo } = useFlooded();
  const { colors, Type } = useTheme();
  const styles = useMemo(() => createWelcomeStyles(colors), [colors]);
  const [mode, setMode] = useState<Mode>('landing');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignUp = () => {
    if (!email.trim()) {
      Alert.alert('Email required', 'Enter any sample email to continue.');
      return;
    }
    signUpDemo(email, name);
    router.replace({
      pathname: '/profile/measurements',
      params: { firstTime: '1' },
    });
  };

  const onSignIn = () => {
    if (!email.trim()) {
      Alert.alert('Email required', 'Enter any sample email to continue.');
      return;
    }
    signInDemo(email, name);
    router.replace('/(tabs)');
  };

  if (mode === 'signup') {
    return (
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Pressable style={styles.backBtn} onPress={() => setMode('landing')}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
            <Text style={[Type.caption, styles.kicker]}>CREATE ACCOUNT</Text>
            <Text style={[Type.hero, styles.heading]}>Join Flooded</Text>
            <Text style={[Type.body, styles.sub]}>
              Your profile is saved for this session — no server, no passwords stored.
            </Text>
            <View style={styles.fields}>
              <Field label="Name" value={name} onChangeText={setName} placeholder="Alex" autoCapitalize="words" />
              <Field
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@school.edu"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Field
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Anything (not validated)"
                secureTextEntry
              />
            </View>
            <Pressable style={styles.primaryBtn} onPress={onSignUp}>
              <Text style={styles.primaryBtnText}>Create account →</Text>
            </Pressable>
            <View style={styles.stepHint}>
              <View style={styles.stepDot} />
              <View style={[styles.stepDot, styles.stepDotDim]} />
              <Text style={styles.stepHintText}>Next: your measurements</Text>
            </View>
            <Pressable style={styles.switchRow} onPress={() => setMode('signin')}>
              <Text style={styles.switchText}>
                Already have an account? <Text style={styles.switchBold}>Sign in</Text>
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (mode === 'signin') {
    return (
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Pressable style={styles.backBtn} onPress={() => setMode('landing')}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
            <Text style={[Type.caption, styles.kicker]}>SIGN IN</Text>
            <Text style={[Type.hero, styles.heading]}>Welcome back</Text>
            <Text style={[Type.body, styles.sub]}>Sign in to restore your measurements and alerts.</Text>
            <View style={styles.fields}>
              <Field
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@school.edu"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Field
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Any password for demo"
                secureTextEntry
              />
            </View>
            <Pressable style={styles.primaryBtn} onPress={onSignIn}>
              <Text style={styles.primaryBtnText}>Sign in</Text>
            </Pressable>
            <Pressable style={styles.switchRow} onPress={() => setMode('signup')}>
              <Text style={styles.switchText}>
                New here? <Text style={styles.switchBold}>Create account</Text>
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.landingRoot}>
      <View style={styles.heroBlock}>
        <SafeAreaView edges={['top']}>
          <View style={styles.heroInner}>
            <FloodedMark size={48} color="rgba(255,255,255,0.9)" />
            <Text style={styles.landingWordmark}>FLOODED</Text>
            <Text style={styles.landingTagline}>
              Fashion cut for tall proportions.{'\n'}Your measurements. Your fit.
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.cardArea}>
        <View style={styles.featureRow}>
          {[
            { icon: '◈', label: 'Tall sizing' },
            { icon: '◉', label: 'Fit engine' },
            { icon: '◎', label: 'Restock alerts' },
          ].map((f) => (
            <View key={f.label} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <Pressable style={styles.primaryBtn} onPress={() => setMode('signup')}>
          <Text style={styles.primaryBtnText}>Create account</Text>
        </Pressable>
        <Pressable style={styles.outlineBtn} onPress={() => setMode('signin')}>
          <Text style={styles.outlineBtnText}>Sign in</Text>
        </Pressable>

        <SafeAreaView edges={['bottom']}>
          <Text style={styles.disclaimer}>Demo prototype · INLS 382 · Spring 2026</Text>
        </SafeAreaView>
      </View>
    </View>
  );
}

function createWelcomeStyles(colors: FloodedColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    flex: { flex: 1 },

    landingRoot: { flex: 1 },
    heroBlock: {
      flex: 1.2,
      backgroundColor: colors.accent,
    },
    heroInner: {
      paddingHorizontal: 28,
      paddingTop: Space.xl,
      paddingBottom: Space.xxl,
    },
    landingWordmark: {
      fontFamily: Font.display,
      fontSize: 42,
      letterSpacing: 8,
      color: '#FFFFFF',
      marginTop: Space.xl,
      marginBottom: Space.md,
    },
    landingTagline: {
      fontFamily: Font.body,
      fontSize: 14,
      color: 'rgba(255,255,255,0.75)',
      lineHeight: 22,
    },
    cardArea: {
      flex: 1,
      backgroundColor: colors.bg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: -24,
      paddingHorizontal: 24,
      paddingTop: Space.xl,
    },
    featureRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Space.xl,
    },
    featureItem: { alignItems: 'center', gap: Space.sm, flex: 1 },
    featureIcon: { fontSize: 22, color: colors.accent },
    featureLabel: {
      fontFamily: Font.medium,
      fontSize: 10,
      color: colors.textSecondary,
      letterSpacing: 0.3,
      textAlign: 'center',
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.divider,
      marginBottom: Space.xl,
    },

    scroll: {
      paddingHorizontal: 20,
      paddingTop: Space.md,
      paddingBottom: Space.xxl,
    },
    backBtn: { marginBottom: Space.xl },
    backText: {
      fontFamily: Font.body,
      fontSize: 14,
      color: colors.textSecondary,
    },
    kicker: { marginBottom: Space.sm, color: colors.accent, letterSpacing: 1.5 },
    heading: { marginBottom: Space.sm },
    sub: { marginBottom: Space.xl, maxWidth: 340, lineHeight: 20 },
    fields: { gap: Space.md, marginBottom: Space.xl },

    primaryBtn: {
      backgroundColor: colors.accent,
      paddingVertical: 14,
      borderRadius: 6,
      alignItems: 'center',
      marginBottom: Space.sm,
    },
    primaryBtnText: {
      fontFamily: Font.body,
      fontSize: 14,
      letterSpacing: 0.3,
      color: colors.accentOnDark,
    },
    outlineBtn: {
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderColor: colors.accent,
      paddingVertical: 13,
      borderRadius: 6,
      alignItems: 'center',
      marginBottom: Space.sm,
    },
    outlineBtnText: {
      fontFamily: Font.body,
      fontSize: 14,
      color: colors.accent,
      letterSpacing: 0.3,
    },
    stepHint: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
      paddingVertical: Space.md,
      marginBottom: Space.sm,
    },
    stepDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.accent,
    },
    stepDotDim: { backgroundColor: colors.divider },
    stepHintText: { fontFamily: Font.body, fontSize: 12, color: colors.muted },
    switchRow: { paddingVertical: Space.md, alignItems: 'center' },
    switchText: {
      fontFamily: Font.body,
      color: colors.textSecondary,
      fontSize: 14,
    },
    switchBold: { fontFamily: Font.medium, color: colors.accent },
    disclaimer: {
      fontFamily: Font.body,
      fontSize: 11,
      color: colors.muted,
      textAlign: 'center',
      paddingTop: Space.lg,
    },
  });
}
