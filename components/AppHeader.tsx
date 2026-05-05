import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FloodedMark } from '@/components/FloodedMark';
import { Font } from '@/constants/fonts';
import { type FloodedColors, type ThemedType } from '@/constants/Theme';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  right?: 'menu' | { kind: 'step'; text: string } | { kind: 'badge'; count: number };
  onMenuPress: () => void;
};

function Hamburger({ lineColor }: { lineColor: string }) {
  const line = { height: 1, backgroundColor: lineColor, width: 14 as const };
  return (
    <View style={{ gap: 4 }}>
      <View style={line} />
      <View style={line} />
      <View style={line} />
    </View>
  );
}

export function AppHeader({ right = 'menu', onMenuPress }: Props) {
  const { colors, Type } = useTheme();
  const styles = useMemo(() => createStyles(colors, Type), [colors, Type]);

  return (
    <View style={styles.row}>
      <View style={styles.logoGroup}>
        <FloodedMark size={18} color={colors.accent} />
        <Text style={styles.logoText}>FLOODED</Text>
      </View>
      <View style={styles.right}>
        {right === 'menu' ? (
          <Pressable onPress={onMenuPress} hitSlop={12} accessibilityLabel="Menu">
            <Hamburger lineColor={colors.text} />
          </Pressable>
        ) : right.kind === 'step' ? (
          <Text style={styles.step}>{right.text}</Text>
        ) : (
          <Pressable onPress={onMenuPress} style={styles.badgeRow} hitSlop={8}>
            <View style={styles.dot} />
            <Text style={styles.badgeCount}>{right.count}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function createStyles(colors: FloodedColors, Type: ThemedType) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 52,
      paddingHorizontal: 16,
      backgroundColor: colors.bg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderHairline,
    },
    logoGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    logoText: {
      ...Type.navLogo,
      color: colors.text,
    },
    right: { minWidth: 44, alignItems: 'flex-end', justifyContent: 'center' },
    step: {
      fontFamily: Font.body,
      fontSize: 12,
      color: colors.muted,
    },
    badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.accent,
    },
    badgeCount: {
      fontFamily: Font.body,
      fontSize: 12,
      color: colors.text,
    },
  });
}
