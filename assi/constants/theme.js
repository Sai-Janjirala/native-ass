import { Platform } from 'react-native';

const tintColorLight = '#000000'; // Pure black
const tintColorDark = '#FFFFFF'; // Pure white

export const Colors = {
  light: {
    text: '#09090B', // Zinc-950 (Charcoal Black)
    background: '#FFFFFF', // Pure White
    tint: tintColorLight,
    icon: '#71717A', // Zinc-500
    tabIconDefault: '#A1A1AA', // Zinc-400
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FAFAFA', // Zinc-50 (Pure White)
    background: '#000000', // Pure Black
    tint: tintColorDark,
    icon: '#A1A1AA', // Zinc-400
    tabIconDefault: '#3F3F46', // Zinc-700
    tabIconSelected: tintColorDark,
  },
};

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
