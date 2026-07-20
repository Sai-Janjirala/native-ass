import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  Alert, 
  ScrollView 
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, useAppColorScheme } from '@/constants/theme';
import { useSurvey } from '@/context/SurveyContext';

export default function ClipboardScreen() {
  const colorScheme = useAppColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { draft, updateDraftField } = useSurvey();

  // Local state
  const [copiedText, setCopiedText] = useState('');
  const [mockSurveyId] = useState(`SURV-TEMP-${Date.now().toString().substring(5)}`);

  // Fetch clipboard string on mount
  useEffect(() => {
    checkClipboard();
  }, []);

  const checkClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    setCopiedText(text);
  };

  const handleCopyText = async (text, label) => {
    await Clipboard.setStringAsync(text);
    setCopiedText(text);
    Alert.alert('Copied to Clipboard', `Copied ${label}:\n"${text}"`);
  };

  const handleClearClipboard = async () => {
    await Clipboard.setStringAsync('');
    setCopiedText('');
    Alert.alert('Clipboard Cleared', 'The system clipboard has been cleared.');
  };

  const handlePasteNotes = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) {
      updateDraftField('notes', text);
      Alert.alert(
        'Text Pasted', 
        `Pasted text from clipboard into active survey draft notes:\n\n"${text}"`,
        [{ text: 'View Form', onPress: () => router.navigate('/?tab=1') }, { text: 'Dismiss' }]
      );
    } else {
      Alert.alert('Empty Clipboard', 'There is no text on the clipboard to paste.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scrollContainer, styles.contentShell]} showsVerticalScrollIndicator={false}>
        
        {/* Info Header */}
        <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#F5F9FC', borderColor: colorScheme === 'dark' ? '#2F3336' : '#D5E6F3' }]}>
          <Ionicons name="clipboard" size={32} color={colors.tint} style={{ marginBottom: 10 }} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Clipboard Manager API</Text>
          <Text style={[styles.cardSub, { color: colors.icon }]}>
            Use this panel to copy active inspection metadata or paste logs into your survey report.
          </Text>
        </View>

        {/* Copy Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Copy Survey Details</Text>
        
        <View style={[styles.actionBox, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
          
          {/* Copy Survey ID */}
          <View style={styles.actionItem}>
            <View style={styles.itemTextContainer}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Survey Template ID</Text>
              <Text style={[styles.itemVal, { color: colors.icon }]} numberOfLines={1}>{mockSurveyId}</Text>
            </View>
            <Pressable 
              style={[styles.copyBtn, { backgroundColor: colors.tint }]}
              onPress={() => handleCopyText(mockSurveyId, 'Survey ID')}
            >
              <Ionicons name="copy-outline" size={16} color="#FFF" />
              <Text style={styles.copyBtnText}>Copy</Text>
            </Pressable>
          </View>

          <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]} />

          {/* Copy Contact Phone Number */}
          <View style={styles.actionItem}>
            <View style={styles.itemTextContainer}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Linked Contact Number</Text>
              <Text style={[styles.itemVal, { color: draft.contact?.phoneNumber ? colors.icon : '#FF3B30' }]} numberOfLines={1}>
                {draft.contact?.phoneNumber ? `${draft.contact.name}: ${draft.contact.phoneNumber}` : 'No contact linked to survey'}
              </Text>
            </View>
            <Pressable 
              style={[styles.copyBtn, { backgroundColor: colors.tint, opacity: draft.contact?.phoneNumber ? 1 : 0.5 }]}
              onPress={() => draft.contact?.phoneNumber && handleCopyText(draft.contact.phoneNumber, 'Contact Number')}
              disabled={!draft.contact?.phoneNumber}
            >
              <Ionicons name="copy-outline" size={16} color="#FFF" />
              <Text style={styles.copyBtnText}>Copy</Text>
            </Pressable>
          </View>

          <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]} />

          {/* Copy Coordinates */}
          <View style={styles.actionItem}>
            <View style={styles.itemTextContainer}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>GPS Coordinates</Text>
              <Text style={[styles.itemVal, { color: draft.location ? colors.icon : '#FF3B30' }]} numberOfLines={1}>
                {draft.location 
                  ? `${draft.location.latitude.toFixed(5)}, ${draft.location.longitude.toFixed(5)}` 
                  : 'No coordinates linked to survey'}
              </Text>
            </View>
            <Pressable 
              style={[styles.copyBtn, { backgroundColor: colors.tint, opacity: draft.location ? 1 : 0.5 }]}
              onPress={() => {
                if (draft.location) {
                  const locStr = `${draft.location.latitude.toFixed(6)}, ${draft.location.longitude.toFixed(6)}`;
                  handleCopyText(locStr, 'Location Coordinates');
                }
              }}
              disabled={!draft.location}
            >
              <Ionicons name="copy-outline" size={16} color="#FFF" />
              <Text style={styles.copyBtnText}>Copy</Text>
            </Pressable>
          </View>
        </View>

        {/* Clipboard State / Paste Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>System Clipboard Status</Text>
        
        <View style={[styles.actionBox, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
          <Text style={[styles.label, { color: colors.text }]}>Current Clipboard Value:</Text>
          <View style={[styles.clipboardPreview, { backgroundColor: colorScheme === 'dark' ? '#151718' : '#F9FBFD', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
            <Text style={[styles.clipboardPreviewText, { color: copiedText ? colors.text : colors.icon }]}>
              {copiedText || 'Clipboard is empty or contains non-textual data.'}
            </Text>
          </View>

          <View style={styles.btnRow}>
            <Pressable 
              style={[styles.btnOutline, { borderColor: '#FF3B30' }]}
              onPress={handleClearClipboard}
            >
              <Ionicons name="trash-outline" size={16} color="#FF3B30" style={{ marginRight: 6 }} />
              <Text style={styles.btnOutlineTextDestructive}>Clear Clipboard</Text>
            </Pressable>

            <Pressable 
              style={[styles.btnPrimary, { backgroundColor: colors.tint }]}
              onPress={handlePasteNotes}
            >
              <Ionicons name="download-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.btnPrimaryText}>Paste to Survey Notes</Text>
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  contentShell: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSub: {
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 15,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemVal: {
    fontSize: 12,
    marginTop: 4,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  copyBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  clipboardPreview: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 60,
    justifyContent: 'center',
    marginBottom: 16,
  },
  clipboardPreviewText: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  btnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  btnOutline: {
    flex: 1,
    minWidth: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnOutlineTextDestructive: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: 'bold',
  },
  btnPrimary: {
    flex: 1.5,
    minWidth: 180,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnPrimaryText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
