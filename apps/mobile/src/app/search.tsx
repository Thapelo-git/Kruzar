import { router } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';

const WINDOW_WIDTH = Dimensions.get('window').width;
const TAG_CELL = (WINDOW_WIDTH - 4) / 3;

const TAG_POST_COLORS = [
  '#E3F2FD', '#F3E5F5', '#E8F5E9', '#FFF8E1',
  '#FCE4EC', '#E8EAF6', '#F1F8E9', '#E0F7FA',
  '#FBE9E7', '#EDE7F6', '#E0F2F1', '#FFF3E0',
];

const TAG_AUTHORS: Record<string, string[]> = {
  '#Moments':         ['Ivy', 'Pit', 'Abel', 'Jane', 'Maggy', 'Sipho', 'Winter', 'Peter', 'Paul', 'Lebo', 'Shibu', 'Buhle'],
  '#Realtimemoments': ['Power', 'Abel', 'Sipho', 'Jane', 'Ivy', 'Peter', 'Maggy', 'Pit', 'Winter', 'Paul', 'Lebo', 'Shibu'],
  '#LiveNow':         ['Peter', 'Abel', 'Jane', 'Power', 'Sipho', 'Ivy', 'Pit', 'Maggy', 'Winter', 'Paul', 'Lebo', 'Buhle'],
  '#Upload':          ['Maggy', 'Winter', 'Pit', 'Abel', 'Jane', 'Ivy', 'Power', 'Sipho', 'Peter', 'Paul', 'Lebo', 'Shibu'],
  '#Viral':           ['Sipho', 'Jane', 'Power', 'Ivy', 'Pit', 'Winter', 'Abel', 'Maggy', 'Peter', 'Lebo', 'Buhle', 'Paul'],
  '#SA':              ['Winter', 'Power', 'Maggy', 'Sipho', 'Abel', 'Jane', 'Pit', 'Ivy', 'Peter', 'Shibu', 'Lebo', 'Buhle'],
};

type UserResult = {
  id: string;
  name: string;
  username: string;
  followers: string;
  posts: number;
  isFollowing: boolean;
};

const ALL_USERS: UserResult[] = [
  { id: '1', name: 'Power Ramatsoma', username: 'powerram', followers: '2.3m', posts: 45, isFollowing: false },
  { id: '2', name: 'Ivy Dlamini', username: 'ivyd', followers: '18k', posts: 32, isFollowing: true },
  { id: '3', name: 'Pit Nkosi', username: 'pitnkosi', followers: '5.4k', posts: 21, isFollowing: false },
  { id: '4', name: 'Abel Mokoena', username: 'abelm', followers: '900', posts: 14, isFollowing: true },
  { id: '5', name: 'Jane Sithole', username: 'janesit', followers: '12k', posts: 67, isFollowing: false },
  { id: '6', name: 'Maggy Khumalo', username: 'maggy_k', followers: '3.1k', posts: 29, isFollowing: false },
  { id: '7', name: 'Sipho Mthembu', username: 'sipho_m', followers: '7.8k', posts: 55, isFollowing: true },
  { id: '8', name: 'Winter Zulu', username: 'winterz', followers: '22k', posts: 38, isFollowing: false },
];

const AVATAR_COLORS = ['#FF7043', '#AB47BC', '#42A5F5', '#26A69A', '#EC407A', '#7E57C2', '#FFA726', '#26C6DA'];

const TRENDING_TAGS = ['#Moments', '#Realtimemoments', '#LiveNow', '#Upload', '#Viral', '#SA'];

