import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, useAppColorScheme } from '@/constants/theme';
import { useSurvey } from '@/context/SurveyContext';
import { CustomHeader } from '@/components/CustomHeader';

export default function ProfileScreen() {
  const colorScheme = useAppColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { surveys, todayCount } = useSurvey();

  const totalSurveys = surveys.length;
  const highPriorityCount = surveys.filter((s) => s.priority === 'High').length;
  const medPriorityCount = surveys.filter((s) => s.priority === 'Medium').length;
  const lowPriorityCount = surveys.filter((s) => s.priority === 'Low').length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="My Profile 🤠" />
      <ScrollView contentContainerStyle={[styles.scrollContainer, styles.contentShell]} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[
          styles.profileCard, 
          { 
            backgroundColor: colors.surface,
            borderColor: colors.surfaceBorder,
          }
        ]}>
          <View style={[styles.avatarBig, { borderColor: colors.primary }]}> 
            <Image 
              source={{ uri: 'https://avatars.githubusercontent.com/u/224969012?v=4&size=64' }} 
              style={styles.avatarBigImage} 
            />
          </View>
          <Text style={[styles.studentName, { color: colors.text }]}>Sai Janjirala</Text>
          <Text style={[styles.studentSub, { color: colors.icon }]}>React Native Developer</Text>
          
          <View style={[styles.badge, { backgroundColor: colors.pillBg }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>ID: 2026-NATIVE-ASS</Text>
          </View>
        </View>

        {/* Survey Analytics */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>My Stats 📊</Text>
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <View style={[styles.metricIconBox, { backgroundColor: colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)' }]}>
              <Ionicons name="document-text-outline" size={22} color={colors.primary} />
            </View>
            <Text style={[styles.metricNum, { color: colors.text }]}>{totalSurveys}</Text>
            <Text style={[styles.metricLabel, { color: colors.icon }]}>Total Logs</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <View style={[styles.metricIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
              <Ionicons name="today-outline" size={22} color="#10B981" />
            </View>
            <Text style={[styles.metricNum, { color: '#10B981' }]}>{todayCount}</Text>
            <Text style={[styles.metricLabel, { color: colors.icon }]}>Done Today</Text>
          </View>
        </View>

        <View style={[
          styles.breakdownBox, 
          { 
            backgroundColor: colors.surface,
            borderColor: colors.surfaceBorder,
          }
        ]}>
          <Text style={[styles.breakdownTitle, { color: colors.text }]}>Priority Breakdown 🔥</Text>
          
          {/* High Priority Bar */}
          <View style={styles.progressRow}>
            <View style={styles.progressLabelRow}>
              <Text style={[styles.progressName, { color: colors.text }]}>High Priority</Text>
              <Text style={[styles.progressVal, { color: '#EF4444' }]}>{highPriorityCount}</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.pillBg }]}>
              <View style={[
                styles.progressBarFill, 
                { 
                  backgroundColor: '#EF4444', 
                  width: totalSurveys > 0 ? `${(highPriorityCount / totalSurveys) * 100}%` : '0%' 
                }
              ]} />
            </View>
          </View>

          {/* Medium Priority Bar */}
          <View style={styles.progressRow}>
            <View style={styles.progressLabelRow}>
              <Text style={[styles.progressName, { color: colors.text }]}>Medium Priority</Text>
              <Text style={[styles.progressVal, { color: '#F59E0B' }]}>{medPriorityCount}</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.pillBg }]}>
              <View style={[
                styles.progressBarFill, 
                { 
                  backgroundColor: '#F59E0B', 
                  width: totalSurveys > 0 ? `${(medPriorityCount / totalSurveys) * 100}%` : '0%' 
                }
              ]} />
            </View>
          </View>

          {/* Low Priority Bar */}
          <View style={styles.progressRow}>
            <View style={styles.progressLabelRow}>
              <Text style={[styles.progressName, { color: colors.text }]}>Low Priority</Text>
              <Text style={[styles.progressVal, { color: '#10B981' }]}>{lowPriorityCount}</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.pillBg }]}>
              <View style={[
                styles.progressBarFill, 
                { 
                  backgroundColor: '#10B981', 
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
    paddingBottom: 110,
  },
  contentShell: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  profileCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarBig: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarBigImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  studentName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  studentSub: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 12,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: 140,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  metricIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricNum: {
    fontSize: 24,
    fontWeight: '900',
    marginVertical: 2,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  breakdownBox: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  breakdownTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 14,
  },
  progressRow: {
    marginBottom: 12,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressName: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressVal: {
    fontSize: 12,
    fontWeight: '800',
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
