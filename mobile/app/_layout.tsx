import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { setRouter } from '../src/utils/navigation';
import { AuthProvider, useAuth } from '../src/store/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

// 🔥 This controls navigation based on auth
function AppNavigator() {
  const { user, loading } = useAuth();

  // ⏳ wait until auth is ready
  if (loading) return null;

  return (
    <Stack>
      {!user ? (
        <Stack.Screen name="login" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

// 🔥 Root Layout
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // Inject router globally
  useEffect(() => {
    setRouter(router);
  }, [router]);

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}