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
  Image
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useSurvey } from '@/context/SurveyContext';
import { CustomHeader } from '@/components/CustomHeader';

export default function NewSurveyScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { draft, updateDraftField, submitSurvey, clearDraft } = useSurvey();
  
  // Local UI States
  const [isPreview, setIsPreview] = useState(false);
  const [errors, setErrors] = useState<{ siteName?: string; clientName?: string }>({});

  const handlePrioritySelect = (priority: 'High' | 'Medium' | 'Low') => {
    updateDraftField('priority', priority);
  };

  const validateForm = () => {
    const tempErrors: { siteName?: string; clientName?: string } = {};
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
      Alert.alert('Validation Failed', 'Please fill in all required fields (Site Name and Client Name).');
    }
  };

  const handleSubmit = () => {
    const result = submitSurvey();
    if (result.success) {
      Alert.alert(
        'Survey Submitted',
        `Survey ID: ${result.survey?.id} was successfully saved.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setIsPreview(false);
              router.navigate('/(drawer)/(tabs)/history');
            }
          }
        ]
      );
    } else {
      Alert.alert('Error', result.error || 'Failed to submit survey.');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Draft',
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

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return '#FF3B30';
      case 'Medium': return '#FF9500';
      case 'Low': return '#34C759';
      default: return colors.icon;
    }
  };

  // ==================== RENDER PREVIEW MODE ====================
  if (isPreview) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CustomHeader title="Survey Preview" showBack={false} />
        
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
            <View style={styles.previewHeader}>
              <Text style={[styles.previewTitle, { color: colors.text }]}>Inspection Record Summary</Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(draft.priority) + '15' }]}>
                <Text style={[styles.priorityText, { color: getPriorityColor(draft.priority) }]}>{draft.priority}</Text>
              </View>
            </View>

            {/* Field Details */}
            <View style={styles.previewGrid}>
              <View style={styles.previewRow}>
                <Text style={[styles.previewLabel, { color: colors.icon }]}>Site Name</Text>
                <Text style={[styles.previewValue, { color: colors.text }]}>{draft.siteName}</Text>
              </View>
              
              <View style={styles.previewRow}>
                <Text style={[styles.previewLabel, { color: colors.icon }]}>Client Name</Text>
                <Text style={[styles.previewValue, { color: colors.text }]}>{draft.clientName}</Text>
              </View>

              <View style={styles.previewRow}>
                <Text style={[styles.previewLabel, { color: colors.icon }]}>Survey Date</Text>
                <Text style={[styles.previewValue, { color: colors.text }]}>{draft.date}</Text>
              </View>

              {draft.description ? (
                <View style={styles.previewRow}>
                  <Text style={[styles.previewLabel, { color: colors.icon }]}>Description</Text>
                  <Text style={[styles.previewValue, { color: colors.text }]}>{draft.description}</Text>
                </View>
              ) : null}
            </View>

            {/* Photo Attachment View */}
            <View style={[styles.attachmentPreview, { borderTopColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
              <Text style={[styles.attachmentTitle, { color: colors.text }]}>Attached Photo</Text>
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
                <Text style={[styles.noAttachmentText, { color: colors.icon }]}>No photo attached</Text>
              )}
            </View>

            {/* Location Attachment View */}
            <View style={[styles.attachmentPreview, { borderTopColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
              <Text style={[styles.attachmentTitle, { color: colors.text }]}>Location Coordinates</Text>
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
                <Text style={[styles.noAttachmentText, { color: colors.icon }]}>No coordinates attached</Text>
              )}
            </View>

            {/* Contact Attachment View */}
            <View style={[styles.attachmentPreview, { borderTopColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
              <Text style={[styles.attachmentTitle, { color: colors.text }]}>Linked Contact</Text>
              {draft.contact ? (
                <View style={styles.contactContainer}>
                  <Ionicons name="person" size={16} color={colors.tint} />
                  <Text style={[styles.contactName, { color: colors.text }]}>
                    {draft.contact.name} {draft.contact.phoneNumber ? `(${draft.contact.phoneNumber})` : ''}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.noAttachmentText, { color: colors.icon }]}>No contact linked</Text>
              )}
            </View>

            {/* Notes Attachment View */}
            <View style={[styles.attachmentPreview, { borderTopColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
              <Text style={[styles.attachmentTitle, { color: colors.text }]}>Inspector Notes</Text>
              {draft.notes ? (
                <Text style={[styles.previewValue, { color: colors.text }]}>{draft.notes}</Text>
              ) : (
                <Text style={[styles.noAttachmentText, { color: colors.icon }]}>No notes provided</Text>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <Pressable 
              style={[styles.editButton, { borderColor: colors.tint }]}
              onPress={() => setIsPreview(false)}
            >
              <Text style={[styles.editButtonText, { color: colors.tint }]}>Edit Form</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.submitButton, { backgroundColor: colors.tint }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Survey</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ==================== RENDER FORM EDIT MODE ====================
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="New Inspection Survey" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Form Fields */}
        <View style={[styles.formContainer, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
          
          {/* Site Name Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Site Name *</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  color: colors.text,
                  backgroundColor: colorScheme === 'dark' ? '#151718' : '#F9FBFD',
                  borderColor: errors.siteName ? '#FF3B30' : (colorScheme === 'dark' ? '#2F3336' : '#EAF0F6')
                }
              ]}
              placeholder="Enter site / installation name"
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
            <Text style={[styles.label, { color: colors.text }]}>Client Name *</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  color: colors.text,
                  backgroundColor: colorScheme === 'dark' ? '#151718' : '#F9FBFD',
                  borderColor: errors.clientName ? '#FF3B30' : (colorScheme === 'dark' ? '#2F3336' : '#EAF0F6')
                }
              ]}
              placeholder="Enter client company/organization"
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
            <Text style={[styles.label, { color: colors.text }]}>Priority Level</Text>
            <View style={styles.priorityRow}>
              {(['Low', 'Medium', 'High'] as const).map((p) => {
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
            <Text style={[styles.label, { color: colors.text }]}>Survey Date (YYYY-MM-DD)</Text>
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
            <Text style={[styles.label, { color: colors.text }]}>Site Description</Text>
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
              <Text style={[styles.label, { color: colors.text }]}>Inspector Notes</Text>
              <Pressable onPress={() => router.navigate('/(drawer)/clipboard')}>
                <Text style={[styles.notesPasteLink, { color: colors.tint }]}>Go to Clipboard</Text>
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
              placeholder="Enter notes manually or paste them from the Clipboard API tool..."
              placeholderTextColor={colors.icon}
              value={draft.notes}
              onChangeText={(text) => updateDraftField('notes', text)}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Attachment Status Section */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 10 }]}>Survey Attachments</Text>
        
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
                <Text style={[styles.attachmentName, { color: colors.text }]}>Site Photograph</Text>
                <Text style={[styles.attachmentDesc, { color: colors.icon }]}>
                  {draft.photoUri ? `Attached (${draft.photoTime})` : 'No photograph linked'}
                </Text>
              </View>
            </View>
            <Pressable 
              style={[styles.attachBtn, { borderColor: colors.tint }]}
              onPress={() => router.navigate('/(drawer)/camera')}
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
              <Ionicons 
                name={draft.location ? "checkmark-circle" : "location-outline"} 
                size={22} 
                color={draft.location ? "#34C759" : colors.icon} 
              />
              <View style={styles.attachmentText}>
                <Text style={[styles.attachmentName, { color: colors.text }]}>GPS Coordinates</Text>
                <Text style={[styles.attachmentDesc, { color: colors.icon }]}>
                  {draft.location ? `${draft.location.latitude.toFixed(4)}, ${draft.location.longitude.toFixed(4)}` : 'No coordinates linked'}
                </Text>
              </View>
            </View>
            <Pressable 
              style={[styles.attachBtn, { borderColor: colors.tint }]}
              onPress={() => router.navigate('/(drawer)/location')}
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
                <Text style={[styles.attachmentName, { color: colors.text }]}>Linked Contact</Text>
                <Text style={[styles.attachmentDesc, { color: colors.icon }]}>
                  {draft.contact ? `${draft.contact.name}` : 'No contact linked'}
                </Text>
              </View>
            </View>
            <Pressable 
              style={[styles.attachBtn, { borderColor: colors.tint }]}
              onPress={() => router.navigate('/(drawer)/contacts')}
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
            <Text style={styles.resetBtnText}>Reset Draft</Text>
          </Pressable>

          <Pressable 
            style={[styles.previewBtn, { backgroundColor: colors.tint }]}
            onPress={handleGoToPreview}
          >
            <Text style={styles.previewBtnText}>Preview Survey</Text>
          </Pressable>
        </View>
      </ScrollView>
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
});
