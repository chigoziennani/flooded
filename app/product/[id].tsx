import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Font } from '@/constants/fonts';
import { Space } from '@/constants/Theme';
import type { FloodedColors } from '@/constants/Theme';
import { useFlooded } from '@/context/FloodedContext';
import { useTheme } from '@/context/ThemeContext';
import { getProduct, PRODUCTS } from '@/data/products';
import type { SizeRow } from '@/data/products';

type Sheet = 'none' | 'size' | 'payment' | 'processing' | 'fitcheck';

function stockLabel(stock: string) {
  if (stock === 'in_stock') return 'In stock';
  if (stock === 'low') return 'Low stock';
  return 'Sold out';
}
function stockColor(stock: string, colors: FloodedColors) {
  if (stock === 'in_stock') return colors.accent;
  if (stock === 'low') return '#B5860A';
  return colors.muted;
}

/** One row in the sizing table */
type TableStyles = ReturnType<typeof createTableStyles>;

function SizeTableRow({
  row,
  isTop,
  isBottom,
  isShoe,
  tableStyles,
}: {
  row: SizeRow;
  isTop: boolean;
  isBottom: boolean;
  isShoe: boolean;
  tableStyles: TableStyles;
}) {
  return (
    <View style={tableStyles.row}>
      <Text style={[tableStyles.cell, tableStyles.sizeCell]}>{row.size}</Text>
      {isTop && (
        <>
          <Text style={tableStyles.cell}>{row.chest ?? '—'}</Text>
          <Text style={tableStyles.cell}>{row.bodyLength ?? '—'}</Text>
          <Text style={tableStyles.cell}>{row.sleeve ?? '—'}</Text>
        </>
      )}
      {isBottom && (
        <>
          <Text style={tableStyles.cell}>{row.waist ?? '—'}</Text>
          <Text style={tableStyles.cell}>{row.inseam ?? '—'}</Text>
          <Text style={tableStyles.cell}>{row.hip ?? '—'}</Text>
        </>
      )}
      {isShoe && (
        <>
          <Text style={tableStyles.cell}>{row.eu ?? '—'}</Text>
          <Text style={tableStyles.cell}>{row.uk ?? '—'}</Text>
          <Text style={tableStyles.cell}>{row.lengthMm ?? '—'}</Text>
        </>
      )}
    </View>
  );
}

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors, Type } = useTheme();
  const tableStyles = useMemo(() => createTableStyles(colors), [colors]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const product = typeof id === 'string' ? getProduct(id) : undefined;
  const {
    trackProduct, untrackProduct, trackedIds, stockFor,
    matchPercentForProduct, submitFitFeedback,
    toggleWishlist, isWishlisted, addOrder,
    addRecentlyViewed, trackedSizeFor, setTrackedSize,
  } = useFlooded();
  const [sheet, setSheet] = useState<Sheet>('none');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [trackSheet, setTrackSheet] = useState(false);

  // Record this as viewed
  useEffect(() => {
    if (product?.id) addRecentlyViewed(product.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  if (!product) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.miss}>Product not found</Text>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>
      </View>
    );
  }

  const tracked = trackedIds.includes(product.id);
  const trackedSize = trackedSizeFor(product.id);
  const wishlisted = isWishlisted(product.id);
  const stock = stockFor(product.id);
  const match = matchPercentForProduct(product.id);

  const isTop = product.category === 'Tops' || product.category === 'Outerwear';
  const isBottom = product.category === 'Bottoms';
  const isShoe = product.category === 'Shoes';

  const pairProducts = (product.pairs ?? [])
    .map(pid => getProduct(pid))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];

  const openBuy = () => {
    if (stock === 'out') {
      Alert.alert('Sold out', 'Track this item to be notified when your size is back.');
      return;
    }
    setSelectedSize(null);
    setSheet('size');
  };

  const onPay = (method: 'apple_pay' | 'card') => {
    setSheet('processing');
    setTimeout(() => {
      addOrder({
        productId: product.id,
        size: selectedSize ?? product.sizes[0],
        price: product.price,
        paymentMethod: method,
      });
      setSheet('none');
      router.push({
        pathname: '/checkout/confirm',
        params: {
          productId: product.id,
          size: selectedSize ?? product.sizes[0],
          price: String(product.price),
          method,
        },
      });
    }, 2200);
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 130 }}>
        {/* Hero image */}
        <View style={styles.heroOuter}>
          <Image source={product.image} style={styles.heroImg} resizeMode="contain" />
          <Pressable
            style={styles.heartBtn}
            onPress={() => toggleWishlist(product.id)}
            hitSlop={8}>
            <FontAwesome
              name={wishlisted ? 'heart' : 'heart-o'}
              size={18}
              color={wishlisted ? colors.accent : colors.textTertiary}
            />
          </Pressable>
          <View style={styles.fitBadge}>
            <Text style={styles.fitBadgeText}>{match}% fit match</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Brand + name */}
          <View style={styles.brandRow}>
            <Text style={Type.brandCaps}>{product.brand.toUpperCase()}</Text>
            <View style={styles.condBadge}>
              <Text style={styles.condText}>{product.condition === 'new' ? 'New' : 'Used'}</Text>
            </View>
          </View>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.colorway}>{product.colorway}</Text>
          <Text style={styles.priceLg}>${product.price}</Text>

          {/* Stock status */}
          <View style={styles.stockRow}>
            <View style={[styles.stockDot, { backgroundColor: stockColor(stock, colors) }]} />
            <Text style={[styles.stockTxt, { color: stockColor(stock, colors) }]}>
              {stockLabel(stock)}
            </Text>
          </View>

          {/* ─ Description ─ */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.descText}>{product.description}</Text>
          </View>

          {/* ─ Materials ─ */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Materials</Text>
            <Text style={styles.descText}>{product.materials}</Text>
          </View>

          {/* ─ Fit notes ─ */}
          <View style={[styles.section, styles.fitCard]}>
            <View style={styles.fitCardHeader}>
              <Text style={[styles.sectionTitle, { color: colors.accent }]}>Fit for tall bodies</Text>
              <View style={styles.tallBadge}>
                <Text style={styles.tallBadgeText}>TALL FIT</Text>
              </View>
            </View>
            <Text style={[styles.descText, { color: colors.accent }]}>{product.fit}</Text>
          </View>

          {/* ─ Available sizes ─ */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available sizes</Text>
            <View style={styles.sizeGrid}>
              {product.sizes.map((s) => (
                <View key={s} style={styles.sizePill}>
                  <Text style={styles.sizePillText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ─ Outfit pairings ─ */}
          {pairProducts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pairs well with</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
                {pairProducts.map(p => (
                  <Pressable
                    key={p.id}
                    style={styles.pairCard}
                    onPress={() => router.push(`/product/${p.id}`)}>
                    <View style={styles.pairImgWrap}>
                      <Image source={p.image} style={styles.pairImg} resizeMode="contain" />
                    </View>
                    <Text style={Type.brandCaps}>{p.brand.toUpperCase()}</Text>
                    <Text style={styles.pairName} numberOfLines={2}>{p.name}</Text>
                    <Text style={styles.pairPrice}>${p.salePrice ?? p.price}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* ─ Sizing chart ─ */}
          {product.sizeChart && product.sizeChart.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sizing chart</Text>
              {/* Header row */}
              <View style={[tableStyles.row, tableStyles.headerRow]}>
                <Text style={[tableStyles.cell, tableStyles.sizeCell, tableStyles.headerCell]}>Size</Text>
                {isTop && (
                  <>
                    <Text style={[tableStyles.cell, tableStyles.headerCell]}>Chest</Text>
                    <Text style={[tableStyles.cell, tableStyles.headerCell]}>Body L</Text>
                    <Text style={[tableStyles.cell, tableStyles.headerCell]}>Sleeve</Text>
                  </>
                )}
                {isBottom && (
                  <>
                    <Text style={[tableStyles.cell, tableStyles.headerCell]}>Waist</Text>
                    <Text style={[tableStyles.cell, tableStyles.headerCell]}>Inseam</Text>
                    <Text style={[tableStyles.cell, tableStyles.headerCell]}>Hip</Text>
                  </>
                )}
                {isShoe && (
                  <>
                    <Text style={[tableStyles.cell, tableStyles.headerCell]}>EU</Text>
                    <Text style={[tableStyles.cell, tableStyles.headerCell]}>UK</Text>
                    <Text style={[tableStyles.cell, tableStyles.headerCell]}>Length</Text>
                  </>
                )}
              </View>
              {product.sizeChart.map((row, i) => (
                <View key={row.size} style={i % 2 === 1 ? tableStyles.rowAlt : undefined}>
                  <SizeTableRow row={row} isTop={isTop} isBottom={isBottom} isShoe={isShoe} tableStyles={tableStyles} />
                </View>
              ))}
              <Text style={styles.chartNote}>All measurements are approximate. Tall sizing only.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ─ Footer ─ */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 18) }]}>
        <Pressable style={[styles.buyBtn, stock === 'out' && styles.buyBtnDisabled]} onPress={openBuy}>
          <Text style={styles.buyBtnText}>
            {stock === 'out' ? 'Sold out' : 'Buy now — $' + product.price}
          </Text>
        </Pressable>
        <View style={styles.footerRow}>
          <Pressable
            style={[styles.iconBtn, tracked && styles.iconBtnOn]}
            onPress={() => tracked ? untrackProduct(product.id) : setTrackSheet(true)}>
            <FontAwesome name={tracked ? 'bell' : 'bell-o'} size={13} color={tracked ? colors.accent : colors.textSecondary} />
            <Text style={[styles.iconBtnText, tracked && { color: colors.accent }]}>
              {tracked ? `Size ${trackedSize ?? '—'}` : 'Track restock'}
            </Text>
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={() => setSheet('fitcheck')}>
            <FontAwesome name="check-circle-o" size={13} color={colors.textSecondary} />
            <Text style={styles.iconBtnText}>Fit check</Text>
          </Pressable>
        </View>
      </View>

      {/* ─ Size selection sheet ─ */}
      <Modal visible={sheet === 'size'} animationType="slide" transparent>
        <Pressable style={styles.backdrop} onPress={() => setSheet('none')} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.sheetHandle} />
          <Text style={[Type.section, styles.sheetTitle]}>Select your size</Text>
          <Text style={[Type.body, styles.sheetSub]}>{product.brand} · {product.name}</Text>
          <View style={styles.sizeGrid}>
            {product.sizes.map((s) => {
              const active = selectedSize === s;
              return (
                <Pressable
                  key={s}
                  style={[styles.sizeSelectPill, active && styles.sizeSelectPillOn]}
                  onPress={() => setSelectedSize(s)}>
                  <Text style={[styles.sizeSelectText, active && { color: colors.accentOnDark }]}>
                    {s}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.sheetPriceRow}>
            <Text style={Type.body}>Total</Text>
            <Text style={styles.priceLg}>${product.price}</Text>
          </View>
          <Pressable
            style={styles.sheetPrimaryBtn}
            onPress={() => {
              if (!selectedSize) { Alert.alert('Select a size', 'Choose a size to continue.'); return; }
              setSheet('payment');
            }}>
            <Text style={styles.sheetPrimaryBtnText}>Continue to payment</Text>
          </Pressable>
        </View>
      </Modal>

      {/* ─ Payment method sheet ─ */}
      <Modal visible={sheet === 'payment'} animationType="slide" transparent>
        <Pressable style={styles.backdrop} onPress={() => setSheet('size')} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.sheetHandle} />
          <Text style={[Type.section, styles.sheetTitle]}>Payment</Text>
          <Text style={[Type.body, styles.sheetSub]}>Size {selectedSize} · ${product.price}</Text>
          <Pressable style={styles.applePayBtn} onPress={() => onPay('apple_pay')}>
            <FontAwesome name="apple" size={18} color="#FFFFFF" />
            <Text style={styles.applePayText}> Pay</Text>
          </Pressable>
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or pay with card</Text>
            <View style={styles.orLine} />
          </View>
          <Pressable style={styles.cardBtn} onPress={() => onPay('card')}>
            <FontAwesome name="credit-card" size={13} color={colors.text} />
            <Text style={styles.cardBtnText}> Credit or debit card</Text>
          </Pressable>
          <Text style={[Type.body, styles.payDisclaimer]}>Demo simulation — no real payment is processed.</Text>
        </View>
      </Modal>

      {/* ─ Processing ─ */}
      <Modal visible={sheet === 'processing'} animationType="fade" transparent>
        <View style={styles.processingBackdrop}>
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.processingText}>Authorizing with Face ID…</Text>
            <Text style={[Type.body, { textAlign: 'center' }]}>Hold still while we verify</Text>
          </View>
        </View>
      </Modal>

      {/* ─ Track size selection ─ */}
      <Modal visible={trackSheet} animationType="slide" transparent>
        <Pressable style={styles.backdrop} onPress={() => setTrackSheet(false)} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.sheetHandle} />
          <Text style={[Type.section, styles.sheetTitle]}>Track a size</Text>
          <Text style={[Type.body, styles.sheetSub]}>
            Select your size — we'll alert you the moment it restocks.
          </Text>
          <View style={styles.sizeGrid}>
            {product.sizes.map(s => {
              const active = selectedSize === s;
              return (
                <Pressable
                  key={s}
                  style={[styles.sizeSelectPill, active && styles.sizeSelectPillOn]}
                  onPress={() => setSelectedSize(s)}>
                  <Text style={[styles.sizeSelectText, active && { color: colors.accentOnDark }]}>{s}</Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable
            style={styles.sheetPrimaryBtn}
            onPress={() => {
              if (!selectedSize) { Alert.alert('Select a size', 'Choose the size you want tracked.'); return; }
              trackProduct(product.id, selectedSize);
              setTrackedSize(product.id, selectedSize);
              setTrackSheet(false);
              Alert.alert('Tracking', `We'll notify you when ${product.brand} ${product.name} (size ${selectedSize}) is back in stock.`);
            }}>
            <Text style={styles.sheetPrimaryBtnText}>Confirm tracking</Text>
          </Pressable>
        </View>
      </Modal>

      {/* ─ Fit check ─ */}
      <Modal visible={sheet === 'fitcheck'} animationType="slide" transparent>
        <Pressable style={styles.backdrop} onPress={() => setSheet('none')} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.sheetHandle} />
          <Text style={[Type.section, styles.sheetTitle]}>Fit feedback</Text>
          <Text style={[Type.body, styles.sheetSub]}>One tap updates your personal fit model.</Text>
          <Pressable
            style={styles.sheetPrimaryBtn}
            onPress={() => {
              submitFitFeedback('sleeve_short');
              setSheet('none');
              Alert.alert('Saved', 'Torso preference updated — future matches recalibrated.');
            }}>
            <Text style={styles.sheetPrimaryBtnText}>Sleeves felt short</Text>
          </Pressable>
          <Pressable
            style={[styles.sheetPrimaryBtn, styles.sheetSecondaryBtn]}
            onPress={() => {
              submitFitFeedback('inseam_short');
              setSheet('none');
              Alert.alert('Saved', 'Inseam signal updated.');
            }}>
            <Text style={[styles.sheetPrimaryBtnText, { color: colors.text }]}>Inseam felt short</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

function createTableStyles(colors: FloodedColors) {
  return StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderHairline,
    paddingVertical: 8,
  },
  rowAlt: {
    backgroundColor: colors.raised,
  },
  headerRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.surface,
  },
  cell: {
    flex: 1,
    fontFamily: Font.body,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sizeCell: {
    fontFamily: Font.medium,
    color: colors.text,
    textAlign: 'left',
  },
  headerCell: {
    fontFamily: Font.medium,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  });
}

function createStyles(colors: FloodedColors) {
  return StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  miss: { fontFamily: Font.medium, color: colors.text, fontSize: 15 },
  back: { fontFamily: Font.body, color: colors.textSecondary, marginTop: 18, fontSize: 14 },

  heroOuter: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: colors.imagePlate,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroImg: {
    width: '85%',
    height: '85%',
  },
  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.bg,
    borderRadius: 20,
    padding: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  fitBadge: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    backgroundColor: colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
  },
  fitBadgeText: {
    fontFamily: Font.medium,
    fontSize: 11,
    color: colors.accent,
    letterSpacing: 0.2,
  },

  body: { paddingHorizontal: 16, paddingTop: Space.lg },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  condBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  condText: { fontFamily: Font.medium, fontSize: 10, color: colors.textSecondary, letterSpacing: 0.3 },
  name: {
    fontFamily: Font.display,
    fontSize: 22,
    letterSpacing: 0.2,
    color: colors.text,
    marginTop: Space.sm,
    lineHeight: 28,
  },
  colorway: { fontFamily: Font.body, fontSize: 12, color: colors.textTertiary, marginTop: 4 },
  priceLg: {
    fontFamily: Font.medium,
    fontSize: 22,
    color: colors.accent,
    marginTop: Space.md,
    fontVariant: ['tabular-nums'] as const,
  },
  stockRow: { flexDirection: 'row', alignItems: 'center', marginTop: Space.sm, gap: 6 },
  stockDot: { width: 6, height: 6, borderRadius: 3 },
  stockTxt: { fontFamily: Font.medium, fontSize: 12 },

  /* Content sections */
  section: {
    marginTop: Space.xl,
    paddingBottom: Space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderHairline,
  },
  sectionTitle: {
    fontFamily: Font.medium,
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.text,
    marginBottom: Space.sm,
    textTransform: 'uppercase',
  },
  descText: {
    fontFamily: Font.body,
    fontSize: 13,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  fitCard: {
    backgroundColor: colors.accentLight,
    borderRadius: 8,
    padding: Space.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fitCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Space.sm },
  tallBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  tallBadgeText: { fontFamily: Font.medium, fontSize: 8, color: '#FFFFFF', letterSpacing: 1 },

  sizeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm, marginTop: Space.sm },
  sizePill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  sizePillText: { fontFamily: Font.medium, fontSize: 12, color: colors.textSecondary },
  chartNote: {
    fontFamily: Font.body,
    fontSize: 10,
    color: colors.muted,
    marginTop: Space.sm,
    fontStyle: 'italic',
  },

  /* Outfit pairing */
  pairCard: {
    width: 120,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    padding: Space.sm,
    overflow: 'hidden',
  },
  pairImgWrap: {
    height: 90,
    backgroundColor: colors.raised,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Space.sm,
  },
  pairImg: { width: '90%', height: '90%' },
  pairName: { fontFamily: Font.body, fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  pairPrice: { fontFamily: Font.medium, fontSize: 12, color: colors.text, marginTop: 4 },

  /* Footer */
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderHairline,
    gap: Space.sm,
  },
  buyBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  buyBtnDisabled: { backgroundColor: colors.raised },
  buyBtnText: { fontFamily: Font.body, color: colors.accentOnDark, fontSize: 14, letterSpacing: 0.3 },
  footerRow: { flexDirection: 'row', gap: Space.sm },
  iconBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  iconBtnOn: { borderColor: colors.accent, backgroundColor: colors.accentLight },
  iconBtnText: { fontFamily: Font.body, fontSize: 12, color: colors.textSecondary },

  /* Sheets */
  backdrop: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    alignSelf: 'center',
    marginBottom: Space.lg,
  },
  sheetTitle: { marginBottom: 4 },
  sheetSub: { marginBottom: Space.xl },
  sheetPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Space.xl,
    marginBottom: Space.md,
  },
  sheetPrimaryBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: Space.sm,
  },
  sheetPrimaryBtnText: { fontFamily: Font.body, color: colors.accentOnDark, fontSize: 14, letterSpacing: 0.3 },
  sheetSecondaryBtn: {
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  sizeSelectPill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    minWidth: 52,
    alignItems: 'center',
  },
  sizeSelectPillOn: { borderColor: colors.accent, backgroundColor: colors.accent },
  sizeSelectText: { fontFamily: Font.medium, fontSize: 12, color: colors.textSecondary },
  applePayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 6,
    marginBottom: Space.md,
  },
  applePayText: { fontFamily: Font.medium, fontSize: 16, color: '#FFFFFF', letterSpacing: -0.3 },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: Space.sm, marginBottom: Space.md },
  orLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.divider },
  orText: { fontFamily: Font.body, fontSize: 12, color: colors.muted },
  cardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    paddingVertical: 14,
    borderRadius: 6,
    marginBottom: Space.md,
  },
  cardBtnText: { fontFamily: Font.body, fontSize: 14, color: colors.text },
  payDisclaimer: { textAlign: 'center', fontSize: 11, marginTop: Space.sm },
  processingBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingCard: {
    backgroundColor: colors.bg,
    borderRadius: 16,
    paddingHorizontal: 40,
    paddingVertical: 40,
    alignItems: 'center',
    gap: Space.lg,
    minWidth: 240,
  },
  processingText: { fontFamily: Font.medium, fontSize: 15, color: colors.text, textAlign: 'center' },
  });
}
