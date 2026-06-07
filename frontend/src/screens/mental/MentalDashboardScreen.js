import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/ThemeContext';
import { useRTLStyle } from '../../theme/RTLContext';
import api from '../../services/api';

const getMoodIcon = (level) => {
  switch(level) {
    case 5: return { name: 'happy', color: '#22C55E' };
    case 4: return { name: 'slightly-smile', color: '#4ADE80' };
    case 3: return { name: 'analytics', color: '#FCD34D' };
    case 2: return { name: 'sad', color: '#F87171' };
    case 1: return { name: 'sad-outline', color: '#EF4444' };
    default: return { name: 'help-circle', color: '#9CA3AF' };
  }
};

export default function MentalDashboardScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const response = await api.getMoodLogs();
      if (response.success) {
        setLogs(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchLogs();
    });
    return unsubscribe;
  }, [navigation]);

  const renderLogItem = ({ item }) => {
    const moodIcon = getMoodIcon(item.mood_level);
    const date = new Date(item.created_at).toLocaleDateString();
    
    return (
      <View style={[styles.logCard, rtl.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={[styles.iconContainer, { backgroundColor: moodIcon.color + '20' }]}>
          <Ionicons name={moodIcon.name} size={32} color={moodIcon.color} />
        </View>
        <View style={styles.logContent}>
          <Text style={[styles.logDate, { color: theme.colors.text }]}>{date}</Text>
          {item.journal_notes ? (
            <Text style={[styles.logNotes, { color: theme.colors.text + '80' }]} numberOfLines={2}>
              {item.journal_notes}
            </Text>
          ) : null}
        </View>
        <View style={styles.statsContainer}>
          <View style={[rtl.row, styles.statItem]}>
            <Ionicons name="pulse" size={14} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.text, marginStart: 4 }}>{item.anxiety_level}/5</Text>
          </View>
          <View style={[rtl.row, styles.statItem]}>
            <Ionicons name="moon" size={14} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.text, marginStart: 4 }}>{item.sleep_hours}h</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, rtl.row]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name={rtl.isRTL ? "arrow-forward" : "arrow-back"} size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('mentalHealth.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLogItem}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={() => (
          <View style={styles.heroSection}>
            <TouchableOpacity 
              style={[styles.checkInButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('DailyCheckIn')}
            >
              <Ionicons name="heart" size={24} color="#FFF" />
              <Text style={styles.checkInButtonText}>{t('mentalHealth.checkIn')}</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { color: theme.colors.text, textAlign: rtl.isRTL ? 'right' : 'left' }]}>
              {t('Exercises & Relaxation')}
            </Text>
            
            <View style={[styles.exercisesContainer, rtl.row]}>
              <TouchableOpacity 
                style={[styles.exerciseCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                onPress={() => navigation.navigate('BreathingExercise')}
              >
                <View style={[styles.exerciseIconContainer, { backgroundColor: '#3B82F620' }]}>
                  <Ionicons name="water-outline" size={32} color="#3B82F6" />
                </View>
                <Text style={[styles.exerciseTitle, { color: theme.colors.text }]}>{t('Breathing')}</Text>
                <Text style={[styles.exerciseSubtitle, { color: theme.colors.text + '80' }]}>{t('Reduce stress')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.exerciseCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                onPress={() => navigation.navigate('Meditation')}
              >
                <View style={[styles.exerciseIconContainer, { backgroundColor: '#8B5CF620' }]}>
                  <Ionicons name="headset-outline" size={32} color="#8B5CF6" />
                </View>
                <Text style={[styles.exerciseTitle, { color: theme.colors.text }]}>{t('Meditation')}</Text>
                <Text style={[styles.exerciseSubtitle, { color: theme.colors.text + '80' }]}>{t('Find peace')}</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.sectionTitle, { color: theme.colors.text, textAlign: rtl.isRTL ? 'right' : 'left', marginTop: 16 }]}>
              {t('History')}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color={theme.colors.text + '50'} />
            <Text style={[styles.emptyText, { color: theme.colors.text + '80' }]}>{t('No mood logs yet.')}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  heroSection: {
    marginBottom: 24,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 24,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 32,
  },
  checkInButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginStart: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  exercisesContainer: {
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  exerciseCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  exerciseIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exerciseSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  logCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 16,
  },
  logContent: {
    flex: 1,
  },
  logDate: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  logNotes: {
    fontSize: 14,
  },
  statsContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});
