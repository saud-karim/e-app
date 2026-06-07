import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';
import { useRTLStyle } from '../../theme/RTLContext';

export default function InteractionCheckerScreen({ navigation }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();

  const [currentDrug, setCurrentDrug] = useState('');
  const [drugs, setDrugs] = useState([]);
  const [userMedications, setUserMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMeds, setFetchingMeds] = useState(true);

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        const response = await api.getMedications();
        if (response.success && response.data) {
          setUserMedications(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingMeds(false);
      }
    };
    fetchMeds();
  }, []);

  const handleAddDrug = () => {
    if (currentDrug.trim() !== '' && !drugs.includes(currentDrug.trim())) {
      setDrugs([...drugs, currentDrug.trim()]);
      setCurrentDrug('');
    }
  };

  const toggleDrug = (drugName) => {
    if (drugs.includes(drugName)) {
      setDrugs(drugs.filter((d) => d !== drugName));
    } else {
      setDrugs([...drugs, drugName]);
    }
  };

  const handleRemoveDrug = (index) => {
    setDrugs(drugs.filter((_, i) => i !== index));
  };

  const handleCheck = async () => {
    if (drugs.length < 2) return;
    
    try {
      setLoading(true);
      const result = await api.checkInteractions(drugs);
      navigation.navigate('InteractionResults', { result, drugs });
    } catch (error) {
      console.error(error);
      alert(t('Failed to check interactions'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, rtl.row, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('Interaction Checker')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={[styles.infoBox, rtl.row]}>
          <Ionicons name="information-circle" size={24} color="#3B82F6" />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            {t('Enter two or more medications to check for potential drug interactions.')}
          </Text>
        </View>

        {!fetchingMeds && userMedications.length > 0 && (
          <View style={styles.inputSection}>
            <Text style={[styles.label, { color: theme.colors.text }]}>{t('Select from your medications')}</Text>
            <View style={styles.pillsContainer}>
              {userMedications.map((med) => {
                const isSelected = drugs.includes(med.name);
                return (
                  <TouchableOpacity 
                    key={med.id} 
                    style={[styles.pill, { 
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface, 
                      borderColor: theme.colors.primary 
                    }]}
                    onPress={() => toggleDrug(med.name)}
                  >
                    <Text style={[styles.pillText, { color: isSelected ? '#FFF' : theme.colors.text }]}>{med.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('Add Medication')}</Text>
          <View style={[styles.row, rtl.row, rtl.row]}>
            <View style={[styles.inputContainer, rtl.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Ionicons name="medical" size={20} color={theme.colors.text + '50'} style={styles.icon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder={t('e.g. Aspirin')}
                placeholderTextColor={theme.colors.text + '50'}
                value={currentDrug}
                onChangeText={setCurrentDrug}
                onSubmitEditing={handleAddDrug}
              />
            </View>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleAddDrug}
            >
              <Ionicons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {drugs.length > 0 && (
          <View style={[styles.pillsContainer, rtl.row, { marginTop: 16 }]}>
            {drugs.map((drug, index) => (
              <View key={index} style={[styles.pill, rtl.row, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary }]}>
                <Text style={[styles.pillText, { color: theme.colors.primary }]}>{drug}</Text>
                <TouchableOpacity onPress={() => handleRemoveDrug(index)}>
                  <Ionicons name="close-circle" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={[styles.checkButton, drugs.length < 2 && styles.disabledButton]} 
          onPress={handleCheck}
          disabled={drugs.length < 2 || loading}
        >
          <LinearGradient
            colors={drugs.length < 2 ? [theme.colors.border, theme.colors.border] : ['#EF4444', '#F87171']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradientButton, rtl.row, rtl.row]}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="shield-checkmark" size={24} color="#FFF" style={{ marginEnd: 8 }} />
                <Text style={styles.checkButtonText}>{t('Check Interactions')}</Text>
              </>
            )}
          </LinearGradient>
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
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#3B82F615',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginStart: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginEnd: 12,
  },
  icon: {
    marginEnd: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  pillText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
  },
  checkButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  gradientButton: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
