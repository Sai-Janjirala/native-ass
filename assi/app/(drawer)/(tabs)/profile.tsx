import React from 'react';
import { View, StyleSheet, Text, ScrollView, useColorScheme, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useSurvey } from '@/context/SurveyContext';
import { CustomHeader } from '@/components/CustomHeader';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { surveys, todayCount } = useSurvey();

  const totalSurveys = surveys.length;
  const highPriorityCount = surveys.filter((s) => s.priority === 'High').length;
  const medPriorityCount = surveys.filter((s) => s.priority === 'Medium').length;
  const lowPriorityCount = surveys.filter((s) => s.priority === 'Low').length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Student Profile" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[
          styles.profileCard, 
          { 
            backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF',
            borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6'
          }
        ]}>
          <View style={[styles.avatarBig, { backgroundColor: colors.tint }]}>
            <Text style={styles.avatarBigText}>SJ</Text>
          </View>
          <Text style={[styles.studentName, { color: colors.text }]}>Sai Janjirala</Text>
          <Text style={[styles.studentSub, { color: colors.icon }]}>React Native Developer</Text>
          
          <View style={[styles.badge, { backgroundColor: colors.tint + '15' }]}>
            <Text style={[styles.badgeText, { color: colors.tint }]}>Roll: 2026-NATIVE-ASS</Text>
          </View>
        </View>

        {/* Project Details */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Assignment Information</Text>
        <View style={[
          styles.detailsBox, 
          { 
            backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF',
            borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6'
          }
        ]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>Course Name</Text>
            <Text style={[styles.detailVal, { color: colors.text }]}>React Native Mini Project</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>Project Title</Text>
            <Text style={[styles.detailVal, { color: colors.text }]}>Smart Field Survey App</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>Tech Stack</Text>
            <Text style={[styles.detailVal, { color: colors.text }]}>Expo, React Native, TypeScript</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>Completed Modules</Text>
            <Text style={[styles.detailVal, { color: colors.tint, fontWeight: '700' }]}>8 / 8 Modules</Text>
          </View>
        </View>

        {/* Survey Analytics */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Inspection Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
            <Ionicons name="document-text-outline" size={24} color={colors.tint} />
            <Text style={[styles.metricNum, { color: colors.text }]}>{totalSurveys}</Text>
            <Text style={[styles.metricLabel, { color: colors.icon }]}>Total Logged</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
            <Ionicons name="today-outline" size={24} color="#34C759" />
            <Text style={[styles.metricNum, { color: '#34C759' }]}>{todayCount}</Text>
            <Text style={[styles.metricLabel, { color: colors.icon }]}>Added Today</Text>
          </View>
        </View>

        <View style={[
          styles.breakdownBox, 
          { 
            backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF',
            borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6'
          }
        ]}>
          <Text style={[styles.breakdownTitle, { color: colors.text }]}>Priority Breakdown</Text>
          
          {/* High Priority Bar */}
          <View style={styles.progressRow}>
            <View style={styles.progressLabelRow}>
              <Text style={[styles.progressName, { color: colors.text }]}>High Priority</Text>
              <Text style={[styles.progressVal, { color: '#FF3B30' }]}>{highPriorityCount}</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colorScheme === 'dark' ? '#333' : '#eee' }]}>
              <View style={[
                styles.progressBarFill, 
                { 
                  backgroundColor: '#FF3B30', 
                  width: totalSurveys > 0 ? `${(highPriorityCount / totalSurveys) * 100}%` : '0%' 
                }
              ]} />
            </View>
          </View>

          {/* Medium Priority Bar */}
          <View style={styles.progressRow}>
            <View style={styles.progressLabelRow}>
              <Text style={[styles.progressName, { color: colors.text }]}>Medium Priority</Text>
              <Text style={[styles.progressVal, { color: '#FF9500' }]}>{medPriorityCount}</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colorScheme === 'dark' ? '#333' : '#eee' }]}>
              <View style={[
                styles.progressBarFill, 
                { 
                  backgroundColor: '#FF9500', 
                  width: totalSurveys > 0 ? `${(medPriorityCount / totalSurveys) * 100}%` : '0%' 
                }
              ]} />
            </View>
          </View>

          {/* Low Priority Bar */}
          <View style={styles.progressRow}>
            <View style={styles.progressLabelRow}>
              <Text style={[styles.progressName, { color: colors.text }]}>Low Priority</Text>
              <Text style={[styles.progressVal, { color: '#34C759' }]}>{lowPriorityCount}</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colorScheme === 'dark' ? '#333' : '#eee' }]}>
              <View style={[
                styles.progressBarFill, 
                { 
                  backgroundColor: '#34C759', 
                  width: totalSurveys > 0 ? `${(lowPriorityCount / totalSurveys) * 100}%` : '0%' 
                }
              ]} />
            </View>
          </View>
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
    paddingBottom: 32,
  },
  profileCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarBig: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarBigText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  studentSub: {
    fontSize: 14,
    marginTop: 2,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailsBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  metricNum: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  breakdownBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  progressRow: {
    marginBottom: 12,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressName: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
