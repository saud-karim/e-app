import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Behavior when app is in foreground
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export const setupNotifications = async () => {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('medications', {
      name: 'Medication Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice && Platform.OS !== 'web') {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return null;
    }
    
    // For local notifications, we don't strictly need a push token from expo, 
    // but good to have if we do backend pushes later.
    try {
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id' // would be set from app.json
      })).data;
    } catch (e) {
      console.log('Error getting push token', e);
    }
  } else if (Platform.OS === 'web') {
    console.log('Push notifications on web require VAPID keys. Running in Web Fallback mode.');
    return 'web-mock-token';
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
};

// Schedule local reminder
export const scheduleMedicationReminder = async (medicationName, time) => {
  if (Platform.OS === 'web') {
    console.log(`[Web Simulation] Medication ${medicationName} scheduled at ${time.toString()}`);
    return 'web-simulation-id';
  }
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "💊 Time for your medication!",
        body: `Don't forget to take ${medicationName}.`,
        sound: true,
        data: { action: 'medication_reminder', medicationName },
      },
      trigger: {
        hour: time.getHours(),
        minute: time.getMinutes(),
        repeats: true, // Daily
      },
    });
    return id;
  } catch (error) {
    console.error("Error scheduling notification", error);
    return null;
  }
};

export const cancelAllReminders = async () => {
  if (Platform.OS !== 'web') {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
};
