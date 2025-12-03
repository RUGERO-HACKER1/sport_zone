import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      title: 'Tournament Starting Soon',
      message: 'Kigali Tour Championship starts in 2 days. Get ready!',
      time: '2 hours ago',
      read: false,
      type: 'info'
    },
    {
      id: '2',
      title: 'Registration Successful',
      message: 'You have been successfully registered for Weekend Showdown.',
      time: '1 day ago',
      read: true,
      type: 'success'
    },
    {
      id: '3',
      title: 'Match Reminder',
      message: 'Your next match is scheduled for tomorrow at 10:00 AM.',
      time: '2 days ago',
      read: true,
      type: 'warning'
    },
    {
      id: '4',
      title: 'Payment Received',
      message: 'Your registration fee for Kigali Tour Championship has been received.',
      time: '3 days ago',
      read: true,
      type: 'success'
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const getIconName = (type: string) => {
    switch (type) {
      case 'info': return 'information-circle';
      case 'success': return 'checkmark-circle';
      case 'warning': return 'warning';
      case 'error': return 'close-circle';
      default: return 'notifications';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'info': return '#2196F3';
      case 'success': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      default: return '#666';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>Stay updated with tournament activities</Text>
      </View>

      {notifications.map((notification) => (
        <TouchableOpacity
          key={notification.id}
          style={[
            styles.notificationCard,
            !notification.read && styles.unreadNotification
          ]}
          onPress={() => markAsRead(notification.id)}
        >
          <View style={styles.notificationIcon}>
            <Ionicons name={getIconName(notification.type)} size={24} color={getIconColor(notification.type)} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>
          {!notification.read && (
            <View style={styles.unreadIndicator} />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

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
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    margin: 10,
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: '#ffd700',
  },
  notificationIcon: {
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationMessage: {
    color: '#ccc',
    marginBottom: 5,
  },
  notificationTime: {
    color: '#666',
    fontSize: 12,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffd700',
  },
});