function UserCard({ user, index }: { user: UserResult; index: number }) {
  const [following, setFollowing] = useState(user.isFollowing);
  return (
    <Pressable style={styles.userCard} onPress={() => router.navigate('/profile')}>
      <View style={[styles.userAvatar, { backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }]}>
        <Text style={styles.userAvatarText}>{user.name[0]}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userHandle}>@{user.username}</Text>
        <Text style={styles.userStats}>
          <Text style={styles.statsHighlight}>{user.followers}</Text> followers ·{' '}
          <Text style={styles.statsHighlight}>{user.posts}</Text> posts
        </Text>
      </View>
      <Pressable
        style={[styles.followBtn, following && styles.followingBtn]}
        onPress={(e) => {
          e.stopPropagation();
          setFollowing((f) => !f);
        }}>
        <Text style={[styles.followBtnText, following && styles.followingBtnText]}>
          {following ? 'Following' : 'Follow'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagPress = (tag: string) => {
    setSelectedTag(tag);
    setQuery('');
  };

  const clearAll = () => {
    setSelectedTag(null);
    setQuery('');
  };

  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (text.length > 0) setSelectedTag(null);
  };

  const filteredUsers = query.trim()
    ? ALL_USERS.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.username.toLowerCase().includes(query.toLowerCase()),
      )
    : ALL_USERS;

  const tagPosts = selectedTag ? TAG_AUTHORS[selectedTag] ?? [] : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      {/* Search input */}
      <View style={styles.searchBar}>
        <Search size={18} color="#9E9E9E" strokeWidth={2} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search people, moments..."
          placeholderTextColor="#9E9E9E"
          value={query}
          onChangeText={handleQueryChange}
          returnKeyType="search"
        />
        {(query.length > 0 || selectedTag) && (
          <Pressable onPress={clearAll} style={styles.clearBtn}>
            <X size={16} color="#9E9E9E" strokeWidth={2.5} />
          </Pressable>
        )}
      </View>

      {/* Active tag pill */}
      {selectedTag && (
        <View style={styles.activeTagRow}>
          <View style={styles.activeTagPill}>
            <Text style={styles.activeTagText}>{selectedTag}</Text>
          </View>
          <Pressable onPress={() => setSelectedTag(null)} style={styles.activeTagClose}>
            <X size={13} color="#9E9E9E" strokeWidth={2.5} />
            <Text style={styles.activeTagCloseText}> Clear</Text>
          </Pressable>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TAG FEED */}
        {selectedTag ? (
          <>
            <Text style={styles.sectionTitle}>
              Posts for {selectedTag}
              <Text style={styles.sectionCount}> · {tagPosts.length} posts</Text>
            </Text>
            <View style={styles.tagGrid}>
              {tagPosts.map((author, i) => (
                <Pressable
                  key={`${selectedTag}-${i}`}
                  style={[
                    styles.tagCell,
                    { width: TAG_CELL, height: TAG_CELL, backgroundColor: TAG_POST_COLORS[i % TAG_POST_COLORS.length] },
                  ]}
                  onPress={() =>
                    router.navigate({
                      pathname: '/moment-viewer',
                      params: { username: author, colorIndex: i.toString() },
                    })
                  }>
                  <Text style={styles.tagCellLabel}>PIC/VIDEO</Text>
                  <View style={styles.tagCellAuthor}>
                    <Text style={styles.tagCellAuthorText}>{author}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <>
            {query.length === 0 && (
              <>
                <Text style={styles.sectionTitle}>Trending</Text>
                <FlatList
                  horizontal
                  data={TRENDING_TAGS}
                  keyExtractor={(t) => t}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tagsRow}
                  renderItem={({ item }) => (
                    <Pressable style={styles.tag} onPress={() => handleTagPress(item)}>
                      <Text style={styles.tagText}>{item}</Text>
                    </Pressable>
                  )}
                />
              </>
            )}

            <Text style={styles.sectionTitle}>
              {query.length > 0 ? `Results for "${query}"` : 'Suggested'}
            </Text>
            {filteredUsers.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No users found</Text>
              </View>
            ) : (
              filteredUsers.map((user, index) => (
                <UserCard key={user.id} user={user} index={index} />
              ))
            )}
          </>
        )}

        <View style={{ height: 24 }} />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
  },
  clearBtn: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  tagsRow: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 8,
  },
  tag: {
    backgroundColor: '#E0F7FA',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Brand.cyan,
  },
  tagText: {
    color: Brand.cyanDark,
    fontSize: 13,
    fontWeight: '600',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F5F5F5',
  },
  userAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  userHandle: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  userStats: {
    fontSize: 12,
    color: '#777777',
    marginTop: 2,
  },
  statsHighlight: {
    color: Brand.cyan,
    fontWeight: '700',
  },
  followBtn: {
    backgroundColor: Brand.cyan,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  followBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  followingBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Brand.cyan,
  },
  followingBtnText: {
    color: Brand.cyan,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#9E9E9E',
  },
  activeTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 10,
  },
  activeTagPill: {
    backgroundColor: Brand.cyan,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  activeTagText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  activeTagClose: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  activeTagCloseText: {
    color: '#9E9E9E',
    fontSize: 13,
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: '400',
    color: '#9E9E9E',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    paddingHorizontal: 2,
    paddingTop: 4,
  },
  tagCell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  tagCellLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777777',
    fontStyle: 'italic',
    transform: [{ rotate: '-15deg' }],
  },
  tagCellAuthor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  tagCellAuthorText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});
