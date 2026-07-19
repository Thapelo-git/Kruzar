import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Mic, Pause, Phone, Play, Send } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';

type Message = {
  id: string;
  text: string;
  isOwn: boolean;
  time: string;
  isVoice?: boolean;
  duration?: string;
};

const AVATAR_COLORS: Record<string, string> = {
  Ivy: '#AB47BC',
  Peter: '#42A5F5',
  Abel: '#26A69A',
  Maggy: '#EC407A',
  Sipho: '#7E57C2',
  Pit: '#FFA726',
  Jane: '#26C6DA',
  Winter: '#FF7043',
};

function buildMessages(name: string): Message[] {
  return [
    { id: '1', text: `Hey! It's ${name} here 👋`, isOwn: false, time: '10:30' },
    { id: '2', text: 'Hey! So good to hear from you', isOwn: true, time: '10:31' },
    { id: '3', text: 'Did you catch my latest moment?', isOwn: false, time: '10:32' },
    { id: '4', text: 'Yes! That was amazing 🔥', isOwn: true, time: '10:33' },
    { id: '5', text: '', isOwn: false, time: '10:34', isVoice: true, duration: '0:18' },
    { id: '6', text: 'Haha thanks, uploading more soon!', isOwn: false, time: '10:35' },
    { id: '7', text: "Can't wait to see them 👀", isOwn: true, time: '10:36' },
  ];
}

function formatSeconds(s: number) {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function MessageBubble({ msg }: { msg: Message }) {
  const [playing, setPlaying] = useState(false);

  if (msg.isVoice) {
    const waveColor = msg.isOwn ? 'rgba(255,255,255,0.5)' : Brand.cyan;
    const iconColor = msg.isOwn ? '#FFFFFF' : Brand.cyan;
    return (
      <View style={[styles.bubble, msg.isOwn ? styles.ownBubble : styles.theirBubble]}>
        <Pressable style={styles.voiceMsg} onPress={() => setPlaying((p) => !p)}>
          {playing
            ? <Pause size={18} color={iconColor} />
            : <Play size={18} color={iconColor} />
          }
          <View style={styles.voiceWave}>
            {Array.from({ length: 18 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.waveBar,
                  { height: 4 + Math.sin(i * 0.8) * 8 + 4 },
                  { backgroundColor: waveColor },
                  playing && i < 6 && styles.waveBarPlayed,
                ]}
              />
            ))}
          </View>
          <Text style={[styles.voiceDuration, msg.isOwn && styles.voiceDurationOwn]}>
            {msg.duration}
          </Text>
        </Pressable>
        <Text style={[styles.msgTime, msg.isOwn && styles.msgTimeOwn]}>{msg.time}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.bubble, msg.isOwn ? styles.ownBubble : styles.theirBubble]}>
      <Text style={[styles.msgText, msg.isOwn && styles.msgTextOwn]}>{msg.text}</Text>
      <Text style={[styles.msgTime, msg.isOwn && styles.msgTimeOwn]}>{msg.time}</Text>
    </View>
  );
}

export default function ConversationScreen() {
  const { name } = useLocalSearchParams<{ id: string; name: string }>();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<Message>>(null);

  const [messages, setMessages] = useState<Message[]>(() => buildMessages(name ?? 'User'));
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const MAX_VOICE_SECONDS = 30;

  const avatarColor = AVATAR_COLORS[name ?? ''] ?? '#9E9E9E';

  const scrollToBottom = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendText = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isOwn: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    setTimeout(() => {
      const replies = [
        '👍',
        "That's great!",
        'haha 😂',
        'Tell me more!',
        'Nice one 🔥',
        '💯',
      ];
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: replies[Math.floor(Math.random() * replies.length)],
        isOwn: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordSeconds((s) => {
        if (s >= MAX_VOICE_SECONDS - 1) {
          stopRecording(s + 1);
          return s;
        }
        return s + 1;
      });
    }, 1000);
  };

  const stopRecording = (finalSeconds?: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const secs = finalSeconds ?? recordSeconds;
    if (secs > 0) {
      const voiceMsg: Message = {
        id: Date.now().toString(),
        text: '',
        isOwn: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isVoice: true,
        duration: formatSeconds(secs),
      };
      setMessages((prev) => [...prev, voiceMsg]);
    }
    setIsRecording(false);
    setRecordSeconds(0);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.bottom}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#333333" strokeWidth={2.5} />
        </Pressable>
        <View style={[styles.headerAvatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.headerAvatarText}>{(name ?? 'U')[0]}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{name}</Text>
          <Text style={styles.headerStatus}>● Online</Text>
        </View>
        <Pressable style={styles.callBtn}>
          <Phone size={20} color={Brand.cyan} strokeWidth={2} />
        </Pressable>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        renderItem={({ item }) => <MessageBubble msg={item} />}
        onLayout={scrollToBottom}
      />

      {/* Recording overlay */}
      {isRecording && (
        <View style={styles.recordingOverlay}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>
            Recording {formatSeconds(recordSeconds)} / max 0:30
          </Text>
          <Text style={styles.recordingHint}>Release to send</Text>
        </View>
      )}

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#9E9E9E"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={sendText}
        />
        {inputText.trim().length > 0 ? (
          <Pressable style={styles.sendBtn} onPress={sendText}>
            <Send size={18} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>
        ) : (
          <Pressable
            style={[styles.micBtn, isRecording && styles.micBtnActive]}
            onPressIn={startRecording}
            onPressOut={() => stopRecording()}>
            <Mic size={20} color={isRecording ? Brand.red : '#777777'} strokeWidth={2} />
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  headerStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  callBtn: {
    padding: 6,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  ownBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Brand.cyan,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  msgText: {
    fontSize: 15,
    color: '#222',
    lineHeight: 21,
  },
  msgTextOwn: {
    color: '#FFFFFF',
  },
  msgTime: {
    fontSize: 10,
    color: '#9E9E9E',
    alignSelf: 'flex-end',
  },
  msgTimeOwn: {
    color: 'rgba(255,255,255,0.7)',
  },
  voiceMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 160,
  },
  voiceWave: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 24,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
  },
  waveBarPlayed: {
    opacity: 1,
  },
  voiceDuration: {
    fontSize: 12,
    color: '#777',
    fontWeight: '600',
  },
  voiceDurationOwn: {
    color: 'rgba(255,255,255,0.8)',
  },
  recordingOverlay: {
    backgroundColor: '#FFF3F3',
    borderTopWidth: 1,
    borderTopColor: Brand.red,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Brand.red,
  },
  recordingText: {
    flex: 1,
    fontSize: 14,
    color: Brand.red,
    fontWeight: '600',
  },
  recordingHint: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 15,
    color: '#000',
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Brand.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnActive: {
    backgroundColor: '#FFEBEE',
    borderWidth: 2,
    borderColor: Brand.red,
  },
});
