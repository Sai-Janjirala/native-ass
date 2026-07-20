import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  Pressable, 
  Alert, 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Colors, useAppColorScheme } from '@/constants/theme';
import { useSurvey } from '@/context/SurveyContext';

export default function SurveyDetailModal() {
  const colorScheme = useAppColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { id } = useLocalSearchParams();
  const { surveys, deleteSurvey } = useSurvey();

  // Find the survey in history
  const survey = surveys.find((s) => s.id === id);

  if (!survey) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={[styles.title, { color: colors.text, marginTop: 16 }]}>Survey Not Found</Text>
        <Text style={[styles.desc, { color: colors.icon, marginTop: 8 }]}>
          The requested inspection report could not be found or has been deleted.
        </Text>
        <Pressable 
          style={[styles.closeBtn, { backgroundColor: colors.tint, marginTop: 24 }]}
          onPress={() => router.back()}
        >
          <Text style={styles.closeBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const getPriorityColor = (p) => {
    switch (p) {
      case 'High': return '#FF3B30';
      case 'Medium': return '#FF9500';
      case 'Low': return '#34C759';
      default: return colors.icon;
    }
  };

  const handleCopyText = async (text, label) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', `${label} copied to clipboard!`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Survey? 🗑️',
      'Are you sure you want to delete this survey record from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteSurvey(survey.id);
            router.back();
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Modal Header */}
      <View style={[styles.header, { borderBottomColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7' }]}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.surveyId, { color: colors.icon }]}>{survey.id}</Text>
          <Text style={[styles.siteNameHeader, { color: colors.text }]} numberOfLines={1}>{survey.siteName}</Text>
        </View>
        <Pressable 
          style={[styles.iconBtnClose, { backgroundColor: colorScheme === 'dark' ? '#18181B' : '#F4F4F5' }]} 
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContainer, styles.contentShell]} showsVerticalScrollIndicator={false}>
        {/* Priority and Date Row */}
        <View style={styles.metaRow}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(survey.priority) + '15' }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(survey.priority) }]}>
              {survey.priority} Priority
            </Text>
          </View>
          <View style={styles.dateMeta}>
            <Ionicons name="calendar-outline" size={16} color={colors.icon} />
            <Text style={[styles.dateText, { color: colors.text }]}>{survey.date}</Text>
          </View>
        </View>

        {/* Client details */}
        <View style={[styles.sectionCard, { backgroundColor: colorScheme === 'dark' ? '#18181B' : '#F4F4F5', borderColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7' }]}>
          <Text style={[styles.sectionLabel, { color: colors.icon }]}>Client Info 👤</Text>
          <Text style={[styles.sectionValueBold, { color: colors.text }]}>{survey.clientName}</Text>
          
          {survey.description ? (
            <View style={{ marginTop: 12 }}>
              <Text style={[styles.sectionLabel, { color: colors.icon }]}>Site Description 💬</Text>
              <Text style={[styles.sectionValue, { color: colors.text }]}>{survey.description}</Text>
            </View>
          ) : null}
        </View>

        {/* Photo Section */}
        <View style={styles.detailBlock}>
          <Text style={[styles.blockTitle, { color: colors.text }]}>Site Picture 📸</Text>
          {survey.photoUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: survey.photoUri }} style={styles.siteImage} />
              {survey.photoTime && (
                <Text style={[styles.photoTimeText, { color: colors.icon }]}>
                  Captured: {survey.photoTime}
                </Text>
              )}
            </View>
          ) : (
            <View style={[styles.emptyAttachment, { borderColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7' }]}>
              <Ionicons name="image-outline" size={24} color={colors.icon} />
              <Text style={[styles.emptyAttachmentText, { color: colors.icon }]}>No picture snapped yet 🤷</Text>
            </View>
          )}
        </View>

        {/* Location Section */}
        <View style={styles.detailBlock}>
          <Text style={[styles.blockTitle, { color: colors.text }]}>Coordinates 📍</Text>
          {survey.location ? (
            <View style={[styles.infoRowCard, { backgroundColor: colorScheme === 'dark' ? '#18181B' : '#FFF', borderColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7' }]}>
              <View style={styles.infoRowMeta}>
                <Ionicons name="location" size={20} color={colors.tint} />
                <View style={styles.infoRowTextContainer}>
                  <Text style={[styles.infoRowTitle, { color: colors.text }]}>
                    Lat: {survey.location.latitude.toFixed(6)}, Lon: {survey.location.longitude.toFixed(6)}
                  </Text>
                  <Text style={[styles.infoRowSub, { color: colors.icon }]}>
                    Accuracy: ±{survey.location.accuracy.toFixed(1)} meters
                  </Text>
                </View>
              </View>
              <Pressable 
                style={[styles.iconButtonSmall, { backgroundColor: colorScheme === 'dark' ? '#27272A' : '#F4F4F5' }]}
                onPress={() => {
                  const locStr = `${survey.location?.latitude.toFixed(6)}, ${survey.location?.longitude.toFixed(6)}`;
                  handleCopyText(locStr, 'Coordinates');
                }}
              >
                <Ionicons name="copy-outline" size={16} color={colors.text} />
              </Pressable>
            </View>
          ) : (
            <View style={[styles.emptyAttachment, { borderColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7' }]}>
              <Ionicons name="location-outline" size={24} color={colors.icon} />
              <Text style={[styles.emptyAttachmentText, { color: colors.icon }]}>No GPS signals linked yet 🧭</Text>
            </View>
          )}
        </View>

        {/* Contact Section */}
        <View style={styles.detailBlock}>
          <Text style={[styles.blockTitle, { color: colors.text }]}>Team Contact 👥</Text>
          {survey.contact ? (
            <View style={[styles.infoRowCard, { backgroundColor: colorScheme === 'dark' ? '#18181B' : '#FFF', borderColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7' }]}>
              <View style={styles.infoRowMeta}>
                <Ionicons name="person" size={20} color={colors.tint} />
                <View style={styles.infoRowTextContainer}>
                  <Text style={[styles.infoRowTitle, { color: colors.text }]}>{survey.contact.name}</Text>
                  <Text style={[styles.infoRowSub, { color: colors.icon }]}>
                    {survey.contact.phoneNumber || 'No phone number available'}
                  </Text>
                </View>
              </View>
              {survey.contact.phoneNumber ? (
                <Pressable 
                  style={[styles.iconButtonSmall, { backgroundColor: colorScheme === 'dark' ? '#27272A' : '#F4F4F5' }]}
                  onPress={() => handleCopyText(survey.contact.phoneNumber, 'Contact Number')}
                >
                  <Ionicons name="copy-outline" size={16} color={colors.text} />
                </Pressable>
              ) : null}
            </View>
          ) : (
            <View style={[styles.emptyAttachment, { borderColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7' }]}>
              <Ionicons name="person-outline" size={24} color={colors.icon} />
              <Text style={[styles.emptyAttachmentText, { color: colors.icon }]}>No buddy linked yet 👤</Text>
            </View>
          )}
        </View>

        {/* Notes Section */}
        <View style={styles.detailBlock}>
          <Text style={[styles.blockTitle, { color: colors.text }]}>Notes 📝</Text>
          <View style={[styles.notesBox, { backgroundColor: colorScheme === 'dark' ? '#18181B' : '#F4F4F5', borderColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7' }]}>
            <Text style={[styles.notesText, { color: survey.notes ? colors.text : colors.icon }]}>
              {survey.notes || 'No notes written yet ✍️'}
            </Text>
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Pressable 
            style={[styles.deleteButton, { backgroundColor: '#EF4444', borderColor: '#EF4444' }]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={[styles.deleteButtonText, { color: '#FFF' }]}>Delete Survey 🗑️</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 13,
    textAlign: 'center',
  },
  closeBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  header: {
    height: 64,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  surveyId: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  siteNameHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  iconBtnClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  contentShell: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionValueBold: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  sectionValue: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  detailBlock: {
    marginBottom: 20,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  photoContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  siteImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  photoTimeText: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '500',
  },
  emptyAttachment: {
    height: 70,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  emptyAttachmentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoRowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  infoRowTextContainer: {
    marginLeft: 12,
    flex: 1,
    minWidth: 0,
  },
  infoRowTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  infoRowSub: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  iconButtonSmall: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 80,
  },
  notesText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
    paddingTop: 16,
    marginTop: 10,
    alignItems: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
