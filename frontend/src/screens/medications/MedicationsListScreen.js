import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';
import { useRTLStyle } from '../../theme/RTLContext';
import GlobalHeader from '../../components/GlobalHeader';

export default function MedicationsListScreen({ navigation }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t, i18n } = useTranslation();

  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMedications();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const data = await api.getMedications();
      setMedications(data);
    } catch (error) {
      console.error(error);
      Alert.alert(t('Error'), t('Failed to load medications'));
    } finally {
      setLoading(false);
    }
  };

  const renderMedication = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, rtl.row, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}
      onPress={() => navigation.navigate('MedicationDetails', { medication: item })}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
        <Ionicons name={item.dosage_unit?.toLowerCase().includes('ml') ? "flask" : "medical"} size={26} color={theme.colors.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.medName, { color: theme.colors.text }]}>{item.name}</Text>
        <Text style={[styles.medDosage, { color: theme.colors.text + '90' }]}>{item.dosage} {item.dosage_unit ? t(item.dosage_unit) : ''} • {item.frequency_type ? t(item.frequency_type) : ''}</Text>
        <View style={[styles.timeContainer, rtl.row]}>
          <Ionicons name="time-outline" size={14} color={theme.colors.primary} />
          <Text style={[styles.medTime, { color: theme.colors.primary, marginStart: 4 }]}>
            {item.reminder_times ? item.reminder_times.join(', ') : ''}
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.moreButton}
        onPress={() => navigation.navigate('EditMedication', { medication: item })}
      >
        <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.text + '50'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GlobalHeader title={t('My Medications')} subtitle={t('Manage your daily prescriptions')} showGradient={true} />

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMedication}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="medical-outline" size={60} color={theme.colors.text + '30'} />
              <Text style={[styles.emptyText, { color: theme.colors.text + '60' }]}>{t('No medications added yet')}</Text>
            </View>
          }
        />
      )}

      <View style={[styles.fabContainer, i18n.language === 'ar' ? { left: 24 } : { right: 24 }]}>
        <TouchableOpacity 
          style={[styles.miniFab, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}
          onPress={() => navigation.navigate('ScanPrescription')}
        >
          <Ionicons name="scan" size={24} color={theme.colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('AddMedication')}
        >
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>
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
    height: 200,
    opacity: 0.1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  listContent: {
    padding: 24,
    paddingTop: 0,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    elevation: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  medName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  medDosage: {
    fontSize: 15,
    marginBottom: 2,
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B9DF215',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  medTime: {
    fontSize: 13,
    fontWeight: '700',
    marginStart: 4,
  },
  moreButton: {
    padding: 8,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    alignItems: 'center',
    gap: 16,
  },
  miniFab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  }
});
