/**
 * EduFocus Theme Colors & Design Tokens
 */

import { Platform } from 'react-native';

export const Colors = {
  primary: '#4A6CF7',
  primaryDark: '#3B5DE7',
  primaryLight: '#6B8AFF',
  accent: '#22C55E',
  accentLight: '#4ADE80',

  light: {
    text: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F5F9',
    border: '#E2E8F0',
    tint: '#4A6CF7',
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#4A6CF7',
    cardShadow: 'rgba(0, 0, 0, 0.06)',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    progressBg: '#E2E8F0',
  },
  dark: {
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    background: '#0F172A',
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    border: '#334155',
    tint: '#6B8AFF',
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: '#6B8AFF',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',
    progressBg: '#334155',
  },
};

// Subject icon colors for course cards
export const SubjectColors: Record<string, { bg: string; text: string; darkBg?: string }> = {
  Mathematics: { bg: '#EEF2FF', text: '#4A6CF7', darkBg: 'rgba(74, 108, 247, 0.15)' },
  Biology: { bg: '#F0FDF4', text: '#22C55E', darkBg: 'rgba(34, 197, 94, 0.15)' },
  Chemistry: { bg: '#FFF7ED', text: '#F59E0B', darkBg: 'rgba(245, 158, 11, 0.15)' },
  Physics: { bg: '#FDF2F8', text: '#EC4899', darkBg: 'rgba(236, 72, 153, 0.15)' },
  History: { bg: '#FFFBEB', text: '#D97706', darkBg: 'rgba(217, 119, 6, 0.15)' },
  English: { bg: '#EFF6FF', text: '#3B82F6', darkBg: 'rgba(59, 130, 246, 0.15)' },
  default: { bg: '#F1F5F9', text: '#64748B', darkBg: 'rgba(100, 116, 139, 0.15)' },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Menlo',
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
    rounded: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
