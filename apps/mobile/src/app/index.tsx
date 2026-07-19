import { router } from 'expo-router';
import { AlignJustify, Bookmark, Camera, Heart, MessageSquare, Share2 } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type Post = {
  id: string;
  username: string;
  caption: string;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  isLive: boolean;
  momentCount: number;
  liked: boolean;
  saved: boolean;
};

type MomentFriend = {
  id: string;
  name: string;
  isLive: boolean;
  time: string | null;
  colorIndex: number;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#AB47BC', '#42A5F5', '#26A69A', '#EC407A',
  '#7E57C2', '#FFA726', '#26C6DA', '#FF7043',
];

const MOMENT_FRIENDS: MomentFriend[] = [
  { id: '1', name: 'Ivy',    isLive: false, time: '2m',  colorIndex: 0 },
  { id: '2', name: 'Peter',  isLive: true,  time: null,  colorIndex: 1 },
  { id: '3', name: 'Abel',   isLive: false, time: '15m', colorIndex: 2 },
  { id: '4', name: 'Maggy',  isLive: true,  time: null,  colorIndex: 3 },
  { id: '5', name: 'Sipho',  isLive: false, time: 'now', colorIndex: 4 },
  { id: '6', name: 'Pit',    isLive: false, time: '1h',  colorIndex: 5 },
  { id: '7', name: 'Jane',   isLive: false, time: '3h',  colorIndex: 6 },
  { id: '8', name: 'Winter', isLive: false, time: '5h',  colorIndex: 7 },
];

// Live friends appear first
const SORTED_MOMENTS = [...MOMENT_FRIENDS].sort(
  (a, b) => Number(b.isLive) - Number(a.isLive),
);

const MOCK_POSTS: Post[] = [
  {
    id: '1', username: 'Peter', caption: 'Best App',
    likes: 3, comments: 1, saves: 0, shares: 0,
    isLive: true, momentCount: 13, liked: false, saved: false,
  },
  {
    id: '2', username: 'Ivy', caption: 'Summer vibes only',
    likes: 12, comments: 5, saves: 2, shares: 1,
    isLive: false, momentCount: 7, liked: true, saved: false,
  },
  {
    id: '3', username: 'Pit', caption: 'New day, new energy',
    likes: 45, comments: 8, saves: 3, shares: 2,
    isLive: false, momentCount: 0, liked: false, saved: true,
  },
  {
    id: '4', username: 'Abel', caption: 'Making it happen',
    likes: 101, comments: 24, saves: 15, shares: 8,
    isLive: true, momentCount: 5, liked: false, saved: false,
  },
];

const BG_COLORS = ['#E3F2FD', '#F3E5F5', '#E8F5E9', '#FFF8E1'];

// ─── Live pulse ring ──────────────────────────────────────────────────────────

function LivePulseRing() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale,   { toValue: 1.35, duration: 700, useNativeDriver: true }),
          Animated.timing(scale,   { toValue: 1,    duration: 700, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.2,  duration: 700, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.8,  duration: 700, useNativeDriver: true }),
        ]),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[styles.pulseRing, { transform: [{ scale }], opacity }]}
    />
  );
}

// ─── Moment bubble ────────────────────────────────────────────────────────────

function MomentBubble({ friend }: { friend: MomentFriend }) {
  const avatarBg = AVATAR_COLORS[friend.colorIndex % AVATAR_COLORS.length];

  return (
    <Pressable
      style={styles.momentItem}
      onPress={() =>
        router.navigate({
          pathname: '/moment-viewer',
          params: {
            username: friend.name,
            colorIndex: friend.colorIndex.toString(),
            isLive: friend.isLive ? '1' : '0',
          },
        })
      }>
      <View style={styles.momentRingWrapper}>
        {friend.isLive && <LivePulseRing />}
        <View style={[styles.momentRing, friend.isLive ? styles.momentRingLive : styles.momentRingNormal]}>
          <View style={[styles.momentAvatar, { backgroundColor: avatarBg }]}>
            <Text style={styles.momentInitial}>{friend.name[0]}</Text>
          </View>
        </View>
        {friend.isLive && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        )}
      </View>
      <Text style={styles.momentName} numberOfLines={1}>{friend.name}</Text>
      {!friend.isLive && (
        <Text style={styles.momentTime}>{friend.time}</Text>
      )}
    </Pressable>
  );
}

// ─── Moments strip ────────────────────────────────────────────────────────────

type StripItem =
  | { kind: 'add'; id: string }
  | (MomentFriend & { kind: 'friend' });

const STRIP_DATA: StripItem[] = [
  { kind: 'add', id: 'add' },
  ...SORTED_MOMENTS.map((f) => ({ ...f, kind: 'friend' as const })),
];

function MomentsStrip() {
  return (
    <View style={styles.momentsStrip}>
      <FlatList<StripItem>
        horizontal
        data={STRIP_DATA}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.momentsContent}
        renderItem={({ item }) => {
          if (item.kind === 'add') {
            return (
              <Pressable style={styles.momentItem} onPress={() => router.navigate('/add')}>
                <View style={styles.addStoryCircle}>
                  <Camera size={22} color="#FFFFFF" strokeWidth={1.75} />
                  <View style={styles.addStoryPlus}>
                    <Text style={styles.addStoryPlusText}>+</Text>
                  </View>
                </View>
                <Text style={styles.momentName}>Your Story</Text>
              </Pressable>
            );
          }
          return <MomentBubble friend={item} />;
        }}
      />
    </View>
  );
}

