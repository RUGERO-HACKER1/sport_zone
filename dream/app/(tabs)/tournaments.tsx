import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import PaymentModal from '../../components/PaymentModal';

export default function TournamentsScreen() {
  const { tournaments, registerForTournament, isAuthenticated } = useApp();
  const [paymentModal, setPaymentModal] = useState<{
    visible: boolean;
    tournamentId: string;
    tournamentName: string;
  }>({ visible: false, tournamentId: '', tournamentName: '' });

  const handleRegister = async (tournamentId: string, tournamentName: string) => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to register for tournaments');
      return;
    }

    // Show payment modal
    setPaymentModal({
      visible: true,
      tournamentId,
      tournamentName
    });
  };

  const handlePaymentSuccess = async (tournamentId: string) => {
    try {
      const success = await registerForTournament(tournamentId);
      if (success) {
        Alert.alert('Success', 'Tournament registration completed!');
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again later.');
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Active Tournaments</Text>
          <Text style={styles.subtitle}>Register now to compete for prizes</Text>
        </View>

        {tournaments.map((tournament) => (
          <View key={tournament.id} style={styles.tournamentCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.tournamentName}>{tournament.name}</Text>
              <Text style={[
                styles.status,
                tournament.status === 'Registration Open' ? styles.statusOpen : 
                tournament.status === 'Starting Soon' ? styles.statusSoon :
                tournament.status === 'Ongoing' ? styles.statusOngoing : styles.statusCompleted
              ]}>
                {tournament.status}
              </Text>
            </View>
            
            <Text style={styles.description}>{tournament.description}</Text>
            
            <View style={styles.details}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Teams Registered</Text>
                <Text style={styles.detailValue}>{tournament.teams}/{tournament.maxTeams}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Entry Fee</Text>
                <Text style={styles.detailValue}>{tournament.fee}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Prize Pool</Text>
                <Text style={styles.detailValue}>{tournament.prize}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Dates</Text>
                <Text style={styles.detailValue}>{tournament.startDate} - {tournament.endDate}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[
                styles.registerButton,
                (tournament.status !== 'Registration Open' || tournament.teams >= tournament.maxTeams) && 
                styles.registerButtonDisabled
              ]}
              onPress={() => handleRegister(tournament.id, tournament.name)}
              disabled={tournament.status !== 'Registration Open' || tournament.teams >= tournament.maxTeams}
            >
              <Text style={styles.registerButtonText}>
                {tournament.teams >= tournament.maxTeams ? 'Tournament Full' :
                 tournament.status !== 'Registration Open' ? 'Registration Closed' : 'Register Now'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💰 Payment Information</Text>
          <Text style={styles.infoText}>
            • Registration fee: 500 RWF per team{'\n'}
            • Payment methods: Mobile Money & Credit/Debit Cards{'\n'}
            • Instant registration confirmation{'\n'}
            • Contact: +250 785 617 178 for support
          </Text>
        </View>
      </ScrollView>

      <PaymentModal
        visible={paymentModal.visible}
        onClose={() => setPaymentModal({ visible: false, tournamentId: '', tournamentName: '' })}
        onPaymentSuccess={() => {
          handlePaymentSuccess(paymentModal.tournamentId);
          setPaymentModal({ visible: false, tournamentId: '', tournamentName: '' });
        }}
        tournamentName={paymentModal.tournamentName}
        amount="500 RWF"
      />
    </>
  );
}

// ... keep the same styles from previous version
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
  tournamentCard: {
    backgroundColor: '#2a2a2a',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tournamentName: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  status: {
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
  statusCompleted: {
    backgroundColor: '#9E9E9E',
    color: '#fff',
  },
  details: {
    gap: 10,
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    color: '#ccc',
  },
  detailValue: {
    color: '#fff',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#ffd700',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonDisabled: {
    backgroundColor: '#666',
  },
  registerButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#2a2a2a',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  infoTitle: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
});