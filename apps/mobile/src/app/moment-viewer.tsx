import { router, useLocalSearchParams } from 'expo-router';
import { Camera, Flame, Heart, Send, Share2, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';

const BG_COLORS = [
  '#FF7043', '#AB47BC', '#42A5F5', '#26A69A',
  '#EC407A', '#7E57C2', '#FFA726', '#26C6DA',
  '#66BB6A', '#EF5350',
];

const STORY_DURATION_MS = 6000;

function computeTimeRemaining(index: number): string {
  const hours = 23 - (index % 5);
  const mins = 60 - (index * 7) % 60;
  const secs = (index * 13) % 60;
  return `${hours}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
}

function LiveDot() {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.2, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1,   duration: 600, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);
  return <Animated.View style={[styles.liveDot, { opacity }]} />;
}

export default function MomentViewerScreen() {
  const { username, colorIndex, isLive } = useLocalSearchParams<{
    username: string;
    colorIndex: string;
    isLive?: string;
  }>();
  const insets = useSafeAreaInsets();
  const live = isLive === '1';

  const numIndex = parseInt(colorIndex ?? '0', 10);
  const bgColor = BG_COLORS[numIndex % BG_COLORS.length];
  const timeRemaining = computeTimeRemaining(numIndex);

  const progress = useRef(new Animated.Value(0)).current;
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);
  const [viewers] = useState(Math.floor(Math.random() * 900) + 100);

  useEffect(() => {
    const startAnim = () => {
      progress.setValue(0);
      const anim = Animated.timing(progress, {
        toValue: 1,
        duration: STORY_DURATION_MS,
        useNativeDriver: false,
      });
      anim.start(({ finished }) => {
        if (finished) {
          if (live) {
            startAnim(); // loop for live
          } else {
            router.back();
          }
        }
      });
      return anim;
    };
    const anim = startAnim();
    return () => anim.stop();
  }, [username]);

  const sendReply = () => {
    if (!replyText.trim()) return;
    setReplySent(true);
    setReplyText('');
    setTimeout(() => setReplySent(false), 2000);
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Pressable style={styles.tapLeft} onPress={() => router.back()} />
      <Pressable style={styles.tapRight} onPress={() => router.back()} />

      {/* Progress bar */}
      <View style={[styles.progressRow, { top: insets.top + 8 }]}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </View>

      {/* Top bar */}
      <View style={[styles.topBar, { top: insets.top + 24 }]}>
        <View style={styles.userRow}>
          <View style={[styles.userAvatar, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
            <Text style={styles.userAvatarText}>{(username ?? 'U')[0]}</Text>
          </View>
          <View>
            <Text style={styles.userNameTop}>{username}</Text>
            {live ? (
              <View style={styles.liveRow}>
                <LiveDot />
                <Text style={styles.liveLabel}>LIVE · {viewers} watching</Text>
              </View>
            ) : (
              <Text style={styles.timeLeft}>⏱ {timeRemaining} left</Text>
            )}
          </View>
        </View>
        <Pressable style={styles.closeBtn} onPress={() => router.back()}>
          <X size={18} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </View>

      {/* Content placeholder */}
      <View style={styles.contentArea}>
        <Camera size={64} color="rgba(255,255,255,0.7)" strokeWidth={1.5} />
        <Text style={styles.contentLabel}>Moment · {username}</Text>
        <Text style={styles.contentSub}>Expires in {timeRemaining}</Text>
      </View>

      {/* Bottom reply bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        {replySent ? (
          <View style={styles.replySentBanner}>
            <Text style={styles.replySentText}>Reply sent ✓</Text>
          </View>
        ) : (
          <>
            <TextInput
              style={styles.replyInput}
              placeholder={`Reply to ${username}...`}
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={replyText}
              onChangeText={setReplyText}
              returnKeyType="send"
              onSubmitEditing={sendReply}
            />
            {replyText.trim().length > 0 && (
              <Pressable style={styles.replySendBtn} onPress={sendReply}>
                <Send size={17} color={Brand.cyan} strokeWidth={2.5} />
              </Pressable>
            )}
            <Pressable style={styles.reactionBtn}>
              <Heart size={20} color="#FFFFFF" strokeWidth={2} />
            </Pressable>
            <Pressable style={styles.reactionBtn}>
              <Flame size={20} color="#FFFFFF" strokeWidth={2} />
            </Pressable>
            <Pressable style={styles.shareBtn}>
              <Share2 size={18} color="#FFFFFF" strokeWidth={2} />
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tapLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '30%',
    zIndex: 5,
  },
  tapRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '30%',
    zIndex: 5,
  },
  progressRow: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 20,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  topBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  userNameTop: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  timeLeft: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  contentLabel: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  contentSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 8,
  },
  replyInput: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 14,
  },
  replySendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replySentBanner: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replySentText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Brand.red,
  },
  liveLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '600',
  },
});
