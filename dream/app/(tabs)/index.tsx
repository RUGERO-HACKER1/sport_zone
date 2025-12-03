import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import { useSocket } from '../../contexts/SocketContext';
import { useTheme } from '../../contexts/ThemeContext';
import LiveMatchCard from '../../components/LiveMatchCard';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, user, tournaments } = useApp();
  const { onlinePlayers, liveMatches } = useSocket();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const upcomingTournament = tournaments[0];
  const registeredTeams = tournaments.reduce((total, t) => total + t.teams, 0);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      backgroundColor: colors.card,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primary,
    },
    onlineIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1a3a1a',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
    },
    onlineDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#4CAF50',
      marginRight: 6,
    },
    onlineText: {
      color: '#4CAF50',
      fontSize: 12,
      fontWeight: 'bold',
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.text,
      marginTop: 5,
    },
    welcomeText: {
      fontSize: 14,
      color: colors.primary,
      marginTop: 10,
      fontWeight: '600',
    },
    statsOverview: {
      flexDirection: 'row',
      padding: 15,
      justifyContent: 'space-between',
    },
    statCard: {
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      flex: 1,
      margin: 5,
    },
    statNumber: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary,
      marginVertical: 5,
    },
    statLabel: {
      color: colors.textSecondary,
      fontSize: 12,
      textAlign: 'center',
    },
    liveSection: {
      padding: 15,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    seeAllText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    quickActions: {
      padding: 15,
    },
    actionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    actionCard: {
      backgroundColor: colors.card,
      width: '48%',
      padding: 20,
      borderRadius: 10,
      marginBottom: 10,
      alignItems: 'center',
    },
    actionIcon: {
      marginBottom: 10,
    },
    actionText: {
      color: colors.primary,
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 12,
    },
    featuredTournament: {
      padding: 15,
    },
    tournamentCard: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 10,
    },
    tournamentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    tournamentName: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
    },
    tournamentStatus: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 15,
      fontSize: 12,
      fontWeight: 'bold',
    },
    statusOpen: {
      backgroundColor: '#4CAF50',
      color: '#fff',
    },
    statusSoon: {
      backgroundColor: '#FF9800',
      color: '#fff',
    },
    statusOngoing: {
      backgroundColor: '#2196F3',
      color: '#fff',
    },
    tournamentDetails: {
      gap: 10,
      marginBottom: 15,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    detailText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    joinButton: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    joinButtonText: {
      color: '#000',
      fontWeight: 'bold',
    },
    prizesSection: {
      padding: 15,
    },
    prizeList: {
      gap: 10,
    },
    prizeItem: {
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    firstPrize: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    prizePosition: {
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: 14,
      flex: 1,
    },
    prizeAmount: {
      color: colors.text,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
    },
    prizeTitle: {
      color: colors.textSecondary,
      fontStyle: 'italic',
      flex: 1,
      textAlign: 'right',
      fontSize: 12,
    },
    footer: {
      padding: 20,
      backgroundColor: colors.card,
      alignItems: 'center',
      marginTop: 10,
    },
    footerTitle: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    footerText: {
      color: colors.textSecondary,
      marginBottom: 5,
    },
    contactNumber: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    footerNote: {
      color: colors.textSecondary,
      fontSize: 12,
      fontStyle: 'italic',
    },
  });

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      {/* Header with Online Players */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>KIGALI TOUR DLS</Text>
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>{onlinePlayers} online</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>CHAMPIONS 2025</Text>
        {isAuthenticated && (
          <Text style={styles.welcomeText}>Welcome back, {user?.teamName}! 🏆</Text>
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsOverview}>
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color={colors.primary} />
          <Text style={styles.statNumber}>{tournaments.length}</Text>
          <Text style={styles.statLabel}>Active Tournaments</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color={colors.primary} />
          <Text style={styles.statNumber}>{registeredTeams}</Text>
          <Text style={styles.statLabel}>Teams Registered</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={24} color={colors.primary} />
          <Text style={styles.statNumber}>200K+</Text>
          <Text style={styles.statLabel}>Prize Pool</Text>
        </View>
      </View>

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <View style={styles.liveSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Live Matches</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {liveMatches.map((match) => (
            <LiveMatchCard key={match.id} match={match} />
          ))}
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/tournaments')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="trophy" size={24} color={colors.primary} />
            </View>
            <Text style={styles.actionText}>Join Tournament</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/leagues')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="stats-chart" size={24} color={colors.primary} />
            </View>
            <Text style={styles.actionText}>View Leagues</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/chat')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="chatbubbles" size={24} color={colors.primary} />
            </View>
            <Text style={styles.actionText}>Player Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="person" size={24} color={colors.primary} />
            </View>
            <Text style={styles.actionText}>My Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Featured Tournament */}
      <View style={styles.featuredTournament}>
        <Text style={styles.sectionTitle}>Featured Tournament</Text>
        <View style={styles.tournamentCard}>
          <View style={styles.tournamentHeader}>
            <Text style={styles.tournamentName}>{upcomingTournament?.name}</Text>
            <Text style={[
              styles.tournamentStatus,
              upcomingTournament?.status === 'Registration Open' ? styles.statusOpen : 
              upcomingTournament?.status === 'Starting Soon' ? styles.statusSoon : styles.statusOngoing
            ]}>
              {upcomingTournament?.status}
            </Text>
          </View>
          
          <View style={styles.tournamentDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="cash" size={16} color={colors.primary} />
              <Text style={styles.detailText}>Prize: {upcomingTournament?.prize}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="people" size={16} color={colors.primary} />
              <Text style={styles.detailText}>Teams: {upcomingTournament?.teams}/{upcomingTournament?.maxTeams}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color={colors.primary} />
              <Text style={styles.detailText}>Starts: {upcomingTournament?.startDate}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => router.push('/(tabs)/tournaments')}
          >
            <Text style={styles.joinButtonText}>View Tournament</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Prize Distribution */}
      <View style={styles.prizesSection}>
        <Text style={styles.sectionTitle}>🏆 Prize Distribution</Text>
        <View style={styles.prizeList}>
          <View style={[styles.prizeItem, styles.firstPrize]}>
            <Text style={styles.prizePosition}>🥇 1st Place</Text>
            <Text style={styles.prizeAmount}>40,000 RWF</Text>
            <Text style={styles.prizeTitle}>+ Ultimate Champion Title</Text>
          </View>
          <View style={styles.prizeItem}>
            <Text style={styles.prizePosition}>🥈 2nd Place</Text>
            <Text style={styles.prizeAmount}>20,000 RWF</Text>
            <Text style={styles.prizeTitle}>Rise of the Runner-Up</Text>
          </View>
          <View style={styles.prizeItem}>
            <Text style={styles.prizePosition}>🥉 3rd Place</Text>
            <Text style={styles.prizeAmount}>10,000 RWF</Text>
            <Text style={styles.prizeTitle}>Power Player Award</Text>
          </View>
          <View style={styles.prizeItem}>
            <Text style={styles.prizePosition}>4th Place</Text>
            <Text style={styles.prizeAmount}>5,000 RWF</Text>
            <Text style={styles.prizeTitle}>Gamers Boost Bundle</Text>
          </View>
        </View>
      </View>

      {/* Contact Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Need Help?</Text>
        <Text style={styles.footerText}>Contact our support team:</Text>
        <Text style={styles.contactNumber}>+250 785 617 178</Text>
        <Text style={styles.footerNote}>Available 24/7 for tournament support</Text>
      </View>
    </ScrollView>
  );
}