import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function AdminDashboard() {
    const { user, isAdmin, adminStats, fetchAdminStats, logout } = useApp();
    const { colors } = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAdmin) {
            router.replace('/(tabs)/profile');
            return;
        }

        const loadStats = async () => {
            try {
                // Set a timeout to avoid infinite loading
                const timeoutPromise = new Promise(resolve => setTimeout(resolve, 5000));
                const fetchPromise = fetchAdminStats();

                await Promise.race([fetchPromise, timeoutPromise]);
            } catch (e) {
                console.log('Error loading admin stats:', e);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [isAdmin]);

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
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
        },
        backButton: {
            padding: 10,
        },
        content: {
            padding: 20,
        },
        cardGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        card: {
            width: '48%',
            backgroundColor: colors.card,
            padding: 20,
            borderRadius: 15,
            marginBottom: 15,
            alignItems: 'center',
        },
        cardValue: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.primary,
            marginVertical: 10,
        },
        cardLabel: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        section: {
            marginTop: 20,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 15,
        },
        actionButton: {
            backgroundColor: colors.card,
            padding: 15,
            borderRadius: 10,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        actionButtonText: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '500',
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
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Admin Dashboard</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.cardGrid}>
                    <View style={styles.card}>
                        <Ionicons name="people" size={24} color={colors.primary} />
                        <Text style={styles.cardValue}>{adminStats?.totals.users || 0}</Text>
                        <Text style={styles.cardLabel}>Total Users</Text>
                    </View>
                    <View style={styles.card}>
                        <Ionicons name="trophy" size={24} color={colors.primary} />
                        <Text style={styles.cardValue}>{adminStats?.totals.tournaments || 0}</Text>
                        <Text style={styles.cardLabel}>Tournaments</Text>
                    </View>
                    <View style={styles.card}>
                        <Ionicons name="shirt" size={24} color={colors.primary} />
                        <Text style={styles.cardValue}>{adminStats?.totals.teams || 0}</Text>
                        <Text style={styles.cardLabel}>Teams</Text>
                    </View>
                    <View style={styles.card}>
                        <Ionicons name="football" size={24} color={colors.primary} />
                        <Text style={styles.cardValue}>{adminStats?.totals.matches || 0}</Text>
                        <Text style={styles.cardLabel}>Matches</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Management</Text>

                    <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/admin/tournaments')}>
                        <Text style={styles.actionButtonText}>Manage Tournaments</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/admin/users')}>
                        <Text style={styles.actionButtonText}>Manage Users</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/admin/registrations')}>
                        <Text style={styles.actionButtonText}>Payment Approvals</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { marginTop: 20, backgroundColor: colors.error }]}
                        onPress={() => {
                            logout();
                            router.replace('/auth');
                        }}
                    >
                        <Text style={[styles.actionButtonText, { color: '#fff' }]}>Logout</Text>
                        <Ionicons name="log-out-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
