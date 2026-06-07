import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/ThemeContext';
import { useRTLStyle } from '../../theme/RTLContext';
import api from '../../services/api';

const MOODS = [
  { level: 1, icon: 'sad-outline', label: 'Awful', color: '#EF4444' },
  { level: 2, icon: 'sad', label: 'Bad', color: '#F87171' },
  { level: 3, icon: 'analytics', label: 'Neutral', color: '#FCD34D' },
  { level: 4, icon: 'slightly-smile', label: 'Good', color: '#4ADE80' },
  { level: 5, icon: 'happy', label: 'Awesome', color: '#22C55E' },
];

export default function DailyCheckInScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const rtl = useRTLStyle();

  const [step, setStep] = useState(1);
  const [mood, setMood] = useState(null);
  const [anxiety, setAnxiety] = useState(1);
  const [sleep, setSleep] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step === 1 && !mood) return Alert.alert(t('Error'), t('Please select your mood'));
    if (step === 3 && (sleep === '' || isNaN(sleep))) return Alert.alert(t('Error'), t('Please enter valid sleep hours'));
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      saveCheckIn();
    }
  };

  const saveCheckIn = async () => {
    setLoading(true);
    try {
      const payload = {
        mood_level: mood,
        anxiety_level: anxiety,
        sleep_hours: parseFloat(sleep),
        journal_notes: notes,
      };
      
      const response = await api.addMoodLog(payload);
      if (response.success) {
        Alert.alert(t('Success'), t('Check-in saved successfully!'));
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      Alert.alert(t('Error'), t('Failed to save check-in'));
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.question, { color: theme.colors.text }]}>{t('How are you feeling today?')}</Text>
            <View style={[styles.moodsGrid, rtl.row]}>
              {MOODS.map((m) => (
                <TouchableOpacity
                  key={m.level}
                  style={[
                    styles.moodOption,
                    { 
                      backgroundColor: mood === m.level ? m.color + '20' : theme.colors.surface,
                      borderColor: mood === m.level ? m.color : theme.colors.border
                    }
                  ]}
                  onPress={() => setMood(m.level)}
                >
                  <Ionicons name={m.icon} size={48} color={mood === m.level ? m.color : theme.colors.text + '50'} />
                  <Text style={[styles.moodLabel, { color: theme.colors.text, marginTop: 8 }]}>{t(m.label)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.question, { color: theme.colors.text }]}>{t('How would you rate your anxiety?')}</Text>
            <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>{t('1 = None, 5 = Severe')}</Text>
            <View style={{ gap: 12, marginTop: 20 }}>
              {[1, 2, 3, 4, 5].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.anxietyOption,
                    rtl.row,
                    { 
                      backgroundColor: anxiety === level ? theme.colors.primary + '20' : theme.colors.surface,
                      borderColor: anxiety === level ? theme.colors.primary : theme.colors.border
                    }
                  ]}
                  onPress={() => setAnxiety(level)}
                >
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: anxiety === level ? theme.colors.primary : theme.colors.text + '50' }}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.question, { color: theme.colors.text }]}>{t('How many hours did you sleep?')}</Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              keyboardType="numeric"
              placeholder="e.g. 7.5"
              placeholderTextColor={theme.colors.text + '50'}
              value={sleep}
              onChangeText={setSleep}
              autoFocus
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.question, { color: theme.colors.text }]}>{t('Any thoughts or journal notes?')}</Text>
            <TextInput
              style={[styles.textArea, { color: theme.colors.text, backgroundColor: theme.colors.surface, borderColor: theme.colors.border, textAlign: rtl.isRTL ? 'right' : 'left' }]}
              multiline
              numberOfLines={6}
              placeholder={t('Write down what is on your mind...')}
              placeholderTextColor={theme.colors.text + '50'}
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
              autoFocus
            />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, rtl.row]}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()} style={styles.backButton}>
          <Ionicons name={rtl.isRTL ? "arrow-forward" : "arrow-back"} size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {t('Step {{current}} of {{total}}').replace('{{current}}', step).replace('{{total}}', 4)}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderStep()}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>{loading ? t('common.loading') : (step === 4 ? t('Save') : t('Next'))}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  scrollContent: { padding: 24 },
  stepContent: { flex: 1 },
  question: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  moodsGrid: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 32,
  },
  moodOption: {
    width: '45%',
    aspectRatio: 1,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodLabel: { fontSize: 16, fontWeight: 'bold' },
  anxietyOption: {
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    fontSize: 24,
    textAlign: 'center',
    marginTop: 32,
  },
  textArea: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    marginTop: 32,
    minHeight: 150,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  primaryButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
