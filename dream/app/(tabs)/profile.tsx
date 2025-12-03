import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../contexts/NotificationContext';
import { useTheme, Theme } from '../../contexts/ThemeContext';
import { useSocial } from '../../contexts/SocialContext';
import StatisticsCard from '../../components/StatisticsCard';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout, isAuthenticated, isAdmin } = useApp();
  const { notificationPermission, requestPermission } = useNotifications();
  const { theme, toggleTheme, colors } = useTheme();
  const { followedTeams } = useSocial();
  const router = useRouter();

  const [settings, setSettings] = useState({
    pushNotifications: notificationPermission,
    emailUpdates: true,
    soundEffects: true,
    vibration: true,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    notLoggedIn: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    notLoggedInText: {
      color: colors.text,
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 20,
    },
    loginButton: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 10,
      minWidth: 200,
      alignItems: 'center',
    },
    loginButtonText: {
      color: '#000',
      fontSize: 16,
      fontWeight: 'bold',
    },
    header: {
      alignItems: 'center',
      padding: 30,
      backgroundColor: colors.card,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15,
    },
    avatarText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
    },
    teamName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 5,
    },
    ranking: {
      fontSize: 16,
      color: colors.primary,
    },
    statsSection: {
      padding: 16,
    },
    settingsSection: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingLabel: {
      fontSize: 16,
      color: colors.text,
    },
    themeSelector: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 4,
      marginVertical: 16,
    },
    themeButton: {
      flex: 1,
      padding: 12,
      alignItems: 'center',
      borderRadius: 8,
    },
    themeButtonActive: {
      backgroundColor: colors.primary,
    },
    themeButtonText: {
      color: colors.text,
      fontWeight: 'bold',
    },
    themeButtonTextActive: {
      color: '#000',
    },
    actionsSection: {
      padding: 16,
    },
    actionButton: {
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    adminButton: {
      backgroundColor: '#3a2a2a',
      borderWidth: 1,
      borderColor: '#ffd700',
    },
    actionButtonText: {
      color: colors.primary,
      fontWeight: 'bold',
    },
    logoutButton: {
      backgroundColor: colors.error,
      marginTop: 10,
    },
    logoutButtonText: {
      color: '#fff',
    },
    contactSection: {
      padding: 20,
      alignItems: 'center',
      backgroundColor: colors.card,
      margin: 16,
      borderRadius: 10,
    },
    contactText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    contactNote: {
      color: colors.textSecondary,
      fontSize: 12,
    },
  });

  const playerStats = [
    { label: 'Matches Played', value: 15 },
    { label: 'Wins', value: 10, change: 5 },
    { label: 'Win Rate', value: '67%', change: 12 },
    { label: 'Goals Scored', value: 28 },
    { label: 'Goals Conceded', value: 15, change: -8 },
    { label: 'Clean Sheets', value: 6 },
  ];

  const teamStats = [
    { label: 'Tournaments', value: 3 },
    { label: 'Current Rank', value: '#1' },
    { label: 'Total Points', value: 32 },
    { label: 'Form', value: 'W-W-D-W' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.push('/');
          }
        }
      ]
    );
  };

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof settings],
    }));

    if (key === 'pushNotifications' && !settings.pushNotifications) {
      requestPermission();
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.notLoggedIn}>
          <Text style={styles.notLoggedInText}>Please login to view your profile</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth')}
          >
            <Text style={styles.loginButtonText}>Login / Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.avatar || user?.teamName?.substring(0, 2)}</Text>
        </View>
        <Text style={styles.teamName}>{user?.teamName}</Text>
        <Text style={styles.ranking}>Rank #1 • {followedTeams.length} Teams Followed</Text>
      </View>

      <View style={styles.statsSection}>
        <StatisticsCard title="Player Statistics" stats={playerStats} columns={3} />
        <StatisticsCard title="Team Performance" stats={teamStats} columns={2} />
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Appearance</Text>

        <View style={styles.themeSelector}>
          {(['light', 'dark', 'auto'] as Theme[]).map(themeOption => (
            <TouchableOpacity
              key={themeOption}
              style={[
                styles.themeButton,
                theme === themeOption && styles.themeButtonActive
              ]}
              onPress={() => toggleTheme(themeOption)}
            >
              <Text style={[
                styles.themeButtonText,
                theme === themeOption && styles.themeButtonTextActive
              ]}>
                {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Notifications</Text>
        {Object.entries(settings).map(([key, value]) => (
          <View key={key} style={styles.settingItem}>
            <Text style={styles.settingLabel}>
              {key.split(/(?=[A-Z])/).join(' ')}
            </Text>
            <Switch
              value={value}
              onValueChange={() => toggleSetting(key)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={value ? '#fff' : '#f4f3f4'}
            />
          </View>
        ))}
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {isAdmin && (
          <TouchableOpacity
            style={[styles.actionButton, styles.adminButton]}
            onPress={() => router.push('/admin')}
          >
            <Text style={styles.actionButtonText}>Admin Dashboard</Text>
            <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Tournament History</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Payment History</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Followed Teams</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
          <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Logout</Text>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Need Help?</Text>
        <Text style={styles.contactText}>+250 785 617 178</Text>
        <Text style={styles.contactNote}>24/7 Tournament Support</Text>
      </View>
    </ScrollView>
  );
}