import React from 'react';
import { View, StyleSheet, Text, ScrollView, useColorScheme, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useSurvey } from '@/context/SurveyContext';
import { CustomHeader } from '@/components/CustomHeader';
import { PremiumCard } from '@/components/PremiumCard';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { todayCount, surveys } = useSurvey();

  // Get 3 most recent surveys
  const recentSurveys = surveys.slice(0, 3);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return '#FF3B30';
      case 'Medium':
        return '#FF9500';
      case 'Low':
        return '#34C759';
      default:
        return colors.icon;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="My Field Surveys 🚀" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={[
          styles.welcomeBanner, 
          { 
            backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#F0F8FF',
            borderColor: colorScheme === 'dark' ? '#2F3336' : '#D0E8F2'
          }
        ]}>
          <View style={styles.welcomeTextContainer}>
            <Text style={[styles.welcomeSub, { color: colors.icon }]}>Hey there! 👋</Text>
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>Sai Janjirala</Text>
            <Text style={[styles.studentRoll, { color: colors.tint }]}>ID: 2026-NATIVE-ASS</Text>
          </View>
          <View style={[styles.countBadge, { backgroundColor: colors.tint }]}>
            <Text style={styles.countNumber}>{todayCount}</Text>
            <Text style={styles.countLabel}>Done</Text>
          </View>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#F9FBFD', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
            <Text style={[styles.statNum, { color: colors.text }]}>{surveys.length}</Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>Total Surveys</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#F9FBFD', borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
            <Text style={[styles.statNum, { color: getPriorityColor('High') }]}>
              {surveys.filter(s => s.priority === 'High').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>High Priority</Text>
          </View>
        </View>

        {/* Quick Action Grid */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions ⚡</Text>
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <PremiumCard 
                title="New Survey ➕" 
                description="Add a new log" 
                iconName="add-circle-outline" 
                onPress={() => router.navigate('/(drawer)/(tabs)/new-survey')} 
              />
            </View>
            <View style={styles.gridCol}>
              <PremiumCard 
                title="History 📂" 
                description="View past surveys" 
                iconName="time-outline" 
                onPress={() => router.navigate('/(drawer)/(tabs)/history')} 
              />
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <PremiumCard 
                title="Snap Pic 📸" 
                description="Take photos of sites" 
                iconName="camera-outline" 
                onPress={() => router.navigate('/(drawer)/camera')} 
              />
            </View>
            <View style={styles.gridCol}>
              <PremiumCard 
                title="GPS Tracker 📍" 
                description="Grab GPS coordinates" 
                iconName="location-outline" 
                onPress={() => router.navigate('/(drawer)/location')} 
              />
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <PremiumCard 
                title="Link Buddies 👥" 
                description="Choose team contacts" 
                iconName="people-outline" 
                onPress={() => router.navigate('/(drawer)/contacts')} 
              />
            </View>
            <View style={styles.gridCol}>
              <PremiumCard 
                title="Clipboard 📋" 
                description="Copy/paste helper" 
                iconName="clipboard-outline" 
                onPress={() => router.navigate('/(drawer)/clipboard')} 
              />
            </View>
          </View>
        </View>

        {/* Recent Surveys Summary */}
        <View style={styles.recentHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Latest Surveys 👀</Text>
          {surveys.length > 0 && (
            <Pressable onPress={() => router.navigate('/(drawer)/(tabs)/history')}>
              <Text style={[styles.viewAllText, { color: colors.tint }]}>View All</Text>
            </Pressable>
          )}
        </View>

        {recentSurveys.length === 0 ? (
          <View style={[styles.emptyRecent, { borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]}>
            <Ionicons name="document-text-outline" size={32} color={colors.icon} />
            <Text style={[styles.emptyRecentText, { color: colors.icon }]}>Empty! Go start a survey ⚡</Text>
          </View>
        ) : (
          recentSurveys.map((survey) => (
            <Pressable
              key={survey.id}
              style={[
                styles.recentCard,
                { 
                  backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF',
                  borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' 
                }
              ]}
              onPress={() => router.navigate({ pathname: '/modal', params: { id: survey.id } })}
            >
              <View style={styles.recentMeta}>
                <View style={styles.siteInfo}>
                  <Text style={[styles.recentSiteName, { color: colors.text }]}>{survey.siteName}</Text>
                  <Text style={[styles.recentClient, { color: colors.icon }]}>{survey.clientName}</Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(survey.priority) + '15' }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(survey.priority) }]}>
                    {survey.priority}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.recentDivider, { backgroundColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6' }]} />
              
              <View style={styles.recentFooter}>
                <View style={styles.recentFooterItem}>
                  <Ionicons name="calendar-outline" size={14} color={colors.icon} />
                  <Text style={[styles.recentFooterText, { color: colors.icon }]}>{survey.date}</Text>
                </View>
                {survey.location && (
                  <View style={styles.recentFooterItem}>
                    <Ionicons name="location-outline" size={14} color={colors.icon} />
                    <Text style={[styles.recentFooterText, { color: colors.icon }]} numberOfLines={1}>
                      {survey.location.latitude.toFixed(4)}, {survey.location.longitude.toFixed(4)}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          ))
        )}
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
  welcomeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeSub: {
    fontSize: 13,
    fontWeight: '500',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  studentRoll: {
    fontSize: 12,
    fontWeight: '600',
  },
  countBadge: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  countNumber: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  countLabel: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  gridContainer: {
    marginBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCol: {
    flex: 1,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyRecent: {
    padding: 30,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyRecentText: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: '500',
  },
  recentCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  recentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  siteInfo: {
    flex: 1,
    marginRight: 10,
  },
  recentSiteName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  recentClient: {
    fontSize: 13,
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  recentDivider: {
    height: 1,
    marginVertical: 12,
  },
  recentFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  recentFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  recentFooterText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
