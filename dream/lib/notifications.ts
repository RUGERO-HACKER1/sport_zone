import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior with proper types
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    // Add iOS-specific properties
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push token:', token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export async function scheduleTournamentReminder(tournamentName: string, startTime: Date) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🏆 Tournament Starting Soon!',
      body: `${tournamentName} starts in 1 hour! Get ready to play!`,
      data: { tournamentName, startTime: startTime.toISOString() },
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      type: 'date',
      date: new Date(startTime.getTime() - 60 * 60 * 1000), // 1 hour before
    } as Notifications.DateTriggerInput,
  });
}

export async function scheduleMatchReminder(matchDetails: string, matchTime: Date) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⚽ Match Alert!',
      body: `Your match: ${matchDetails} starts in 30 minutes!`,
      data: { matchDetails, matchTime: matchTime.toISOString() },
      sound: true,
    },
    trigger: {
      type: 'date',
      date: new Date(matchTime.getTime() - 30 * 60 * 1000), // 30 minutes before
    } as Notifications.DateTriggerInput,
  });
}

export async function sendTournamentUpdate(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null, // Send immediately
  } as any); // Using any to bypass TypeScript for immediate notifications
}