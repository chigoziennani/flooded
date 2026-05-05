import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Font } from '@/constants/fonts';
import type { FloodedColors } from '@/constants/Theme';
import { useTheme } from '@/context/ThemeContext';

const LABELS: Record<string, string> = {
  index: 'Home',
  search: 'Search',
  radar: 'Alerts',
  profile: 'Profile',
};

export function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
        },
      ]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];
        const label = (options.tabBarLabel as string) ?? LABELS[route.name] ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable key={route.key} accessibilityRole="button" onPress={onPress} style={styles.tab}>
            <View
              style={[
                styles.indicator,
                { backgroundColor: isFocused ? colors.accent : colors.borderSubtle },
              ]}
            />
            <Text
              style={[
                styles.label,
                { color: isFocused ? colors.accent : colors.tabInactive },
              ]}
              numberOfLines={1}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(colors: FloodedColors) {
  return StyleSheet.create({
    bar: {
      flexDirection: 'row',
      backgroundColor: colors.bg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.borderHairline,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 4,
    },
    indicator: {
      width: 18,
      height: 2,
      borderRadius: 1,
      marginBottom: 4,
    },
    label: {
      fontFamily: Font.body,
      fontSize: 11,
      letterSpacing: 0.5,
    },
  });
}
