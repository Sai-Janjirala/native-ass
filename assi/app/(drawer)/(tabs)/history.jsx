import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  FlatList, 
  Pressable, 
  Alert, 
  useColorScheme 
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useSurvey } from '@/context/SurveyContext';
import { CustomHeader } from '@/components/CustomHeader';

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
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
            backgroundColor: colorScheme === 'dark' ? '#18181B' : '#F4F4F5',
            borderColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7'
          }
        ]}>
          <Ionicons name="search" size={20} color={colors.icon} style={{ marginRight: 8 }} />
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
                    backgroundColor: isSelected ? colors.tint : 'transparent',
                    borderColor: isSelected ? colors.tint : (colorScheme === 'dark' ? '#27272A' : '#E4E4E7'),
                    borderWidth: isSelected ? 0 : 1
                  }
                ]}
                onPress={() => setPriorityFilter(p)}
              >
                <Text style={[
                  styles.filterTabText, 
                  { 
                    color: isSelected ? '#FFF' : colors.text,
                    fontWeight: isSelected ? '700' : '500'
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
          <View style={[styles.emptyIconCircle, { backgroundColor: colorScheme === 'dark' ? '#18181B' : '#F4F4F5' }]}>
            <Ionicons name="document-text-outline" size={48} color={colors.icon} />
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
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.surveyCard,
                { 
                  backgroundColor: colorScheme === 'dark' ? '#18181B' : '#FFFFFF',
                  borderColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7'
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
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '15' }]}>
                    <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
                      {item.priority}
                    </Text>
                  </View>
                  
                  <Pressable 
                    style={styles.deleteBtn}
                    onPress={() => handleDeletePress(item.id, item.siteName)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                  </Pressable>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#27272A' : '#E4E4E7' }]} />

              <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                  <Ionicons name="calendar-outline" size={14} color={colors.icon} />
                  <Text style={[styles.footerText, { color: colors.icon }]}>{item.date}</Text>
                </View>
                {item.location && (
                  <View style={styles.footerItem}>
                    <Ionicons name="location-outline" size={14} color={colors.icon} />
                    <Text style={[styles.footerText, { color: colors.icon }]} numberOfLines={1}>
                      {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
                    </Text>
                  </View>
                )}
                {item.photoUri && (
                  <View style={styles.footerItem}>
                    <Ionicons name="image-outline" size={14} color="#34C759" />
                    <Text style={[styles.footerText, { color: '#34C759', fontWeight: '600' }]}>Photo</Text>
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterTabText: {
    fontSize: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  surveyCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  siteInfo: {
    flex: 1,
    marginRight: 10,
  },
  siteName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  clientName: {
    fontSize: 13,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
});
