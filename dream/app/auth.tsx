import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../contexts/AppContext';

export default function AuthScreen() {
  const router = useRouter();
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    teamName: '',
    captainName: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password);
        if (user) {
          if (user.role === 'admin') {
            router.replace('/admin');
          } else {
            router.replace('/(tabs)');
          }
        }
      } else {
        if (!formData.teamName || !formData.captainName || !formData.phone) {
          Alert.alert('Error', 'Please fill all registration fields');
          setLoading(false);
          return;
        }

        const success = await register({
          teamName: formData.teamName,
          captainName: formData.captainName,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        });

        if (success) {
          Alert.alert('Success', 'Team registered successfully!');
          router.replace('/(tabs)');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Player Registration</Text>
        <Text style={styles.subtitle}>Join Kigali Tour DLS Champions</Text>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isLogin && styles.activeToggle]}
          onPress={() => setIsLogin(true)}
        >
          <Text style={[styles.toggleText, isLogin && styles.activeToggleText]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !isLogin && styles.activeToggle]}
          onPress={() => setIsLogin(false)}
        >
          <Text style={[styles.toggleText, !isLogin && styles.activeToggleText]}>Register</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {!isLogin && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Team Name *"
              placeholderTextColor="#666"
              value={formData.teamName}
              onChangeText={(text) => setFormData({ ...formData, teamName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Captain Name *"
              placeholderTextColor="#666"
              value={formData.captainName}
              onChangeText={(text) => setFormData({ ...formData, captainName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number *"
              placeholderTextColor="#666"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email *"
          placeholderTextColor="#666"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password *"
          placeholderTextColor="#666"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register Team')}
          </Text>
        </TouchableOpacity>

        <View style={styles.feeInfo}>
          <Text style={styles.feeText}>Registration Fee: 500 RWF / 7 RM</Text>
          <Text style={styles.note}>Limited spots available. Register now!</Text>
          <Text style={styles.contact}>Contact: +250 785 617 178</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 5,
  },
  toggleButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: '#ffd700',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activeToggleText: {
    color: '#000',
  },
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    color: '#fff',
    marginBottom: 15,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#ffd700',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feeInfo: {
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
  },
  feeText: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  note: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  contact: {
    color: '#ffd700',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
});