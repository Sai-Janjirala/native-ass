import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { SurveyProvider } from '@/context/SurveyContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppColorScheme } from '@/constants/theme';

export const unstable_settings = {
  anchor: '(drawer)',
};

export default function RootLayout() {
  const colorScheme = useAppColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SurveyProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Survey Details' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SurveyProvider>
    </GestureHandlerRootView>
  );
}
// Camera
// “Camera feature ke liye maine Expo Camera API use ki hai. App pehle user se camera permission leta hai using useCameraPermissions(). Agar permission mil jaati hai, then CameraView open hota hai. Jab user capture button press karta hai, takePictureAsync() method photo capture karta hai. Us photo ka local URI milta hai, aur maine us URI ko survey draft me save kiya hai, so preview aur final survey details me image show ho jaati hai.”
// Location
// “Location ke liye maine Expo Location API use ki hai. App requestForegroundPermissionsAsync() se location permission leta hai. Permission milne ke baad getCurrentPositionAsync() current GPS coordinates fetch karta hai. Isme latitude, longitude, accuracy, aur timestamp milta hai. Ye data survey draft ke location field me store hota hai, so report ke saath exact coordinates attach ho jaate hain.”
// Contacts
// “Contacts feature Expo Contacts API se bana hai. App contacts permission request karta hai. Permission milne par getContactsAsync() device ke contacts read karta hai, especially name and phone number. User list se contact select karta hai, aur selected contact survey draft ke saath link ho jaata hai. Agar permission ya contacts available nahi hain, demo contacts fallback ke liye show hote hain.”
// Clipboard
// “Clipboard ke liye Expo Clipboard API use ki hai. App getStringAsync() se clipboard ka text read kar sakta hai aur setStringAsync() se text clipboard me copy kar sakta hai. Iska use maine survey notes paste karne, coordinates copy karne, contact number copy karne, aur survey ID copy karne ke liye kiya hai.”
// State Management
// “Ye sab captured data directly screen ke local state me nahi chhoda. Maine Context API use ki hai, specifically SurveyContext, jisme active survey draft maintain hota hai. Camera photo URI, GPS coordinates, contact, notes, priority, site name sab draft me update hote hain. Jab user submit karta hai, wahi draft final survey history me save ho jaata hai.”
// Best Short Answer
// “Sir, maine native device features direct manually implement nahi kiye. Maine Expo ke official APIs use kiye: Camera ke liye expo-camera, GPS ke liye expo-location, contacts ke liye expo-contacts, aur clipboard ke liye expo-clipboard. Har feature pehle permission check karta hai, phir device API se data fetch/capture karta hai, aur finally Context API ke through survey draft me store karta hai.”
// Keep this line ready. It sounds clean and technical.