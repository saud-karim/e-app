import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useRTLStyle } from '../../theme/RTLContext';

const questions = [
  "Over the last 2 weeks, how often have you felt down, depressed, or hopeless?",
  "How often have you had little interest or pleasure in doing things?",
  "How often have you been feeling nervous, anxious or on edge?",
  "How often have you not been able to stop or control worrying?",
  "How often have you had trouble relaxing?"
];

const options = [
  { label: 'Not at all', score: 0 },
  { label: 'Several days', score: 1 },
  { label: 'More than half the days', score: 2 },
  { label: 'Nearly every day', score: 3 }
];

export default function SelfAssessmentScreen({ navigation }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState(Array(questions.length).fill(0));
  const [loading, setLoading] = useState(false);

  const handleSelect = async (score) => {
    const newScores = [...scores];
    newScores[currentIndex] = score;
    setScores(newScores);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Submit
      try {
        setLoading(true);
        const totalScore = newScores.reduce((a,b) => a+b, 0);
        const res = await api.submitAssessment(totalScore);
        navigation.replace('AssessmentResults', { result: res.data });
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, rtl.row, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('Self-Assessment')}</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { backgroundColor: theme.colors.primary, width: `${((currentIndex + 1) / questions.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: theme.colors.text + '80' }]}>
          {currentIndex + 1} / {questions.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.questionText, { color: theme.colors.text }]}>
          {t(questions[currentIndex])}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
        ) : (
          options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.optionCard, rtl.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={() => handleSelect(opt.score)}
            >
              <Text style={[styles.optionText, { color: theme.colors.text }]}>{t(opt.label)}</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text + '50'} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backButton: { padding: 8, marginStart: -8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  progressContainer: { padding: 20, paddingBottom: 0 },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%' },
  progressText: { textAlign: 'auto', marginTop: 8, fontSize: 12, fontWeight: '600' },
  content: { padding: 20, paddingTop: 40 },
  questionText: { fontSize: 24, fontWeight: 'bold', lineHeight: 34, marginBottom: 40 },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  optionText: { fontSize: 16, fontWeight: '600' }
});
