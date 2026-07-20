import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  FlatList, 
  Pressable, 
  Alert, 
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, useAppColorScheme } from '@/constants/theme';
import { useSurvey } from '@/context/SurveyContext';
import { CustomHeader } from '@/components/CustomHeader';

export default function HistoryScreen() {
  const colorScheme = useAppColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { surveys, deleteSurvey } = useSurvey();

  // Local search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#FF3B30';
      case 'Medium': return '#FF9500';
      case 'Low': return '#34C759';
      default: return colors.icon;
    }
  };

  const handleDeletePress = (id, siteName) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.confirm(`Delete this survey? 🗑️\n\nAre you sure you want to delete the survey record for "${siteName}"? This action is permanent.`)) {
        deleteSurvey(id);
      }
    } else {
      Alert.alert(
        'Delete this survey? 🗑️',
        `Are you sure you want to delete the survey record for "${siteName}"? This action is permanent.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => {
              deleteSurvey(id);
            }
          }
        ]
      );
    }
  };

  // Filter logic
  const filteredSurveys = surveys.filter((s) => {
    const matchesSearch = 
      s.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesPriority = 
      priorityFilter === 'All' || s.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Survey History 📂" />

      {/* Search Input Bar */}
      <View style={styles.topContainer}>
        <View style={[
          styles.searchContainer, 
          { 
            backgroundColor: colors.surface,
            borderColor: colors.surfaceBorder,
          }
        ]}>
          <Ionicons name="search" size={18} color={colors.primary} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by site or client..."
            placeholderTextColor={colors.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.icon} />
            </Pressable>
          ) : null}
        </View>

        {/* Priority Filters Segment */}
        <View style={styles.filterRow}>
          {(['All', 'High', 'Medium', 'Low']).map((p) => {
            const isSelected = priorityFilter === p;
            const displayLabel = p === 'All' ? 'All' : p === 'High' ? 'High 🔥' : p === 'Medium' ? 'Med ⚡' : 'Low 🍀';
            return (
              <Pressable
                key={p}
                style={[
                  styles.filterTab,
                  { 
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.surfaceBorder,
                    borderWidth: 1
                  }
                ]}
                onPress={() => setPriorityFilter(p)}
              >
                <Text style={[
                  styles.filterTabText, 
                  { 
                    color: isSelected ? '#FFFFFF' : colors.text,
                    fontWeight: isSelected ? '800' : '600'
                  }
                ]}>
                  {displayLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* FlatList */}
      {filteredSurveys.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, borderWidth: 1 }]}>
            <Ionicons name="document-text-outline" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Nothing here! 🏜️</Text>
          <Text style={[styles.emptySub, { color: colors.icon }]}>
            {surveys.length === 0 
              ? 'No surveys added yet! Go start one under the New tab.'
              : 'No surveys match your search or filters.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredSurveys}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContainer, styles.contentShell]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.surveyCard,
                { 
                  backgroundColor: colors.surface,
                  borderColor: colors.surfaceBorder,
                  transform: [{ scale: pressed ? 0.99 : 1 }]
                }
              ]}
              onPress={() => router.navigate({ pathname: '/modal', params: { id: item.id } })}
            >
              <View style={styles.cardHeader}>
                <View style={styles.siteInfo}>
                  <Text style={[styles.siteName, { color: colors.text }]} numberOfLines={1}>{item.siteName}</Text>
                  <Text style={[styles.clientName, { color: colors.icon }]} numberOfLines={1}>{item.clientName}</Text>
                </View>
                
                <View style={styles.badgeRow}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '18' }]}>
                    <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
                      {item.priority}
                    </Text>
                  </View>
                  
                  <Pressable 
                    style={styles.deleteBtn}
                    onPress={() => handleDeletePress(item.id, item.siteName)}
                  >
                    <Ionicons name="trash-outline" size={15} color="#EF4444" />
                  </Pressable>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

              <View style={styles.cardFooter}>
                <View style={[styles.footerItem, { backgroundColor: colors.pillBg }]}>
                  <Ionicons name="calendar-outline" size={13} color={colors.icon} />
                  <Text style={[styles.footerText, { color: colors.text }]}>{item.date}</Text>
                </View>
                {item.location && (
                  <View style={[styles.footerItem, { backgroundColor: colors.pillBg }]}>
                    <Ionicons name="location-outline" size={13} color={colors.primary} />
                    <Text style={[styles.footerText, { color: colors.text }]} numberOfLines={1}>
                      {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
                    </Text>
                  </View>
                )}
                {item.photoUri && (
                  <View style={[styles.footerItem, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                    <Ionicons name="image-outline" size={13} color="#10B981" />
                    <Text style={[styles.footerText, { color: '#10B981', fontWeight: '700' }]}>Photo Attached</Text>
                  </View>
                )}
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterTab: {
    flex: 1,
    minWidth: 72,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: 'center',
  },
  filterTabText: {
    fontSize: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  contentShell: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  surveyCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  siteInfo: {
    flex: 1,
    minWidth: 0,
    marginRight: 10,
  },
  siteName: {
    fontSize: 16,
    fontWeight: '800',
  },
  clientName: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '800',
  },
  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 0,
    gap: 5,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    fontWeight: '500',
  },
});
