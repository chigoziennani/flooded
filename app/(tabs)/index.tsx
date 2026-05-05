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
import { PRODUCTS, getProduct, type Product } from '@/data/products';
import {
  SPEC_FILTERS,
  type SpecCategory,
  productMatchesSpecCategory,
} from '@/utils/categoryFilter';

function greetingName(session: { displayName: string } | null) {
  const h = new Date().getHours();
  const dayPart = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const name = session?.displayName?.split(' ')[0] ?? 'there';
  return `${dayPart}, ${name}`;
}
function stockPriority(s: string) {
  return s === 'in_stock' ? 2 : s === 'low' ? 1 : 0;
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const pad = 16;
  const gap = 8;
  const colW = (width - pad * 2 - gap) / 2;

  const { colors, Type, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const {
    matchPercentForProduct, stockFor, session,
    isWishlisted, toggleWishlist,
    recentlyViewed, fitExplainerDismissed, dismissFitExplainer,
  } = useFlooded();

  const [filter, setFilter] = useState<SpecCategory>('All');
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const sorted = useMemo(() => {
    let list = PRODUCTS.filter(p => productMatchesSpecCategory(p, filter));
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => {
      const sp = stockPriority(stockFor(b.id)) - stockPriority(stockFor(a.id));
      if (sp !== 0) return sp;
      return matchPercentForProduct(b.id) - matchPercentForProduct(a.id);
    });
  }, [filter, query, stockFor, matchPercentForProduct]);

  const recentProducts = recentlyViewed
    .map(id => getProduct(id))
    .filter((p): p is Product => p !== undefined);

  const renderItem = ({ item }: { item: Product }) => {
    const match = matchPercentForProduct(item.id);
    const stock = stockFor(item.id);
    const wishlisted = isWishlisted(item.id);
    return (
      <Pressable
        style={[styles.card, { width: colW }]}
        onPress={() => router.push(`/product/${item.id}`)}>
        <View style={styles.imageArea}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
          <Pressable style={styles.heartBtn} onPress={() => toggleWishlist(item.id)} hitSlop={8}>
            <FontAwesome
              name={wishlisted ? 'heart' : 'heart-o'}
              size={12}
              color={wishlisted ? colors.accent : colors.muted}
            />
          </Pressable>
          {item.salePrice && (
            <View style={styles.saleBadge}>
              <Text style={styles.saleBadgeText}>SALE</Text>
            </View>
          )}
          {stock === 'out' && (
            <View style={styles.soldOutOverlay}>
              <Text style={styles.soldOutText}>Sold out</Text>
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
            {stock === 'low' && <Text style={styles.lowStock}>Low</Text>}
          </View>
        </View>
      </Pressable>
    );
  };

  const listHeader = (
    <View>
      <AppHeader onMenuPress={() => router.push('/modal')} />
      <View style={styles.screenPad}>
        <Text style={[Type.greeting, styles.greeting]}>{greetingName(session)}</Text>
        <Text style={[Type.hero, styles.heroText]}>Your fit matches today</Text>

        {!fitExplainerDismissed && (
          <View style={styles.explainerCard}>
            <View style={styles.explainerBody}>
              <FontAwesome name="info-circle" size={14} color={colors.accent} style={{ marginTop: 1 }} />
              <View style={styles.explainerText}>
                <Text style={styles.explainerTitle}>How fit match works</Text>
                <Text style={styles.explainerDesc}>
                  Your % is calculated from your measurements vs. each product's sizing chart — sleeve length, inseam, chest, and waist. Update your measurements in Profile anytime to improve accuracy.
                </Text>
              </View>
            </View>
            <Pressable onPress={dismissFitExplainer} style={styles.explainerDismiss} hitSlop={8}>
              <FontAwesome name="times" size={12} color={colors.muted} />
            </Pressable>
          </View>
        )}

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
            placeholder="Search brands, styles, categories"
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <FontAwesome name="times-circle" size={13} color={colors.muted} />
            </Pressable>
          )}
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {SPEC_FILTERS.map((cat) => {
            const on = filter === cat;
            return (
              <Pressable key={cat} onPress={() => setFilter(cat)} style={[styles.chip, on && styles.chipOn]}>
                <Text style={[styles.chipLabel, on && styles.chipLabelOn]}>{cat}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {query.length > 0 && sorted.length === 0 && (
          <Text style={[Type.body, styles.emptyHint]}>No results for &ldquo;{query}&rdquo;</Text>
        )}
        {filter !== 'All' && sorted.length === 0 && query.length === 0 && (
          <Text style={[Type.body, styles.emptyHint]}>No {filter.toLowerCase()} in this catalog</Text>
        )}

        {recentProducts.length > 0 && !query && filter === 'All' && (
          <View style={styles.recentSection}>
            <Text style={[Type.caption, styles.recentLabel]}>RECENTLY VIEWED</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentStrip}>
              {recentProducts.map(p => (
                <Pressable
                  key={p.id}
                  style={styles.recentCard}
                  onPress={() => router.push(`/product/${p.id}`)}>
                  <Image source={p.image} style={styles.recentImg} resizeMode="contain" />
                  <Text style={styles.recentBrand} numberOfLines={1}>{p.brand}</Text>
                  <Text style={styles.recentName} numberOfLines={1}>{p.name.split(' ')[0]}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <Text style={[Type.caption, styles.gridLabel]}>
          {sorted.length} {filter === 'All' ? 'items' : filter.toLowerCase()} · sorted by fit
        </Text>
      </View>
    </View>
  );

  return (
    <Animated.View entering={FadeIn.duration(220)} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <FlatList
          data={sorted}
          keyExtractor={p => p.id}
          numColumns={2}
          ListHeaderComponent={listHeader}
          columnWrapperStyle={{ gap, paddingHorizontal: pad, marginBottom: gap }}
          contentContainerStyle={{ paddingBottom: Space.xxl }}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
        />
      </SafeAreaView>
    </Animated.View>
  );
}

function createStyles(colors: FloodedColors, isDark: boolean) {
  const soldOutBg = isDark ? 'rgba(22,22,26,0.92)' : 'rgba(255,255,255,0.85)';
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    screenPad: { paddingHorizontal: 16 },

    greeting: { marginTop: Space.lg, marginBottom: Space.xs },
    heroText: { marginBottom: Space.lg },

    explainerCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.accentLight,
      borderRadius: 8,
      padding: Space.md,
      marginBottom: Space.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.accent,
      gap: Space.sm,
    },
    explainerBody: { flex: 1, flexDirection: 'row', gap: Space.sm },
    explainerText: { flex: 1 },
    explainerTitle: { fontFamily: Font.medium, fontSize: 12, color: colors.accent, marginBottom: 4 },
    explainerDesc: { fontFamily: Font.body, fontSize: 11, color: colors.accent, lineHeight: 17 },
    explainerDismiss: { padding: 2 },

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
    searchInput: { flex: 1, fontFamily: Font.body, fontSize: 13, color: colors.text, padding: 0 },

    chipRow: { gap: 8, paddingBottom: Space.lg, flexDirection: 'row' },
    chip: {
      paddingVertical: 5,
      paddingHorizontal: 12,
      borderRadius: 4,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
      backgroundColor: colors.bg,
    },
    chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
    chipLabel: { fontFamily: Font.medium, fontSize: 11, color: colors.chipInactive },
    chipLabelOn: { color: colors.accentOnDark },
    emptyHint: { marginBottom: Space.md, color: colors.textSecondary },

    recentSection: { marginBottom: Space.md },
    recentLabel: { marginBottom: Space.sm },
    recentStrip: { gap: Space.sm, paddingRight: 4 },
    recentCard: {
      width: 80,
      alignItems: 'center',
    },
    recentImg: {
      width: 70,
      height: 70,
      borderRadius: 6,
      backgroundColor: colors.raised,
      marginBottom: 4,
    },
    recentBrand: { fontFamily: Font.medium, fontSize: 8, color: colors.muted, letterSpacing: 0.5 },
    recentName: { fontFamily: Font.body, fontSize: 10, color: colors.textSecondary },

    gridLabel: { marginBottom: Space.md },

    card: {
      backgroundColor: colors.bg,
      borderRadius: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderHairline,
      overflow: 'hidden',
    },
    imageArea: {
      height: 160,
      backgroundColor: colors.raised,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: { width: '90%', height: '90%' },
    heartBtn: {
      position: 'absolute',
      top: 6,
      right: 6,
      backgroundColor: colors.bg,
      borderRadius: 12,
      padding: 5,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderHairline,
    },
    saleBadge: {
      position: 'absolute',
      top: 6,
      left: 6,
      backgroundColor: colors.accent,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 3,
    },
    saleBadgeText: { fontFamily: Font.medium, fontSize: 8, color: '#FFFFFF', letterSpacing: 0.5 },
    soldOutOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: soldOutBg,
      paddingVertical: 4,
      alignItems: 'center',
    },
    soldOutText: { fontFamily: Font.medium, fontSize: 10, letterSpacing: 1, color: colors.muted },
    cardBody: { paddingHorizontal: Space.md, paddingVertical: Space.sm, gap: 3 },
    fitMatch: {
      fontFamily: Font.medium,
      fontSize: 11,
      color: colors.accent,
      textDecorationLine: 'underline',
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 2,
    },
    origPrice: { fontFamily: Font.body, fontSize: 11, color: colors.muted, textDecorationLine: 'line-through' },
    lowStock: { fontFamily: Font.medium, fontSize: 9, color: '#B5860A', letterSpacing: 0.3 },
  });
}
