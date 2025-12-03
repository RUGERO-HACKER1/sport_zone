import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface Match {
  id: string;
  team1: string;
  team2: string;
  score1?: number;
  score2?: number;
  winner?: number;
  round: number;
  position: number;
}

interface TournamentBracketProps {
  matches: Match[];
  tournamentName: string;
}

export default function TournamentBracket({ matches, tournamentName }: TournamentBracketProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      backgroundColor: colors.card,
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    bracket: {
      flexDirection: 'row',
      padding: 16,
    },
    round: {
      flex: 1,
      marginHorizontal: 8,
    },
    roundTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.textSecondary,
      marginBottom: 16,
      textAlign: 'center',
    },
    match: {
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 8,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    winnerMatch: {
      padding: 12,
      borderRadius: 8,
      marginBottom: 24,
      borderWidth: 2,
      borderColor: colors.success,
      backgroundColor: `${colors.success}20`, // Fixed: removed duplicate backgroundColor
    },
    team: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 6,
    },
    teamName: {
      fontSize: 12,
      color: colors.text,
      flex: 1,
    },
    score: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.primary,
      marginLeft: 8,
      minWidth: 20,
      textAlign: 'center',
    },
    vs: {
      fontSize: 10,
      color: colors.textSecondary,
      textAlign: 'center',
      marginVertical: 4,
    },
  });

  const rounds = Array.from(new Set(matches.map(match => match.round))).sort();

  const getRoundName = (round: number) => {
    const roundNames = ['Final', 'Semi Finals', 'Quarter Finals', 'Round of 16', 'Round of 32'];
    return roundNames[round - 1] || `Round ${round}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{tournamentName} Bracket</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.bracket}>
          {rounds.map(round => (
            <View key={round} style={styles.round}>
              <Text style={styles.roundTitle}>{getRoundName(round)}</Text>
              {matches
                .filter(match => match.round === round)
                .sort((a, b) => a.position - b.position)
                .map(match => (
                  <View 
                    key={match.id} 
                    style={match.winner ? styles.winnerMatch : styles.match}
                  >
                    <View style={styles.team}>
                      <Text style={styles.teamName}>{match.team1}</Text>
                      <Text style={styles.score}>{match.score1 ?? '-'}</Text>
                    </View>
                    <Text style={styles.vs}>VS</Text>
                    <View style={styles.team}>
                      <Text style={styles.teamName}>{match.team2}</Text>
                      <Text style={styles.score}>{match.score2 ?? '-'}</Text>
                    </View>
                  </View>
                ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
}