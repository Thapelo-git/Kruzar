import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Check, Images, SwitchCamera, X, Zap, ZapOff } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';

function formatSeconds(s: number) {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function AddScreen() {
  const insets = useSafeAreaInsets();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [capturedIsVideo, setCapturedIsVideo] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraRef = useRef<any>(null);
  const isRecordingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Permission screen ────────────────────────────────────────────────────────
  if (!cameraPermission) return null;

  if (!cameraPermission.granted) {
    return (
      <View style={styles.permissionScreen}>
        <Pressable
          style={[styles.closeBtn, { top: insets.top + 12 }]}
          onPress={() => router.back()}>
          <X size={18} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.permTitle}>Camera Access</Text>
        <Text style={styles.permSub}>
          Allow Ramatsoma to capture and share your moments
        </Text>
        <Pressable style={styles.permBtn} onPress={requestCameraPermission}>
          <Text style={styles.permBtnText}>Allow Camera</Text>
        </Pressable>
      </View>
    );
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  const takePhoto = async () => {
    if (!cameraRef.current || isRecordingRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      if (photo?.uri) {
        setCapturedUri(photo.uri);
        setCapturedIsVideo(false);
      }
    } catch {
      Alert.alert('Error', 'Could not take photo. Please try again.');
    }
  };

  const startRecording = async () => {
    if (!cameraRef.current || isRecordingRef.current) return;
    if (!micPermission?.granted) {
      await requestMicPermission();
      if (!micPermission?.granted) return;
    }
    isRecordingRef.current = true;
    setIsRecording(true);
    setRecordSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordSeconds((s) => {
        if (s >= 29) {
          stopRecording();
          return s;
        }
        return s + 1;
      });
    }, 1000);
    try {
      const video = await cameraRef.current.recordAsync({ maxDuration: 30 });
      if (video?.uri) {
        setCapturedUri(video.uri);
        setCapturedIsVideo(true);
      }
    } catch {
      // recording was stopped normally
    } finally {
      cleanupRecording();
    }
  };

  const stopRecording = () => {
    if (!isRecordingRef.current) return;
    cameraRef.current?.stopRecording();
    cleanupRecording();
  };

  const cleanupRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    isRecordingRef.current = false;
    setIsRecording(false);
    setRecordSeconds(0);
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setCapturedUri(asset.uri);
      setCapturedIsVideo(asset.type === 'video');
    }
  };

  const retake = () => {
    setCapturedUri(null);
    setCapturedIsVideo(false);
  };

  const postMoment = () => {
    Alert.alert('Moment Posted!', 'Your moment is now live for your friends to see.', [
      { text: 'Great!', onPress: () => router.back() },
    ]);
  };

  // ── Preview screen (after capture) ──────────────────────────────────────────
  if (capturedUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />

        {/* Video badge */}
        {capturedIsVideo && (
          <View style={[styles.videoBadge, { top: insets.top + 16 }]}>
            <Text style={styles.videoBadgeText}>● Video</Text>
          </View>
        )}

        {/* Top-left close */}
        <Pressable style={[styles.closeBtn, { top: insets.top + 12 }]} onPress={() => router.back()}>
          <X size={18} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>

        {/* Bottom actions */}
        <View style={[styles.previewActions, { paddingBottom: insets.bottom + 24 }]}>
          <Pressable style={styles.retakeBtn} onPress={retake}>
            <X size={18} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.retakeBtnText}>Retake</Text>
          </Pressable>
          <Pressable style={styles.postBtn} onPress={postMoment}>
            <Text style={styles.postBtnText}>Post Moment</Text>
            <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Camera screen ────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Live camera preview */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flash}
      />

      {/* Gradient overlay — top */}
      <View style={styles.topGradient} pointerEvents="none" />
      {/* Gradient overlay — bottom */}
      <View style={styles.bottomGradient} pointerEvents="none" />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.iconCircle} onPress={() => router.back()}>
          <X size={18} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>

        <Text style={styles.cameraLabel}>Realtimemoments</Text>

        <Pressable
          style={styles.iconCircle}
          onPress={() => setFlash((f) => (f === 'off' ? 'on' : 'off'))}>
          {flash === 'on' ? (
            <Zap size={20} color="#FFD700" fill="#FFD700" strokeWidth={1.5} />
          ) : (
            <ZapOff size={20} color="rgba(255,255,255,0.8)" strokeWidth={1.75} />
          )}
        </Pressable>
      </View>

      {/* Recording badge */}
      {isRecording && (
        <View style={[styles.recordingBadge, { top: insets.top + 72 }]}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>REC {formatSeconds(recordSeconds)}</Text>
          <Text style={styles.recordingMax}> / 0:30</Text>
        </View>
      )}

      {/* Bottom controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 24 }]}>
        {/* Gallery */}
        <Pressable style={styles.sideBtn} onPress={openGallery}>
          <View style={styles.galleryCircle}>
            <Images size={24} color="#FFFFFF" strokeWidth={1.75} />
          </View>
          <Text style={styles.controlLabel}>Gallery</Text>
        </Pressable>

        {/* Capture — tap for photo, hold for video */}
        <Pressable
          style={styles.captureOuter}
          onPress={takePhoto}
          onLongPress={startRecording}
          onPressOut={() => {
            if (isRecordingRef.current) stopRecording();
          }}
          delayLongPress={400}>
          <View style={[styles.captureInner, isRecording && styles.captureInnerRecording]} />
        </Pressable>

        {/* Flip */}
        <Pressable
          style={styles.sideBtn}
          onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}>
          <View style={styles.galleryCircle}>
            <SwitchCamera size={24} color="#FFFFFF" strokeWidth={1.75} />
          </View>
          <Text style={styles.controlLabel}>Flip</Text>
        </Pressable>
      </View>

      {/* Capture hint */}
      {!isRecording && (
        <Text style={[styles.captureHint, { bottom: insets.bottom + 90 }]}>
          Tap for photo · Hold for video
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // Permission screen
  permissionScreen: {
    flex: 1,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  permTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  permSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 22,
  },
  permBtn: {
    marginTop: 8,
    backgroundColor: Brand.cyan,
    borderRadius: 28,
    paddingHorizontal: 36,
    paddingVertical: 14,
  },
  permBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Overlays
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  // Top bar
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  closeBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Recording badge
  recordingBadge: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
    zIndex: 10,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Brand.red,
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  recordingMax: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },

  // Bottom controls
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 32,
    paddingTop: 20,
    zIndex: 10,
  },
  sideBtn: {
    alignItems: 'center',
    gap: 6,
  },
  galleryCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
  },
  captureInnerRecording: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: Brand.red,
  },
  controlLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '500',
  },
  captureHint: {
    position: 'absolute',
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '400',
    zIndex: 10,
  },

  // Preview screen
  previewActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 10,
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  retakeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: Brand.cyan,
  },
  postBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  videoBadge: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(229,57,53,0.85)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    zIndex: 10,
  },
  videoBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
