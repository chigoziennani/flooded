import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import 'react-native-reanimated';

import { fontAssets } from '@/constants/fonts';
import { Font } from '@/constants/fonts';
import {
  AppThemeProvider,
  NavigationThemeProvider,
  useTheme,
} from '@/context/ThemeContext';
import { FloodedProvider } from '@/context/FloodedContext';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...fontAssets,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <FloodedProvider>
      <AppThemeProvider>
        <RootNavigation />
      </AppThemeProvider>
    </FloodedProvider>
  );
}

function RootNavigation() {
  const { colors, navigationTheme, isDark } = useTheme();

  const sharedScreenOptions = useMemo(
    () => ({
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.accent,
      headerTitleStyle: {
        fontFamily: Font.medium,
        fontSize: 15,
        color: colors.text,
      },
      headerShadowVisible: false,
      contentStyle: { backgroundColor: colors.bg },
      animation: 'default' as const,
    }),
    [colors],
  );

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={sharedScreenOptions}>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="welcome"
          options={{ headerShown: false, presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name="auth/sign-up"
          options={{ title: 'Create account', presentation: 'card' }}
        />
        <Stack.Screen
          name="auth/sign-in"
          options={{ title: 'Sign in', presentation: 'card' }}
        />
        <Stack.Screen
          name="profile/height"
          options={{ title: 'Height' }}
        />
        <Stack.Screen
          name="profile/measurements"
          options={{ title: 'Your measurements' }}
        />
        <Stack.Screen
          name="product/[id]"
          options={{ title: '', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="checkout/confirm"
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="wishlist"
          options={{ title: 'Saved', headerBackTitle: 'Profile' }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'About' }}
        />
      </Stack>
    </NavigationThemeProvider>
  );
}
