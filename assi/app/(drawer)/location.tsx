import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  Alert, 
  ActivityIndicator, 
  useColorScheme 
} from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useSurvey } from '@/context/SurveyContext';

export default function LocationScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { updateDraftField } = useSurvey();

  // Local state
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);

  // Check and fetch location on component mount
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { status } = await Location.getForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status === Location.PermissionStatus.GRANTED) {
        await fetchLocation();
      } else {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleRequestPermission = async () => {
    setIsLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status);
    
    if (status === Location.PermissionStatus.GRANTED) {
      await fetchLocation();
    } else {
      setIsLoading(false);
      setErrorMsg('Permission to access location was denied');
    }
  };

  const fetchLocation = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      
      // Get current location
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc);
    } catch (error) {
      setErrorMsg('Error fetching current location. Make sure GPS is enabled.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLocation = async () => {
    if (location) {
      const lat = location.coords.latitude.toFixed(6);
      const lon = location.coords.longitude.toFixed(6);
      const textToCopy = `Lat: ${lat}, Lon: ${lon} (Acc: ${location.coords.accuracy?.toFixed(1) || 0}m)`;
      
      await Clipboard.setStringAsync(textToCopy);
      Alert.alert(
        'Coordinates Copied',
        `Success! Location has been copied to your clipboard:\n\n${textToCopy}`
      );
    } else {
      Alert.alert('No Location', 'Please retrieve location coordinates before copying.');
    }
  };

  const handleAttachLocation = () => {
    if (location) {
      updateDraftField('location', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        timestamp: location.timestamp,
      });
      Alert.alert(
        'GPS Linked',
        'Coordinates successfully attached to your active survey draft.',
        [{ text: 'OK', onPress: () => router.navigate('/(drawer)/(tabs)/new-survey') }]
      );
    }
  };

  // Render Loader
  if (isLoading && !location) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.infoText, { color: colors.icon, marginTop: 12 }]}>
          Acquiring satellite GPS signals...
        </Text>
      </View>
    );
  }

  // Render Permission Required State
  if (permissionStatus !== Location.PermissionStatus.GRANTED) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background, padding: 24 }]}>
        <Ionicons name="location-outline" size={64} color={colors.icon} />
        <Text style={[styles.titleText, { color: colors.text, marginTop: 16 }]}>
          Location Access Required
        </Text>
        <Text style={[styles.subText, { color: colors.icon, marginTop: 8 }]}>
          To capture coordinates for survey reports, please enable foreground location permissions.
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Radar Icon visual */}
        <View style={styles.visualContainer}>
          <View style={[styles.radarCircleOuter, { borderColor: colors.tint + '30' }]}>
            <View style={[styles.radarCircleInner, { backgroundColor: colors.tint + '15' }]}>
              {isLoading ? (
                <ActivityIndicator size="large" color={colors.tint} />
              ) : (
                <Ionicons name="locate" size={44} color={colors.tint} />
              )}
            </View>
          </View>
        </View>

        {/* Info Box */}
        <View style={[styles.infoCard, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
          {errorMsg ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning-outline" size={24} color="#FF3B30" />
              <Text style={[styles.errorText, { color: '#FF3B30' }]}>{errorMsg}</Text>
            </View>
          ) : location ? (
            <View style={styles.grid}>
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.icon }]}>Latitude</Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {location.coords.latitude.toFixed(6)}°
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]} />
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.icon }]}>Longitude</Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {location.coords.longitude.toFixed(6)}°
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]} />
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.icon }]}>GPS Accuracy</Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  ±{location.coords.accuracy?.toFixed(1) || 0} meters
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]} />
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.icon }]}>Acquired At</Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {new Date(location.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.warningText, { color: colors.text }]}>
              {"GPS Coordinates not yet retrieved. Tap 'Refresh GPS' below."}
            </Text>
          )}
        </View>

        {/* Buttons */}
        <View style={styles.actionsContainer}>
          <View style={styles.rowButtons}>
            <Pressable 
              style={[styles.btnOutline, { borderColor: colors.tint }]} 
              onPress={fetchLocation}
              disabled={isLoading}
            >
              <Ionicons name="sync" size={18} color={colors.tint} style={{ marginRight: 6 }} />
              <Text style={[styles.btnOutlineText, { color: colors.tint }]}>Refresh GPS</Text>
            </Pressable>

            <Pressable 
              style={[styles.btnOutline, { borderColor: colors.tint }]} 
              onPress={handleCopyLocation}
            >
              <Ionicons name="copy-outline" size={18} color={colors.tint} style={{ marginRight: 6 }} />
              <Text style={[styles.btnOutlineText, { color: colors.tint }]}>Copy Text</Text>
            </Pressable>
          </View>

          <Pressable 
            style={[styles.btnPrimary, { backgroundColor: colors.tint, opacity: location ? 1 : 0.6 }]} 
            onPress={handleAttachLocation}
            disabled={!location}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.btnPrimaryText}>Attach to Active Survey</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  radarCircleOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarCircleInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  grid: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
  },
  actionsContainer: {
    gap: 12,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  btnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnOutlineText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  btnPrimaryText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
  },
  warningText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
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
