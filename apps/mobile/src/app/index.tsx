import { router } from 'expo-router';
import { User, X } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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
      <View style={[styles.contentArea, { backgroundColor: bgColor }]} />

      {/* Action pills — top, no avatar */}
      <View style={styles.topActions}>
        <Pressable onPress={onLike} style={[styles.actionBtn, item.liked && styles.actionBtnLiked]}>
          <Text style={[styles.actionLabel, item.liked && styles.actionLabelLiked]}>
            Like{item.likes > 0 ? ` ${item.likes}` : ''}
          </Text>
        </Pressable>

        <Pressable style={styles.actionBtn} onPress={() => setShowComments(true)}>
          <Text style={styles.actionLabel}>Comment{item.comments > 0 ? ` ${item.comments}` : ''}</Text>
        </Pressable>

        <Pressable onPress={onSave} style={[styles.actionBtn, item.saved && styles.actionBtnSaved]}>
          <Text style={[styles.actionLabel, item.saved && styles.actionLabelSaved]}>
            Save{item.saves > 0 ? ` ${item.saves}` : ''}
          </Text>
        </Pressable>

        <Pressable style={styles.actionBtn}>
          <Text style={styles.actionLabel}>Share{item.shares > 0 ? ` ${item.shares}` : ''}</Text>
        </Pressable>
      </View>

      {/* Bottom info + avatar on right */}
      <View style={styles.postInfo}>
        <View style={styles.postInfoLeft}>
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

        {/* Avatar — + badge if no moments, count badge if has moments */}
        <Pressable style={styles.avatarWrapper} onPress={() => router.navigate('/profile')}>
          <View style={styles.dashedRing}>
            <View style={styles.avatar}>
              <User size={24} color="#FFFFFF" strokeWidth={1.75} />
            </View>
          </View>
          {item.momentCount === 0 ? (
            <View style={styles.followBadge}>
              <Text style={styles.followBadgeText}>+</Text>
            </View>
          ) : (
            <View style={styles.momentBadge}>
              <Text style={styles.momentBadgeText}>{item.momentCount}</Text>
            </View>
          )}
        </Pressable>
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
      {/* Paging post feed */}
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  actionBtnLiked: {
    backgroundColor: 'rgba(229,57,53,0.12)',
    borderColor: Brand.red,
  },
  actionBtnSaved: {
    backgroundColor: 'rgba(0,188,212,0.12)',
    borderColor: Brand.cyan,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  actionLabelLiked: {
    color: Brand.red,
  },
  actionLabelSaved: {
    color: Brand.cyan,
  },
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
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
  followBadge: {
    position: 'absolute',
    bottom: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Brand.cyan,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },

  // Post info bar
  postInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.93)',
    gap: 12,
  },
  postInfoLeft: {
    flex: 1,
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
