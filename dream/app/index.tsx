import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';

export default function IndexScreen() {
  const router = useRouter();
  const { isHydrated, isAuthenticated, isAdmin } = useApp();
  const { colors } = useTheme();

  useEffect(() => {
    console.log('IndexScreen: Checking auth state', { isHydrated, isAuthenticated, isAdmin });
    if (!isHydrated) return;

    // FORCE LOGOUT FOR TESTING
    // AsyncStorage.removeItem('sport-zone-auth'); 
    // Uncommenting the above line would force logout, but let's just rely on the user following instructions first.
    // Actually, the user seems stuck. Let's force it once.

    if (isAuthenticated) {
      if (isAdmin) {
        console.log('IndexScreen: Redirecting to /admin');
        router.replace('/admin');
      } else {
        console.log('IndexScreen: Redirecting to /(tabs)');
        router.replace('/(tabs)');
      }
    } else {
      console.log('IndexScreen: Redirecting to /auth');
      router.replace('/auth');
    }
  }, [isHydrated, isAuthenticated, isAdmin, router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});