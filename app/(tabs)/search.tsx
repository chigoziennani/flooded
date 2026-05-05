import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { Font } from '@/constants/fonts';
import { Space } from '@/constants/Theme';
import type { FloodedColors } from '@/constants/Theme';
import { useFlooded } from '@/context/FloodedContext';
import { useTheme } from '@/context/ThemeContext';
import { PRODUCTS, type Product } from '@/data/products';

type Category = 'Tops' | 'Bottoms' | 'Shoes' | 'Outerwear';

const CATEGORY_META: { key: Category; emoji: string; desc: string }[] = [
  { key: 'Tops',      emoji: '👕', desc: 'Hoodies, tees, crewnecks' },
  { key: 'Bottoms',   emoji: '👖', desc: 'Pants, denim, joggers' },
  { key: 'Shoes',     emoji: '👟', desc: 'Sneakers, extended sizes' },
  { key: 'Outerwear', emoji: '🧥', desc: 'Jackets, extended back hem' },
];

export default function BrowseScreen() {
  const { width } = useWindowDimensions();
  const pad = 16;
  const gap = 8;
  const colW = (width - pad * 2 - gap) / 2;

  const [query, setQuery] = useState('');
  const [browseCat, setBrowseCat] = useState<Category | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const { matchPercentForProduct, stockFor } = useFlooded();
  const { colors, Type, isDark } = useTheme();
  const styles = useMemo(() => createBrowseStyles(colors, isDark), [colors, isDark]);

  const onSale = useMemo(() => PRODUCTS.filter(p => p.salePrice !== undefined), []);
  const recentlyRestocked = useMemo(
    () => PRODUCTS.filter(p => stockFor(p.id) === 'in_stock').slice(0, 4),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const isSearching = query.trim().length > 0 || browseCat !== null;

  const results = useMemo(() => {
    let list = browseCat ? PRODUCTS.filter(p => p.category === browseCat) : PRODUCTS;
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => matchPercentForProduct(b.id) - matchPercentForProduct(a.id));
  }, [query, browseCat, matchPercentForProduct]);

  const renderCard = ({ item }: { item: Product }) => {
    const match = matchPercentForProduct(item.id);
    const stock = stockFor(item.id);
    return (
      <Pressable style={[styles.card, { width: colW }]} onPress={() => router.push(`/product/${item.id}`)}>
        <View style={styles.imageArea}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
          {item.salePrice && (
            <View style={styles.saleBadge}>
              <Text style={styles.saleBadgeText}>SALE</Text>
            </View>
          )}
          {stock === 'out' && (
            <View style={styles.soldOverlay}>
              <Text style={styles.soldText}>Sold out</Text>
            </View>
          )}
        </View>
        <View style={styles.cardBody}>
          <Text style={Type.brandCaps}>{item.brand.toUpperCase()}</Text>
          <Text style={Type.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.fitMatch}>{match}% fit match</Text>
          <View style={styles.priceRow}>
            {item.salePrice ? (
              <>
                <Text style={[Type.price, { color: colors.accent }]}>${item.salePrice}</Text>
                <Text style={styles.origPrice}>${item.price}</Text>
              </>
            ) : (
              <Text style={Type.price}>${item.price}</Text>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  const browseHeader = (
    <View>
      <AppHeader onMenuPress={() => router.push('/modal')} />
      <View style={styles.pad}>
        {/* Search bar */}
        <Pressable
          style={[styles.searchWrap, searchFocused && styles.searchWrapFocused]}
          onPress={() => inputRef.current?.focus()}>
          <FontAwesome
            name="search"
            size={13}
            color={searchFocused ? colors.accent : colors.muted}
          />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search brands, styles, categories…"
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <FontAwesome name="times-circle" size={13} color={colors.muted} />
            </Pressable>
          )}
        </Pressable>
      </View>
    </View>
  );

  /* ── Browse mode (no active search or category) ── */
  if (!isSearching) {
    return (
      <Animated.View entering={FadeIn.duration(220)} style={{ flex: 1 }}>
        <SafeAreaView style={styles.safe} edges={['top']}>
          <ScrollView contentContainerStyle={{ paddingBottom: Space.xxl }}>
            {browseHeader}

            {/* Category tiles */}
            <View style={styles.pad}>
              <Text style={[Type.caption, styles.sectionLabel]}>BROWSE BY CATEGORY</Text>
              <View style={styles.catGrid}>
                {CATEGORY_META.map(({ key, emoji, desc }) => {
                  const count = PRODUCTS.filter(p => p.category === key).length;
                  return (
                    <Pressable
                      key={key}
                      style={styles.catTile}
                      onPress={() => setBrowseCat(key)}>
                      <Text style={styles.catEmoji}>{emoji}</Text>
                      <Text style={styles.catName}>{key}</Text>
                      <Text style={styles.catDesc}>{desc}</Text>
                      <Text style={styles.catCount}>{count} pieces</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* On sale */}
            {onSale.length > 0 && (
              <View style={styles.stripSection}>
                <View style={[styles.pad, styles.stripHeader]}>
                  <Text style={[Type.caption, styles.sectionLabel]}>ON SALE</Text>
                  <View style={styles.saleDot} />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
                  {onSale.map(p => (
                    <Pressable
                      key={p.id}
                      style={styles.stripCard}
                      onPress={() => router.push(`/product/${p.id}`)}>
                      <View style={styles.stripImgWrap}>
                        <Image source={p.image} style={styles.stripImg} resizeMode="contain" />
                        <View style={styles.saleBadge}>
                          <Text style={styles.saleBadgeText}>
                            -{Math.round((1 - p.salePrice! / p.price) * 100)}%
                          </Text>
                        </View>
                      </View>
                      <Text style={Type.brandCaps}>{p.brand.toUpperCase()}</Text>
                      <Text style={styles.stripName} numberOfLines={1}>{p.name}</Text>
                      <View style={styles.priceRow}>
                        <Text style={[Type.price, { color: colors.accent }]}>${p.salePrice}</Text>
                        <Text style={styles.origPrice}>${p.price}</Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Recently restocked */}
            {recentlyRestocked.length > 0 && (
              <View style={styles.stripSection}>
                <View style={styles.pad}>
                  <Text style={[Type.caption, styles.sectionLabel]}>RECENTLY RESTOCKED</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
                  {recentlyRestocked.map(p => (
                    <Pressable
                      key={p.id}
                      style={styles.stripCard}
                      onPress={() => router.push(`/product/${p.id}`)}>
                      <View style={styles.stripImgWrap}>
                        <Image source={p.image} style={styles.stripImg} resizeMode="contain" />
                        <View style={styles.inStockBadge}>
                          <Text style={styles.inStockText}>IN STOCK</Text>
                        </View>
                      </View>
                      <Text style={Type.brandCaps}>{p.brand.toUpperCase()}</Text>
                      <Text style={styles.stripName} numberOfLines={1}>{p.name}</Text>
                      <Text style={Type.price}>${p.price}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    );
  }

  /* ── Search / filter results mode ── */
  return (
    <Animated.View entering={FadeIn.duration(220)} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <FlatList
          data={results}
          keyExtractor={p => p.id}
          numColumns={2}
          ListHeaderComponent={
            <View>
              {browseHeader}
              {browseCat && (
                <View style={[styles.pad, { flexDirection: 'row', alignItems: 'center', gap: Space.sm }]}>
                  <Pressable
                    style={styles.activeCatPill}
                    onPress={() => setBrowseCat(null)}>
                    <Text style={styles.activeCatPillText}>{browseCat}</Text>
                    <FontAwesome name="times" size={10} color={colors.accentOnDark} />
                  </Pressable>
                </View>
              )}
              <View style={styles.pad}>
                <Text style={[Type.caption, styles.sectionLabel]}>
                  {results.length} result{results.length === 1 ? '' : 's'} · by fit match
                </Text>
              </View>
            </View>
          }
          columnWrapperStyle={{ gap, paddingHorizontal: pad, marginBottom: gap }}
          contentContainerStyle={{ paddingBottom: Space.xxl }}
          renderItem={renderCard}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={[styles.pad, { paddingTop: Space.xl }]}>
              <Text style={Type.body}>No results — try a different search.</Text>
            </View>
          }
        />
      </SafeAreaView>
    </Animated.View>
  );
}

function createBrowseStyles(colors: FloodedColors, isDark: boolean) {
  const soldOverlayBg = isDark ? 'rgba(22,22,26,0.92)' : 'rgba(255,255,255,0.85)';
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  pad: { paddingHorizontal: 16 },
  sectionLabel: { marginBottom: Space.md },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: Space.lg,
    gap: Space.sm,
  },
  searchWrapFocused: {
    borderColor: colors.accent,
    backgroundColor: colors.accentLight,
  },
  searchInput: {
    flex: 1,
    fontFamily: Font.body,
    fontSize: 13,
    color: colors.text,
    padding: 0,
  },

  /* Category tiles */
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm },
  catTile: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    padding: Space.md,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  catEmoji: { fontSize: 24, marginBottom: Space.sm },
  catName: { fontFamily: Font.medium, fontSize: 14, color: colors.text },
  catDesc: { fontFamily: Font.body, fontSize: 11, color: colors.muted, marginTop: 2 },
  catCount: { fontFamily: Font.medium, fontSize: 10, color: colors.accent, marginTop: Space.sm },

  /* Horizontal strip */
  stripSection: { marginTop: Space.lg },
  stripHeader: { flexDirection: 'row', alignItems: 'center', gap: Space.sm },
  saleDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent },
  strip: { paddingHorizontal: 16, gap: Space.md, paddingBottom: 4 },
  stripCard: {
    width: 140,
    backgroundColor: colors.bg,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    overflow: 'hidden',
    padding: Space.sm,
  },
  stripImgWrap: {
    height: 110,
    backgroundColor: colors.raised,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Space.sm,
  },
  stripImg: { width: '90%', height: '90%' },
  stripName: { fontFamily: Font.body, fontSize: 11, color: colors.textSecondary, marginBottom: 2 },

  saleBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.accent,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  saleBadgeText: { fontFamily: Font.medium, fontSize: 9, color: '#FFFFFF', letterSpacing: 0.5 },
  inStockBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#EBF7EE',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  inStockText: { fontFamily: Font.medium, fontSize: 9, color: '#2A7A3B', letterSpacing: 0.5 },

  /* Active category pill */
  activeCatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginBottom: Space.md,
  },
  activeCatPillText: { fontFamily: Font.medium, fontSize: 11, color: colors.accentOnDark },

  /* Product grid card */
  card: {
    backgroundColor: colors.bg,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    overflow: 'hidden',
  },
  imageArea: {
    height: 140,
    backgroundColor: colors.raised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '90%', height: '90%' },
  soldOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: soldOverlayBg, paddingVertical: 3, alignItems: 'center',
  },
  soldText: { fontFamily: Font.medium, fontSize: 9, letterSpacing: 1, color: colors.muted },
  cardBody: { paddingHorizontal: Space.md, paddingVertical: Space.sm, gap: 2 },
  fitMatch: { fontFamily: Font.medium, fontSize: 11, color: colors.accent, textDecorationLine: 'underline' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  origPrice: {
    fontFamily: Font.body, fontSize: 11, color: colors.muted,
    textDecorationLine: 'line-through',
  },
  });
}
