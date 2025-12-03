import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { apiFetch, buildAuthHeaders } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: string;
    teamName: string;
    captainName: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
}

export default function AdminUsers() {
    const { colors } = useTheme();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = await AsyncStorage.getItem('sport-zone-auth').then(res => res ? JSON.parse(res).token : null);
            if (!token) return;

            const response = await apiFetch('/api/admin/users', {
                headers: buildAuthHeaders(token)
            });
            if (response.success) {
                setUsers(response.data);
            }
        } catch (error) {
            console.log('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.teamName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.captainName.toLowerCase().includes(search.toLowerCase())
    );

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
        searchContainer: {
            padding: 15,
            backgroundColor: colors.card,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        searchInput: {
            backgroundColor: colors.background,
            padding: 12,
            borderRadius: 10,
            color: colors.text,
            fontSize: 16,
        },
        list: {
            padding: 15,
        },
        userCard: {
            backgroundColor: colors.card,
            padding: 15,
            borderRadius: 12,
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        userInfo: {
            flex: 1,
        },
        teamName: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 4,
        },
        detailText: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 2,
        },
        roleBadge: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: colors.primary + '20',
        },
        roleText: {
            fontSize: 12,
            color: colors.primary,
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
                <Text style={styles.title}>Manage Users</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    placeholderTextColor={colors.textSecondary}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={filteredUsers}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.userCard}>
                        <View style={styles.userInfo}>
                            <Text style={styles.teamName}>{item.teamName}</Text>
                            <Text style={styles.detailText}>👤 {item.captainName}</Text>
                            <Text style={styles.detailText}>📧 {item.email}</Text>
                            <Text style={styles.detailText}>📱 {item.phone}</Text>
                        </View>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>{item.role.toUpperCase()}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}
