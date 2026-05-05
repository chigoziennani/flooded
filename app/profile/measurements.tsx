/**
 * Measurements screen — drum-roll pickers for key measurements.
 */
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { DrumPicker } from '@/components/DrumPicker';
import { Font } from '@/constants/fonts';
import { Space } from '@/constants/Theme';
import type { FloodedColors } from '@/constants/Theme';
import type { TorsoType } from '@/constants/Theme';
import { useFlooded } from '@/context/FloodedContext';
import { useTheme } from '@/context/ThemeContext';

const HEIGHTS = Array.from({ length: 25 }, (_, i) => 60 + i);
const INSEAMS = Array.from({ length: 15 }, (_, i) => 28 + i);
const SLEEVES = Array.from({ length: 21 }, (_, i) => 30 + i * 0.5);
const WAISTS = Array.from({ length: 19 }, (_, i) => 26 + i);
const TORSO_OPTIONS: TorsoType[] = ['Standard', 'Long', 'Extra Long'];

function heightLabel(n: number) {
  const ft = Math.floor(n / 12);
  const inches = n % 12;
  return `${ft}'${inches}"`;
}
function inchLabel(n: number) {
  return `${n}"`;
}
function sleeveLabel(n: number) {
  return Number.isInteger(n) ? `${n}"` : `${n}"`;
}

