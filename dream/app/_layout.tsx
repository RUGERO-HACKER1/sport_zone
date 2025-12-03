import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../contexts/AppContext';
import { SocketProvider } from '../contexts/SocketContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SocialProvider } from '../contexts/SocialContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppProvider>
        <SocketProvider>
          <NotificationProvider>
            <SocialProvider>
              <StatusBar style="auto" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="auth" />
              </Stack>
            </SocialProvider>
          </NotificationProvider>
        </SocketProvider>
      </AppProvider>
    </ThemeProvider>
  );
}