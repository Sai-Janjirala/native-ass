import { Platform, useColorScheme } from 'react-native';

const tintColorLight = '#09090B'; // Obsidian Black
const tintColorDark = '#FAFAFA'; // Stark White

export const Colors = {
  light: {
    text: '#09090B', // Charcoal Black
    background: '#F4F4F5', // Soft Zinc backdrop
    surface: '#FFFFFF', // Pure White card
    surfaceBorder: '#E4E4E7', // Soft Zinc border
    tint: tintColorLight,
    primary: '#09090B', // Obsidian Black
    primaryDark: '#18181B',
    secondary: '#27272A', // Deep Zinc
    accent: '#52525B', // Slate Charcoal
    icon: '#71717A', // Zinc-500
    tabIconDefault: '#A1A1AA', // Zinc-400
    tabIconSelected: tintColorLight,
    pillBg: '#E4E4E7', // Zinc pill background
    pillActiveBg: '#09090B', // Active obsidian pill
    pillActiveText: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.08)',
  },
  dark: {
    text: '#FAFAFA', // Stark White
    background: '#09090B', // Deep Obsidian Black
    surface: '#141417', // Dark Obsidian surface card
    surfaceBorder: '#27272A', // Dark Zinc border
    tint: tintColorDark,
    primary: '#FAFAFA', // Crisp Stark White
    primaryDark: '#E4E4E7',
    secondary: '#A1A1AA', // Soft Zinc
    accent: '#71717A',
    icon: '#A1A1AA', // Zinc-400
    tabIconDefault: '#52525B', // Zinc-600
    tabIconSelected: tintColorDark,
    pillBg: '#27272A', // Dark pill container
    pillActiveBg: '#FAFAFA', // Active white pill
    pillActiveText: '#09090B',
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
