import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  Pressable, 
  useWindowDimensions,
  SafeAreaView
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, useAppColorScheme } from '@/constants/theme';
import { useSurvey } from '@/context/SurveyContext';
import { CustomHeader } from '@/components/CustomHeader';

import NewSurveyScreen from './new-survey';
import HistoryScreen from './history';
import ProfileScreen from './profile';

const tabsConfig = [
  { label: 'Home', icon: 'grid-outline', activeIcon: 'grid' },
  { label: 'New', icon: 'add-circle-outline', activeIcon: 'add-circle' },
  { label: 'History', icon: 'time-outline', activeIcon: 'time' },
  { label: 'Me', icon: 'person-outline', activeIcon: 'person' },
];

function DashboardContent({ onNavigate }) {
  const colorScheme = useAppColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { todayCount, surveys } = useSurvey();

  const recentSurveys = surveys.slice(0, 3);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return colors.icon;
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.scrollContainer, styles.contentShell]} showsVerticalScrollIndicator={false}>
      {/* User Welcome Banner with Modern Surface Styling */}
      <View style={[
        styles.welcomeBanner, 
        { 
          backgroundColor: colors.surface,
          borderColor: colors.surfaceBorder
        }
      ]}>
        <View style={styles.welcomeTextContainer}>
          <View style={[styles.greetingBadge, { backgroundColor: colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)' }]}>
            <Text style={[styles.welcomeSub, { color: colors.primary }]}>Hey there! 👋</Text>
          </View>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>Sai Janjirala</Text>
          <Text style={[styles.studentRoll, { color: colors.icon }]}>ID: 2026-NATIVE-ASS</Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.countNumber}>{todayCount}</Text>
          <Text style={styles.countLabel}>Done Today</Text>
        </View>
      </View>

      {/* Primary Action Buttons */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>What do you want to do?</Text>
      
      <View style={styles.mainActionsContainer}>
        {/* Start New Survey Pill Button */}
        <Pressable 
          style={({ pressed }) => [
            styles.primaryActionBtn, 
            { 
              backgroundColor: '#2563EB',
              transform: [{ scale: pressed ? 0.98 : 1 }]
            }
          ]}
          onPress={() => onNavigate(1)}
        >
          <View style={styles.actionIconCircle}>
            <Ionicons name="add-circle" size={24} color="#2563EB" />
          </View>
          <View style={styles.primaryActionText}>
            <Text style={styles.primaryActionTitle}>Start a New Survey 📝</Text>
            <Text style={styles.primaryActionSub}>Log a site check inline with camera & GPS</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
        </Pressable>

        {/* View History Button */}
        <Pressable 
          style={({ pressed }) => [
            styles.secondaryActionBtn, 
            { 
              backgroundColor: '#10B981',
              transform: [{ scale: pressed ? 0.98 : 1 }]
            }
          ]}
          onPress={() => onNavigate(2)}
        >
          <View style={styles.actionIconCircle}>
            <Ionicons name="time" size={24} color="#10B981" />
          </View>
          <View style={styles.primaryActionText}>
            <Text style={styles.secondaryActionTitle}>View Survey History 📂</Text>
            <Text style={styles.secondaryActionSub}>
              Browse, search and filter {surveys.length} survey logs
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
        </Pressable>
      </View>

      {/* Recent Surveys Summary */}
      <View style={styles.recentHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Latest Surveys 👀</Text>
        {surveys.length > 0 && (
          <Pressable 
            style={[styles.viewAllPill, { backgroundColor: colors.pillBg }]}
            onPress={() => onNavigate(2)}
          >
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
            <Ionicons name="arrow-forward-outline" size={14} color={colors.primary} />
          </Pressable>
        )}
      </View>

      {recentSurveys.length === 0 ? (
        <View style={[styles.emptyRecent, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
          <Ionicons name="document-text-outline" size={36} color={colors.primary} />
          <Text style={[styles.emptyRecentText, { color: colors.icon }]}>Empty! Go start a survey ⚡</Text>
        </View>
      ) : (
        recentSurveys.map((survey) => (
          <Pressable
            key={survey.id}
            style={({ pressed }) => [
              styles.recentCard,
              { 
                backgroundColor: colors.surface,
                borderColor: colors.surfaceBorder,
                transform: [{ scale: pressed ? 0.99 : 1 }]
              }
            ]}
            onPress={() => router.navigate({ pathname: '/modal', params: { id: survey.id } })}
          >
            <View style={styles.recentMeta}>
              <View style={styles.siteInfo}>
                <Text style={[styles.recentSiteName, { color: colors.text }]}>{survey.siteName}</Text>
                <Text style={[styles.recentClient, { color: colors.icon }]}>{survey.clientName}</Text>
              </View>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(survey.priority) + '18' }]}>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(survey.priority) }]} />
                <Text style={[styles.priorityText, { color: getPriorityColor(survey.priority) }]}>
                  {survey.priority}
                </Text>
              </View>
            </View>
            
            <View style={[styles.recentDivider, { backgroundColor: colors.surfaceBorder }]} />
            
            <View style={styles.recentFooter}>
              <View style={[styles.recentFooterItem, { backgroundColor: colors.pillBg }]}>
                <Ionicons name="calendar-outline" size={13} color={colors.icon} />
                <Text style={[styles.recentFooterText, { color: colors.text }]}>{survey.date}</Text>
              </View>
              {survey.location && (
                <View style={[styles.recentFooterItem, { backgroundColor: colors.pillBg }]}>
                  <Ionicons name="location-outline" size={13} color={colors.primary} />
                  <Text style={[styles.recentFooterText, { color: colors.text }]} numberOfLines={1}>
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
  const colorScheme = useAppColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { tab } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState(0);
  const scrollViewRef = useRef(null);

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

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: activeTab * width, animated: false });
  }, [activeTab, width]);

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
          <View style={[styles.pagerPage, { width }]}>
            <View style={styles.pageContent}>
              <CustomHeader title="Smart Field Survey 🚀" />
              <DashboardContent onNavigate={navigateToTab} />
            </View>
          </View>
          <View style={[styles.pagerPage, { width }]}>
            <NewSurveyScreen />
          </View>
          <View style={[styles.pagerPage, { width }]}>
            <HistoryScreen />
          </View>
          <View style={[styles.pagerPage, { width }]}>
            <ProfileScreen />
          </View>
        </ScrollView>

        {/* Floating Creative Pill Navigation Bar */}
        <View style={styles.floatingTabBarWrapper} pointerEvents="box-none">
          <View style={[
            styles.pillTabBar, 
            { 
              backgroundColor: colors.surface, 
              borderColor: colors.surfaceBorder,
              shadowColor: colors.primary,
            }
          ]}>
            {tabsConfig.map((t, idx) => {
              const isActive = activeTab === idx;
              return (
                <Pressable 
                  key={idx} 
                  style={({ pressed }) => [
                    styles.pillTabItem, 
                    isActive && [styles.pillTabActive, { backgroundColor: colors.primary }],
                    { transform: [{ scale: pressed ? 0.95 : 1 }] }
                  ]} 
                  onPress={() => navigateToTab(idx)}
                >
                  <Ionicons 
                    name={isActive ? t.activeIcon : t.icon} 
                    size={20} 
                    color={isActive ? '#FFFFFF' : colors.icon} 
                  />
                  {isActive && (
                    <Text style={styles.activePillLabel}>{t.label}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerPage: {
    flex: 1,
    minWidth: 0,
  },
  pageContent: {
    flex: 1,
    minWidth: 0,
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
  welcomeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  welcomeTextContainer: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  greetingBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  welcomeSub: {
    fontSize: 12,
    fontWeight: '700',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  studentRoll: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  countBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  countNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  countLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: -0.2,
    marginTop: 4,
  },
  mainActionsContainer: {
    marginBottom: 20,
    gap: 12,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 22,
    gap: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryActionText: {
    flex: 1,
    minWidth: 0,
  },
  primaryActionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  primaryActionSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 22,
    gap: 14,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  secondaryActionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryActionSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyRecent: {
    padding: 32,
    borderRadius: 22,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyRecentText: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: '600',
  },
  recentCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
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
    fontSize: 16,
    fontWeight: '800',
  },
  recentClient: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '800',
  },
  recentDivider: {
    height: 1,
    marginVertical: 12,
  },
  recentFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  recentFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 0,
    gap: 5,
  },
  recentFooterText: {
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
  },
  floatingTabBarWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillTabBar: {
    flexDirection: 'row',
    height: 62,
    width: '92%',
    maxWidth: 500,
    borderRadius: 31,
    borderWidth: 1.5,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  pillTabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
  },
  pillTabActive: {
    paddingHorizontal: 18,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  activePillLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6,
  },
});
