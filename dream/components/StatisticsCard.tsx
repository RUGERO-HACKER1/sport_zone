import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  icon?: string;
}

interface StatisticsCardProps {
  title: string;
  stats: StatItem[];
  columns?: number;
}

export default function StatisticsCard({ title, stats, columns = 2 }: StatisticsCardProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginVertical: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    statItem: {
      width: (width - 64) / columns - 8,
      alignItems: 'center',
      marginBottom: 16,
      padding: 12,
      backgroundColor: colors.background,
      borderRadius: 8,
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    change: {
      fontSize: 10,
      fontWeight: 'bold',
      marginTop: 2,
    },
    positive: {
      color: colors.success,
    },
    negative: {
      color: colors.error,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            {stat.change !== undefined && (
              <Text style={[
                styles.change,
                stat.change >= 0 ? styles.positive : styles.negative
              ]}>
                {stat.change >= 0 ? '+' : ''}{stat.change}%
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}