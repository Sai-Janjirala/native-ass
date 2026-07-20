import { Platform, useColorScheme } from 'react-native';

const tintColorLight = '#6366F1'; // Electric Indigo
const tintColorDark = '#818CF8'; // Soft Electric Violet

export const Colors = {
  light: {
    text: '#0F172A', // Slate-900
    background: '#F8FAFC', // Slate-50 soft backdrop
    surface: '#FFFFFF', // Crisp white cards
    surfaceBorder: '#E2E8F0', // Soft Slate-200 border
    tint: tintColorLight,
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    secondary: '#0EA5E9', // Sky Blue
    accent: '#10B981', // Emerald
    icon: '#64748B', // Slate-500
    tabIconDefault: '#94A3B8', // Slate-400
    tabIconSelected: tintColorLight,
    pillBg: '#F1F5F9', // Light gray pill container
    pillActiveBg: '#6366F1', // Active pill background fill
    pillActiveText: '#FFFFFF',
    cardShadow: 'rgba(99, 102, 241, 0.08)',
  },
  dark: {
    text: '#F8FAFC', // Slate-50
    background: '#09090B', // Deep Zinc-950
    surface: '#121216', // Dark zinc surface card
    surfaceBorder: '#27272A', // Dark Zinc-800 border
    tint: tintColorDark,
    primary: '#818CF8',
    primaryDark: '#6366F1',
    secondary: '#38BDF8', // Sky Blue
    accent: '#34D399', // Emerald
    icon: '#A1A1AA', // Zinc-400
    tabIconDefault: '#52525B', // Zinc-600
    tabIconSelected: tintColorDark,
    pillBg: '#18181C', // Dark pill container
    pillActiveBg: '#6366F1', // Vibrant pill highlight
    pillActiveText: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.5)',
  },
};

export function useAppColorScheme() {
  const colorScheme = useColorScheme();

  return Platform.OS === 'web' ? 'light' : (colorScheme ?? 'light');
}

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
