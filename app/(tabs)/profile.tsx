import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, router } from 'expo-router';
import { useMemo } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { Font } from '@/constants/fonts';
import { Space } from '@/constants/Theme';
import type { FloodedColors } from '@/constants/Theme';
import { useFlooded } from '@/context/FloodedContext';
import { useTheme } from '@/context/ThemeContext';
import { getProduct } from '@/data/products';

function Row({
  title,
  subtitle,
  onPress,
  styles,
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      <Text style={styles.chev}>›</Text>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { session, signOutDemo, profileCompleteness, heightIn, inseam, torso, orders, wishlist } =
    useFlooded();
  const { colors, Type, isDark, setDarkMode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Animated.View entering={FadeIn.duration(220)} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <AppHeader onMenuPress={() => router.push('/modal')} />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={Type.wordmarkDisplay}>FLOODED</Text>
          <Text style={[Type.body, styles.sub]}>Profile & sizing</Text>

          <View style={styles.progressBlock}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${profileCompleteness}%` }]} />
            </View>
            <Text style={Type.caption}>PROFILE {profileCompleteness}% COMPLETE</Text>
          </View>

          <View style={styles.card}>
            {session ? (
              <>
                <Text style={Type.overline}>SIGNED IN</Text>
                <Text style={styles.signedName}>{session.displayName}</Text>
                <Text style={styles.signedEmail}>{session.email}</Text>
                <Pressable style={styles.outlineBtn} onPress={() => signOutDemo()}>
                  <Text style={styles.outlineBtnText}>Sign out</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={Type.hero}>Join Flooded</Text>
                <Text style={[Type.body, styles.guestBody]}>
                  Demo sign-in for your presentation. No server, no stored passwords.
                </Text>
                <Pressable style={styles.primaryBtn} onPress={() => router.push('/auth/sign-up')}>
                  <Text style={styles.primaryBtnText}>Create account</Text>
                </Pressable>
                <Pressable style={styles.ghostBtn} onPress={() => router.push('/auth/sign-in')}>
                  <Text style={styles.ghostBtnText}>Sign in</Text>
                </Pressable>
              </>
            )}
          </View>

          <Text style={[Type.caption, styles.section]}>APPEARANCE</Text>
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text style={styles.rowTitle}>Dark mode</Text>
                <Text style={styles.rowSub}>Uses a dark background across the app</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={setDarkMode}
                trackColor={{ false: colors.divider, true: colors.accentMid }}
                thumbColor={Platform.OS === 'android' ? (isDark ? colors.accent : colors.surface) : undefined}
                ios_backgroundColor={colors.divider}
              />
            </View>
          </View>

          <Text style={[Type.caption, styles.section]}>MEASUREMENTS</Text>
          <View style={styles.card}>
            <Row
              styles={styles}
              title="Your measurements"
              subtitle={`${heightIn}" height · ${inseam}" inseam · ${torso} torso`}
              onPress={() => router.push('/profile/measurements')}
            />
          </View>

          {orders.length > 0 ? (
            <>
              <Text style={[Type.caption, styles.section]}>RECENT ORDERS</Text>
              <View style={styles.card}>
                {orders.slice(0, 3).map((order, i) => {
                  const p = getProduct(order.productId);
                  return (
                    <View key={order.id}>
                      {i > 0 ? <View style={styles.rowDivider} /> : null}
                      <View style={styles.orderRow}>
                        <View style={styles.orderIcon}>
                          <FontAwesome
                            name={order.paymentMethod === 'apple_pay' ? 'apple' : 'credit-card'}
                            size={12}
                            color={colors.accent}
                          />
                        </View>
                        <View style={styles.rowText}>
                          <Text style={styles.rowTitle} numberOfLines={1}>
                            {p ? `${p.brand} ${p.name}` : order.productId}
                          </Text>
                          <Text style={styles.rowSub}>
                            Size {order.size} · ${order.price}
                          </Text>
                        </View>
                        <Text style={styles.orderChev}>›</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          ) : null}

          <Text style={[Type.caption, styles.section]}>SAVED</Text>
          <View style={styles.card}>
            <Row
              styles={styles}
              title={
                wishlist.length > 0
                  ? `${wishlist.length} saved piece${wishlist.length === 1 ? '' : 's'}`
                  : 'Wishlist'
              }
              subtitle={
                wishlist.length > 0 ? 'Sorted by fit match' : 'Heart any product to save it'
              }
              onPress={() => router.push('/wishlist')}
            />
          </View>

          <Text style={[Type.caption, styles.section]}>MORE</Text>
          <View style={styles.card}>
            <Link href="/modal" asChild>
              <Pressable style={styles.row}>
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>About Flooded</Text>
                  <Text style={styles.rowSub}>Problem, prototype, team</Text>
                </View>
                <Text style={styles.chev}>›</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

function createStyles(colors: FloodedColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    scroll: { paddingHorizontal: 16, paddingBottom: Space.xxl },
    sub: { marginTop: Space.sm, marginBottom: Space.lg },
    progressBlock: { marginBottom: Space.lg },
    progressTrack: {
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.raised,
      overflow: 'hidden',
      marginBottom: Space.sm,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.accent,
      borderRadius: 2,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: Space.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
      marginBottom: Space.sm,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Space.md,
    },
    switchText: { flex: 1 },
    signedName: {
      fontFamily: Font.medium,
      fontSize: 18,
      color: colors.text,
      marginTop: Space.sm,
    },
    signedEmail: {
      fontFamily: Font.body,
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
      marginBottom: Space.md,
    },
    outlineBtn: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
      paddingVertical: 10,
      borderRadius: 6,
      alignItems: 'center',
    },
    outlineBtnText: {
      fontFamily: Font.body,
      color: colors.textSecondary,
      fontSize: 13,
    },
    guestBody: { marginTop: Space.sm, marginBottom: Space.lg },
    orderRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: Space.md },
    orderIcon: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.accentLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    orderChev: { color: colors.muted, fontSize: 20, paddingLeft: 8 },
    rowDivider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.divider, marginVertical: 4 },
    primaryBtn: {
      backgroundColor: colors.accent,
      paddingVertical: 12,
      borderRadius: 6,
      alignItems: 'center',
      marginBottom: Space.sm,
    },
    primaryBtnText: {
      fontFamily: Font.body,
      fontSize: 13,
      letterSpacing: 0.3,
      color: colors.accentOnDark,
    },
    ghostBtn: {
      paddingVertical: 10,
      alignItems: 'center',
    },
    ghostBtnText: { fontFamily: Font.body, color: colors.textSecondary, fontSize: 13 },
    section: { marginTop: Space.lg, marginBottom: Space.sm },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
    },
    rowText: { flex: 1 },
    rowTitle: { fontFamily: Font.medium, color: colors.text, fontSize: 14 },
    rowSub: { fontFamily: Font.body, color: colors.textTertiary, fontSize: 12, marginTop: 4 },
    chev: { color: colors.muted, fontSize: 20, fontWeight: '300', paddingLeft: 8 },
  });
}
