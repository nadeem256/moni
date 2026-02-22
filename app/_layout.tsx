import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { PremiumProvider } from '@/contexts/PremiumContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  useFrameworkReady();

  const slideFromRight = {
    animation: 'slide_from_right' as const,
    gestureDirection: 'horizontal' as const,
  };

  const fadeIn = {
    animation: 'fade' as const,
  };

  return (
    <AuthProvider>
      <PremiumProvider>
        <ThemeProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
          >
            <Stack.Screen
              name="index"
              options={fadeIn}
            />
            <Stack.Screen
              name="(tabs)"
              options={fadeIn}
            />
            <Stack.Screen
              name="auth/sign-in"
              options={{
                animation: 'fade_from_bottom',
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="auth/sign-up"
              options={{
                animation: 'fade_from_bottom',
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="settings"
              options={slideFromRight}
            />
            <Stack.Screen
              name="edit-profile"
              options={slideFromRight}
            />
            <Stack.Screen
              name="transaction-history"
              options={slideFromRight}
            />
            <Stack.Screen
              name="privacy-policy"
              options={slideFromRight}
            />
            <Stack.Screen
              name="terms-of-service"
              options={slideFromRight}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </PremiumProvider>
    </AuthProvider>
  );
}
