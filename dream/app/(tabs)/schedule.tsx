import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { apiFetch } from '../../lib/api';

interface Match {
  id: string;
  team1: string;
  team2: string;
  score1?: number;
  score2?: number;
  date: string;
  time: string;
  tournament: string;
  round: string;
  status: 'upcoming' | 'live' | 'completed';
  dayKey: string;
}

const matchStatusMap: Record<string, Match['status']> = {
  scheduled: 'upcoming',
  upcoming: 'upcoming',
  live: 'live',
  completed: 'completed',
  cancelled: 'completed',
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const formatDateKey = (date: Date) => date.toISOString().split('T')[0];

const formatDayLabel = (date: Date) =>
  date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const mapMatchFromApi = (item: any): Match => {
  const kickoff = item.matchDate ? new Date(item.matchDate) : new Date();
  return {
    id: item.id,
    team1: item.homeTeam?.name || 'TBD',
    team2: item.awayTeam?.name || 'TBD',
    score1: item.score?.home ?? item.homeScore ?? undefined,
    score2: item.score?.away ?? item.awayScore ?? undefined,
    date: kickoff.toDateString(),
    time:
      item.readableTime ||
      kickoff.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tournament: item.tournamentName || item.Tournament?.name || 'Tournament',
    round:
      typeof item.round === 'string'
        ? item.round
        : `Round ${item.round ?? 1}`,
    status: matchStatusMap[item.status] || 'upcoming',
    dayKey: formatDateKey(kickoff),
  };
};

export default function ScheduleScreen() {
  const { colors } = useTheme();
  const [selectedDay, setSelectedDay] = useState('today');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [baseDate] = useState(() => new Date());

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const response = await apiFetch('/api/matches');
        const normalized = Array.isArray(response.data)
          ? response.data.map(mapMatchFromApi)
          : [];
        setMatches(normalized);
      } catch (error) {
        console.log('Failed to fetch matches', error);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  const dayOptions = useMemo(() => {
    const today = baseDate;
    const tomorrow = addDays(baseDate, 1);
    const dayAfter = addDays(baseDate, 2);

    return [
      { id: 'today', label: 'Today', date: formatDayLabel(today), key: formatDateKey(today) },
      { id: 'tomorrow', label: 'Tomorrow', date: formatDayLabel(tomorrow), key: formatDateKey(tomorrow) },
      { id: 'day3', label: formatDayLabel(dayAfter), date: formatDayLabel(dayAfter), key: formatDateKey(dayAfter) },
    ];
  }, [baseDate]);

  const dayKeyMap = useMemo(() => {
    return dayOptions.reduce<Record<string, string>>((acc, option) => {
      acc[option.id] = option.key;
      return acc;
    }, {});
  }, [dayOptions]);

  const filteredMatches = dayKeyMap[selectedDay]
    ? matches.filter(match => match.dayKey === dayKeyMap[selectedDay])
    : matches;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'live': return '#FF4444';
      case 'upcoming': return '#FF9800';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'COMPLETED';
      case 'live': return 'LIVE';
      case 'upcoming': return 'UPCOMING';
      default: return status.toUpperCase();
    }
  };

  // Define styles inside the component to access colors
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      backgroundColor: colors.card,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },
    daySelector: {
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    daySelectorContent: {
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    dayButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      marginHorizontal: 5,
      backgroundColor: colors.card,
      alignItems: 'center',
      minWidth: 80,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dayButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    dayLabel: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 14,
    },
    dayLabelActive: {
      color: '#000',
    },
    dayDate: {
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 2,
    },
    dayDateActive: {
      color: '#333',
    },
    matchesContainer: {
      flex: 1,
      padding: 15,
    },
    matchCard: {
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
    },
    matchHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    tournamentName: {
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: 14,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
    },
    statusText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: 'bold',
    },
    roundText: {
      color: colors.textSecondary,
      fontSize: 12,
      marginBottom: 15,
    },
    matchContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    team: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
    },
    teamName: {
      color: colors.text,
      fontWeight: '600',
      fontSize: 14,
      textAlign: 'center',
    },
    score: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: 'bold',
      minWidth: 20,
      textAlign: 'center',
    },
    vsContainer: {
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    vsText: {
      color: colors.textSecondary,
      fontWeight: 'bold',
      fontSize: 12,
      marginBottom: 4,
    },
    matchTime: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    matchFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 10,
    },
    dateInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    dateText: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    detailsButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.card,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.border,
    },
    detailsButtonText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: 'bold',
    },
    noMatches: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 10,
      margin: 15,
      alignItems: 'center',
    },
    noMatchesText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
    noMatchesSubtext: {
      color: colors.textSecondary,
      marginTop: 6,
      textAlign: 'center',
      fontSize: 12,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Match Schedule</Text>
        <Text style={styles.subtitle}>Tournament fixtures and results</Text>
      </View>

      {/* Day Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.daySelector}
        contentContainerStyle={styles.daySelectorContent}
      >
        {dayOptions.map((day) => (
          <TouchableOpacity
            key={day.id}
            style={[
              styles.dayButton,
              selectedDay === day.id && styles.dayButtonActive
            ]}
            onPress={() => setSelectedDay(day.id)}
          >
            <Text style={[
              styles.dayLabel,
              selectedDay === day.id && styles.dayLabelActive
            ]}>
              {day.label}
            </Text>
            <Text style={[
              styles.dayDate,
              selectedDay === day.id && styles.dayDateActive
            ]}>
              {day.date}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.matchesContainer}>
        {loading ? (
          <View style={styles.noMatches}>
            <Text style={styles.noMatchesText}>Loading schedule...</Text>
            <Text style={styles.noMatchesSubtext}>Fetching the latest fixtures</Text>
          </View>
        ) : filteredMatches.length === 0 ? (
          <View style={styles.noMatches}>
            <Text style={styles.noMatchesText}>No matches scheduled</Text>
            <Text style={styles.noMatchesSubtext}>
              Check back later or try another day
            </Text>
          </View>
        ) : (
          filteredMatches.map((match) => (
            <View key={match.id} style={styles.matchCard}>
              <View style={styles.matchHeader}>
                <Text style={styles.tournamentName}>{match.tournament}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(match.status) }
                ]}>
                  <Text style={styles.statusText}>{getStatusText(match.status)}</Text>
                </View>
              </View>

              <Text style={styles.roundText}>{match.round}</Text>

              <View style={styles.matchContent}>
                <View style={styles.team}>
                  <Text style={styles.teamName}>{match.team1}</Text>
                  {match.status === 'completed' && (
                    <Text style={styles.score}>{match.score1}</Text>
                  )}
                </View>

                <View style={styles.vsContainer}>
                  <Text style={styles.vsText}>VS</Text>
                  <Text style={styles.matchTime}>{match.time}</Text>
                </View>

                <View style={styles.team}>
                  {match.status === 'completed' && (
                    <Text style={styles.score}>{match.score2}</Text>
                  )}
                  <Text style={styles.teamName}>{match.team2}</Text>
                </View>
              </View>

              <View style={styles.matchFooter}>
                <View style={styles.dateInfo}>
                  <Ionicons name="calendar" size={14} color={colors.textSecondary} />
                  <Text style={styles.dateText}>{match.date}</Text>
                </View>
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}