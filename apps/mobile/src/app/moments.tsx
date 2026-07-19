import { router } from 'expo-router';
import { Camera, Plus, Search } from 'lucide-react-native';
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
const CELL_SIZE = (WINDOW_WIDTH - 4) / 3;

type StoryUser = { id: string; name: string; isCamera?: boolean };
type GridPost = { id: string; username: string };

const STORY_USERS: StoryUser[] = [
  { id: 'camera', name: 'Camera', isCamera: true },
  { id: '1', name: 'Ivy' },
  { id: '2', name: 'Pit' },
  { id: '3', name: 'Abel' },
  { id: '4', name: 'Jane' },
  { id: '5', name: 'Maggy' },
  { id: '6', name: 'Sipho' },
];

const GRID_POSTS: GridPost[] = [
  { id: '1', username: 'Shibu' },
  { id: '2', username: 'Paul' },
  { id: '3', username: 'Lebo' },
  { id: '4', username: 'Winter' },
  { id: '5', username: 'Pearl' },
  { id: '6', username: 'Zinhle' },
  { id: '7', username: 'Michael' },
  { id: '8', username: 'Simon' },
  { id: '9', username: 'Shelly' },
  { id: '10', username: 'Oratile' },
  { id: '11', username: 'Jack' },
  { id: '12', username: 'Buhle' },
];

const AVATAR_COLORS = [
  '#FF7043',
  '#AB47BC',
  '#42A5F5',
  '#26A69A',
  '#EC407A',
  '#7E57C2',
  '#FFA726',
];

function StoryBubble({ user, index }: { user: StoryUser; index: number }) {
  const onPress = () => {
    if (user.isCamera) {
      router.navigate('/add');
    } else {
      router.navigate({
        pathname: '/moment-viewer',
        params: { username: user.name, colorIndex: index.toString() },
      });
    }
  };

  return (
    <Pressable style={styles.storyItem} onPress={onPress}>
      {user.isCamera ? (
        <View style={styles.cameraCircle}>
          <Camera size={26} color="#FFFFFF" strokeWidth={1.75} />
        </View>
      ) : (
        <View style={styles.storyRing}>
          <View style={[styles.storyAvatar, { backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }]}>
            <Text style={styles.storyInitial}>{user.name[0]}</Text>
          </View>
        </View>
      )}
      <Text style={styles.storyLabel} numberOfLines={1}>
        {user.name}
      </Text>
    </Pressable>
  );
}

function GridCell({ post, index }: { post: GridPost; index: number }) {
  return (
    <Pressable
      style={[styles.gridCell, { width: CELL_SIZE, height: CELL_SIZE + 40 }]}
      onPress={() =>
        router.navigate({
          pathname: '/moment-viewer',
          params: { username: post.username, colorIndex: (index + 7).toString() },
        })
      }>
      <View style={styles.gridHeader}>
        <Text style={styles.gridUsername} numberOfLines={1}>
          {post.username}
        </Text>
      </View>
      <View style={styles.gridContent}>
        <Text style={styles.gridContentLabel}>PIC/VIDEO</Text>
      </View>
    </Pressable>
  );
}

export default function MomentsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Realtimemoments</Text>
        <Pressable style={styles.searchBtn}>
          <Search size={20} color="#555555" strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Moments stories section */}
        <Text style={styles.sectionLabel}>Moments</Text>
        <FlatList
          horizontal
          data={STORY_USERS}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesRow}
          renderItem={({ item, index }) => <StoryBubble user={item} index={index} />}
        />

        {/* Uploads section */}
        <View style={styles.uploadsHeader}>
          <Text style={styles.sectionLabel}>Uploads</Text>
          <Pressable style={styles.uploadAddBtn}>
            <Plus size={16} color={Brand.cyan} strokeWidth={2.5} />
          </Pressable>
        </View>

        {/* 3-column grid */}
        <View style={styles.grid}>
          {GRID_POSTS.map((post, index) => (
            <GridCell key={post.id} post={post} index={index} />
          ))}
        </View>

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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  searchBtn: {
    padding: 4,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  storiesRow: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 4,
  },
  storyItem: {
    alignItems: 'center',
    width: 72,
    gap: 4,
    paddingHorizontal: 4,
  },
  cameraCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Brand.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: Brand.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyInitial: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  storyLabel: {
    fontSize: 11,
    color: '#333333',
    textAlign: 'center',
    width: 64,
  },
  uploadsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  uploadAddBtn: {
    marginLeft: 6,
    marginTop: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Brand.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    paddingHorizontal: 2,
  },
  gridCell: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  gridHeader: {
    backgroundColor: Brand.cyan,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  gridUsername: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  gridContent: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContentLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555555',
    fontStyle: 'italic',
    transform: [{ rotate: '-15deg' }],
  },
});
