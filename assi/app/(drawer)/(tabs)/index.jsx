import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  Pressable, 
  useColorScheme,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useSurvey } from '@/context/SurveyContext';
import { CustomHeader } from '@/components/CustomHeader';

import NewSurveyScreen from './new-survey';
import HistoryScreen from './history';
import ProfileScreen from './profile';

const { width } = Dimensions.get('window');

function DashboardContent({ onNavigate }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { todayCount, surveys } = useSurvey();

  // Get 3 most recent surveys
  const recentSurveys = surveys.slice(0, 3);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#FF3B30';
      case 'Medium': return '#FF9500';
      case 'Low': return '#34C759';
      default: return colors.icon;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Grayscale User Welcome Banner */}
      <View style={[
        styles.welcomeBanner, 
        { 
          backgroundColor: colorScheme === 'dark' ? '#18181B' : '#F4F4F5',
          borderColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7'
        }
      ]}>
        <View style={styles.welcomeTextContainer}>
          <Text style={[styles.welcomeSub, { color: colors.icon }]}>Hey there! 👋</Text>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>Sai Janjirala</Text>
          <Text style={[styles.studentRoll, { color: colors.icon }]}>ID: 2026-NATIVE-ASS</Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: colors.text }]}>
          <Text style={[styles.countNumber, { color: colors.background }]}>{todayCount}</Text>
          <Text style={[styles.countLabel, { color: colors.background }]}>Done</Text>
        </View>
      </View>

      {/* Primary Action Buttons (Extremely Simple UX) */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>What do you want to do?</Text>
      
      <View style={styles.mainActionsContainer}>
        {/* Colorful Emerald Green Button */}
        <Pressable 
          style={[styles.primaryActionBtn, { backgroundColor: '#10B981' }]}
          onPress={() => onNavigate(1)}
        >
          <Ionicons name="add-circle" size={24} color="#FFF" />
          <View style={styles.primaryActionText}>
            <Text style={styles.primaryActionTitle}>Start a New Survey 📝</Text>
            <Text style={styles.primaryActionSub}>Log a site check inline with camera & GPS</Text>
          </View>
        </Pressable>

        {/* Colorful Royal Blue Button */}
        <Pressable 
          style={[styles.secondaryActionBtn, { backgroundColor: '#3B82F6', borderColor: '#3B82F6' }]}
          onPress={() => onNavigate(2)}
        >
          <Ionicons name="time" size={24} color="#FFF" />
          <View style={styles.primaryActionText}>
            <Text style={[styles.secondaryActionTitle, { color: '#FFF' }]}>View Survey History 📂</Text>
            <Text style={[styles.secondaryActionSub, { color: '#E0E7FF' }]}>
              Browse, search and filter {surveys.length} survey logs
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Recent Surveys Summary */}
      <View style={styles.recentHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Latest Surveys 👀</Text>
        {surveys.length > 0 && (
          <Pressable onPress={() => onNavigate(2)}>
            <Text style={[styles.viewAllText, { color: '#3B82F6' }]}>View All</Text>
          </Pressable>
        )}
      </View>

      {recentSurveys.length === 0 ? (
        <View style={[styles.emptyRecent, { borderColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7' }]}>
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
                backgroundColor: colorScheme === 'dark' ? '#18181B' : '#FFFFFF',
                borderColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7' 
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
            
            <View style={[styles.recentDivider, { backgroundColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7' }]} />
            
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
  );
}

export default function TabLayoutWrapper() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { tab } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const scrollViewRef = useRef(null);

  // Synchronize with URL search parameter reactively
  useEffect(() => {
    if (tab !== undefined && tab !== null) {
      const idx = parseInt(tab, 10);
      if (!isNaN(idx) && idx >= 0 && idx <= 3 && idx !== activeTab) {
        navigateToTab(idx);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const navigateToTab = (index) => {
    setActiveTab(index);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleScrollEnd = (e) => {
    const xOffset = e.nativeEvent.contentOffset.x;
    const index = Math.round(xOffset / width);
    if (index >= 0 && index <= 3) {
      setActiveTab(index);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          style={{ flex: 1 }}
          bounces={false}
          scrollEventThrottle={16}
        >
          <View style={{ width }}>
            <View style={{ flex: 1 }}>
              <CustomHeader title="My Field Surveys 🚀" />
              <DashboardContent onNavigate={navigateToTab} />
            </View>
          </View>
          <View style={{ width }}>
            <NewSurveyScreen />
          </View>
          <View style={{ width }}>
            <HistoryScreen />
          </View>
          <View style={{ width }}>
            <ProfileScreen />
          </View>
        </ScrollView>

        {/* Custom Premium Grayscale Bottom Navigation Bar */}
        <View style={[
          styles.tabBar, 
          { 
            backgroundColor: colors.background, 
            borderTopColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7' 
          }
        ]}>
          <Pressable style={styles.tabItem} onPress={() => navigateToTab(0)}>
            <Ionicons name={activeTab === 0 ? 'grid' : 'grid-outline'} size={22} color={activeTab === 0 ? colors.tint : colors.icon} />
            <Text style={[styles.tabLabel, { color: activeTab === 0 ? colors.tint : colors.icon }]}>Home</Text>
          </Pressable>
          <Pressable style={styles.tabItem} onPress={() => navigateToTab(1)}>
            <Ionicons name={activeTab === 1 ? 'add-circle' : 'add-circle-outline'} size={22} color={activeTab === 1 ? colors.tint : colors.icon} />
            <Text style={[styles.tabLabel, { color: activeTab === 1 ? colors.tint : colors.icon }]}>New</Text>
          </Pressable>
          <Pressable style={styles.tabItem} onPress={() => navigateToTab(2)}>
            <Ionicons name={activeTab === 2 ? 'time' : 'time-outline'} size={22} color={activeTab === 2 ? colors.tint : colors.icon} />
            <Text style={[styles.tabLabel, { color: activeTab === 2 ? colors.tint : colors.icon }]}>History</Text>
          </Pressable>
          <Pressable style={styles.tabItem} onPress={() => navigateToTab(3)}>
            <Ionicons name={activeTab === 3 ? 'person' : 'person-outline'} size={22} color={activeTab === 3 ? colors.tint : colors.icon} />
            <Text style={[styles.tabLabel, { color: activeTab === 3 ? colors.tint : colors.icon }]}>Me</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
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
    marginBottom: 20,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeSub: {
    fontSize: 13,
    fontWeight: '600',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  studentRoll: {
    fontSize: 12,
    fontWeight: '700',
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  countLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.2,
    marginTop: 8,
  },
  mainActionsContainer: {
    marginBottom: 20,
    gap: 12,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryActionText: {
    flex: 1,
  },
  primaryActionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryActionSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    marginTop: 2,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryActionSub: {
    fontSize: 11,
    marginTop: 2,
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
  tabBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
});
