import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRTLStyle } from '../../theme/RTLContext';
import { Audio } from 'expo-av';
import api from '../../services/api';

export default function ReminderNotificationScreen({ route, navigation }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();

  const [upcomingIntake, setUpcomingIntake] = useState(null);
  const [loading, setLoading] = useState(true);
  const soundRef = useRef(null);

  useEffect(() => {
    fetchUpcomingIntake();
    playAlarmSound();

    return () => {
      stopAlarmSound();
    };
  }, []);

  const playAlarmSound = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      // Using a public domain alarm sound URL for demonstration
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg' },
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (e) {
      console.log('Error playing alarm sound:', e);
    }
  };

  const stopAlarmSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (e) {
      console.log('Error stopping alarm sound:', e);
    }
  };

  const fetchUpcomingIntake = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboard();
      if (data.upcomingIntakes && data.upcomingIntakes.length > 0) {
        setUpcomingIntake(data.upcomingIntakes[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const medicationName = upcomingIntake?.medication?.name || route.params?.medicationName || 'Your Medication';

  const handleTake = async () => {
    await stopAlarmSound();
    if (upcomingIntake && upcomingIntake.medication_id) {
      try {
        await api.logIntake({
          medication_id: upcomingIntake.medication_id,
          scheduled_time: upcomingIntake.scheduled_time,
          status: 'taken'
        });
      } catch (e) {
        console.error(e);
      }
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Main');
    }
  };

  const handleSnooze = async () => {
    await stopAlarmSound();
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Main');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <View style={[styles.header, { backgroundColor: 'transparent' }]}>
        <TouchableOpacity onPress={handleSnooze} style={styles.backButton}>
          <Ionicons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : !upcomingIntake ? (
          <Text style={[styles.title, { color: theme.colors.text }]}>{t('No upcoming medications!')}</Text>
        ) : (
          <>
            <View style={styles.pillBox}>
              <LinearGradient
                colors={['#8B5CF6', '#6366F1']}
                style={styles.iconCircle}
              >
                <Ionicons name="medical" size={60} color="#FFF" />
              </LinearGradient>
            </View>

            <Text style={[styles.title, { color: theme.colors.text }]}>{t('Time for your medication!')}</Text>
            <Text style={[styles.subtitle, { color: theme.colors.text + '90' }]}>
              {t('Please take')} <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>{medicationName}</Text> {t('now to stay on track with your health.')}
            </Text>
          </>
        )}
      </View>

      <View style={styles.footer}>
        {upcomingIntake && (
          <TouchableOpacity style={styles.actionButton} onPress={handleTake}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.gradientButton, rtl.row, rtl.row]}
            >
              <Ionicons name="checkmark-circle" size={24} color="#FFF" style={{ marginEnd: 8 }} />
              <Text style={styles.buttonText}>{t('Mark as Taken')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.snoozeButton, rtl.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} 
          onPress={handleSnooze}
        >
          <Ionicons name={upcomingIntake ? "time-outline" : "checkmark-done"} size={24} color={theme.colors.text} style={{ marginEnd: 8 }} />
          <Text style={[styles.snoozeText, { color: theme.colors.text }]}>
            {upcomingIntake ? t('Snooze (10 min)') : t('Got it')}
          </Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 8,
    marginStart: -8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  pillBox: {
    marginBottom: 32,
    elevation: 10,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    gap: 16,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  gradientButton: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  snoozeButton: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
  },
  snoozeText: {
    fontSize: 18,
    fontWeight: '600',
  }
});
