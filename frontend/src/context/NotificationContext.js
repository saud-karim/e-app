import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../navigation/navigationRef';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();

    // Foreground listener
    const foregroundSub = Notifications.addNotificationReceivedListener(notification => {
      saveNotification(notification);
      
      // If it's a medication reminder and app is open, force the alarm screen
      const data = notification.request.content.data;
      if (data && data.action === 'medication_reminder') {
        navigate('ReminderNotification', { medicationName: data.medicationName });
      }
    });

    // Background interaction listener
    const responseSub = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data && data.action === 'medication_reminder') {
        navigate('ReminderNotification', { medicationName: data.medicationName });
      }
    });

    return () => {
      foregroundSub.remove();
      responseSub.remove();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem('@notifications_history');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
  };

  const saveNotification = async (notification) => {
    try {
      const newNotif = {
        id: notification.request.identifier,
        title: notification.request.content.title,
        body: notification.request.content.body,
        date: notification.date || Date.now(),
        data: notification.request.content.data,
      };
      setNotifications(prev => {
        // Prevent duplicates
        if (prev.find(n => n.id === newNotif.id)) return prev;
        const updated = [newNotif, ...prev].slice(0, 50); // Keep last 50
        AsyncStorage.setItem('@notifications_history', JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error('Failed to save notification', e);
    }
  };

  const clearNotifications = async () => {
    await AsyncStorage.removeItem('@notifications_history');
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
