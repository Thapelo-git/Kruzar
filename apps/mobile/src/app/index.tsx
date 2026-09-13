import { router } from 'expo-router';
import { User, X } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';
import { usePosts } from '@/context/PostsContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type Post = {
  id: string;
  uri?: string;
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

// ─── Mock data ────────────────────────────────────────────────────────────────

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

// ─── Post card ────────────────────────────────────────────────────────────────

const MOCK_COMMENTS: { id: string; user: string; text: string }[] = [
  { id: '1', user: 'Ivy',   text: 'This is amazing 🔥' },
  { id: '2', user: 'Abel',  text: 'Love it!' },
  { id: '3', user: 'Sipho', text: 'Great content 👏' },
];

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
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  return (
    <View style={[styles.post, { height }]}>
      {item.uri ? (
        <Image source={{ uri: item.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <View style={[styles.contentArea, { backgroundColor: bgColor }]} />
      )}

      {/* Top row: actions LEFT + avatar RIGHT */}
      <View style={styles.topRow}>
        {/* Action labels */}
        <View style={styles.topActions}>
          <Pressable onPress={onLike} style={styles.actionBtn}>
            <Text style={[styles.actionLabel, item.liked && styles.actionLabelLiked]}>
              {item.liked ? 'Liked' : 'Like'}
            </Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => setShowComments(true)}>
            <Text style={styles.actionLabel}>Comment</Text>
          </Pressable>
          <Pressable onPress={onSave} style={styles.actionBtn}>
            <Text style={[styles.actionLabel, item.saved && styles.actionLabelSaved]}>Save</Text>
          </Pressable>
          <Pressable style={styles.actionBtn}>
            <Text style={styles.actionLabel}>Share</Text>
          </Pressable>
        </View>

        {/* Avatar — top right */}
        <Pressable style={styles.avatarWrapper} onPress={() => router.navigate('/profile')}>
          {item.momentCount > 0 && (
            <View style={styles.momentBadge}>
              <Text style={styles.momentBadgeText}>{item.momentCount}</Text>
            </View>
          )}
          <View style={styles.dashedRing}>
            <View style={styles.avatar}>
              <User size={22} color="#FFFFFF" strokeWidth={1.75} />
            </View>
          </View>
          <View style={styles.followBadge}>
            <Text style={styles.followBadgeText}>+</Text>
          </View>
        </Pressable>
      </View>

      {/* Bottom: username + caption + stats LEFT, LIVE badge RIGHT */}
      <View style={styles.postInfo}>
        <View style={styles.postInfoLeft}>
          <Text style={styles.username}>@{item.username}</Text>
          <Text style={styles.caption}>{item.caption}</Text>
          <Text style={styles.stats}>
            {item.likes}L . {item.comments}C . {item.saves}S . {item.shares}S
          </Text>
        </View>
        {item.isLive && (
          <View style={styles.liveChip}>
            <Text style={styles.liveChipText}>LIVE</Text>
          </View>
        )}
      </View>

      {/* Comment sheet */}
      {showComments && (
        <View style={styles.commentSheet}>
          <View style={styles.commentSheetHeader}>
            <Text style={styles.commentSheetTitle}>Comments</Text>
            <Pressable onPress={() => setShowComments(false)}>
              <X size={20} color="#333333" strokeWidth={2.5} />
            </Pressable>
          </View>

          {MOCK_COMMENTS.map((c) => (
            <View key={c.id} style={styles.commentRow}>
              <View style={styles.commentAvatar}>
                <Text style={styles.commentAvatarText}>{c.user[0]}</Text>
              </View>
              <View style={styles.commentBody}>
                <Text style={styles.commentUser}>{c.user}</Text>
                <Text style={styles.commentText}>{c.text}</Text>
              </View>
            </View>
          ))}

          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="#9E9E9E"
              value={commentText}
              onChangeText={setCommentText}
              returnKeyType="send"
            />
            <Pressable
              style={[styles.commentSendBtn, !commentText.trim() && { opacity: 0.4 }]}
              onPress={() => setCommentText('')}
              disabled={!commentText.trim()}>
              <Text style={styles.commentSendText}>Post</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Home screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { userPosts, toggleLike: ctxToggleLike, toggleSave: ctxToggleSave } = usePosts();
  const [mockPosts, setMockPosts] = useState<Post[]>(MOCK_POSTS);
  const [feedHeight, setFeedHeight] = useState(0);

  // User's captured posts at top, then mock posts
  const allPosts = useMemo<Post[]>(
    () => [...(userPosts as Post[]), ...mockPosts],
    [userPosts, mockPosts],
  );

  const userPostIds = useMemo(() => new Set(userPosts.map((p) => p.id)), [userPosts]);

  const handleLike = useCallback((id: string) => {
    if (userPostIds.has(id)) {
      ctxToggleLike(id);
    } else {
      setMockPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p,
        ),
      );
    }
  }, [userPostIds, ctxToggleLike]);

  const handleSave = useCallback((id: string) => {
    if (userPostIds.has(id)) {
      ctxToggleSave(id);
    } else {
      setMockPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, saved: !p.saved, saves: p.saved ? p.saves - 1 : p.saves + 1 } : p,
        ),
      );
    }
  }, [userPostIds, ctxToggleSave]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Paging post feed */}
      <View
        style={styles.feedContainer}
        onLayout={(e) => setFeedHeight(e.nativeEvent.layout.height)}>
        {feedHeight > 0 && (
          <FlatList
            data={allPosts}
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
                onLike={() => handleLike(item.id)}
                onSave={() => handleSave(item.id)}
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
  // Top row
  topRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 14,
    zIndex: 10,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    flexWrap: 'wrap',
  },
  actionBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  actionBtnLiked: {},
  actionBtnSaved: {},
  actionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  actionLabelLiked: {
    fontWeight: '800',
  },
  actionLabelSaved: {
    fontWeight: '800',
  },

  // Avatar — top right
  avatarWrapper: {
    alignItems: 'center',
    marginLeft: 8,
  },
  dashedRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#37474F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  momentBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Brand.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    zIndex: 1,
  },
  momentBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  followBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Brand.red,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  followBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
  },

  // Post info — bottom overlay
  postInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 80,
    zIndex: 10,
  },
  postInfoLeft: {
    flex: 1,
    gap: 4,
    marginRight: 12,
  },
  postInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  liveChip: {
    backgroundColor: Brand.red,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  liveChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  caption: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  stats: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.3,
    marginTop: 2,
  },

  // Comment sheet
  commentSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
    zIndex: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  commentSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentSheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  commentAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Brand.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  commentBody: {
    flex: 1,
    gap: 2,
  },
  commentUser: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  commentText: {
    fontSize: 13,
    color: '#444444',
    lineHeight: 18,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#000000',
  },
  commentSendBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: Brand.cyan,
  },
  commentSendText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
