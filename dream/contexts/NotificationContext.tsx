import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { 
  registerForPushNotificationsAsync, 
  scheduleTournamentReminder, 
  showInstantNotification 
} from '../lib/notifications-simple';

interface NotificationContextType {
  notificationPermission: boolean;
  requestPermission: () => Promise<void>;
  scheduleReminder: (tournamentName: string, startTime: Date) => Promise<void>;
  showNotification: (title: string, body: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationPermission, setNotificationPermission] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token: string | null) => {
      if (token) {
        setNotificationPermission(true);
      }
    });

    // Handle notifications when app is foregrounded
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Handle notification responses
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  const requestPermission = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setNotificationPermission(true);
        Alert.alert('Success', 'Push notifications enabled!');
      }
    } catch (error) {
      console.log('Error requesting notification permission:', error);
      Alert.alert('Error', 'Failed to enable notifications');
    }
  };

  const scheduleReminder = async (tournamentName: string, startTime: Date) => {
    if (!notificationPermission) {
      Alert.alert('Enable Notifications', 'Please enable notifications to get reminders');
      return;
    }

    try {
      await scheduleTournamentReminder(tournamentName, startTime);
      Alert.alert('Reminder Set', `You'll be notified 1 hour before ${tournamentName}`);
    } catch (error) {
      console.log('Error scheduling reminder:', error);
      Alert.alert('Error', 'Failed to set reminder');
    }
  };

  const showNotification = async (title: string, body: string) => {
    if (!notificationPermission) return;
    
    try {
      await showInstantNotification(title, body);
    } catch (error) {
      console.log('Error showing notification:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notificationPermission,
      requestPermission,
      scheduleReminder,
      showNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};