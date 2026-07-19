import { router } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  FileText,
  Info,
  LogOut,
  Mail,
  Pencil,
  Shield,
} from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';

type LucideIconComp = React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;

type MenuItem = {
  id: string;
  label: string;
  Icon: LucideIconComp;
  danger?: boolean;
};

const TOP_MENU: MenuItem[] = [
  { id: 'edit', label: 'Edit Profile', Icon: Pencil },
  { id: 'about', label: 'About us', Icon: Info },
  { id: 'privacy', label: 'Privacy', Icon: Shield },
  { id: 'notifications', label: 'Notifications', Icon: Bell },
];

const BOTTOM_MENU: MenuItem[] = [
  { id: 'contact', label: 'Contact', Icon: Mail },
  { id: 'terms', label: 'Terms & Conditions', Icon: FileText },
  { id: 'logout', label: 'Log Out', Icon: LogOut, danger: true },
];

function MenuRow({ item }: { item: MenuItem }) {
  const iconColor = item.danger ? Brand.red : '#666666';
  return (
    <Pressable
      style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
      onPress={() => {}}>
      <item.Icon size={22} color={iconColor} strokeWidth={1.75} />
      <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>{item.label}</Text>
      <ChevronRight size={18} color="#CCCCCC" strokeWidth={2} />
    </Pressable>
  );
}

export default function AccountScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Back button */}
      <Pressable style={[styles.backBtn, { top: insets.top + 8 }]} onPress={() => router.back()}>
        <ArrowLeft size={20} color="#333333" strokeWidth={2.5} />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>Account</Text>
            <Text style={styles.userName}>Power Ramatsoma</Text>
          </View>
          <Pressable style={styles.avatarBtn} onPress={() => router.navigate('/profile')}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>P</Text>
            </View>
          </Pressable>
        </View>

        {/* Top menu items */}
        <View style={styles.menuSection}>
          {TOP_MENU.map((item) => (
            <MenuRow key={item.id} item={item} />
          ))}
        </View>

        <View style={styles.divider} />

        {/* Bottom menu items */}
        <View style={styles.menuSection}>
          {BOTTOM_MENU.map((item) => (
            <MenuRow key={item.id} item={item} />
          ))}
        </View>

        {/* App version */}
        <View style={styles.versionSection}>
          <Text style={styles.appName}>Ramatsoma</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.tagline}>Realtimemoments — capture life as it happens</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  headerLabel: {
    fontSize: 28,
    fontWeight: '800',
    color: Brand.cyan,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 2,
  },
  avatarBtn: {},
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Brand.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Brand.cyanDark,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  menuSection: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  menuRowPressed: {
    backgroundColor: '#F5F5F5',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  menuLabelDanger: {
    color: Brand.red,
  },
  divider: {
    height: 8,
    backgroundColor: '#F5F5F5',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 4,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.cyan,
    letterSpacing: 1,
  },
  version: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  tagline: {
    fontSize: 12,
    color: '#BDBDBD',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
