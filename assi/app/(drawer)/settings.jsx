import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  Alert, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, useAppColorScheme } from '@/constants/theme';
import { useSurvey } from '@/context/SurveyContext';

export default function SettingsScreen() {
  const colorScheme = useAppColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { surveys, deleteSurvey } = useSurvey();

  const handleClearAllData = () => {
    Alert.alert(
      'Danger! Delete All? 🧨',
      'This will erase all submitted surveys in your inspection history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            // Context has surveys state. We can delete it. 
            // Wait, we need to make sure we clear the data. We can access context.
            // Let's look at what context actions we have: surveys state is mutable or we can reload?
            // In context, we have a deleteSurvey function, but let's check: we can delete individually.
            // Let's clear individually or we can add a clearAll function in context or just call delete on all.
            // Since we want to clear all, let's trigger delete on all of them, or let's look: we can delete one by one.
            surveys.forEach(s => {
              // We can delete
            });
            // Let's see: since context manages state, we should have added a clearAll, but we can do a loop or clear draft.
            // Wait, we can implement clearAll or just delete them. Let's look at SurveyContext.tsx:
            // Oh, we can just run deleteSurvey for each survey ID! That's very easy:
            surveys.forEach(s => deleteSurvey(s.id));
            Alert.alert('Data Cleared', 'All survey records have been cleared from memory.');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={[styles.scrollContainer, styles.contentShell]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>App Settings ⚙️</Text>
      
      <View style={[styles.box, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
        
        {/* Theme Status */}
        <View style={styles.row}>
          <View style={styles.meta}>
            <Ionicons name="color-palette-outline" size={22} color={colors.tint} />
            <View style={styles.textBlock}>
              <Text style={[styles.title, { color: colors.text }]}>System Vibe 🎨</Text>
              <Text style={[styles.desc, { color: colors.icon }]}>
                Currently running in {colorScheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]} />

        {/* Clear Data Option */}
        <Pressable 
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          onPress={handleClearAllData}
        >
          <View style={styles.meta}>
            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
            <View style={styles.textBlock}>
              <Text style={[styles.title, { color: '#FF3B30' }]}>Wipe All Surveys 🗑️</Text>
              <Text style={[styles.desc, { color: colors.icon }]}>
                Delete all surveys forever ({surveys.length} records)
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.icon} />
        </Pressable>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Assignment Information</Text>
      <View style={[styles.box, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.icon }]}>Student Name</Text>
          <Text style={[styles.infoVal, { color: colors.text }]}>Sai Janjirala</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]} />
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.icon }]}>Roll Number</Text>
          <Text style={[styles.infoVal, { color: colors.text }]}>2026-NATIVE-ASS</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]} />
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.icon }]}>Submission Date</Text>
          <Text style={[styles.infoVal, { color: colors.text }]}>July 18, 2026</Text>
        </View>
      </View>
      
      <Text style={[styles.footerText, { color: colors.icon }]}>
        Smart Field Survey and Inspection App developed for Mobile Application Development coursework.
      </Text>
    </ScrollView>
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
  contentShell: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  box: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  pressed: {
    opacity: 0.7,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  textBlock: {
    marginLeft: 14,
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  desc: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  footerText: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
});
