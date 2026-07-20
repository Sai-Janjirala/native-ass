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

  const activeBg = colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(10, 126, 164, 0.1)';
  const activeText = colors.tint;
  const inactiveText = colors.text;

  return (
    <DrawerContentScrollView 
      {...props} 
      contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.background }]}
    >
      {/* Drawer Header with Student Profile */}
      <View style={[styles.header, { borderBottomColor: colorScheme === 'dark' ? '#333' : '#eee' }]}>
        <View style={[styles.avatarContainer, { borderColor: colors.tint }]}>
          <Text style={[styles.avatarText, { color: colors.tint }]}>SJ</Text>
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
          style={[styles.itemPressable, isActive('dashboard') && { backgroundColor: activeBg }]}
          onPress={() => router.navigate('/?tab=0')}
        >
          <Ionicons 
            name="home-outline" 
            size={22} 
            color={isActive('dashboard') ? activeText : inactiveText} 
          />
          <Text style={[styles.itemText, { color: isActive('dashboard') ? activeText : inactiveText }]}>
            Home 🏠
          </Text>
        </Pressable>

        {/* Survey */}
        <Pressable
          style={[styles.itemPressable, isActive('survey') && { backgroundColor: activeBg }]}
          onPress={() => router.navigate('/?tab=1')}
        >
          <Ionicons 
            name="document-text-outline" 
            size={22} 
            color={isActive('survey') ? activeText : inactiveText} 
          />
          <Text style={[styles.itemText, { color: isActive('survey') ? activeText : inactiveText }]}>
            New Survey ➕
          </Text>
        </Pressable>

        <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#333' : '#eee' }]} />
        <Text style={[styles.sectionTitle, { color: colors.icon }]}>Cool APIs ⚡</Text>

        {/* Camera */}
        <Pressable
          style={[styles.itemPressable, isActive('camera') && { backgroundColor: activeBg }]}
          onPress={() => router.navigate('/(drawer)/camera')}
        >
          <Ionicons 
            name="camera-outline" 
            size={22} 
            color={isActive('camera') ? activeText : inactiveText} 
          />
          <Text style={[styles.itemText, { color: isActive('camera') ? activeText : inactiveText }]}>
            Snap Pic 📸
          </Text>
        </Pressable>

        {/* Location */}
        <Pressable
          style={[styles.itemPressable, isActive('location') && { backgroundColor: activeBg }]}
          onPress={() => router.navigate('/(drawer)/location')}
        >
          <Ionicons 
            name="location-outline" 
            size={22} 
            color={isActive('location') ? activeText : inactiveText} 
          />
          <Text style={[styles.itemText, { color: isActive('location') ? activeText : inactiveText }]}>
            GPS Tracker 📍
          </Text>
        </Pressable>

        {/* Contacts */}
        <Pressable
          style={[styles.itemPressable, isActive('contacts') && { backgroundColor: activeBg }]}
          onPress={() => router.navigate('/(drawer)/contacts')}
        >
          <Ionicons 
            name="people-outline" 
            size={22} 
            color={isActive('contacts') ? activeText : inactiveText} 
          />
          <Text style={[styles.itemText, { color: isActive('contacts') ? activeText : inactiveText }]}>
            Buddies List 👥
          </Text>
        </Pressable>

        {/* Clipboard */}
        <Pressable
          style={[styles.itemPressable, isActive('clipboard') && { backgroundColor: activeBg }]}
          onPress={() => router.navigate('/(drawer)/clipboard')}
        >
          <Ionicons 
            name="clipboard-outline" 
            size={22} 
            color={isActive('clipboard') ? activeText : inactiveText} 
          />
          <Text style={[styles.itemText, { color: isActive('clipboard') ? activeText : inactiveText }]}>
            Clipboard Tool 📋
          </Text>
        </Pressable>

        <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#333' : '#eee' }]} />

        {/* Settings */}
        <Pressable
          style={[styles.itemPressable, isActive('settings') && { backgroundColor: activeBg }]}
          onPress={() => router.navigate('/(drawer)/settings')}
        >
          <Ionicons 
            name="settings-outline" 
            size={22} 
            color={isActive('settings') ? activeText : inactiveText} 
          />
          <Text style={[styles.itemText, { color: isActive('settings') ? activeText : inactiveText }]}>
            App Settings ⚙️
          </Text>
        </Pressable>
      </View>

      {/* Drawer Footer info */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.icon }]}>
          {"Done Today: "}{todayCount}
        </Text>
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
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 4,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 15,
  },
  divider: {
    height: 1,
    marginVertical: 15,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingLeft: 15,
    marginBottom: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerVersion: {
    fontSize: 10,
    marginTop: 5,
  },
});
