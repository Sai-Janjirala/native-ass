import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  Image, 
  Alert, 
  ActivityIndicator, 
  useColorScheme 
} from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useSurvey } from '@/context/SurveyContext';

export default function CameraScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { updateDraftField } = useSurvey();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  // Local state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedUri, setCapturedUri] = useState(null);
  const [capturedTime, setCapturedTime] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(true);

  useEffect(() => {
    if (permission) {
      setIsCameraLoading(false);
    }
  }, [permission]);

  // Request permission helper
  const handleRequestPermission = async () => {
    setIsCameraLoading(true);
    await requestPermission();
    setIsCameraLoading(false);
  };

  // Toggle Camera
  const handleOpenCamera = () => {
    setIsCameraActive(true);
    setCapturedUri(null);
    setCapturedTime(null);
  };

  const handleCapture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        const options = { quality: 0.8, skipProcessing: false };
        const photo = await cameraRef.current.takePictureAsync(options);
        
        if (photo?.uri) {
          const timestamp = new Date().toLocaleString();
          setCapturedUri(photo.uri);
          setCapturedTime(timestamp);
          setIsCameraActive(false);
        }
      } catch (error) {
        Alert.alert('Capture Error', 'An error occurred while taking the picture.');
        console.error(error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const handleDeletePhoto = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this captured photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setCapturedUri(null);
            setCapturedTime(null);
          }
        }
      ]
    );
  };

  const handleAttachPhoto = () => {
    if (capturedUri && capturedTime) {
      updateDraftField('photoUri', capturedUri);
      updateDraftField('photoTime', capturedTime);
      Alert.alert(
        'Photo Attached', 
        'This photo has been attached to your active survey draft.',
        [{ text: 'OK', onPress: () => router.navigate('/?tab=1') }]
      );
    }
  };

  // Render Loading Indicator
  if (isCameraLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.infoText, { color: colors.icon, marginTop: 12 }]}>
          Loading Camera permissions...
        </Text>
      </View>
    );
  }

  // Render Permission Required State
  if (!permission || !permission.granted) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background, padding: 24 }]}>
        <Ionicons name="camera-outline" size={64} color={colors.icon} />
        <Text style={[styles.titleText, { color: colors.text, marginTop: 16 }]}>
          Camera Access Required
        </Text>
        <Text style={[styles.subText, { color: colors.icon, marginTop: 8 }]}>
          To capture photos for your inspection survey reports, please enable camera permissions.
        </Text>
        <Pressable 
          style={[styles.actionButton, { backgroundColor: colors.tint }]}
          onPress={handleRequestPermission}
        >
          <Text style={styles.actionButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  // Render Active Camera Viewport
  if (isCameraActive) {
    return (
      <View style={[styles.cameraContainer, { backgroundColor: '#000' }]}>
        <CameraView style={StyleSheet.absoluteFillObject} ref={cameraRef}>
          <View style={styles.cameraOverlayContainer}>
            {/* Header controls */}
            <View style={styles.cameraHeader}>
              <Pressable 
                style={styles.camCloseBtn}
                onPress={() => setIsCameraActive(false)}
              >
                <Ionicons name="close" size={28} color="#FFF" />
              </Pressable>
            </View>

            {/* Bottom capture triggers */}
            <View style={styles.cameraControls}>
              {isCapturing ? (
                <ActivityIndicator size="large" color="#FFF" />
              ) : (
                <Pressable style={styles.captureBtn} onPress={handleCapture}>
                  <View style={styles.captureBtnInner} />
                </Pressable>
              )}
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  // Render Captured Preview or Welcome State
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {capturedUri ? (
        // Preview State
        <View style={styles.previewContainer}>
          <View style={[styles.previewCard, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFF', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
            <Image source={{ uri: capturedUri }} style={styles.previewImage} />
            
            <View style={styles.previewMeta}>
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={16} color={colors.icon} />
                <Text style={[styles.timeLabel, { color: colors.icon }]}>
                  Captured: {capturedTime}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <Pressable 
              style={[styles.deleteBtn, { borderColor: '#FF3B30' }]} 
              onPress={handleDeletePhoto}
            >
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
              <Text style={styles.deleteBtnText}>Delete</Text>
            </Pressable>

            <Pressable 
              style={[styles.retakeBtn, { borderColor: colors.tint }]} 
              onPress={handleOpenCamera}
            >
              <Ionicons name="refresh-outline" size={18} color={colors.tint} />
              <Text style={[styles.retakeBtnText, { color: colors.tint }]}>Retake</Text>
            </Pressable>
          </View>

          <Pressable 
            style={[styles.attachButton, { backgroundColor: colors.tint }]} 
            onPress={handleAttachPhoto}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
            <Text style={styles.attachButtonText}>Attach to Active Survey</Text>
          </Pressable>
        </View>
      ) : (
        // Initial Empty State
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#F2FAFD' }]}>
            <Ionicons name="camera" size={54} color={colors.tint} />
          </View>
          <Text style={[styles.titleText, { color: colors.text }]}>Capture Site Photograph</Text>
          <Text style={[styles.subText, { color: colors.icon }]}>
            Snap high-quality images of structures, damages, or site surroundings to document in your survey draft.
          </Text>
          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.tint }]}
            onPress={handleOpenCamera}
          >
            <Ionicons name="camera-reverse" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.actionButtonText}>Open Camera</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  cameraOverlayContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  camCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraControls: {
    alignItems: 'center',
    marginBottom: 30,
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  captureBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  previewCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  previewImage: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  previewMeta: {
    padding: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
  },
  deleteBtnText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: 'bold',
  },
  retakeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retakeBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  attachButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
