import React from 'react';
import { View, StyleSheet, Text, Pressable, useColorScheme, SafeAreaView, Platform, Image } from 'react-native';
import { useNavigation, router } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export const CustomHeader = ({ title, showBack = false }) => {
  const colorScheme = useColorScheme();
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
      <View style={[styles.container, { borderBottomColor: colorScheme === 'dark' ? '#222' : '#f0f0f0' }]}>
        <Pressable 
          style={[styles.iconButton, { backgroundColor: colorScheme === 'dark' ? '#222' : '#f5f5f5' }]} 
          onPress={handleMenuPress}
        >
          <Ionicons 
            name={showBack ? 'arrow-back' : 'menu'} 
            size={24} 
            color={colors.text} 
          />
        </Pressable>

        <View style={styles.titleContainer}>
          <Text style={[styles.headerSubtitle, { color: colors.icon }]}>
            {getFormattedDate()}
          </Text>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {title || 'Smart Field Survey'}
          </Text>
        </View>

        <Pressable 
          style={[styles.profileBadge, { borderColor: colors.tint }]}
          onPress={() => router.navigate('/?tab=3')}
        >
          <Image 
            source={{ uri: 'https://avatars.githubusercontent.com/u/224969012?v=4&size=64' }} 
            style={styles.headerAvatar}
          />
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
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  profileBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
