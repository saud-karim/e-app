import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform, Alert, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { setupNotifications, scheduleMedicationReminder, cancelAllReminders } from '../../services/notificationService';
import * as Notifications from 'expo-notifications';
import { useRTLStyle } from '../../theme/RTLContext';

export default function ReminderSettingsScreen({ navigation }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationsEnabled(status === 'granted');
  };

  const toggleNotifications = async (value) => {
    if (value) {
      const token = await setupNotifications();
      if (token || Platform.OS === 'web') {
        setNotificationsEnabled(true);
        Alert.alert(t('Success'), t('Notifications enabled successfully.'));
      } else {
        setNotificationsEnabled(false);
        Alert.alert(t('Permission Denied'), t('Please enable notifications in your phone settings.'));
      }
    } else {
      await cancelAllReminders();
      setNotificationsEnabled(false);
      Alert.alert(t('Disabled'), t('All local medication reminders have been cancelled.'));
    }
  };

  const handleTestNotification = async () => {
    if (!notificationsEnabled && Platform.OS !== 'web') {
      Alert.alert(t('Error'), t('Please enable notifications first.'));
      return;
    }
    
    // Schedule a test notification 5 seconds from now
    const time = new Date();
    time.setSeconds(time.getSeconds() + 5);
    
    await scheduleMedicationReminder("Aspirin (Test)", time);
    Alert.alert(t('Test Scheduled'), t('You will receive a notification in 5 seconds.'));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, rtl.row, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('Smart Reminders')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
          <View style={[styles.cardHeader, rtl.row, rtl.row]}>
            <View style={[styles.iconBox, { backgroundColor: '#3B82F615' }]}>
              <Ionicons name="notifications" size={24} color="#3B82F6" />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{t('Enable Reminders')}</Text>
              <Text style={[styles.cardSubtitle, { color: theme.colors.text + '80' }]}>{t('Receive push notifications for your medications')}</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
              thumbColor={notificationsEnabled ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
          <View style={[styles.cardHeader, rtl.row, rtl.row]}>
            <View style={[styles.iconBox, { backgroundColor: '#8B5CF615' }]}>
              <Ionicons name="volume-high" size={24} color="#8B5CF6" />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{t('Sound Alerts')}</Text>
              <Text style={[styles.cardSubtitle, { color: theme.colors.text + '80' }]}>{t('Play sound when reminder triggers')}</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
              thumbColor={soundEnabled ? theme.colors.primary : '#f4f3f4'}
              disabled={!notificationsEnabled}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.testButton, rtl.row, { backgroundColor: theme.colors.primary }]}
          onPress={handleTestNotification}
        >
          <Ionicons name="paper-plane" size={20} color="#FFF" style={{ marginEnd: 8 }} />
          <Text style={styles.testButtonText}>{t('Send Test Notification (5s)')}</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 8,
    marginStart: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 16,
  },
  cardHeaderText: {
    flex: 1,
    marginEnd: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
  },
  testButton: {
    marginTop: 24,
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
