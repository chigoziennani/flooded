import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Theme } from '@react-navigation/native';
import {
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
  DarkTheme,
} from '@react-navigation/native';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  type FloodedColors,
  floodedDark,
  floodedLight,
  makeType,
} from '@/constants/Theme';

const STORAGE_KEY = '@flooded/theme-preference';

type ThemeCtx = {
  isDark: boolean;
  colors: FloodedColors;
  Type: ReturnType<typeof makeType>;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  navigationTheme: Theme;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

function buildNavigationTheme(isDark: boolean, colors: FloodedColors) {
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.bg,
      card: colors.surface,
      text: colors.text,
      border: colors.divider,
      notification: colors.accent,
    },
  };
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const v = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && v === 'dark') setIsDark(true);
        if (!cancelled && v === 'light') setIsDark(false);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const colors = useMemo(() => (isDark ? floodedDark : floodedLight), [isDark]);
  const Type = useMemo(() => makeType(colors), [colors]);

  const setDarkMode = useCallback((dark: boolean) => {
    setIsDark(dark);
    AsyncStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light').catch(() => {});
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!isDark);
  }, [isDark, setDarkMode]);

  const navigationTheme = useMemo(
    () => buildNavigationTheme(isDark, colors),
    [isDark, colors],
  );

  const value = useMemo(
    () =>
      ({
        isDark,
        colors,
        Type,
        setDarkMode,
        toggleDarkMode,
        navigationTheme,
      }) satisfies ThemeCtx,
    [isDark, colors, Type, setDarkMode, toggleDarkMode, navigationTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeCtx {
  const v = useContext(ThemeContext);
  if (!v) throw new Error('useTheme must be used within AppThemeProvider');
  return v;
}

export { NavigationThemeProvider };
