import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { apiFetch, buildAuthHeaders } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Tournament {
    id: string;
    name: string;
    status: string;
    maxTeams: number;
    entryFee: number;
    prizePool: string;
    startDate: string;
    endDate: string;
    description: string;
}

export default function AdminTournaments() {
    const { colors } = useTheme();
    const router = useRouter();
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [maxTeams, setMaxTeams] = useState('');
    const [entryFee, setEntryFee] = useState('');
    const [prizePool, setPrizePool] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const response = await apiFetch('/api/tournaments');
            if (Array.isArray(response.data)) {
                setTournaments(response.data);
            }
        } catch (error) {
            console.log('Failed to fetch tournaments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const token = await AsyncStorage.getItem('sport-zone-auth').then(res => res ? JSON.parse(res).token : null);
            if (!token) return;

            const response = await apiFetch('/api/tournaments', {
                method: 'POST',
                headers: buildAuthHeaders(token),
                body: JSON.stringify({
                    name,
                    description,
                    maxTeams: parseInt(maxTeams),
                    entryFee: parseFloat(entryFee),
                    prizePool,
                    startDate: new Date(startDate).toISOString(), // Simple date parsing, might need better picker
                    endDate: new Date(endDate).toISOString(),
                })
            });

            if (response.success) {
                Alert.alert('Success', 'Tournament created successfully');
                setModalVisible(false);
                fetchTournaments();
                resetForm();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to create tournament');
            console.log(error);
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setMaxTeams('');
        setEntryFee('');
        setPrizePool('');
        setStartDate('');
        setEndDate('');
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            padding: 20,
            backgroundColor: colors.card,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
        },
        backButton: {
            padding: 10,
        },
        addButton: {
            padding: 10,
        },
        list: {
            padding: 15,
        },
        card: {
            backgroundColor: colors.card,
            padding: 15,
            borderRadius: 12,
            marginBottom: 10,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 5,
        },
        cardDetail: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 2,
        },
        statusBadge: {
            alignSelf: 'flex-start',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
            backgroundColor: colors.primary + '20',
            marginTop: 5,
        },
        statusText: {
            fontSize: 12,
            color: colors.primary,
            fontWeight: 'bold',
        },
        // Modal Styles
        modalContainer: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            height: '80%',
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
        },
        input: {
            backgroundColor: colors.card,
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
            color: colors.text,
        },
        createButton: {
            backgroundColor: colors.primary,
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginTop: 10,
        },
        createButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Manage Tournaments</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                    <Ionicons name="add-circle" size={28} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={tournaments}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.cardDetail}>💰 Prize: {item.prizePool}</Text>
                        <Text style={styles.cardDetail}>👥 Teams: {item.maxTeams}</Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                        </View>
                    </View>
                )}
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Tournament</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TextInput style={styles.input} placeholder="Tournament Name" placeholderTextColor={colors.textSecondary} value={name} onChangeText={setName} />
                            <TextInput style={styles.input} placeholder="Description" placeholderTextColor={colors.textSecondary} value={description} onChangeText={setDescription} multiline />
                            <TextInput style={styles.input} placeholder="Max Teams (e.g. 16)" placeholderTextColor={colors.textSecondary} value={maxTeams} onChangeText={setMaxTeams} keyboardType="numeric" />
                            <TextInput style={styles.input} placeholder="Entry Fee (RWF)" placeholderTextColor={colors.textSecondary} value={entryFee} onChangeText={setEntryFee} keyboardType="numeric" />
                            <TextInput style={styles.input} placeholder="Prize Pool" placeholderTextColor={colors.textSecondary} value={prizePool} onChangeText={setPrizePool} />
                            <TextInput style={styles.input} placeholder="Start Date (YYYY-MM-DD)" placeholderTextColor={colors.textSecondary} value={startDate} onChangeText={setStartDate} />
                            <TextInput style={styles.input} placeholder="End Date (YYYY-MM-DD)" placeholderTextColor={colors.textSecondary} value={endDate} onChangeText={setEndDate} />

                            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                                <Text style={styles.createButtonText}>Create Tournament</Text>
                            </TouchableOpacity>
                            <View style={{ height: 40 }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
