import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';
import GlobalHeader from '../../components/GlobalHeader';

export default function HomeDashboardScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDashboard();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskStyles = (score) => {
    if (score == null || score <= 20) {
      return { colors: ['#10B981', '#34D399'], icon: 'checkmark-circle' };
    } else if (score <= 50) {
      return { colors: ['#F59E0B', '#FBBF24'], icon: 'alert-circle' };
    } else {
      return { colors: ['#EF4444', '#F87171'], icon: 'warning' };
    }
  };

  const riskStyles = getRiskStyles(dashboardData?.riskScore);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GlobalHeader showGradient={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Risk Score Widget */}
        <LinearGradient
          colors={riskStyles.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.riskWidget}
        >
          <View style={styles.riskHeader}>
            <Ionicons name={riskStyles.icon} size={24} color="#FFF" />
            <Text style={styles.riskTitle}>{t('Health Risk Score')}</Text>
          </View>
          <View style={styles.riskBody}>
            <Text style={styles.riskScore}>{loading ? '...' : dashboardData?.riskScore}</Text>
            <Text style={styles.riskDesc}>{t('You have missed')} {dashboardData?.weeklyMissedCount ?? 0} {t('doses this week.')}</Text>
          </View>
        </LinearGradient>

        {/* Daily Timeline */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('Daily Timeline')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MedicationsTab')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>{t('See All')}</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 20 }} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timelineList}>
              {dashboardData?.upcomingIntakes?.map((intake, index) => (
                <View key={index} style={[styles.timelineItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <View style={[styles.timeBox, { backgroundColor: theme.colors.primary + '15' }]}>
                    <Text style={[styles.timeText, { color: theme.colors.primary }]}>
                      {new Date(intake.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <Text style={[styles.medName, { color: theme.colors.text }]}>{intake.medication?.name || 'Unknown'}</Text>
                  <Text style={[styles.medDosage, { color: theme.colors.text + '80' }]}>{intake.medication?.dosage || '-'}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: theme.colors.text + '10' }]}>
                    <Text style={[styles.statusText, { color: theme.colors.text }]}>{t('Upcoming')}</Text>
                  </View>
                </View>
              ))}

              {dashboardData?.missedIntakes?.map((intake, index) => (
                <View key={`missed-${index}`} style={[styles.timelineItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <View style={[styles.timeBox, { backgroundColor: '#EF444415' }]}>
                    <Text style={[styles.timeText, { color: '#EF4444' }]}>
                      {new Date(intake.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <Text style={[styles.medName, { color: theme.colors.text }]}>{intake.medication?.name || 'Unknown'}</Text>
                  <Text style={[styles.medDosage, { color: theme.colors.text + '80' }]}>{intake.medication?.dosage || '-'}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: '#EF444420' }]}>
                    <Text style={[styles.statusText, { color: '#EF4444' }]}>{t('Missed')}</Text>
                  </View>
                </View>
              ))}

              {(!dashboardData?.upcomingIntakes?.length && !dashboardData?.missedIntakes?.length) && (
                <Text style={{ color: theme.colors.text + '80', padding: 20 }}>{t('No timeline data for today')}</Text>
              )}
            </ScrollView>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 16 }]}>{t('Quick Actions')}</Text>
          <View style={styles.actionsGrid}>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => navigation.navigate('MedicationsTab', { screen: 'AddMedication' })}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                <Ionicons name="add-circle" size={32} color={theme.colors.primary} />
              </View>
              <Text style={[styles.actionText, { color: theme.colors.text }]}>{t('Add Med')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => navigation.navigate('AIChat')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#10B98115' }]}>
                <Ionicons name="chatbubbles" size={32} color="#10B981" />
              </View>
              <Text style={[styles.actionText, { color: theme.colors.text }]}>{t('AI Chat')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => navigation.navigate('Reports')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#8B5CF615' }]}>
                <Ionicons name="analytics" size={32} color="#8B5CF6" />
              </View>
              <Text style={[styles.actionText, { color: theme.colors.text }]}>{t('Reports')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => navigation.navigate('InteractionChecker')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F59E0B15' }]}>
                <Ionicons name="warning" size={32} color="#F59E0B" />
              </View>
              <Text style={[styles.actionText, { color: theme.colors.text }]}>{t('Interactions')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => navigation.navigate('MentalHealth')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#3B82F615' }]}>
                <Ionicons name="heart" size={32} color="#3B82F6" />
              </View>
              <Text style={[styles.actionText, { color: theme.colors.text }]}>{t('Mental Health')}</Text>
            </TouchableOpacity>

          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    opacity: 0.15,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 100, // For Bottom Tabs
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  riskWidget: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  riskBody: {
    marginTop: 4,
  },
  riskScore: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 4,
  },
  riskDesc: {
    color: '#FFF',
    opacity: 0.9,
    fontSize: 14,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  timelineList: {
    gap: 16,
    paddingRight: 24,
  },
  timelineItem: {
    width: 150,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  timeBox: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  medName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  medDosage: {
    fontSize: 13,
    marginBottom: 16,
  },
  statusBadge: {
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    minWidth: '40%',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
