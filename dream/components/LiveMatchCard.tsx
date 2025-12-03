import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface LiveMatch {
  id: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  minute: number;
  status: string;
}

interface LiveMatchCardProps {
  match: LiveMatch;
  onPress?: () => void;
}

export default function LiveMatchCard({ match, onPress }: LiveMatchCardProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 10,
      marginVertical: 5,
      borderLeftWidth: 3,
      borderLeftColor: '#FF4444',
    },
    liveIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#FF4444',
      marginRight: 6,
    },
    liveText: {
      color: '#FF4444',
      fontSize: 12,
      fontWeight: 'bold',
    },
    teamsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    team: {
      flex: 1,
      alignItems: 'center',
    },
    teamName: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 5,
    },
    score: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: 'bold',
    },
    vsContainer: {
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    vsText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    minute: {
      color: '#4CAF50',
      fontSize: 11,
      fontWeight: 'bold',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.liveIndicator}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>
      
      <View style={styles.teamsContainer}>
        <View style={styles.team}>
          <Text style={styles.teamName} numberOfLines={1}>{match.team1}</Text>
          <Text style={styles.score}>{match.score1}</Text>
        </View>
        
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
          <Text style={styles.minute}>{match.minute}'</Text>
        </View>
        
        <View style={styles.team}>
          <Text style={styles.score}>{match.score2}</Text>
          <Text style={styles.teamName} numberOfLines={1}>{match.team2}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}