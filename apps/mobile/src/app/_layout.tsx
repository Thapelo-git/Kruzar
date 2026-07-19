import { DarkTheme, DefaultTheme, Tabs, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { RamatsomaTabBar } from '@/components/ramatsoma-tab-bar';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Tabs
        tabBar={(props) => <RamatsomaTabBar {...props} />}
        screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="moments" />
        <Tabs.Screen name="add" />
        <Tabs.Screen name="chats" />
        <Tabs.Screen name="search" />
        <Tabs.Screen name="explore" options={{ href: null }} />
        <Tabs.Screen name="profile" options={{ href: null }} />
        <Tabs.Screen name="account" options={{ href: null }} />
        <Tabs.Screen name="conversation" options={{ href: null }} />
        <Tabs.Screen name="moment-viewer" options={{ href: null }} />
      </Tabs>
    </ThemeProvider>
  );
}