export default function MeasurementsScreen() {
  const { firstTime } = useLocalSearchParams<{ firstTime?: string }>();
  const isFirstTime = firstTime === '1';
  const { colors, Type, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    heightIn, inseam, torso,
    sleeveLength, waistIn,
    profileCompleteness,
    setHeightIn, setInseam, setTorso,
    setSleeveLength, setWaistIn,
    saveProfile,
  } = useFlooded();

  const cm = useMemo(() => Math.round(heightIn * 2.54), [heightIn]);

  function PickerRow({
    label,
    hint,
    children,
  }: {
    label: string;
    hint?: string;
    children: React.ReactNode;
  }) {
    return (
      <View style={styles.pickerRow}>
        <View style={styles.pickerLabel}>
          <Text style={styles.pickerLabelText}>{label}</Text>
          {hint ? <Text style={styles.pickerHint}>{hint}</Text> : null}
        </View>
        <View style={styles.pickerWrap}>{children}</View>
      </View>
    );
  }

  const onContinue = () => {
    saveProfile();
    if (isFirstTime) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Saved', 'Measurements updated — fit scores recalculated.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={isFirstTime ? ['top', 'bottom'] : ['bottom']}>
      {isFirstTime && (
        <View style={styles.onboardingHeader}>
          <View style={styles.stepIndicator}>
            <View style={[styles.stepPip, styles.stepPipDone]}>
              <Text style={styles.stepPipText}>✓</Text>
            </View>
            <View style={styles.stepConnector} />
            <View style={[styles.stepPip, styles.stepPipActive]}>
              <Text style={styles.stepPipText}>2</Text>
            </View>
          </View>
          <Text style={[Type.caption, styles.stepLabel]}>STEP 2 OF 2 — YOUR MEASUREMENTS</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator
        indicatorStyle={Platform.OS === 'ios' ? (isDark ? 'white' : 'black') : undefined}
      >
        {!isFirstTime && (
          <AppHeader
            right={{ kind: 'step', text: `${profileCompleteness}%` }}
            onMenuPress={() => router.back()}
          />
        )}

        <Text style={[Type.caption, styles.kicker]}>
          {isFirstTime ? 'ALMOST THERE' : 'YOUR MEASUREMENTS'}
        </Text>
        <Text style={[Type.hero, styles.headline]}>
          {isFirstTime ? 'Tell us about you' : 'Measurements'}
        </Text>
        <Text style={[Type.body, styles.lead]}>
          {isFirstTime
            ? 'Set every measurement below — sleeve and waist are used with our size charts so fit scores match tops, pants, and jackets.'
            : 'Scroll to update. Fit scores recalculate immediately.'}
        </Text>

        <View style={styles.progressBlock}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${profileCompleteness}%` }]} />
          </View>
          <Text style={[Type.caption, styles.progressLabel]}>{profileCompleteness}% complete</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeading}>Height &amp; Inseam</Text>
            <View style={styles.heightPill}>
              <Text style={styles.heightPillText}>
                {heightLabel(heightIn)} · ~{cm} cm
              </Text>
            </View>
          </View>

          <View style={styles.pickerPair}>
            <PickerRow label="Height" hint="ft / in">
              <DrumPicker
                values={HEIGHTS}
                selected={heightIn}
                onChange={v => setHeightIn(v)}
                renderLabel={heightLabel}
                width={80}
              />
            </PickerRow>
            <View style={styles.pickerDivider} />
            <PickerRow label="Inseam" hint="inches">
              <DrumPicker
                values={INSEAMS}
                selected={inseam}
                onChange={v => setInseam(v)}
                renderLabel={inchLabel}
                width={72}
              />
            </PickerRow>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>Torso length</Text>
          <Text style={[Type.body, styles.cardDesc]}>
            Affects sleeve-length scoring — if shirts always ride up on you, you have a long torso.
          </Text>
          <View style={styles.torsoRow}>
            {TORSO_OPTIONS.map((t) => {
              const on = torso === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setTorso(t)}
                  style={[styles.torsoChip, on && styles.torsoChipOn]}>
                  <Text style={[styles.torsoChipText, on && styles.torsoChipTextOn]}>{t}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>Sleeve &amp; Waist</Text>
          <Text style={[Type.body, styles.cardDesc]}>
            Used in fit matching: sleeve length for tops and outerwear vs chart sleeves; waist (and your hip ratio) for pants vs chart waist and hip.
          </Text>
          <View style={styles.pickerPair}>
            <PickerRow label="Sleeve" hint="inches">
              <DrumPicker
                values={SLEEVES}
                selected={sleeveLength}
                onChange={v => setSleeveLength(v)}
                renderLabel={sleeveLabel}
                width={72}
              />
            </PickerRow>
            <View style={styles.pickerDivider} />
            <PickerRow label="Waist" hint="inches">
              <DrumPicker
                values={WAISTS}
                selected={waistIn}
                onChange={v => setWaistIn(v)}
                renderLabel={inchLabel}
                width={72}
              />
            </PickerRow>
          </View>
        </View>

        <Pressable style={styles.primary} onPress={onContinue}>
          <Text style={styles.primaryText}>
            {isFirstTime ? 'Get started →' : 'Save measurements'}
          </Text>
        </Pressable>

        {isFirstTime && (
          <Pressable style={styles.skipBtn} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: FloodedColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    scroll: { paddingHorizontal: 16, paddingBottom: Space.xxl, paddingTop: 4 },

    onboardingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: Space.md,
      paddingBottom: Space.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderHairline,
      gap: Space.md,
    },
    stepIndicator: { flexDirection: 'row', alignItems: 'center' },
    stepPip: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.divider,
    },
    stepPipDone: { backgroundColor: colors.accent },
    stepPipActive: { backgroundColor: colors.accent },
    stepPipText: { fontFamily: Font.medium, fontSize: 10, color: '#FFFFFF' },
    stepConnector: { width: 20, height: 1, backgroundColor: colors.accent, marginHorizontal: 4 },
    stepLabel: { flex: 1, color: colors.accent },

    kicker: { marginTop: Space.lg, marginBottom: Space.sm, color: colors.accent },
    headline: { marginBottom: Space.sm },
    lead: { marginBottom: Space.lg, lineHeight: 20 },

    progressBlock: { marginBottom: Space.lg },
    progressTrack: {
      height: 5,
      borderRadius: 100,
      backgroundColor: colors.progressTrack,
      overflow: 'hidden',
      marginBottom: Space.sm,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.progressFill,
      borderRadius: 100,
    },
    progressLabel: { color: colors.progressLabel },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: Space.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
      marginBottom: Space.md,
      borderLeftWidth: 2,
      borderLeftColor: colors.accent,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Space.lg,
    },
    cardHeading: { fontFamily: Font.medium, fontSize: 13, color: colors.text, marginBottom: Space.sm },
    cardDesc: { fontSize: 12, marginBottom: Space.md },
    heightPill: {
      backgroundColor: colors.accentLight,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 4,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.accent,
    },
    heightPillText: { fontFamily: Font.medium, fontSize: 11, color: colors.accent },

    pickerPair: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginTop: Space.sm,
    },
    pickerDivider: {
      width: StyleSheet.hairlineWidth,
      height: 90,
      backgroundColor: colors.divider,
    },
    pickerRow: { alignItems: 'center', gap: Space.sm },
    pickerLabel: { alignItems: 'center' },
    pickerLabelText: { fontFamily: Font.medium, fontSize: 11, color: colors.text },
    pickerHint: { fontFamily: Font.body, fontSize: 10, color: colors.muted },
    pickerWrap: { alignItems: 'center' },

    torsoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm, marginTop: Space.sm },
    torsoChip: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 4,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
      backgroundColor: colors.bg,
    },
    torsoChipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
    torsoChipText: { fontFamily: Font.body, fontSize: 13, color: colors.textSecondary },
    torsoChipTextOn: { color: colors.accentOnDark },

    primary: {
      backgroundColor: colors.accent,
      paddingVertical: 14,
      borderRadius: 6,
      alignItems: 'center',
      marginTop: Space.sm,
    },
    primaryText: { fontFamily: Font.body, fontSize: 14, letterSpacing: 0.3, color: colors.accentOnDark },
    skipBtn: { paddingVertical: Space.md, alignItems: 'center', marginTop: Space.sm },
    skipText: { fontFamily: Font.body, fontSize: 13, color: colors.muted },
  });
}
