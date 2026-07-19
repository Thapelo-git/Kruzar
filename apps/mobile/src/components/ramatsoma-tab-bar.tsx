import { Home, MessageCircle, PlusCircle, Search } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';

type TabBarProps = {
  state: {
    routes: Array<{ key: string; name: string }>;
    index: number;
  };
  navigation: {
    emit: (options: {
      type: 'tabPress';
      target?: string;
      canPreventDefault: true;
    }) => { defaultPrevented: boolean };
    navigate: (name: string, params?: Record<string, unknown>) => void;
  };
  descriptors: Record<string, unknown>;
  insets: { top: number; right: number; bottom: number; left: number };
};

type TabItem = {
  name: string;
  label: string;
  badge: number | null;
  isMoments?: boolean;
  isCenter?: boolean;
};

const TABS_CONFIG: TabItem[] = [
  { name: 'index', label: 'Home', badge: null },
  { name: 'moments', label: 'Moments', badge: 14, isMoments: true },
  { name: 'add', label: 'Add', badge: null, isCenter: true },
  { name: 'chats', label: 'Chats', badge: 8 },
  { name: 'search', label: 'Search', badge: null },
];

function TabIcon({ name, color, size }: { name: string; color: string; size: number }) {
  switch (name) {
    case 'index':
      return <Home size={size} color={color} strokeWidth={2} />;
    case 'add':
      return <PlusCircle size={size} color={Brand.cyan} strokeWidth={1.5} />;
    case 'chats':
      return <MessageCircle size={size} color={color} strokeWidth={2} />;
    case 'search':
      return <Search size={size} color={color} strokeWidth={2} />;
    default:
      return null;
  }
}

export function RamatsomaTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {TABS_CONFIG.map((tab) => {
        const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
        if (routeIndex === -1) return null;

        const route = state.routes[routeIndex];
        const isFocused = state.index === routeIndex;
        const iconColor = isFocused ? Brand.cyan : '#9E9E9E';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(tab.name);
          }
        };

        return (
          <Pressable
            key={tab.name}
            onPress={onPress}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityLabel={tab.label}>
            <View style={styles.iconWrapper}>
              {tab.isMoments ? (
                <View style={[styles.mCircle, isFocused && styles.mCircleActive]}>
                  <Text style={[styles.mText, isFocused && styles.mTextActive]}>m</Text>
                </View>
              ) : (
                <TabIcon name={tab.name} color={iconColor} size={tab.isCenter ? 28 : 24} />
              )}
              {tab.badge !== null && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, { color: iconColor }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
  },
  iconWrapper: {
    position: 'relative',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#9E9E9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mCircleActive: {
    borderColor: Brand.cyan,
  },
  mText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#9E9E9E',
    lineHeight: 18,
  },
  mTextActive: {
    color: Brand.cyan,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Brand.red,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
});
