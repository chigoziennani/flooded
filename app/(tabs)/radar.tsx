import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useMemo } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { Font } from '@/constants/fonts';
import { Space } from '@/constants/Theme';
import type { FloodedColors } from '@/constants/Theme';
import { useFlooded } from '@/context/FloodedContext';
import { useTheme } from '@/context/ThemeContext';
import { getProduct } from '@/data/products';

export default function AlertsScreen() {
  const {
    trackedIds, untrackProduct, stockFor,
    simulateRestock, lastRestockMessage,
    trackedSizeFor, matchPercentForProduct,
  } = useFlooded();

  const { colors, Type } = useTheme();
  const styles = useMemo(() => createRadarStyles(colors), [colors]);

  const tracked = trackedIds
    .map(id => ({ product: getProduct(id), size: trackedSizeFor(id) }))
    .filter((x): x is { product: NonNullable<typeof x.product>; size: string | undefined } =>
      x.product !== undefined,
    );

  // Separate into price drops (have salePrice), restocks (out of stock), and watching (in stock/low)
  const priceDrops = tracked.filter(({ product }) => product.salePrice !== undefined);
  const restocks = tracked.filter(({ product }) => stockFor(product.id) === 'out' && !product.salePrice);
  const watching = tracked.filter(({ product }) => stockFor(product.id) !== 'out' && !product.salePrice);

  const onSimulate = () => {
    const msg = simulateRestock();
    if (msg && !msg.startsWith('Add')) {
      Alert.alert('Restock simulated', msg);
    } else {
      Alert.alert('Alerts', msg ?? 'Nothing to simulate');
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(220)} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <AppHeader
          right={{ kind: 'badge', count: priceDrops.length + restocks.length }}
          onMenuPress={() => router.push('/modal')}
        />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={[Type.caption, styles.kicker]}>RADAR</Text>
          <Text style={[Type.hero, styles.hero]}>Your alerts</Text>

          {lastRestockMessage ? (
            <View style={styles.restockBanner}>
              <FontAwesome name="check-circle" size={14} color={colors.accent} />
              <Text style={styles.restockBannerText}>{lastRestockMessage}</Text>
            </View>
          ) : null}

          {tracked.length === 0 ? (
            /* ── Empty state ── */
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <FontAwesome name="bell-o" size={28} color={colors.muted} />
              </View>
              <Text style={styles.emptyTitle}>No alerts yet</Text>
              <Text style={[Type.body, styles.emptySub]}>
                Open any product, select your size, then tap{' '}
                <Text style={{ color: colors.accent }}>"Track restock"</Text> — we'll alert you here the moment your size comes back.
              </Text>
              <Pressable style={styles.primaryBtn} onPress={() => router.push('/')}>
                <Text style={styles.primaryBtnText}>Browse catalog</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* ── Price drops ── */}
              {priceDrops.length > 0 && (
                <>
                  <Text style={[Type.caption, styles.section]}>PRICE DROP</Text>
                  {priceDrops.map(({ product, size }) => (
                    <Pressable
                      key={product.id}
                      style={[styles.alertCard, styles.priceDrop]}
                      onPress={() => router.push(`/product/${product.id}`)}>
                      <Image source={product.image} style={styles.thumb} resizeMode="contain" />
                      <View style={styles.alertBody}>
                        <View style={styles.alertTopRow}>
                          <Text style={styles.dropBadge}>PRICE DROP</Text>
                          {size && <Text style={styles.sizePill}>Size {size}</Text>}
                        </View>
                        <Text style={styles.alertTitle} numberOfLines={1}>
                          {product.brand} {product.name}
                        </Text>
                        <View style={styles.priceRow}>
                          <Text style={styles.salePrice}>${product.salePrice}</Text>
                          <Text style={styles.origPrice}>${product.price}</Text>
                          <Text style={styles.savePct}>
                            Save {Math.round((1 - product.salePrice! / product.price) * 100)}%
                          </Text>
                        </View>
                      </View>
                      <Pressable onPress={() => untrackProduct(product.id)} style={styles.dismissBtn} hitSlop={8}>
                        <FontAwesome name="times" size={12} color={colors.muted} />
                      </Pressable>
                    </Pressable>
                  ))}
                </>
              )}

              {/* ── Restock alerts ── */}
              {restocks.length > 0 && (
                <>
                  <Text style={[Type.caption, styles.section]}>WAITING FOR RESTOCK</Text>
                  {restocks.map(({ product, size }) => (
                    <View key={product.id} style={[styles.alertCard, styles.restockCard]}>
                      <Image source={product.image} style={styles.thumb} resizeMode="contain" />
                      <View style={styles.alertBody}>
                        <View style={styles.alertTopRow}>
                          <View style={styles.outDot} />
                          <Text style={styles.outLabel}>SOLD OUT</Text>
                          {size && <Text style={styles.sizePill}>Size {size}</Text>}
                        </View>
                        <Text style={styles.alertTitle} numberOfLines={1}>
                          {product.brand} {product.name}
                        </Text>
                        <Text style={styles.alertMeta}>
                          ${product.price} · {matchPercentForProduct(product.id)}% fit match
                        </Text>
                      </View>
                      <Pressable onPress={() => untrackProduct(product.id)} style={styles.dismissBtn} hitSlop={8}>
                        <FontAwesome name="times" size={12} color={colors.muted} />
                      </Pressable>
                    </View>
                  ))}
                </>
              )}

              {/* ── Watching / available ── */}
              {watching.length > 0 && (
                <>
                  <Text style={[Type.caption, styles.section]}>WATCHING</Text>
                  {watching.map(({ product, size }) => (
                    <Pressable
                      key={product.id}
                      style={[styles.alertCard, styles.watchCard]}
                      onPress={() => router.push(`/product/${product.id}`)}>
                      <Image source={product.image} style={styles.thumb} resizeMode="contain" />
                      <View style={styles.alertBody}>
                        <View style={styles.alertTopRow}>
                          <View style={[styles.outDot, { backgroundColor: stockFor(product.id) === 'in_stock' ? colors.accent : '#B5860A' }]} />
                          <Text style={[styles.outLabel, { color: stockFor(product.id) === 'in_stock' ? colors.accent : '#B5860A' }]}>
                            {stockFor(product.id) === 'in_stock' ? 'IN STOCK' : 'LOW STOCK'}
                          </Text>
                          {size && <Text style={styles.sizePill}>Size {size}</Text>}
                        </View>
                        <Text style={styles.alertTitle} numberOfLines={1}>
                          {product.brand} {product.name}
                        </Text>
                        <Text style={styles.alertMeta}>${product.price}</Text>
                      </View>
                      <FontAwesome name="chevron-right" size={11} color={colors.muted} />
                    </Pressable>
                  ))}
                </>
              )}

              <Pressable style={styles.simulate} onPress={onSimulate}>
                <FontAwesome name="refresh" size={12} color={colors.textSecondary} />
                <Text style={[Type.body, styles.simulateText]}>Simulate restock for demo</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

function createRadarStyles(colors: FloodedColors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 16, paddingBottom: Space.xxl },
  kicker: { marginTop: Space.md },
  hero: { marginTop: Space.sm, marginBottom: Space.lg },

  restockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    backgroundColor: colors.accentLight,
    borderRadius: 6,
    padding: Space.md,
    marginBottom: Space.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
  },
  restockBannerText: { fontFamily: Font.body, fontSize: 13, color: colors.accent, flex: 1 },

  /* Empty state */
  empty: { paddingTop: Space.xxl, alignItems: 'center' },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.raised,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Space.lg,
  },
  emptyTitle: { fontFamily: Font.medium, fontSize: 17, color: colors.text, marginBottom: Space.sm },
  emptySub: {
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Space.lg,
    marginBottom: Space.xl,
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
  },
  primaryBtnText: { fontFamily: Font.body, fontSize: 13, color: colors.accentOnDark, letterSpacing: 0.3 },

  section: { marginBottom: Space.sm, marginTop: Space.lg },

  /* Alert card base */
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    marginBottom: Space.sm,
    padding: Space.md,
    gap: Space.md,
  },
  priceDrop: {
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
  },
  restockCard: {
    borderLeftWidth: 2,
    borderLeftColor: colors.muted,
  },
  watchCard: {},

  thumb: { width: 56, height: 56, borderRadius: 4, backgroundColor: colors.raised },
  alertBody: { flex: 1 },
  alertTopRow: { flexDirection: 'row', alignItems: 'center', gap: Space.sm, marginBottom: 4 },

  dropBadge: {
    fontFamily: Font.medium,
    fontSize: 9,
    letterSpacing: 0.8,
    color: colors.accent,
    backgroundColor: colors.accentLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  outDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.muted },
  outLabel: { fontFamily: Font.medium, fontSize: 9, letterSpacing: 0.8, color: colors.muted },
  sizePill: {
    fontFamily: Font.medium,
    fontSize: 9,
    letterSpacing: 0.5,
    color: colors.textSecondary,
    backgroundColor: colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },

  alertTitle: { fontFamily: Font.medium, fontSize: 13, color: colors.text, marginBottom: 2 },
  alertMeta: { fontFamily: Font.body, fontSize: 11, color: colors.textSecondary },

  priceRow: { flexDirection: 'row', alignItems: 'center', gap: Space.sm, marginTop: 2 },
  salePrice: {
    fontFamily: Font.medium,
    fontSize: 15,
    color: colors.accent,
    fontVariant: ['tabular-nums'] as const,
  },
  origPrice: {
    fontFamily: Font.body,
    fontSize: 12,
    color: colors.muted,
    textDecorationLine: 'line-through',
    fontVariant: ['tabular-nums'] as const,
  },
  savePct: {
    fontFamily: Font.medium,
    fontSize: 10,
    color: '#2A7A3B',
    backgroundColor: '#EBF7EE',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },

  dismissBtn: { padding: 6 },

  simulate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    marginTop: Space.xl,
    paddingVertical: Space.sm,
    justifyContent: 'center',
  },
  simulateText: { color: colors.textSecondary },
  });
}
