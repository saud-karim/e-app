import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';
import { useRTLStyle } from '../../theme/RTLContext';
import GlobalHeader from '../../components/GlobalHeader';

export default function MentalHealthDashboardScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchLogs();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.getMoodLogs();
      setLogs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderEmoji = (level) => {
    const emojis = ['😢', '🙁', '😐', '🙂', '🤩'];
    return emojis[level - 1] || '😐';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GlobalHeader title={t('Safe Space')} subtitle={t('Your Mental Health Journey')} showGradient={false} />

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Welcome Banner */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primary + 'CC']}
          style={styles.welcomeBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="leaf" size={40} color="#FFF" style={{ marginBottom: 12 }} />
          <Text style={styles.bannerTitle}>{t('Hello, Friend')}</Text>
          <Text style={styles.bannerSubtitle}>{t('This is your anonymous, safe space to reflect, relax, and heal.')}</Text>
        </LinearGradient>

        {/* Action Cards */}
        <View style={[styles.actionRow, rtl.row, rtl.row]}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}
            onPress={() => navigation.navigate('DailyCheckIn')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#10B98120' }]}>
              <Ionicons name="heart" size={28} color="#10B981" />
            </View>
            <Text style={[styles.actionTitle, { color: theme.colors.text }]}>{t('Daily Check-In')}</Text>
            <Text style={[styles.actionSubtitle, { color: theme.colors.text + '80' }]}>{t('Log mood')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}
            onPress={() => navigation.navigate('AIChat')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#3B82F620' }]}>
              <Ionicons name="chatbubbles" size={28} color="#3B82F6" />
            </View>
            <Text style={[styles.actionTitle, { color: theme.colors.text }]}>{t('Talk to AI')}</Text>
            <Text style={[styles.actionSubtitle, { color: theme.colors.text + '80' }]}>{t('24/7 Support')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('Exercises & Relaxation')}</Text>
        <View style={[styles.actionRow, rtl.row, rtl.row]}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}
            onPress={() => navigation.navigate('BreathingExercise')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#10B98120' }]}>
              <Ionicons name="water-outline" size={28} color="#10B981" />
            </View>
            <Text style={[styles.actionTitle, { color: theme.colors.text }]}>{t('Breathing')}</Text>
            <Text style={[styles.actionSubtitle, { color: theme.colors.text + '80' }]}>{t('Reduce stress')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}
            onPress={() => navigation.navigate('Meditation')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#8B5CF620' }]}>
              <Ionicons name="headset-outline" size={28} color="#8B5CF6" />
            </View>
            <Text style={[styles.actionTitle, { color: theme.colors.text }]}>{t('Meditation')}</Text>
            <Text style={[styles.actionSubtitle, { color: theme.colors.text + '80' }]}>{t('Find peace')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('Recent Logs')}</Text>

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 24 }} />
        ) : logs.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="calendar-outline" size={48} color={theme.colors.text + '50'} />
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>{t("No check-ins yet. Take a moment for yourself today.")}</Text>
          </View>
        ) : (
          logs.map((log) => (
            <View key={log.id} style={[styles.logCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={[styles.logHeader, rtl.row, rtl.row]}>
                <Text style={[styles.logDate, { color: theme.colors.text + '90' }]}>
                  {new Date(log.created_at).toLocaleDateString()}
                </Text>
                <Text style={styles.logEmoji}>{renderEmoji(log.mood_level)}</Text>
              </View>
              <Text style={[styles.logText, { color: theme.colors.text }]}>
                {t('Anxiety')}: {log.anxiety_level}/5 • {t('Sleep')}: {log.sleep_hours}h
              </Text>
              {log.journal_notes && (
                <Text style={[styles.journalText, { color: theme.colors.text + '80' }]} numberOfLines={2}>
                  "{log.journal_notes}"
                </Text>
              )}
            </View>
          ))
        )}

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
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  welcomeBanner: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bannerSubtitle: {
    color: '#FFF',
    fontSize: 15,
    opacity: 0.9,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 20,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  logCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logDate: {
    fontSize: 14,
    fontWeight: '600',
  },
  logEmoji: {
    fontSize: 24,
  },
  logText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  journalText: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  }
});
