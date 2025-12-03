import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { apiFetch, buildAuthHeaders } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Registration {
    id: string;
    status: string;
    paymentStatus: string;
    paymentProof?: string;
    createdAt: string;
    User: {
        teamName: string;
        email: string;
        phone: string;
    };
    Tournament: {
        name: string;
        fee: string;
    };
}

export default function AdminRegistrations() {
    const { colors } = useTheme();
    const router = useRouter();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProof, setSelectedProof] = useState<string | null>(null);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const token = await AsyncStorage.getItem('sport-zone-auth').then(res => res ? JSON.parse(res).token : null);
            if (!token) return;

            const response = await apiFetch('/api/admin/registrations', {
                headers: buildAuthHeaders(token)
            });
            if (response.success) {
                setRegistrations(response.data);
            }
        } catch (error) {
            console.log('Failed to fetch registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string, paymentStatus: string) => {
        try {
            const token = await AsyncStorage.getItem('sport-zone-auth').then(res => res ? JSON.parse(res).token : null);
            if (!token) return;

            const response = await apiFetch(`/api/admin/registrations/${id}/status`, {
                method: 'PUT',
                headers: buildAuthHeaders(token),
                body: JSON.stringify({ status, paymentStatus })
            });

            if (response.success) {
                Alert.alert('Success', 'Registration updated');
                fetchRegistrations();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update registration');
        }
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
        list: {
            padding: 15,
        },
        card: {
            backgroundColor: colors.card,
            padding: 15,
            borderRadius: 12,
            marginBottom: 10,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
        },
        label: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        value: {
            fontSize: 14,
            color: colors.text,
            fontWeight: 'bold',
        },
        actions: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 10,
            gap: 10,
        },
        button: {
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 8,
        },
        approveButton: {
            backgroundColor: '#4CAF50',
        },
        rejectButton: {
            backgroundColor: '#F44336',
        },
        viewProofButton: {
            backgroundColor: '#2196F3',
            marginRight: 'auto', // Push to left
        },
        buttonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 12,
        },
        statusBadge: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
            backgroundColor: colors.background,
        },
        modalContainer: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.9)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        proofImage: {
            width: '90%',
            height: '80%',
            resizeMode: 'contain',
        },
        closeButton: {
            position: 'absolute',
            top: 40,
            right: 20,
            padding: 10,
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
                <Text style={styles.title}>Payment Approvals</Text>
                <View style={{ width: 44 }} />
            </View>

            <FlatList
                data={registrations}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.value}>{item.User.teamName}</Text>
                            <View style={styles.statusBadge}>
                                <Text style={{ color: item.paymentStatus === 'paid' ? '#4CAF50' : '#FFC107', fontWeight: 'bold' }}>
                                    {item.paymentStatus.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.label}>Tournament: <Text style={styles.value}>{item.Tournament.name}</Text></Text>
                        <Text style={styles.label}>Fee: <Text style={styles.value}>{item.Tournament.fee}</Text></Text>
                        <Text style={styles.label}>Phone: <Text style={styles.value}>{item.User.phone}</Text></Text>

                        <View style={styles.actions}>
                            {item.paymentProof && (
                                <TouchableOpacity
                                    style={[styles.button, styles.viewProofButton]}
                                    onPress={() => setSelectedProof(`${process.env.EXPO_PUBLIC_API_URL}${item.paymentProof}`)}
                                >
                                    <Text style={styles.buttonText}>View Proof</Text>
                                </TouchableOpacity>
                            )}

                            {item.paymentStatus === 'pending' && (
                                <>
                                    <TouchableOpacity
                                        style={[styles.button, styles.rejectButton]}
                                        onPress={() => updateStatus(item.id, 'rejected', 'failed')}
                                    >
                                        <Text style={styles.buttonText}>Reject</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, styles.approveButton]}
                                        onPress={() => updateStatus(item.id, 'confirmed', 'paid')}
                                    >
                                        <Text style={styles.buttonText}>Approve</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                )}
            />

            <Modal visible={!!selectedProof} transparent={true} onRequestClose={() => setSelectedProof(null)}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedProof(null)}>
                        <Ionicons name="close-circle" size={40} color="#fff" />
                    </TouchableOpacity>
                    {selectedProof && (
                        <Image source={{ uri: selectedProof }} style={styles.proofImage} />
                    )}
                </View>
            </Modal>
        </View>
    );
}
