import React from 'react';
import { View, StyleSheet, Text, Pressable, SafeAreaView, Platform, Image } from 'react-native';
import { useNavigation, router } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, useAppColorScheme } from '@/constants/theme';

export const CustomHeader = ({ title, showBack = false }) => {
  const colorScheme = useAppColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const navigation = useNavigation();

  const handleMenuPress = () => {
    if (showBack) {
      router.back();
    } else {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  };

  const getFormattedDate = () => {
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[
        styles.container, 
        { 
          backgroundColor: colors.surface,
          borderColor: colors.surfaceBorder,
        }
      ]}>
        <Pressable 
          style={({ pressed }) => [
            styles.iconButton, 
            { 
              backgroundColor: pressed 
                ? (colorScheme === 'dark' ? '#27272A' : '#E2E8F0') 
                : (colorScheme === 'dark' ? '#1E1E24' : '#F1F5F9'),
            }
          ]} 
          onPress={handleMenuPress}
        >
          <Ionicons 
            name={showBack ? 'arrow-back-outline' : 'menu-outline'} 
            size={22} 
            color={colors.text} 
          />
        </Pressable>

        <View style={styles.titleContainer}>
          <View style={[styles.dateChip, { backgroundColor: colorScheme === 'dark' ? 'rgba(129, 140, 248, 0.15)' : 'rgba(99, 102, 241, 0.1)' }]}>
            <Ionicons name="calendar-outline" size={11} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={[styles.headerSubtitle, { color: colors.primary }]}>
              {getFormattedDate()}
            </Text>
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {title || 'Smart Field Survey'}
          </Text>
        </View>

        <Pressable 
          style={({ pressed }) => [
            styles.profileBadge, 
            { 
              borderColor: colors.primary,
              transform: [{ scale: pressed ? 0.95 : 1 }]
            }
          ]}
          onPress={() => router.navigate('/?tab=3')}
        >
          <Image 
            source={{ uri: 'https://avatars.githubusercontent.com/u/224969012?v=4&size=64' }} 
            style={styles.headerAvatar}
          />
          <View style={[styles.onlineIndicator, { backgroundColor: colors.accent }]} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
  container: {
    height: 64,
    width: '94%',
    maxWidth: 720,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    marginRight: 10,
    justifyContent: 'center',
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  profileBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
