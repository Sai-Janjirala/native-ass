import { Platform } from 'react-native';

const STORAGE_KEY = '@smart_field_surveys_data';

/**
 * Universal persistent storage helper for React Native & Web
 */
export const getStoredSurveys = async (fallbackData = []) => {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(STORAGE_KEY);
        if (item) {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    }
    
    // Try importing AsyncStorage dynamically if available
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      if (AsyncStorage) {
        const item = await AsyncStorage.getItem(STORAGE_KEY);
        if (item) {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch {
      // AsyncStorage optional fallback
    }

    return fallbackData;
  } catch (err) {
    console.warn('Error reading stored surveys:', err);
    return fallbackData;
  }
};

export const saveStoredSurveys = async (surveys) => {
  try {
    const jsonStr = JSON.stringify(surveys);
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, jsonStr);
      }
    }

    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      if (AsyncStorage) {
        await AsyncStorage.setItem(STORAGE_KEY, jsonStr);
      }
    } catch {
      // AsyncStorage optional fallback
    }
  } catch (err) {
    console.warn('Error saving surveys:', err);
  }
};
