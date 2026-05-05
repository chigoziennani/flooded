/**
 * Order confirmation screen — shown after a simulated purchase.
 */
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloodedMark } from '@/components/FloodedMark';
import { Font } from '@/constants/fonts';
import { Space } from '@/constants/Theme';
import type { FloodedColors } from '@/constants/Theme';
import { useFlooded } from '@/context/FloodedContext';
import { useTheme } from '@/context/ThemeContext';
import { getProduct } from '@/data/products';

export default function ConfirmScreen() {
  const { productId, size, price, method } = useLocalSearchParams<{
    productId: string;
    size: string;
    price: string;
    method: string;
  }>();

  const { orders, session } = useFlooded();
  const { colors, Type } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const product = productId ? getProduct(productId) : undefined;
  const orderNumber = orders[0]?.id?.replace('ord-', '').slice(-6).toUpperCase() ?? '------';
  const isApplePay = method === 'apple_pay';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.successIcon}>
          <FontAwesome name="check" size={28} color={colors.accentOnDark} />
        </View>
        <Text style={[Type.caption, styles.kicker]}>ORDER CONFIRMED</Text>
        <Text style={[Type.hero, styles.heading]}>Your order is placed</Text>
        <Text style={[Type.body, styles.sub]}>
          {session?.displayName
            ? `Thanks, ${session.displayName.split(' ')[0]}.`
            : 'Thank you.'}{' '}
          This is a demo simulation — nothing was charged.
        </Text>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={Type.caption}>ORDER</Text>
            <Text style={styles.cardValue}>#{orderNumber}</Text>
          </View>
          <View style={styles.divider} />

          {product ? (
            <>
              <View style={styles.cardRow}>
                <Text style={Type.caption}>ITEM</Text>
                <Text style={styles.cardValue} numberOfLines={2}>
                  {product.brand} {product.name}
                </Text>
              </View>
              <View style={styles.divider} />
            </>
          ) : null}

          <View style={styles.cardRow}>
            <Text style={Type.caption}>SIZE</Text>
            <Text style={styles.cardValue}>{size}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <Text style={Type.caption}>TOTAL</Text>
            <Text style={[styles.cardValue, styles.priceValue]}>${price}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <Text style={Type.caption}>PAID WITH</Text>
            <View style={styles.methodRow}>
              {isApplePay ? (
                <>
                  <FontAwesome name="apple" size={12} color={colors.text} />
                  <Text style={styles.cardValue}> Pay</Text>
                </>
              ) : (
                <>
                  <FontAwesome name="credit-card" size={11} color={colors.textSecondary} />
                  <Text style={styles.cardValue}> Card</Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.shippingCard}>
          <Text style={[Type.caption, styles.shippingLabel]}>ESTIMATED DELIVERY</Text>
          <Text style={styles.shippingDate}>4–7 business days</Text>
          <Text style={[Type.body, styles.shippingNote]}>
            You will receive a tracking email at {session?.email ?? 'your address'} once the
            item ships. All shipping is carbon-neutral.
          </Text>
        </View>

        {isApplePay && (
          <View style={styles.applePayNote}>
            <FontAwesome name="apple" size={13} color={colors.accent} />
            <Text style={[Type.body, styles.applePayNoteText]}>
              Paid via Face ID verification (simulated). No real charge occurred.
            </Text>
          </View>
        )}

        <View style={styles.brandRow}>
          <FloodedMark size={14} color={colors.accentLight} />
        </View>

        <Pressable style={styles.primaryBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.primaryBtnText}>Continue shopping</Text>
        </Pressable>
        <Pressable style={styles.ghostBtn} onPress={() => router.push('/(tabs)/profile')}>
          <Text style={styles.ghostBtnText}>View orders</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: FloodedColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    scroll: { paddingHorizontal: 20, paddingTop: Space.xl, paddingBottom: Space.xxl },

    successIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Space.xl,
    },
    kicker: { marginBottom: Space.sm },
    heading: { marginBottom: Space.sm },
    sub: { marginBottom: Space.xl, maxWidth: 340, lineHeight: 20 },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
      marginBottom: Space.lg,
      overflow: 'hidden',
    },
    cardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Space.lg,
      paddingVertical: 13,
    },
    cardValue: {
      fontFamily: Font.medium,
      fontSize: 13,
      color: colors.text,
      flex: 1,
      textAlign: 'right',
      marginLeft: Space.lg,
    },
    priceValue: {
      fontSize: 16,
      color: colors.accent,
    },
    methodRow: { flexDirection: 'row', alignItems: 'center' },
    divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.borderHairline },

    shippingCard: {
      backgroundColor: colors.accentLight,
      borderRadius: 8,
      padding: Space.lg,
      marginBottom: Space.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.accent,
      borderLeftWidth: 2,
      borderLeftColor: colors.accent,
    },
    shippingLabel: { marginBottom: Space.sm },
    shippingDate: {
      fontFamily: Font.medium,
      fontSize: 15,
      color: colors.accent,
      marginBottom: Space.sm,
    },
    shippingNote: { lineHeight: 20 },

    applePayNote: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Space.sm,
      marginBottom: Space.xl,
      backgroundColor: colors.accentLight,
      padding: Space.md,
      borderRadius: 6,
    },
    applePayNoteText: { flex: 1, lineHeight: 18 },

    brandRow: { alignItems: 'center', marginBottom: Space.xl },

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
    ghostBtn: {
      paddingVertical: 12,
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
      borderRadius: 6,
    },
    ghostBtnText: { fontFamily: Font.body, fontSize: 14, color: colors.textSecondary },
  });
}
