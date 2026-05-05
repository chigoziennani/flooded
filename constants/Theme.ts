/**
 * Flooded — light + dark palettes (brand accent: deep ocean → lighter on dark).
 */

import type { TextStyle } from 'react-native';

import { Font } from '@/constants/fonts';

export const floodedLight = {
  bg: '#FFFFFF',
  surface: '#FAFAFA',
  raised: '#F5F5F5',
  imagePlate: '#F0F0F0',
  divider: '#E0E0E0',
  borderSubtle: '#E8E8E8',
  borderHairline: '#F0F0F0',
  text: '#1A1A1A',
  textSecondary: '#555555',
  textTertiary: '#888888',
  muted: '#999999',
  black: '#000000',
  placeholder: '#BBBBBB',
  tabInactive: '#CCCCCC',
  chipInactive: '#AAAAAA',
  inputBg: '#F5F5F5',
  inputBorder: '#E0E0E0',
  accent: '#1A3C5C',
  accentLight: '#EAF0F5',
  accentMid: '#2D5879',
  accentOnDark: '#FFFFFF',
  primaryFill: '#1A1A1A',
  primaryOnDark: '#FFFFFF',
  pickerFade: 'rgba(255,255,255,0.82)',
  progressTrack: 'rgba(60, 60, 67, 0.14)',
  progressFill: 'rgba(60, 60, 67, 0.48)',
  progressLabel: 'rgba(60, 60, 67, 0.55)',
} as const;

export const floodedDark = {
  bg: '#0C0C0E',
  surface: '#161618',
  raised: '#1F1F23',
  imagePlate: '#252528',
  divider: '#3A3A3F',
  borderSubtle: '#343438',
  borderHairline: '#2C2C30',
  text: '#F5F5F7',
  textSecondary: '#C7C7CC',
  textTertiary: '#98989D',
  muted: '#8E8E93',
  black: '#000000',
  placeholder: '#636366',
  tabInactive: '#636366',
  chipInactive: '#8E8E93',
  inputBg: '#1F1F23',
  inputBorder: '#3A3A3F',
  accent: '#8CB4DC',
  accentLight: 'rgba(140, 180, 220, 0.2)',
  accentMid: '#A8CAE8',
  accentOnDark: '#0C0C0E',
  primaryFill: '#F2F2F7',
  primaryOnDark: '#0C0C0E',
  pickerFade: 'rgba(12, 12, 14, 0.9)',
  progressTrack: 'rgba(255, 255, 255, 0.12)',
  progressFill: 'rgba(255, 255, 255, 0.45)',
  progressLabel: 'rgba(235, 235, 245, 0.55)',
} as const;

export type FloodedColors = typeof floodedLight | typeof floodedDark;

/** @deprecated use `useTheme().colors` in components */
export const Flooded = floodedLight;

export function makeType(colors: FloodedColors) {
  return {
    wordmark: {
      fontFamily: Font.display,
      fontSize: 13,
      letterSpacing: 4,
      color: colors.text,
    } satisfies TextStyle,
    navLogo: {
      fontFamily: Font.display,
      fontSize: 13,
      letterSpacing: 4,
      color: colors.text,
    } satisfies TextStyle,
    wordmarkDisplay: {
      fontFamily: Font.display,
      fontSize: 32,
      letterSpacing: 6,
      color: colors.text,
    } satisfies TextStyle,
    hero: {
      fontFamily: Font.display,
      fontSize: 22,
      letterSpacing: 0.3,
      color: colors.text,
    } satisfies TextStyle,
    title: {
      fontFamily: Font.display,
      fontSize: 22,
      letterSpacing: 0.3,
      color: colors.text,
    } satisfies TextStyle,
    titleSm: {
      fontFamily: Font.medium,
      fontSize: 15,
      color: colors.text,
    } satisfies TextStyle,
    overline: {
      fontFamily: Font.medium,
      fontSize: 10,
      letterSpacing: 1.5,
      color: colors.muted,
    } satisfies TextStyle,
    section: {
      fontFamily: Font.medium,
      fontSize: 15,
      letterSpacing: 0,
      color: colors.text,
    } satisfies TextStyle,
    body: {
      fontFamily: Font.body,
      fontSize: 13,
      letterSpacing: 0,
      color: colors.textSecondary,
    } satisfies TextStyle,
    caption: {
      fontFamily: Font.medium,
      fontSize: 10,
      letterSpacing: 1.5,
      color: colors.muted,
    } satisfies TextStyle,
    greeting: {
      fontFamily: Font.body,
      fontSize: 13,
      color: colors.muted,
    } satisfies TextStyle,
    fitMatch: {
      fontFamily: Font.medium,
      fontSize: 12,
      letterSpacing: 0,
      color: colors.text,
      textDecorationLine: 'underline' as const,
    } satisfies TextStyle,
    price: {
      fontFamily: Font.medium,
      fontSize: 14,
      letterSpacing: 0,
      color: colors.text,
      fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
    } satisfies TextStyle,
    priceLg: {
      fontFamily: Font.medium,
      fontSize: 20,
      letterSpacing: 0,
      color: colors.text,
      fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
    } satisfies TextStyle,
    brandCaps: {
      fontFamily: Font.medium,
      fontSize: 9,
      letterSpacing: 1,
      color: colors.muted,
    } satisfies TextStyle,
    productName: {
      fontFamily: Font.body,
      fontSize: 13,
      color: colors.textSecondary,
    } satisfies TextStyle,
    tabLabel: {
      fontFamily: Font.body,
      fontSize: 11,
      letterSpacing: 0.5,
    } satisfies TextStyle,
    input: {
      fontFamily: Font.body,
      fontSize: 13,
      color: colors.text,
    } satisfies TextStyle,
    button: {
      fontFamily: Font.body,
      fontSize: 13,
      letterSpacing: 0.3,
    } satisfies TextStyle,
    chip: {
      fontFamily: Font.medium,
      fontSize: 11,
    } satisfies TextStyle,
    badge: {
      fontFamily: Font.medium,
      fontSize: 11,
    } satisfies TextStyle,
  } as const;
}

export type ThemedType = ReturnType<typeof makeType>;

/** Default light typography (for rare static use) */
export const Type = makeType(floodedLight);

export const Space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export type TorsoType = 'Standard' | 'Long' | 'Extra Long';
