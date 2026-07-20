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
