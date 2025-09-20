import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { PremiumProvider } from '@/contexts/PremiumContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <PremiumProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
          <Stack.Screen name="settings" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PremiumProvider>
  );
}
