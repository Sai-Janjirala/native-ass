import { Platform, useColorScheme } from 'react-native';

const tintColorLight = '#2563EB'; // Royal Blue Accent
const tintColorDark = '#3B82F6'; // Executive Soft Blue

export const Colors = {
  light: {
    text: '#0F172A', // Slate-900
    background: '#F8FAFC', // Slate-50 soft backdrop
    surface: '#FFFFFF', // Pure White card
    surfaceBorder: '#E2E8F0', // Soft Slate border
    tint: tintColorLight,
    primary: '#2563EB', // Royal Blue
    primaryDark: '#1D4ED8',
    secondary: '#10B981', // Emerald Green
    accent: '#F59E0B', // Amber Accent
    icon: '#64748B', // Slate-500
    tabIconDefault: '#94A3B8', // Slate-400
    tabIconSelected: tintColorLight,
    pillBg: '#F1F5F9',
    taskbarBg: '#09090B', // Black taskbar background
    taskbarActivePill: '#27272A', // Dark charcoal active pill in taskbar
    taskbarActiveText: '#FFFFFF', // White text on taskbar
    cardShadow: 'rgba(0, 0, 0, 0.06)',
  },
  dark: {
    text: '#F8FAFC', // Stark White
    background: '#09090B', // Deep Obsidian Black
    surface: '#141417', // Dark Obsidian surface card
    surfaceBorder: '#27272A', // Dark Zinc border
    tint: tintColorDark,
    primary: '#3B82F6', // Soft Royal Blue
    primaryDark: '#2563EB',
    secondary: '#34D399', // Emerald
    accent: '#FBBF24',
    icon: '#A1A1AA', // Zinc-400
    tabIconDefault: '#52525B', // Zinc-600
    tabIconSelected: tintColorDark,
    pillBg: '#27272A',
    taskbarBg: '#18181B', // Dark charcoal taskbar background
    taskbarActivePill: '#FAFAFA', // Stark White active pill in dark taskbar
    taskbarActiveText: '#09090B', // Black text on white taskbar pill
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
