import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';

const { width } = Dimensions.get('window');

interface TeamStanding {
  position: number;
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[]; // W, D, L
}

export default function LeaguesScreen() {
  const [activeLeague, setActiveLeague] = useState('premier');

  const leagues = {
    premier: {
      name: 'Premier League',
      standings: [
        { position: 1, team: 'Kigali Warriors', played: 10, wins: 8, draws: 1, losses: 1, goalsFor: 25, goalsAgainst: 8, goalDifference: 17, points: 25, form: ['W', 'W', 'W', 'D', 'W'] },
        { position: 2, team: 'Dream FC', played: 10, wins: 7, draws: 2, losses: 1, goalsFor: 22, goalsAgainst: 10, goalDifference: 12, points: 23, form: ['W', 'D', 'W', 'W', 'W'] },
        { position: 3, team: 'Champions United', played: 10, wins: 6, draws: 3, losses: 1, goalsFor: 20, goalsAgainst: 12, goalDifference: 8, points: 21, form: ['W', 'D', 'D', 'W', 'W'] },
        { position: 4, team: 'Victory FC', played: 10, wins: 6, draws: 2, losses: 2, goalsFor: 18, goalsAgainst: 11, goalDifference: 7, points: 20, form: ['W', 'L', 'W', 'W', 'D'] },
        { position: 5, team: 'Glory Hunters', played: 10, wins: 5, draws: 3, losses: 2, goalsFor: 16, goalsAgainst: 12, goalDifference: 4, points: 18, form: ['D', 'W', 'W', 'L', 'W'] },
        { position: 6, team: 'Rwanda Kings', played: 10, wins: 4, draws: 4, losses: 2, goalsFor: 15, goalsAgainst: 13, goalDifference: 2, points: 16, form: ['D', 'D', 'W', 'W', 'L'] },
        { position: 7, team: 'Mountain FC', played: 10, wins: 4, draws: 3, losses: 3, goalsFor: 14, goalsAgainst: 14, goalDifference: 0, points: 15, form: ['W', 'L', 'D', 'W', 'D'] },
        { position: 8, team: 'Lake Side', played: 10, wins: 3, draws: 5, losses: 2, goalsFor: 12, goalsAgainst: 11, goalDifference: 1, points: 14, form: ['D', 'D', 'D', 'W', 'L'] },
      ] as TeamStanding[]
    },
    championship: {
      name: 'Championship',
      standings: [
        { position: 1, team: 'Young Stars', played: 8, wins: 6, draws: 1, losses: 1, goalsFor: 18, goalsAgainst: 6, goalDifference: 12, points: 19, form: ['W', 'W', 'W', 'D', 'W'] },
        { position: 2, team: 'Future FC', played: 8, wins: 5, draws: 2, losses: 1, goalsFor: 15, goalsAgainst: 8, goalDifference: 7, points: 17, form: ['W', 'D', 'W', 'L', 'W'] },
        { position: 3, team: 'Rising Phoenix', played: 8, wins: 4, draws: 3, losses: 1, goalsFor: 12, goalsAgainst: 7, goalDifference: 5, points: 15, form: ['D', 'W', 'D', 'W', 'D'] },
      ] as TeamStanding[]
    }
  };

  const currentLeague = leagues[activeLeague as keyof typeof leagues];

  const getFormColor = (result: string) => {
    switch (result) {
      case 'W': return '#4CAF50';
      case 'D': return '#FF9800';
      case 'L': return '#F44336';
      default: return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>League Standings</Text>
        <Text style={styles.subtitle}>Kigali Tour DLS 2025</Text>
      </View>

      {/* League Selection */}
      <View style={styles.leagueSelector}>
        <TouchableOpacity 
          style={[
            styles.leagueButton, 
            activeLeague === 'premier' && styles.activeLeagueButton
          ]}
          onPress={() => setActiveLeague('premier')}
        >
          <Text style={[
            styles.leagueButtonText,
            activeLeague === 'premier' && styles.activeLeagueButtonText
          ]}>
            Premier League
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.leagueButton, 
            activeLeague === 'championship' && styles.activeLeagueButton
          ]}
          onPress={() => setActiveLeague('championship')}
        >
          <Text style={[
            styles.leagueButtonText,
            activeLeague === 'championship' && styles.activeLeagueButtonText
          ]}>
            Championship
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.tableContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.positionHeader]}>#</Text>
          <Text style={[styles.headerCell, styles.teamHeader]}>Team</Text>
          <Text style={styles.headerCell}>PL</Text>
          <Text style={styles.headerCell}>W</Text>
          <Text style={styles.headerCell}>D</Text>
          <Text style={styles.headerCell}>L</Text>
          <Text style={styles.headerCell}>GD</Text>
          <Text style={styles.headerCell}>PTS</Text>
          <Text style={styles.headerCell}>Form</Text>
        </View>

        {/* Table Rows */}
        {currentLeague.standings.map((team) => (
          <View 
            key={team.position} 
            style={[
              styles.tableRow,
              team.position <= 4 && styles.topFourRow,
              team.position === 1 && styles.championRow
            ]}
          >
            <Text style={[
              styles.cell, 
              styles.positionCell,
              team.position <= 4 && styles.topFourText,
              team.position === 1 && styles.championText
            ]}>
              {team.position}
            </Text>
            
            <View style={[styles.cell, styles.teamCell]}>
              <Text style={[
                styles.teamName,
                team.position === 1 && styles.championText
              ]}>
                {team.team}
              </Text>
            </View>
            
            <Text style={styles.cell}>{team.played}</Text>
            <Text style={styles.cell}>{team.wins}</Text>
            <Text style={styles.cell}>{team.draws}</Text>
            <Text style={styles.cell}>{team.losses}</Text>
            <Text style={[
              styles.cell,
              team.goalDifference > 0 ? styles.positiveGD : 
              team.goalDifference < 0 ? styles.negativeGD : styles.neutralGD
            ]}>
              {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
            </Text>
            <Text style={[styles.cell, styles.points]}>{team.points}</Text>
            
            <View style={[styles.cell, styles.formCell]}>
              <View style={styles.formContainer}>
                {team.form.map((result, index) => (
                  <View 
                    key={index}
                    style={[
                      styles.formIndicator,
                      { backgroundColor: getFormColor(result) }
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Champions League</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.legendText}>Promotion</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.legendText}>Relegation</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    backgroundColor: '#2a2a2a',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 4,
  },
  leagueSelector: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#2a2a2a',
  },
  leagueButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: '#333',
  },
  activeLeagueButton: {
    backgroundColor: '#ffd700',
  },
  leagueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeLeagueButtonText: {
    color: '#000',
  },
  tableContainer: {
    flex: 1,
    margin: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  positionHeader: {
    flex: 0.5,
  },
  teamHeader: {
    flex: 2,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#2a2a2a',
  },
  topFourRow: {
    backgroundColor: '#1a2e1a',
  },
  championRow: {
    backgroundColor: '#2a3a1a',
  },
  cell: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 2,
  },
  positionCell: {
    flex: 0.5,
    fontWeight: 'bold',
  },
  teamCell: {
    flex: 2,
    textAlign: 'left',
  },
  teamName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  points: {
    fontWeight: 'bold',
    color: '#ffd700',
  },
  formCell: {
    flex: 1.2,
  },
  formContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  topFourText: {
    color: '#4CAF50',
  },
  championText: {
    color: '#ffd700',
    fontWeight: 'bold',
  },
  positiveGD: {
    color: '#4CAF50',
  },
  negativeGD: {
    color: '#F44336',
  },
  neutralGD: {
    color: '#ccc',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#2a2a2a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    color: '#ccc',
    fontSize: 10,
  },
});