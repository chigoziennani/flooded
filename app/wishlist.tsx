import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useMemo } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Font } from '@/constants/fonts';
import { Space } from '@/constants/Theme';
import type { FloodedColors } from '@/constants/Theme';
import { useFlooded } from '@/context/FloodedContext';
import { useTheme } from '@/context/ThemeContext';
import { getProduct } from '@/data/products';
import type { Product } from '@/data/products';

export default function WishlistScreen() {
  const { width } = useWindowDimensions();
  const pad = 16;
  const gap = 8;
  const colW = (width - pad * 2 - gap) / 2;

  const { colors, Type, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const { wishlist, toggleWishlist, matchPercentForProduct, stockFor } = useFlooded();

  const items = wishlist
    .map(id => getProduct(id))
    .filter((p): p is Product => p !== undefined);

  const renderItem = ({ item }: { item: Product }) => {
    const match = matchPercentForProduct(item.id);
    const stock = stockFor(item.id);
    return (
      <Pressable
        style={[styles.card, { width: colW }]}
        onPress={() => router.push(`/product/${item.id}`)}>
        <View style={styles.imageArea}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
          <Pressable
            style={styles.heartBtn}
            onPress={() => toggleWishlist(item.id)}
            hitSlop={8}>
            <FontAwesome name="heart" size={12} color={colors.accent} />
          </Pressable>
          {stock === 'out' && (
            <View style={styles.soldBadge}>
              <Text style={styles.soldBadgeText}>Sold out</Text>
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

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <FontAwesome name="heart-o" size={28} color={colors.muted} />
          </View>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={[Type.body, styles.emptySub]}>
            Tap the heart on any product to save it here. Your wishlist is sorted by fit match.
          </Text>
          <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
            <Text style={styles.primaryBtnText}>Browse catalog</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={[...items].sort((a, b) => matchPercentForProduct(b.id) - matchPercentForProduct(a.id))}
          keyExtractor={p => p.id}
          numColumns={2}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={[Type.caption, styles.headerKicker]}>WISHLIST</Text>
              <Text style={Type.hero}>Saved pieces</Text>
              <Text style={[Type.body, styles.headerSub]}>
                {items.length} item{items.length === 1 ? '' : 's'} · sorted by fit match
              </Text>
            </View>
          }
          columnWrapperStyle={{ gap, paddingHorizontal: pad, marginBottom: gap }}
          contentContainerStyle={{ paddingBottom: Space.xxl }}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

function createStyles(colors: FloodedColors, isDark: boolean) {
  const soldBadgeBg = isDark ? 'rgba(22,22,26,0.92)' : 'rgba(255,255,255,0.85)';
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },

    header: { paddingHorizontal: 16, paddingTop: Space.lg, paddingBottom: Space.md },
    headerKicker: { marginBottom: Space.sm },
    headerSub: { marginTop: Space.sm },

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
    soldBadge: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: soldBadgeBg,
      paddingVertical: 4,
      alignItems: 'center',
    },
    soldBadgeText: { fontFamily: Font.medium, fontSize: 10, letterSpacing: 1, color: colors.muted },

    cardBody: { paddingHorizontal: Space.md, paddingVertical: Space.sm, gap: 3 },
    fitMatch: { fontFamily: Font.medium, fontSize: 11, color: colors.accent, textDecorationLine: 'underline' },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
    origPrice: {
      fontFamily: Font.body,
      fontSize: 11,
      color: colors.muted,
      textDecorationLine: 'line-through',
    },

    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
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
    emptySub: { textAlign: 'center', lineHeight: 20, marginBottom: Space.xl },
    primaryBtn: {
      backgroundColor: colors.accent,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 6,
    },
    primaryBtnText: { fontFamily: Font.body, fontSize: 13, color: colors.accentOnDark, letterSpacing: 0.3 },
  });
}