// ─── Post card ────────────────────────────────────────────────────────────────

function PostCard({
  item,
  height,
  onLike,
  onSave,
  bgColor,
}: {
  item: Post;
  height: number;
  onLike: () => void;
  onSave: () => void;
  bgColor: string;
}) {
  return (
    <View style={[styles.post, { height }]}>
      <View style={[styles.contentArea, { backgroundColor: bgColor }]} />

      <View style={styles.topActions}>
        <Pressable onPress={onLike} style={styles.actionBtn}>
          <Heart
            size={22}
            color={item.liked ? Brand.red : '#333333'}
            fill={item.liked ? Brand.red : 'none'}
            strokeWidth={2}
          />
          <Text style={[styles.actionCount, item.liked && styles.actionCountLiked]}>
            {item.likes}
          </Text>
        </Pressable>

        <Pressable style={styles.actionBtn}>
          <MessageSquare size={22} color="#333333" strokeWidth={2} />
          <Text style={styles.actionCount}>{item.comments}</Text>
        </Pressable>

        <Pressable onPress={onSave} style={styles.actionBtn}>
          <Bookmark
            size={22}
            color={item.saved ? Brand.cyan : '#333333'}
            fill={item.saved ? Brand.cyan : 'none'}
            strokeWidth={2}
          />
          <Text style={[styles.actionCount, item.saved && styles.actionCountSaved]}>
            {item.saves}
          </Text>
        </Pressable>

        <Pressable style={styles.actionBtn}>
          <Share2 size={22} color="#333333" strokeWidth={2} />
          <Text style={styles.actionCount}>{item.shares}</Text>
        </Pressable>

        {/* Creator avatar */}
        <Pressable style={styles.avatarArea} onPress={() => router.navigate('/profile')}>
          <View style={styles.avatarWrapper}>
            <View style={styles.dashedRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>{item.username[0]}</Text>
              </View>
            </View>
            {item.momentCount > 0 && (
              <View style={styles.momentBadge}>
                <Text style={styles.momentBadgeText}>{item.momentCount}</Text>
              </View>
            )}
          </View>
          <View style={styles.followBtn}>
            <Text style={styles.followBtnText}>+</Text>
          </View>
          <AlignJustify size={22} color={Brand.cyan} strokeWidth={2.5} />
        </Pressable>
      </View>

      <View style={styles.postInfo}>
        <View style={styles.postInfoTop}>
          <Text style={styles.username}>{item.username}</Text>
          {item.isLive && (
            <View style={styles.liveChip}>
              <View style={styles.liveDot} />
              <Text style={styles.liveChipText}>LIVE</Text>
            </View>
          )}
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.stats}>
          {item.likes}L · {item.comments}C · {item.saves}S · {item.shares}Sh
        </Text>
      </View>
    </View>
  );
}

// ─── Home screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [feedHeight, setFeedHeight] = useState(0);

  const toggleLike = useCallback((id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p,
      ),
    );
  }, []);

  const toggleSave = useCallback((id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, saved: !p.saved, saves: p.saved ? p.saves - 1 : p.saves + 1 }
          : p,
      ),
    );
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Stories row */}
      <MomentsStrip />

      {/* Paging post feed — measured separately so it fills exactly the remaining space */}
      <View
        style={styles.feedContainer}
        onLayout={(e) => setFeedHeight(e.nativeEvent.layout.height)}>
        {feedHeight > 0 && (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={feedHeight}
            decelerationRate="fast"
            renderItem={({ item, index }) => (
              <PostCard
                item={item}
                height={feedHeight}
                bgColor={BG_COLORS[index % BG_COLORS.length]}
                onLike={() => toggleLike(item.id)}
                onSave={() => toggleSave(item.id)}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Moments strip
  momentsStrip: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 6,
  },
  momentsContent: {
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    gap: 2,
  },
  momentItem: {
    alignItems: 'center',
    width: 68,
    paddingHorizontal: 2,
    gap: 4,
  },
  momentRingWrapper: {
    position: 'relative',
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Brand.red,
  },
  momentRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  momentRingLive: {
    borderColor: Brand.red,
  },
  momentRingNormal: {
    borderColor: Brand.cyan,
  },
  momentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  momentInitial: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  liveBadge: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: Brand.red,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  liveBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  momentName: {
    fontSize: 10,
    color: '#333333',
    textAlign: 'center',
    width: 64,
    fontWeight: '500',
  },
  momentTime: {
    fontSize: 9,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  addStoryCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Brand.cyanDark,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  addStoryPlus: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Brand.cyan,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addStoryPlusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 15,
  },

  // Feed
  feedContainer: {
    flex: 1,
  },
  post: {
    position: 'relative',
    overflow: 'hidden',
  },
  contentArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 16,
    zIndex: 10,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  actionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
  actionCountLiked: {
    color: Brand.red,
  },
  actionCountSaved: {
    color: Brand.cyan,
  },
  avatarArea: {
    marginLeft: 'auto',
    alignItems: 'center',
    gap: 8,
  },
  avatarWrapper: {
    position: 'relative',
  },
  dashedRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: Brand.cyan,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#37474F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  momentBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Brand.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  momentBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  followBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Brand.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },

  // Post info bar
  postInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.93)',
    gap: 3,
  },
  postInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.red,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  liveChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  caption: {
    fontSize: 14,
    color: '#555555',
  },
  stats: {
    fontSize: 12,
    color: '#9E9E9E',
    letterSpacing: 0.2,
    marginTop: 2,
  },
});
