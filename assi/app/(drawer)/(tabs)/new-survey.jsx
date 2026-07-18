import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TextInput, 
  Pressable, 
  useColorScheme, 
  Alert, 
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/theme';
import { useSurvey } from '@/context/SurveyContext';
import { CustomHeader } from '@/components/CustomHeader';



// Fallback seed contacts for picker modal
const mockContacts = [
  { id: '1', name: 'Rohan Sharma', phoneNumber: '+91 98765 43210', initials: 'RS' },
  { id: '2', name: 'Anjali Verma', phoneNumber: '+91 91234 56789', initials: 'AV' },
  { id: '3', name: 'Suresh Kumar', phoneNumber: '+91 88888 77777', initials: 'SK' },
  { id: '4', name: 'Amit Patel', phoneNumber: '+91 99999 88888', initials: 'AP' },
  { id: '5', name: 'Pooja Hegde', phoneNumber: undefined, initials: 'PH' },
  { id: '6', name: 'Vikram Singh', phoneNumber: '+91 77777 66666', initials: 'VS' },
];

export default function NewSurveyScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { draft, updateDraftField, submitSurvey, clearDraft } = useSurvey();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  // Navigation & Form States
  const [isPreview, setIsPreview] = useState(false);
  const [errors, setErrors] = useState({});

  // Inline Modal Overlay States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isGPSLocating, setIsGPSLocating] = useState(false);
  
  const [isContactsPickerOpen, setIsContactsPickerOpen] = useState(false);
  const [contactsList, setContactsList] = useState([]);
  const [contactsSearchQuery, setContactsSearchQuery] = useState('');
  const [contactsLoading, setContactsLoading] = useState(false);

  const cameraRef = React.useRef(null);

  // ==================== INLINE GPS RETRIEVAL ====================
  const handleGetGPS = async () => {
    try {
      setIsGPSLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== Location.PermissionStatus.GRANTED) {
        Alert.alert('Location Blocked', 'Please grant GPS permission in settings to fetch coordinates.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      updateDraftField('location', {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy || 0,
        timestamp: loc.timestamp,
      });

      Alert.alert('GPS Captured! 📍', 'GPS location has been linked to your survey.');
    } catch {
      Alert.alert('GPS Error', 'Unable to retrieve location coordinates. Make sure location is turned on.');
    } finally {
      setIsGPSLocating(false);
    }
  };

  // ==================== INLINE CAMERA CAPTURE ====================
  const handleOpenCameraModal = async () => {
    if (!cameraPermission || !cameraPermission.granted) {
      const { granted } = await requestCameraPermission();
      if (!granted) {
        Alert.alert('Camera Blocked', 'Please enable camera permissions to capture site photographs.');
        return;
      }
    }
    setIsCameraOpen(true);
  };

  const handleCapturePhoto = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        const options = { quality: 0.8, skipProcessing: false };
        const photo = await cameraRef.current.takePictureAsync(options);
        
        if (photo?.uri) {
          const timestamp = new Date().toLocaleString();
          updateDraftField('photoUri', photo.uri);
          updateDraftField('photoTime', timestamp);
          setIsCameraOpen(false);
        }
      } catch {
        Alert.alert('Camera Error', 'Could not capture picture.');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const handleDeletePhoto = () => {
    Alert.alert(
      'Trash Pic? 🗑️',
      'Are you sure you want to delete this captured photograph?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            updateDraftField('photoUri', undefined);
            updateDraftField('photoTime', undefined);
          }
        }
      ]
    );
  };

  // ==================== INLINE CONTACTS PICKER ====================
  const handleOpenContactsModal = async () => {
    setIsContactsPickerOpen(true);
    setContactsLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
        });
        if (data.length > 0) {
          const formatted = data.map((c) => {
            const phone = c.phoneNumbers?.[0]?.number;
            const initials = c.name
              ? c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
              : '?';
            return {
              id: c.id || Math.random().toString(),
              name: c.name || 'Unknown Buddy',
              phoneNumber: phone,
              initials,
            };
          });
          setContactsList(formatted);
        } else {
          setContactsList(mockContacts);
        }
      } else {
        setContactsList(mockContacts);
      }
    } catch {
      setContactsList(mockContacts);
    } finally {
      setContactsLoading(false);
    }
  };

  const handleSelectContact = (contact) => {
    updateDraftField('contact', {
      name: contact.name,
      phoneNumber: contact.phoneNumber,
    });
    setIsContactsPickerOpen(false);
    setContactsSearchQuery('');
  };

  // ==================== INLINE CLIPBOARD NOTES ====================
  const handlePasteClipboardNotes = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) {
      updateDraftField('notes', text);
      Alert.alert('Notes Pasted! 📝', 'Successfully pasted text from clipboard.');
    } else {
      Alert.alert('Empty Clipboard', 'There is no text on the system clipboard to paste.');
    }
  };

  const handlePrioritySelect = (priority) => {
    updateDraftField('priority', priority);
  };

  const validateForm = () => {
    const tempErrors = {};
    let isValid = true;

    if (!draft.siteName.trim()) {
      tempErrors.siteName = 'Site Name is required';
      isValid = false;
    }
    if (!draft.clientName.trim()) {
      tempErrors.clientName = 'Client Name is required';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleGoToPreview = () => {
    if (validateForm()) {
      setIsPreview(true);
    } else {
      Alert.alert('Incomplete Form', 'Please fill in the required fields (Site Name and Client Name).');
    }
  };

  const handleSubmit = () => {
    const result = submitSurvey();
    if (result.success) {
      Alert.alert(
        'Survey Logged! 🎉',
        `Survey ID: ${result.survey?.id} was successfully saved.`,
        [
          {
            text: 'Awesome',
            onPress: () => {
              setIsPreview(false);
              router.navigate('/(drawer)/(tabs)/history');
            }
          }
        ]
      );
    } else {
      Alert.alert('Error', result.error || 'Failed to submit.');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Wipe Draft? 🧹',
      'Are you sure you want to clear all inputs and attachments?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            clearDraft();
            setErrors({});
            setIsPreview(false);
          }
        }
      ]
    );
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'High': return '#FF3B30';
      case 'Medium': return '#FF9500';
      case 'Low': return '#34C759';
      default: return colors.icon;
    }
  };

  // Filter contacts based on search query in Contacts Modal
  const filteredContacts = contactsList.filter((c) =>
    c.name.toLowerCase().includes(contactsSearchQuery.toLowerCase()) ||
    (c.phoneNumber && c.phoneNumber.includes(contactsSearchQuery))
  );

  // ==================== RENDER PREVIEW MODE ====================
  if (isPreview) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CustomHeader title="Survey Preview 👀" showBack={false} />
        
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
            <View style={styles.previewHeader}>
              <Text style={[styles.previewTitle, { color: colors.text }]}>Survey Summary 👀</Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(draft.priority) + '15' }]}>
                <Text style={[styles.priorityText, { color: getPriorityColor(draft.priority) }]}>{draft.priority}</Text>
              </View>
            </View>

            {/* Field Details */}
            <View style={styles.previewGrid}>
              <View style={styles.previewRow}>
                <Text style={[styles.previewLabel, { color: colors.icon }]}>Site Name 🏢</Text>
                <Text style={[styles.previewValue, { color: colors.text }]}>{draft.siteName}</Text>
              </View>
              
              <View style={styles.previewRow}>
                <Text style={[styles.previewLabel, { color: colors.icon }]}>Client Name 👤</Text>
                <Text style={[styles.previewValue, { color: colors.text }]}>{draft.clientName}</Text>
              </View>

              <View style={styles.previewRow}>
                <Text style={[styles.previewLabel, { color: colors.icon }]}>Survey Date 📅</Text>
                <Text style={[styles.previewValue, { color: colors.text }]}>{draft.date}</Text>
              </View>

              {draft.description ? (
                <View style={styles.previewRow}>
                  <Text style={[styles.previewLabel, { color: colors.icon }]}>Description 💬</Text>
                  <Text style={[styles.previewValue, { color: colors.text }]}>{draft.description}</Text>
                </View>
              ) : null}
            </View>

            {/* Photo Attachment View */}
            <View style={[styles.attachmentPreview, { borderTopColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
              <Text style={[styles.attachmentTitle, { color: colors.text }]}>Attached Photo 📸</Text>
              {draft.photoUri ? (
                <View style={styles.photoContainer}>
                  <Image source={{ uri: draft.photoUri }} style={styles.previewImage} />
                  {draft.photoTime && (
                    <Text style={[styles.photoTimeText, { color: colors.icon }]}>
                      Captured: {draft.photoTime}
                    </Text>
                  )}
                </View>
              ) : (
                <Text style={[styles.noAttachmentText, { color: colors.icon }]}>No picture snapped yet 🤷</Text>
              )}
            </View>

            {/* Location Attachment View */}
            <View style={[styles.attachmentPreview, { borderTopColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
              <Text style={[styles.attachmentTitle, { color: colors.text }]}>Location Coordinates 📍</Text>
              {draft.location ? (
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={16} color={colors.tint} />
                  <View style={styles.locationTextContainer}>
                    <Text style={[styles.locationCoordinate, { color: colors.text }]}>
                      Lat: {draft.location.latitude.toFixed(6)}, Lon: {draft.location.longitude.toFixed(6)}
                    </Text>
                    <Text style={[styles.locationAccuracy, { color: colors.icon }]}>
                      Accuracy: {draft.location.accuracy.toFixed(1)} meters
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={[styles.noAttachmentText, { color: colors.icon }]}>No GPS coordinates linked yet 🧭</Text>
              )}
            </View>

            {/* Contact Attachment View */}
            <View style={[styles.attachmentPreview, { borderTopColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
              <Text style={[styles.attachmentTitle, { color: colors.text }]}>Linked Buddy 👥</Text>
              {draft.contact ? (
                <View style={styles.contactContainer}>
                  <Ionicons name="person" size={16} color={colors.tint} />
                  <Text style={[styles.contactName, { color: colors.text }]}>
                    {draft.contact.name} {draft.contact.phoneNumber ? `(${draft.contact.phoneNumber})` : ''}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.noAttachmentText, { color: colors.icon }]}>No buddy linked yet 👤</Text>
              )}
            </View>

            {/* Notes Attachment View */}
            <View style={[styles.attachmentPreview, { borderTopColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
              <Text style={[styles.attachmentTitle, { color: colors.text }]}>My Notes 📝</Text>
              {draft.notes ? (
                <Text style={[styles.previewValue, { color: colors.text }]}>{draft.notes}</Text>
              ) : (
                <Text style={[styles.noAttachmentText, { color: colors.icon }]}>No notes written yet ✍️</Text>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <Pressable 
              style={[styles.editButton, { borderColor: colors.tint }]}
              onPress={() => setIsPreview(false)}
            >
              <Text style={[styles.editButtonText, { color: colors.tint }]}>Fix Form ✍️</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.submitButton, { backgroundColor: colors.tint }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Log It! 🎉</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ==================== RENDER FORM EDIT MODE ====================
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Start a Survey 📝" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Form Fields */}
        <View style={[styles.formContainer, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
          
          {/* Site Name Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Site Name 🏢 *</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  color: colors.text,
                  backgroundColor: colorScheme === 'dark' ? '#151718' : '#F9FBFD',
                  borderColor: errors.siteName ? '#FF3B30' : (colorScheme === 'dark' ? '#2F3336' : '#EAF0F6')
                }
              ]}
              placeholder="Enter site name"
              placeholderTextColor={colors.icon}
              value={draft.siteName}
              onChangeText={(text) => {
                updateDraftField('siteName', text);
                if (text) setErrors(prev => ({ ...prev, siteName: undefined }));
              }}
            />
            {errors.siteName && <Text style={styles.errorText}>{errors.siteName}</Text>}
          </View>

          {/* Client Name Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Client Name 👤 *</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  color: colors.text,
                  backgroundColor: colorScheme === 'dark' ? '#151718' : '#F9FBFD',
                  borderColor: errors.clientName ? '#FF3B30' : (colorScheme === 'dark' ? '#2F3336' : '#EAF0F6')
                }
              ]}
              placeholder="Enter client organization"
              placeholderTextColor={colors.icon}
              value={draft.clientName}
              onChangeText={(text) => {
                updateDraftField('clientName', text);
                if (text) setErrors(prev => ({ ...prev, clientName: undefined }));
              }}
            />
            {errors.clientName && <Text style={styles.errorText}>{errors.clientName}</Text>}
          </View>

          {/* Priority selector */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>How Important? 🔥</Text>
            <View style={styles.priorityRow}>
              {(['Low', 'Medium', 'High']).map((p) => {
                const isSelected = draft.priority === p;
                const pColor = getPriorityColor(p);
                return (
                  <Pressable
                    key={p}
                    style={[
                      styles.priorityBtn,
                      { 
                        backgroundColor: isSelected ? pColor : (colorScheme === 'dark' ? '#151718' : '#F9FBFD'),
                        borderColor: isSelected ? pColor : (colorScheme === 'dark' ? '#2F3336' : '#EAF0F6'),
                      }
                    ]}
                    onPress={() => handlePrioritySelect(p)}
                  >
                    <Text style={[
                      styles.priorityBtnText, 
                      { color: isSelected ? '#FFF' : colors.text }
                    ]}>
                      {p}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Survey Date */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Date of Survey 📅</Text>
            <View style={styles.dateInputWrapper}>
              <TextInput
                style={[
                  styles.textInput, 
                  { 
                    flex: 1,
                    color: colors.text,
                    backgroundColor: colorScheme === 'dark' ? '#151718' : '#F9FBFD',
                    borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6'
                  }
                ]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.icon}
                value={draft.date}
                onChangeText={(text) => updateDraftField('date', text)}
              />
              <Pressable
                style={[styles.dateTodayBtn, { backgroundColor: colors.tint }]}
                onPress={() => updateDraftField('date', new Date().toISOString().split('T')[0])}
              >
                <Text style={styles.dateTodayBtnText}>Today</Text>
              </Pressable>
            </View>
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Tell me about the site 💬</Text>
            <TextInput
              style={[
                styles.textInput, 
                styles.textArea,
                { 
                  color: colors.text,
                  backgroundColor: colorScheme === 'dark' ? '#151718' : '#F9FBFD',
                  borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6'
                }
              ]}
              placeholder="Describe the site, structure type, and scope of inspection..."
              placeholderTextColor={colors.icon}
              value={draft.description}
              onChangeText={(text) => updateDraftField('description', text)}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Notes Input */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: colors.text }]}>My personal notes 📝</Text>
              <Pressable 
                style={styles.inlinePasteBtn} 
                onPress={handlePasteClipboardNotes}
              >
                <Ionicons name="clipboard" size={14} color={colors.tint} style={{ marginRight: 4 }} />
                <Text style={[styles.notesPasteLink, { color: colors.tint }]}>Quick Paste 📋</Text>
              </Pressable>
            </View>
            <TextInput
              style={[
                styles.textInput, 
                styles.textArea,
                { 
                  color: colors.text,
                  backgroundColor: colorScheme === 'dark' ? '#151718' : '#F9FBFD',
                  borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6'
                }
              ]}
              placeholder="Enter notes manually or tap Quick Paste..."
              placeholderTextColor={colors.icon}
              value={draft.notes}
              onChangeText={(text) => updateDraftField('notes', text)}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Attachment Status Section */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 10 }]}>Cool Attachments 📎</Text>
        
        <View style={[styles.formContainer, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
          
          {/* Photo Attachment Status */}
          <View style={styles.attachmentItem}>
            <View style={styles.attachmentMeta}>
              <Ionicons 
                name={draft.photoUri ? "checkmark-circle" : "image-outline"} 
                size={22} 
                color={draft.photoUri ? "#34C759" : colors.icon} 
              />
              <View style={styles.attachmentText}>
                <Text style={[styles.attachmentName, { color: colors.text }]}>Photo 📸</Text>
                {draft.photoUri ? (
                  <View style={styles.attachedImageWrapper}>
                    <Image source={{ uri: draft.photoUri }} style={styles.inlineAttachedThumbnail} />
                    <Pressable style={styles.removeImageBtn} onPress={handleDeletePhoto}>
                      <Ionicons name="close-circle" size={18} color="#FF3B30" />
                    </Pressable>
                  </View>
                ) : (
                  <Text style={[styles.attachmentDesc, { color: colors.icon }]}>No picture snapped yet</Text>
                )}
              </View>
            </View>
            <Pressable 
              style={[styles.attachBtn, { borderColor: colors.tint }]}
              onPress={handleOpenCameraModal}
            >
              <Text style={[styles.attachBtnText, { color: colors.tint }]}>
                {draft.photoUri ? 'Retake' : 'Open Camera'}
              </Text>
            </Pressable>
          </View>

          <View style={[styles.innerDivider, { backgroundColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]} />

          {/* Location Attachment Status */}
          <View style={styles.attachmentItem}>
            <View style={styles.attachmentMeta}>
              {isGPSLocating ? (
                <ActivityIndicator size="small" color={colors.tint} />
              ) : (
                <Ionicons 
                  name={draft.location ? "checkmark-circle" : "location-outline"} 
                  size={22} 
                  color={draft.location ? "#34C759" : colors.icon} 
                />
              )}
              <View style={styles.attachmentText}>
                <Text style={[styles.attachmentName, { color: colors.text }]}>GPS Location 📍</Text>
                <Text style={[styles.attachmentDesc, { color: colors.icon }]}>
                  {draft.location ? `${draft.location.latitude.toFixed(5)}, ${draft.location.longitude.toFixed(5)}` : 'No coordinates linked'}
                </Text>
              </View>
            </View>
            <Pressable 
              style={[styles.attachBtn, { borderColor: colors.tint, opacity: isGPSLocating ? 0.6 : 1 }]}
              onPress={handleGetGPS}
              disabled={isGPSLocating}
            >
              <Text style={[styles.attachBtnText, { color: colors.tint }]}>
                {draft.location ? 'Update' : 'Get GPS'}
              </Text>
            </Pressable>
          </View>

          <View style={[styles.innerDivider, { backgroundColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]} />

          {/* Contact Attachment Status */}
          <View style={styles.attachmentItem}>
            <View style={styles.attachmentMeta}>
              <Ionicons 
                name={draft.contact ? "checkmark-circle" : "person-outline"} 
                size={22} 
                color={draft.contact ? "#34C759" : colors.icon} 
              />
              <View style={styles.attachmentText}>
                <Text style={[styles.attachmentName, { color: colors.text }]}>Linked Buddy 👥</Text>
                <Text style={[styles.attachmentDesc, { color: colors.icon }]}>
                  {draft.contact ? `${draft.contact.name}` : 'No buddy linked'}
                </Text>
              </View>
            </View>
            <Pressable 
              style={[styles.attachBtn, { borderColor: colors.tint }]}
              onPress={handleOpenContactsModal}
            >
              <Text style={[styles.attachBtnText, { color: colors.tint }]}>
                {draft.contact ? 'Change' : 'Select'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <Pressable 
            style={[styles.resetBtn, { borderColor: '#FF3B30' }]}
            onPress={handleReset}
          >
            <Text style={styles.resetBtnText}>Wipe Draft 🧹</Text>
          </Pressable>

          <Pressable 
            style={[styles.previewBtn, { backgroundColor: colors.tint }]}
            onPress={handleGoToPreview}
          >
            <Text style={styles.previewBtnText}>See Preview 👀</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ==================== INLINE CAMERA OVERLAY MODAL ==================== */}
      <Modal visible={isCameraOpen} animationType="slide" transparent={false}>
        <SafeAreaView style={[styles.modalScreenContainer, { backgroundColor: '#000' }]}>
          <CameraView style={StyleSheet.absoluteFillObject} ref={cameraRef}>
            <View style={styles.cameraOverlayContainer}>
              <View style={styles.cameraHeader}>
                <Pressable 
                  style={styles.camCloseBtn}
                  onPress={() => setIsCameraOpen(false)}
                >
                  <Ionicons name="close" size={26} color="#FFF" />
                </Pressable>
              </View>

              <View style={styles.cameraControls}>
                {isCapturing ? (
                  <ActivityIndicator size="large" color="#FFF" />
                ) : (
                  <Pressable style={styles.captureBtn} onPress={handleCapturePhoto}>
                    <View style={styles.captureBtnInner} />
                  </Pressable>
                )}
              </View>
            </View>
          </CameraView>
        </SafeAreaView>
      </Modal>

      {/* ==================== INLINE CONTACTS PICKER MODAL ==================== */}
      <Modal visible={isContactsPickerOpen} animationType="slide">
        <SafeAreaView style={[styles.modalScreenContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalHeaderTitle, { color: colors.text }]}>Choose a Buddy 👥</Text>
            <Pressable 
              style={[styles.iconButtonSmall, { backgroundColor: colorScheme === 'dark' ? '#2F3336' : '#F5F5F5' }]}
              onPress={() => {
                setIsContactsPickerOpen(false);
                setContactsSearchQuery('');
              }}
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </Pressable>
          </View>

          <View style={styles.modalContent}>
            {/* Search Input */}
            <View style={[
              styles.contactsSearchBox, 
              { 
                backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#F5F5F5',
                borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6'
              }
            ]}>
              <Ionicons name="search" size={18} color={colors.icon} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.contactsSearchInput, { color: colors.text }]}
                placeholder="Search buddies..."
                placeholderTextColor={colors.icon}
                value={contactsSearchQuery}
                onChangeText={setContactsSearchQuery}
              />
            </View>

            {contactsLoading ? (
              <View style={styles.centerModalContainer}>
                <ActivityIndicator size="large" color={colors.tint} />
                <Text style={[styles.modalLoadingText, { color: colors.icon }]}>Loading address book...</Text>
              </View>
            ) : filteredContacts.length === 0 ? (
              <View style={styles.centerModalContainer}>
                <Ionicons name="people-outline" size={48} color={colors.icon} />
                <Text style={[styles.modalEmptyText, { color: colors.text }]}>No contacts found</Text>
              </View>
            ) : (
              <FlatList
                data={filteredContacts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.contactsList}
                renderItem={({ item }) => (
                  <Pressable 
                    style={[
                      styles.contactPickerItem,
                      { 
                        backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF',
                        borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6'
                      }
                    ]}
                    onPress={() => handleSelectContact(item)}
                  >
                    <View style={[styles.avatarCircle, { backgroundColor: colors.tint + '15' }]}>
                      <Text style={[styles.avatarText, { color: colors.tint }]}>{item.initials}</Text>
                    </View>
                    <View style={styles.contactPickerMeta}>
                      <Text style={[styles.contactPickerName, { color: colors.text }]}>{item.name}</Text>
                      <Text style={[styles.contactPickerPhone, { color: colors.icon }]}>
                        {item.phoneNumber || 'No Number'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.icon} />
                  </Pressable>
                )}
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  formContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inlinePasteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesPasteLink: {
    fontSize: 12,
    fontWeight: '600',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  dateInputWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  dateTodayBtn: {
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTodayBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  priorityBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  attachmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  attachmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  attachmentText: {
    marginLeft: 12,
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '700',
  },
  attachmentDesc: {
    fontSize: 12,
    marginTop: 1,
  },
  attachedImageWrapper: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inlineAttachedThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  removeImageBtn: {
    padding: 4,
  },
  attachBtn: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  attachBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  innerDivider: {
    height: 1,
    marginVertical: 4,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  resetBtn: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: 'bold',
  },
  previewBtn: {
    flex: 2.5,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // ==================== PREVIEW MODE STYLES ====================
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  previewGrid: {
    marginBottom: 10,
  },
  previewRow: {
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  previewValue: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  attachmentPreview: {
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 14,
  },
  attachmentTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  photoContainer: {
    marginTop: 4,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  photoTimeText: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '500',
  },
  noAttachmentText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationCoordinate: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationAccuracy: {
    fontSize: 11,
    marginTop: 2,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1.2,
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // ==================== INLINE MODALS STYLES ====================
  modalScreenContainer: {
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
  modalHeader: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconButtonSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  contactsSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  contactsSearchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  centerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLoadingText: {
    fontSize: 13,
    marginTop: 10,
  },
  modalEmptyText: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  contactsList: {
    paddingBottom: 24,
  },
  contactPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  contactPickerMeta: {
    marginLeft: 12,
    flex: 1,
  },
  contactPickerName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  contactPickerPhone: {
    fontSize: 11,
    marginTop: 2,
  },
});
