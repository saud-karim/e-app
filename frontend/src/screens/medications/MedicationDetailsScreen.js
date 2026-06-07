import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform, Modal } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRTLStyle } from '../../theme/RTLContext';
import { Ionicons } from '@expo/vector-icons';
import GlobalHeader from '../../components/GlobalHeader';
import api from '../../services/api';

export default function MedicationDetailsScreen({ route, navigation }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();
  
  const { medication } = route.params;
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const executeDelete = async () => {
    try {
      setIsDeleting(true);
      await api.deleteMedication(medication.id);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      if (Platform.OS === 'web') {
        window.alert(t('Failed to delete medication'));
      } else {
        Alert.alert(t('Error'), t('Failed to delete medication'));
      }
      setIsDeleting(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={[styles.infoRow, rtl.row]}>
      <View style={[styles.iconWrapper, { backgroundColor: theme.colors.primary + '15' }]}>
        <Ionicons name={icon} size={22} color={theme.colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: theme.colors.text + '70' }]}>{t(label)}</Text>
        <Text style={[styles.infoValue, { color: theme.colors.text }]}>{value}</Text>
      </View>

    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GlobalHeader 
        title={t('Medication Details')} 
        showBack={true} 
        onBack={() => navigation.goBack()} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Card */}
        <View style={[styles.headerCard, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
          <View style={[styles.mainIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
            <Ionicons 
              name={medication.dosage_unit?.toLowerCase().includes('ml') ? "flask" : "medical"} 
              size={50} 
              color={theme.colors.primary} 
            />
          </View>
          <Text style={[styles.medName, { color: theme.colors.text }]}>{medication.name}</Text>
          <Text style={[styles.medDosage, { color: theme.colors.primary }]}>
            {medication.dosage} {medication.dosage_unit ? t(medication.dosage_unit) : ''}
          </Text>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('Schedule & Details')}</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
            
            <InfoRow 
              icon="calendar-outline" 
              label="Frequency" 
              value={medication.frequency_type ? t(medication.frequency_type) : t('Daily')} 
            />
            
            <View style={styles.divider} />
            
            <InfoRow 
              icon="time-outline" 
              label="Reminder Times" 
              value={medication.reminder_times ? medication.reminder_times.join(', ') : t('Not set')} 
            />
            
            {medication.instructions && (
              <>
                <View style={styles.divider} />
                <InfoRow 
                  icon="information-circle-outline" 
                  label="Instructions" 
                  value={t(medication.instructions)} 
                />
              </>
            )}
          </View>
        </View>

        {/* Adherence Mock Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('Adherence')}</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text, alignItems: 'center', paddingVertical: 25 }]}>
            <View style={styles.progressCircle}>
              <Text style={[styles.progressText, { color: theme.colors.primary }]}>100%</Text>
            </View>
            <Text style={[styles.adherenceDesc, { color: theme.colors.text + '80' }]}>
              {t('Perfect! You have taken all doses this week.')}
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton, rtl.row]}
          onPress={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator color="#E33629" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="#E33629" />
              <Text style={styles.deleteButtonText}>{t('Delete')}</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton, rtl.row, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('EditMedication', { medication })}
        >
          <Ionicons name="create-outline" size={20} color="#FFF" />
          <Text style={styles.editButtonText}>{t('Edit')}</Text>
        </TouchableOpacity>
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}>
            
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="trash-outline" size={32} color="#E33629" />
              </View>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                {t('Delete Medication')}
              </Text>
            </View>

            <Text style={[styles.modalMessage, { color: theme.colors.text + '90' }]}>
              {t('Are you sure you want to delete ')}
              <Text style={{fontWeight: 'bold', color: theme.colors.text}}>{medication.name}</Text>
              {t('? This action cannot be undone.')}
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1 }]}
                onPress={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                <Text style={[styles.modalCancelText, { color: theme.colors.text }]}>{t('Cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalDeleteButton]}
                onPress={() => {
                  setShowDeleteModal(false);
                  executeDelete();
                }}
                disabled={isDeleting}
              >
                <Ionicons name="trash" size={18} color="#FFF" style={{marginRight: 6}} />
                <Text style={styles.modalDeleteText}>{t('Delete')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerCard: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 24,
    marginBottom: 24,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  mainIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  medName: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  medDosage: {
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  infoRow: {
    alignItems: 'center',
    marginVertical: 4,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 2,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 12,
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#3B9DF2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  adherenceDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#E3362915',
    marginEnd: 12,
  },
  deleteButtonText: {
    color: '#E33629',
    fontSize: 16,
    fontWeight: '700',
    marginStart: 8,
  },
  editButton: {
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginStart: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    padding: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E3362915',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelButton: {
    // Styling handled inline
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalDeleteButton: {
    backgroundColor: '#E33629',
  },
  modalDeleteText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
