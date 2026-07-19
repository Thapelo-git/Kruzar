import { router } from 'expo-router';
import { SquarePen } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';

type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
};

const MOCK_CHATS: Chat[] = [
  { id: '1', name: 'Ivy', lastMessage: 'Hey! How are you doing?', time: '2m', unread: 3, isOnline: true },
  { id: '2', name: 'Peter', lastMessage: 'Check out my latest post 🔥', time: '15m', unread: 0, isOnline: true },
  { id: '3', name: 'Abel', lastMessage: "Let's meet up this weekend", time: '1h', unread: 1, isOnline: false },
  { id: '4', name: 'Maggy', lastMessage: 'Did you see the new moment?', time: '2h', unread: 2, isOnline: true },
  { id: '5', name: 'Sipho', lastMessage: 'Thanks for following! 🙏', time: '3h', unread: 0, isOnline: false },
  { id: '6', name: 'Pit', lastMessage: 'Loved your video!', time: '5h', unread: 0, isOnline: true },
  { id: '7', name: 'Jane', lastMessage: 'Voice note 🎙️ 0:28', time: '1d', unread: 2, isOnline: false },
  { id: '8', name: 'Winter', lastMessage: 'Looking forward to it', time: '2d', unread: 0, isOnline: false },
];

const AVATAR_COLORS = ['#FF7043', '#AB47BC', '#42A5F5', '#26A69A', '#EC407A', '#7E57C2', '#FFA726', '#26C6DA'];

function ChatRow({ chat, index }: { chat: Chat; index: number }) {
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <Pressable
      style={({ pressed }) => [styles.chatRow, pressed && styles.chatRowPressed]}
      onPress={() =>
        router.navigate({
          pathname: '/conversation',
          params: { id: chat.id, name: chat.name },
        })
      }>
      <View style={styles.avatarWrapper}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarInitial}>{chat.name[0]}</Text>
        </View>
        {chat.isOnline && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatTop}>
          <Text style={[styles.chatName, chat.unread > 0 && styles.chatNameUnread]}>
            {chat.name}
          </Text>
          <Text style={[styles.chatTime, chat.unread > 0 && styles.chatTimeUnread]}>
            {chat.time}
          </Text>
        </View>
        <View style={styles.chatBottom}>
          <Text
            style={[styles.lastMessage, chat.unread > 0 && styles.lastMessageUnread]}
            numberOfLines={1}>
            {chat.lastMessage}
          </Text>
          {chat.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chat.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function ChatsScreen() {
  const insets = useSafeAreaInsets();
  const totalNotifications = MOCK_CHATS.reduce((sum, c) => sum + c.unread, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        {totalNotifications > 0 && (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{totalNotifications} new</Text>
          </View>
        )}
        <Pressable style={styles.newChatBtn}>
          <SquarePen size={22} color={Brand.cyan} strokeWidth={1.75} />
        </Pressable>
      </View>

      {/* Voice note info banner */}
      <View style={styles.featureBanner}>
        <Text style={styles.featureBannerText}>
          💬 Text · 🎙️ Voice comments up to 30s · Notifications in one place
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {MOCK_CHATS.map((chat, index) => (
          <ChatRow key={chat.id} chat={chat} index={index} />
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
  },
  headerBadge: {
    backgroundColor: Brand.cyan,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  newChatBtn: {
    padding: 4,
  },
  featureBanner: {
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  featureBannerText: {
    fontSize: 12,
    color: Brand.cyanDark,
    fontWeight: '500',
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F5F5F5',
  },
  chatRowPressed: {
    backgroundColor: '#F5F5F5',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatContent: {
    flex: 1,
    gap: 4,
  },
  chatTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  chatNameUnread: {
    fontWeight: '700',
    color: '#000000',
  },
  chatTime: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  chatTimeUnread: {
    color: Brand.cyan,
    fontWeight: '600',
  },
  chatBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#9E9E9E',
    flex: 1,
    marginRight: 8,
  },
  lastMessageUnread: {
    color: '#555555',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: Brand.cyan,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
