import React from 'react';
import { View, StyleSheet, Text, Pressable, useWindowDimensions } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { router, usePathname, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, useAppColorScheme } from '@/constants/theme';
import { useSurvey } from '@/context/SurveyContext';

function CustomDrawerContent(props) {
  const colorScheme = useAppColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const pathname = usePathname();
  const { tab } = useLocalSearchParams();
  const { todayCount } = useSurvey();

  // Helper to determine if drawer item is active
  const isActive = (route) => {
    const isTabsPage = pathname === '/' || pathname === '/(tabs)' || pathname === '/(drawer)/(tabs)';
    if (isTabsPage) {
      const activeIndex = tab ? parseInt(tab, 10) : 0;
      if (route === 'dashboard') return activeIndex === 0;
      if (route === 'survey') return activeIndex === 1;
      return false;
    }
    return pathname.includes(route);
  };

  const activeBg = colorScheme === 'dark' ? '#FAFAFA' : '#09090B';
  const activeText = colorScheme === 'dark' ? '#09090B' : '#FFFFFF';
  const inactiveText = colors.text;

  return (
    <DrawerContentScrollView 
      {...props} 
      contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.background }]}
    >
      {/* Drawer Header with Student Profile */}
      <View style={[styles.header, { borderBottomColor: colors.surfaceBorder, backgroundColor: colors.surface }]}>
        <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>SJ</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>Sai Janjirala</Text>
          <Text style={[styles.userRoll, { color: colors.icon }]}>Roll: 2026-NATIVE-ASS</Text>
        </View>
      </View>

      {/* Drawer Navigation Links */}
      <View style={styles.drawerItemsContainer}>
        {/* Dashboard */}
        <Pressable
          style={[
            styles.itemPressable, 
            isActive('dashboard') 
              ? { backgroundColor: activeBg, shadowColor: colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 } 
              : { backgroundColor: 'transparent' }
          ]}
          onPress={() => router.navigate('/?tab=0')}
        >
          <Ionicons 
            name="home-outline" 
            size={20} 
            color={isActive('dashboard') ? activeText : inactiveText} 
          />
          <Text style={[styles.itemText, { color: isActive('dashboard') ? activeText : inactiveText, fontWeight: isActive('dashboard') ? '700' : '500' }]}>
            Home 🏠
          </Text>
        </Pressable>

        {/* Survey */}
        <Pressable
          style={[
            styles.itemPressable, 
            isActive('survey') 
              ? { backgroundColor: activeBg, shadowColor: colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 } 
              : { backgroundColor: 'transparent' }
          ]}
          onPress={() => router.navigate('/?tab=1')}
        >
          <Ionicons 
            name="add-circle-outline" 
            size={20} 
            color={isActive('survey') ? activeText : inactiveText} 
          />
          <Text style={[styles.itemText, { color: isActive('survey') ? activeText : inactiveText, fontWeight: isActive('survey') ? '700' : '500' }]}>
            New Survey ➕
          </Text>
        </Pressable>

        <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />
        <Text style={[styles.sectionTitle, { color: colors.icon }]}>Native APIs ⚡</Text>

        {/* Camera */}
        <Pressable
          style={[
            styles.itemPressable, 
            isActive('camera') 
              ? { backgroundColor: activeBg, shadowColor: colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 } 
              : { backgroundColor: 'transparent' }
          ]}
          onPress={() => router.navigate('/(drawer)/camera')}
        >
          <Ionicons 
            name="camera-outline" 
            size={20} 
            color={isActive('camera') ? activeText : inactiveText} 
          />
          <Text style={[styles.itemText, { color: isActive('camera') ? activeText : inactiveText, fontWeight: isActive('camera') ? '700' : '500' }]}>
            Snap Pic 📸
          </Text>
        </Pressable>

        {/* Location */}
        <Pressable
          style={[
            styles.itemPressable, 
            isActive('location') 
              ? { backgroundColor: activeBg, shadowColor: colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 } 
              : { backgroundColor: 'transparent' }
          ]}
          onPress={() => router.navigate('/(drawer)/location')}
        >
          <Ionicons 
            name="location-outline" 
            size={20} 
            color={isActive('location') ? activeText : inactiveText} 
          />
          <Text style={[styles.itemText, { color: isActive('location') ? activeText : inactiveText, fontWeight: isActive('location') ? '700' : '500' }]}>
            GPS Tracker 📍
          </Text>
        </Pressable>

        {/* Contacts */}
        <Pressable
          style={[
            styles.itemPressable, 
            isActive('contacts') 
              ? { backgroundColor: activeBg, shadowColor: colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 } 
              : { backgroundColor: 'transparent' }
          ]}
          onPress={() => router.navigate('/(drawer)/contacts')}
        >
          <Ionicons 
            name="people-outline" 
            size={20} 
            color={isActive('contacts') ? activeText : inactiveText} 
          />
          <Text style={[styles.itemText, { color: isActive('contacts') ? activeText : inactiveText, fontWeight: isActive('contacts') ? '700' : '500' }]}>
            Buddies List 👥
          </Text>
        </Pressable>

        {/* Clipboard */}
        <Pressable
          style={[
            styles.itemPressable, 
            isActive('clipboard') 
              ? { backgroundColor: activeBg, shadowColor: colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 } 
              : { backgroundColor: 'transparent' }
          ]}
          onPress={() => router.navigate('/(drawer)/clipboard')}
        >
          <Ionicons 
            name="clipboard-outline" 
            size={20} 
            color={isActive('clipboard') ? activeText : inactiveText} 
          />
          <Text style={[styles.itemText, { color: isActive('clipboard') ? activeText : inactiveText, fontWeight: isActive('clipboard') ? '700' : '500' }]}>
            Clipboard Tool 📋
          </Text>
        </Pressable>

        <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

        {/* Settings */}
        <Pressable
          style={[
            styles.itemPressable, 
            isActive('settings') 
              ? { backgroundColor: activeBg, shadowColor: colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 } 
              : { backgroundColor: 'transparent' }
          ]}
          onPress={() => router.navigate('/(drawer)/settings')}
        >
          <Ionicons 
            name="settings-outline" 
            size={20} 
            color={isActive('settings') ? activeText : inactiveText} 
          />
          <Text style={[styles.itemText, { color: isActive('settings') ? activeText : inactiveText, fontWeight: isActive('settings') ? '700' : '500' }]}>
            App Settings ⚙️
          </Text>
        </Pressable>
      </View>

      {/* Drawer Footer info */}
      <View style={[styles.footer, { borderTopColor: colors.surfaceBorder }]}>
        <View style={[styles.footerBadge, { backgroundColor: colors.pillBg }]}>
          <Text style={[styles.footerText, { color: colors.primary }]}>
            {"Done Today: "}{todayCount}
          </Text>
        </View>
        <Text style={[styles.footerVersion, { color: colors.icon }]}>v1.0.0 (Native Assignment)</Text>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const colorScheme = useAppColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { width } = useWindowDimensions();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 2,
          shadowOpacity: 0.1,
          borderBottomWidth: 1,
          borderBottomColor: colorScheme === 'dark' ? '#333' : '#eee',
        },
        headerTintColor: colors.text,
        drawerStyle: {
          width: Math.min(280, Math.max(260, width * 0.86)),
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerShown: false, // Tabs has its own CustomHeader
          title: 'Dashboard',
        }}
      />
      <Drawer.Screen
        name="camera"
        options={{
          title: 'Camera Capture',
        }}
      />
      <Drawer.Screen
        name="location"
        options={{
          title: 'Location API',
        }}
      />
      <Drawer.Screen
        name="contacts"
        options={{
          title: 'Contacts API',
        }}
      />
      <Drawer.Screen
        name="clipboard"
        options={{
          title: 'Clipboard Manager',
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userRoll: {
    fontSize: 12,
    marginTop: 2,
  },
  drawerItemsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  itemPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginVertical: 3,
  },
  itemText: {
    fontSize: 14,
    marginLeft: 14,
  },
  divider: {
    height: 1,
    marginVertical: 12,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingLeft: 15,
    marginBottom: 6,
    marginTop: 4,
  },
  footer: {
    padding: 18,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 6,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '700',
  },
  footerVersion: {
    fontSize: 11,
    fontWeight: '500',
  },
});
