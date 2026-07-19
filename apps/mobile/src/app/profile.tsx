import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';

const WINDOW_WIDTH = Dimensions.get('window').width;
const GRID_CELL = (WINDOW_WIDTH - 4) / 3;

const FRIENDS = [
  { id: '1', name: 'Maggy', color: '#FF7043' },
  { id: '2', name: 'Ivy', color: '#AB47BC' },
  { id: '3', name: 'Pit', color: '#42A5F5' },
  { id: '4', name: 'Abel', color: '#26A69A' },
  { id: '5', name: 'Sipho', color: '#EC407A' },
];

const POST_COLORS = [
  '#E3F2FD', '#F3E5F5', '#E8F5E9', '#FFF8E1',
  '#FCE4EC', '#E8EAF6', '#F1F8E9', '#E0F7FA',
  '#FBE9E7', '#EDE7F6',
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'message'>('posts');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Back arrow */}
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>←</Text>
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.welcomeTo}>Welcome to</Text>
              <Text style={styles.displayName}>Power Ramatsoma</Text>
              <Text style={styles.bio}>Cool guy who thinks about{'\n'}business always.</Text>
            </View>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: '#42A5F5' }]}>
                <Text style={styles.avatarInitial}>P</Text>
              </View>
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <Pressable
              style={[styles.followStatBtn, isFollowing && styles.followingBtn]}
              onPress={() => setIsFollowing((f) => !f)}>
              <Text style={[styles.followStatLabel, isFollowing && styles.followingLabel]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Followers</Text>
              <Text style={styles.statValue}>2.3m</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Following</Text>
              <Text style={styles.statValue}>10k</Text>
            </View>
          </View>

          {/* Friends */}
          <Text style={styles.friendsTitle}>Friends</Text>
          <FlatList
            horizontal
            data={FRIENDS}
            keyExtractor={(f) => f.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.friendsList}
            renderItem={({ item }) => (
              <View style={styles.friendItem}>
                <View style={[styles.friendAvatar, { backgroundColor: item.color }]}>
                  <Text style={styles.friendInitial}>{item.name[0]}</Text>
                </View>
                <Text style={styles.friendName}>{item.name}</Text>
              </View>
            )}
          />

          {/* Action buttons */}
          <View style={styles.actionBtns}>
            <Pressable
              style={[styles.actionBtn, activeTab === 'posts' && styles.actionBtnActive]}
              onPress={() => setActiveTab('posts')}>
              <Text style={[styles.actionBtnText, activeTab === 'posts' && styles.actionBtnTextActive]}>
                Posts
              </Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, activeTab === 'message' && styles.actionBtnActive]}
              onPress={() => setActiveTab('message')}>
              <Text style={[styles.actionBtnText, activeTab === 'message' && styles.actionBtnTextActive]}>
                Message
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Posts grid */}
        <View style={styles.grid}>
          {POST_COLORS.map((color, i) => (
            <Pressable
              key={i}
              style={[styles.gridCell, { width: GRID_CELL, height: GRID_CELL, backgroundColor: color }]}>
              <Text style={styles.gridLabel}>PIC/VIDEO</Text>
            </Pressable>
          ))}
        </View>

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
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 20,
    color: '#333333',
  },
  profileHeader: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
    marginRight: 16,
    gap: 4,
  },
  welcomeTo: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  displayName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },
  bio: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
    marginTop: 4,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Brand.cyan,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 16,
  },
  followStatBtn: {
    backgroundColor: Brand.cyan,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  followingBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Brand.cyan,
  },
  followStatLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  followingLabel: {
    color: Brand.cyan,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: Brand.cyan,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  friendsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  friendsList: {
    gap: 16,
    paddingBottom: 16,
  },
  friendItem: {
    alignItems: 'center',
    gap: 4,
  },
  friendAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Brand.cyan,
  },
  friendInitial: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  friendName: {
    fontSize: 12,
    color: '#333333',
  },
  actionBtns: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#333333',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionBtnActive: {
    backgroundColor: Brand.cyan,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  actionBtnTextActive: {
    color: '#FFFFFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    paddingHorizontal: 2,
    paddingTop: 2,
  },
  gridCell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E0E0E0',
  },
  gridLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#777777',
    fontStyle: 'italic',
    transform: [{ rotate: '-15deg' }],
  },
});
