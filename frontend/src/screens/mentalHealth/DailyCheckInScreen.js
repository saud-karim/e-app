import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useRTLStyle } from '../../theme/RTLContext';

export default function DailyCheckInScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();

  const [moodLevel, setMoodLevel] = useState(3);
  const [anxietyLevel, setAnxietyLevel] = useState(1);
  const [sleepHours, setSleepHours] = useState('7');
  const [journal, setJournal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.addMoodLog({
        mood_level: moodLevel,
        anxiety_level: anxietyLevel,
        sleep_hours: parseFloat(sleepHours) || 0,
        journal_notes: journal
      });
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert(t('Error'), t('Failed to save log'));
    } finally {
      setLoading(false);
    }
  };

  const renderMoodOptions = () => {
    const moods = [
      { level: 1, emoji: '😢', label: 'Awful' },
      { level: 2, emoji: '🙁', label: 'Bad' },
      { level: 3, emoji: '😐', label: 'Okay' },
      { level: 4, emoji: '🙂', label: 'Good' },
      { level: 5, emoji: '🤩', label: 'Great' },
    ];

    return (
      <View style={[styles.moodRow, rtl.row, rtl.row]}>
        {moods.map((m) => (
          <TouchableOpacity 
            key={m.level} 
            style={[styles.moodCircle, moodLevel === m.level && { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary }]}
            onPress={() => setMoodLevel(m.level)}
          >
            <Text style={styles.emojiText}>{m.emoji}</Text>
            <Text style={[styles.moodLabel, { color: theme.colors.text }]}>{t(m.label)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderAnxietyOptions = () => {
    const levels = [1, 2, 3, 4, 5];
    return (
      <View style={[styles.anxietyRow, rtl.row, rtl.row]}>
        {levels.map((l) => (
          <TouchableOpacity 
            key={l}
            style={[
              styles.anxietyCircle, 
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              anxietyLevel === l && { backgroundColor: '#EF4444', borderColor: '#EF4444' }
            ]}
            onPress={() => setAnxietyLevel(l)}
          >
            <Text style={[styles.anxietyText, anxietyLevel === l && { color: '#FFF' }]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, rtl.row, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('Daily Check-In')}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <Text style={[styles.question, { color: theme.colors.text }]}>{t('How are you feeling right now?')}</Text>
        {renderMoodOptions()}

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <Text style={[styles.question, { color: theme.colors.text }]}>{t('How would you rate your anxiety?')}</Text>
        <Text style={[styles.hint, { color: theme.colors.text + '70' }]}>{t('1 = None, 5 = Severe')}</Text>
        {renderAnxietyOptions()}

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <Text style={[styles.question, { color: theme.colors.text }]}>{t('Hours of sleep last night')}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
          keyboardType="numeric"
          value={sleepHours}
          onChangeText={setSleepHours}
          placeholder="7"
          placeholderTextColor={theme.colors.text + '50'}
        />

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <Text style={[styles.question, { color: theme.colors.text }]}>{t('Journal (Optional)')}</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
          multiline
          numberOfLines={4}
          value={journal}
          onChangeText={setJournal}
          placeholder={t("Write whatever is on your mind...")}
          placeholderTextColor={theme.colors.text + '50'}
        />

      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>{t('Save Check-In')}</Text>
          )}
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
    borderBottomColor: 'rgba(255,255,255,0.05)',
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
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    marginBottom: 16,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  moodCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiText: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  anxietyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  anxietyCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anxietyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    marginTop: 8,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    marginTop: 8,
    textAlignVertical: 'top',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 32,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
