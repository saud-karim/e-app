import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';
import { useRTLStyle } from '../../theme/RTLContext';

let DateTimePicker;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

const TOTAL_STEPS = 6;

export default function EditMedicationScreen({ route, navigation }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();

  const { medication } = route.params || {};

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState(medication?.name || '');
  
  const [dosage, setDosage] = useState(medication?.dosage?.toString() || '');
  const [dosageUnit, setDosageUnit] = useState(medication?.dosage_unit || 'mg');
  
  const [frequencyType, setFrequencyType] = useState(medication?.frequency_type || 'daily');
  
  const [startDate, setStartDate] = useState(medication?.start_date ? new Date(medication.start_date) : new Date());
  const [endDate, setEndDate] = useState(medication?.end_date ? new Date(medication.end_date) : null);
  const [isOngoing, setIsOngoing] = useState(!medication?.end_date);
  
  const initialReminderTimes = (medication?.reminder_times || []).length > 0 
    ? (typeof medication.reminder_times === 'string' ? JSON.parse(medication.reminder_times) : medication.reminder_times).map(time => {
        const d = new Date();
        const [h, m] = time.split(':');
        d.setHours(parseInt(h), parseInt(m), 0);
        return d;
      })
    : [new Date()];
  const [reminderTimes, setReminderTimes] = useState(initialReminderTimes);
  
  const [showTimePicker, setShowTimePicker] = useState({ show: false, index: -1 });
  const [showDatePicker, setShowDatePicker] = useState({ show: false, type: null }); // 'start' or 'end'
  
  const [notes, setNotes] = useState(medication?.notes || '');

  const nextStep = () => {
    if (step === 1 && !name) {
      Alert.alert(t('Error'), t('Please enter the medication name'));
      return;
    }
    if (step === 2 && !dosage) {
      Alert.alert(t('Error'), t('Please enter the dosage amount'));
      return;
    }
    setStep(Math.min(step + 1, TOTAL_STEPS));
  };

  const prevStep = () => {
    setStep(Math.max(step - 1, 1));
  };

  const addReminderTime = () => {
    setReminderTimes([...reminderTimes, new Date()]);
  };

  const removeReminderTime = (index) => {
    if (reminderTimes.length > 1) {
      const newTimes = [...reminderTimes];
      newTimes.splice(index, 1);
      setReminderTimes(newTimes);
    }
  };

  const handleTimeChange = (event, selectedDate, index) => {
    setShowTimePicker({ show: false, index: -1 });
    if (selectedDate) {
      const newTimes = [...reminderTimes];
      newTimes[index] = selectedDate;
      setReminderTimes(newTimes);
    }
  };

  const handleDateChange = (event, selectedDate, type) => {
    setShowDatePicker({ show: false, type: null });
    if (selectedDate) {
      if (type === 'start') setStartDate(selectedDate);
      if (type === 'end') {
        setEndDate(selectedDate);
        setIsOngoing(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Format reminder times to HH:MM
      const formattedTimes = reminderTimes.map(d => {
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      });

      const payload = {
        name,
        dosage,
        dosage_unit: dosageUnit,
        frequency_type: frequencyType,
        start_date: startDate.toISOString().split('T')[0],
        end_date: isOngoing ? null : (endDate ? endDate.toISOString().split('T')[0] : null),
        reminder_times: formattedTimes,
        notes,
        status: 'active'
      };

      if (medication && medication.id) {
        await api.updateMedication(medication.id, payload);
        Alert.alert(t('Success'), t('Medication updated successfully'));
      } else {
        await api.addMedication(payload);
        Alert.alert(t('Success'), t('Medication added successfully'));
      }
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert(t('Error'), error.message || t('Failed to save medication'));
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
        <View style={[styles.progressFill, { backgroundColor: theme.colors.primary, width: `${(step / TOTAL_STEPS) * 100}%` }]} />
      </View>
      <Text style={[styles.progressText, { color: theme.colors.text + '80' }]}>{t('Step {{current}} of {{total}}', { current: step, total: TOTAL_STEPS })}</Text>
    </View>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>{t('What is the medication name?')}</Text>
            <View style={[styles.inputContainer, rtl.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Ionicons name="medical-outline" size={20} color={theme.colors.text + '60'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder={t('e.g. Amoxicillin')}
                placeholderTextColor={theme.colors.text + '50'}
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>{t('What is the dosage?')}</Text>
            <View style={[rtl.row, { gap: 12 }]}>
              <View style={[styles.inputContainer, { flex: 1, backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, textAlign: 'center' }]}
                  placeholder="500"
                  placeholderTextColor={theme.colors.text + '50'}
                  keyboardType="numeric"
                  value={dosage}
                  onChangeText={setDosage}
                  autoFocus
                />
              </View>
              <View style={{ flex: 1, gap: 8 }}>
                {['mg', 'ml', 'Tablet', 'Drops'].map(unit => (
                  <TouchableOpacity
                    key={unit}
                    style={[styles.unitChoice, { 
                      backgroundColor: dosageUnit === unit ? theme.colors.primary + '20' : theme.colors.surface,
                      borderColor: dosageUnit === unit ? theme.colors.primary : theme.colors.border
                    }]}
                    onPress={() => setDosageUnit(unit)}
                  >
                    <Text style={{ color: dosageUnit === unit ? theme.colors.primary : theme.colors.text }}>{t(unit)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>{t('How often do you take it?')}</Text>
            <View style={{ gap: 12 }}>
              {['daily', 'twice_daily', 'three_times', 'weekly', 'as_needed'].map(freq => (
                <TouchableOpacity
                  key={freq}
                  style={[styles.freqChoice, rtl.row, { 
                    backgroundColor: frequencyType === freq ? theme.colors.primary + '20' : theme.colors.surface,
                    borderColor: frequencyType === freq ? theme.colors.primary : theme.colors.border
                  }]}
                  onPress={() => setFrequencyType(freq)}
                >
                  <Ionicons 
                    name={frequencyType === freq ? "radio-button-on" : "radio-button-off"} 
                    size={24} 
                    color={frequencyType === freq ? theme.colors.primary : theme.colors.text + '50'} 
                  />
                  <Text style={[styles.freqText, { color: theme.colors.text, marginStart: 12 }]}>{t(freq)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>{t('How long will you take it?')}</Text>
            
            <View style={{ gap: 20 }}>
              <View>
                <Text style={{ color: theme.colors.text + '80', marginBottom: 8 }}>{t('Start Date')}</Text>
                <TouchableOpacity 
                  style={[styles.dateButton, rtl.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                  onPress={() => setShowDatePicker({ show: true, type: 'start' })}
                >
                  <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
                  <Text style={{ color: theme.colors.text, marginStart: 12, flex: 1 }}>{startDate.toDateString()}</Text>
                </TouchableOpacity>
              </View>

              <View>
                <Text style={{ color: theme.colors.text + '80', marginBottom: 8 }}>{t('End Date')}</Text>
                
                <TouchableOpacity 
                  style={[styles.freqChoice, rtl.row, { marginBottom: 12, backgroundColor: isOngoing ? theme.colors.primary + '20' : theme.colors.surface, borderColor: isOngoing ? theme.colors.primary : theme.colors.border }]}
                  onPress={() => setIsOngoing(true)}
                >
                  <Ionicons name={isOngoing ? "radio-button-on" : "radio-button-off"} size={24} color={isOngoing ? theme.colors.primary : theme.colors.text + '50'} />
                  <Text style={{ color: theme.colors.text, marginStart: 12 }}>{t('Ongoing / Continuous')}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.dateButton, rtl.row, { backgroundColor: !isOngoing ? theme.colors.surface : theme.colors.background, borderColor: theme.colors.border, opacity: isOngoing ? 0.5 : 1 }]}
                  onPress={() => setShowDatePicker({ show: true, type: 'end' })}
                >
                  <Ionicons name="calendar-outline" size={20} color={isOngoing ? theme.colors.text + '50' : theme.colors.primary} />
                  <Text style={{ color: theme.colors.text, marginStart: 12, flex: 1 }}>{endDate ? endDate.toDateString() : t('Select End Date')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {showDatePicker.show && Platform.OS !== 'web' && (
              <DateTimePicker
                value={showDatePicker.type === 'start' ? startDate : (endDate || new Date())}
                mode="date"
                display="default"
                onChange={(event, date) => handleDateChange(event, date, showDatePicker.type)}
              />
            )}
            
            {showDatePicker.show && Platform.OS === 'web' && (
               <View style={{ marginTop: 20, padding: 20, backgroundColor: theme.colors.surface, borderRadius: 12 }}>
                 <Text style={{ color: theme.colors.text }}>Date Picker is only available on iOS/Android natively. Please test on mobile app.</Text>
                 <TouchableOpacity onPress={() => setShowDatePicker({show: false})} style={{marginTop: 10}}><Text style={{color: theme.colors.primary}}>Close</Text></TouchableOpacity>
               </View>
            )}
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>{t('When should we remind you?')}</Text>
            
            <View style={{ gap: 16 }}>
              {reminderTimes.map((time, index) => (
                <View key={index} style={[rtl.row, { alignItems: 'center', gap: 12 }]}>
                  <TouchableOpacity 
                    style={[styles.dateButton, rtl.row, { flex: 1, backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                    onPress={() => setShowTimePicker({ show: true, index })}
                  >
                    <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
                    <Text style={{ color: theme.colors.text, fontSize: 18, marginStart: 12, fontWeight: '500' }}>
                      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                  
                  {reminderTimes.length > 1 && (
                    <TouchableOpacity onPress={() => removeReminderTime(index)} style={{ padding: 8 }}>
                      <Ionicons name="close-circle" size={28} color={theme.colors.error || '#EF4444'} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity style={[styles.addTimeBtn, rtl.row]} onPress={addReminderTime}>
                <Ionicons name="add" size={20} color={theme.colors.primary} />
                <Text style={{ color: theme.colors.primary, fontWeight: '600', marginStart: 8 }}>{t('Add another time')}</Text>
              </TouchableOpacity>
            </View>

            {showTimePicker.show && Platform.OS !== 'web' && (
              <DateTimePicker
                value={reminderTimes[showTimePicker.index]}
                mode="time"
                display="default"
                onChange={(event, date) => handleTimeChange(event, date, showTimePicker.index)}
              />
            )}
            
            {showTimePicker.show && Platform.OS === 'web' && (
               <View style={{ marginTop: 20, padding: 20, backgroundColor: theme.colors.surface, borderRadius: 12 }}>
                 <Text style={{ color: theme.colors.text }}>Time Picker is only available on iOS/Android natively. Please test on mobile app.</Text>
                 <TouchableOpacity onPress={() => setShowTimePicker({show: false})} style={{marginTop: 10}}><Text style={{color: theme.colors.primary}}>Close</Text></TouchableOpacity>
               </View>
            )}
          </View>
        );
      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>{t('Any special instructions?')}</Text>
            <View style={[styles.inputContainer, { height: 120, alignItems: 'flex-start', paddingTop: 16, backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <TextInput
                style={[styles.input, { color: theme.colors.text, height: '100%' }]}
                placeholder={t('e.g. Take with food')}
                placeholderTextColor={theme.colors.text + '50'}
                value={notes}
                onChangeText={setNotes}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={[styles.summaryBox, { backgroundColor: theme.colors.primary + '10', borderColor: theme.colors.primary + '30' }]}>
              <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>{t('Summary')}</Text>
              <Text style={{ color: theme.colors.text }}>{name} - {dosage} {t(dosageUnit)}</Text>
              <Text style={{ color: theme.colors.text }}>{t(frequencyType)}</Text>
              <Text style={{ color: theme.colors.text }}>{reminderTimes.length} {t('reminders daily')}</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, rtl.row, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{medication ? t('Edit Medication') : t('Add Medication')}</Text>
        
        {medication ? (
          <TouchableOpacity 
            onPress={async () => {
              Alert.alert(t('Delete Medication'), t('Are you sure you want to delete this medication?'), [
                { text: t('Cancel'), style: 'cancel' },
                { text: t('Delete'), style: 'destructive', onPress: async () => {
                  try {
                    setLoading(true);
                    await api.deleteMedication(medication.id);
                    navigation.goBack();
                  } catch (e) {
                    Alert.alert(t('Error'), t('Failed to delete medication'));
                    setLoading(false);
                  }
                }}
              ]);
            }}
            style={{ padding: 4 }}
          >
            <Ionicons name="trash-outline" size={24} color={theme.colors.error || '#EF4444'} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 28 }} />
        )}
      </View>

      {renderProgressBar()}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {renderStepContent()}
      </ScrollView>

      <View style={[styles.footer, rtl.row, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        {step > 1 ? (
          <TouchableOpacity style={[styles.footerBtn, { backgroundColor: theme.colors.background }]} onPress={prevStep}>
            <Text style={{ color: theme.colors.text, fontWeight: '600' }}>{t('Back')}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.footerBtn} />
        )}

        {step < TOTAL_STEPS ? (
          <TouchableOpacity style={[styles.footerBtn, styles.primaryBtn, { backgroundColor: theme.colors.primary }]} onPress={nextStep}>
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{t('Next')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.footerBtn, styles.primaryBtn, { backgroundColor: theme.colors.primary }]} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{t('Save')}</Text>}
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  backButton: { padding: 4, marginStart: -4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  progressContainer: { paddingHorizontal: 24, paddingTop: 20 },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 13, marginTop: 8, textAlign: 'center', fontWeight: '500' },
  scrollContent: { padding: 24, flexGrow: 1 },
  stepContainer: { flex: 1 },
  stepTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputIcon: { marginEnd: 12 },
  input: { flex: 1, fontSize: 18, height: '100%', ...(Platform.OS === 'web' && { outlineStyle: 'none' }) },
  unitChoice: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  freqChoice: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  freqText: { fontSize: 16, fontWeight: '500' },
  dateButton: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  addTimeBtn: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  summaryBox: {
    marginTop: 32,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerBtn: {
    flex: 1,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  primaryBtn: {
    marginStart: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
});
