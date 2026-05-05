import { Redirect, Tabs } from 'expo-router';

import { AppTabBar } from '@/components/AppTabBar';
import { useFlooded } from '@/context/FloodedContext';

export default function TabLayout() {
  const { session } = useFlooded();

  // Auth gate: redirect to welcome screen until user creates / signs in
  if (!session) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen name="index" options={{ tabBarLabel: 'Home' }} />
      <Tabs.Screen name="search" options={{ tabBarLabel: 'Search' }} />
      <Tabs.Screen name="radar" options={{ tabBarLabel: 'Alerts' }} />
      <Tabs.Screen name="profile" options={{ tabBarLabel: 'Profile' }} />
    </Tabs>
  );
}
