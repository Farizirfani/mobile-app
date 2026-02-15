import { useTheme } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';
import React from 'react';

export default function MyStuffLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false, // Optional: remove shadow for cleaner look
      }}
    >
      <Stack.Screen name="notes" options={{ title: 'Notes', headerShown: false }} />
      <Stack.Screen name="quizzes" options={{ title: 'Quiz Results', headerShown: false }} />
      <Stack.Screen name="progress" options={{ title: 'Progress', headerShown: false }} />
      <Stack.Screen name="bookmarks" options={{ title: 'Bookmarks', headerShown: false }} />
    </Stack>
  );
}
