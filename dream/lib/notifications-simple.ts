import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure notification behavior with proper iOS properties
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
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push token:', token);
    return token;
  } catch (error) {
    console.log('Error getting push token:', error);
    return null;
  }
}

export async function scheduleTournamentReminder(tournamentName: string, startTime: Date) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🏆 Tournament Starting Soon!',
        body: `${tournamentName} starts in 1 hour! Get ready to play!`,
        sound: true,
      },
      trigger: {
        type: 'date',
        date: new Date(startTime.getTime() - 60 * 60 * 1000), // 1 hour before
      } as Notifications.DateTriggerInput,
    });
  } catch (error) {
    console.log('Error scheduling tournament reminder:', error);
  }
}

export async function showInstantNotification(title: string, body: string) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null,
    } as any); // Using any to bypass TypeScript for immediate notifications
  } catch (error) {
    console.log('Error showing instant notification:', error);
  }
}