/**
 * Inter only (spec: SF Pro on iOS optional; Inter cross-platform for parity).
 * Weights capped at 500 per design spec — no 600/700 for UI chrome.
 */

import {
  Inter_200ExtraLight,
  Inter_400Regular,
  Inter_500Medium,
} from '@expo-google-fonts/inter';

export const fontAssets = {
  Inter_200ExtraLight,
  Inter_400Regular,
  Inter_500Medium,
};

/** Registered `fontFamily` names (match useFonts keys). */
export const Font = {
  /** Display / hero — weight 200 */
  display: 'Inter_200ExtraLight',
  body: 'Inter_400Regular',
  medium: 'Inter_500Medium',
} as const;
