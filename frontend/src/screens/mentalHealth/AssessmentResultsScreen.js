import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

export default function AssessmentResultsScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { result } = route.params;

  let riskColor = '#10B981'; // Mild
  let iconName = 'happy';
  if (result.risk_level === 'Moderate') {
    riskColor = '#F59E0B';
    iconName = 'alert-circle';
  } else if (result.risk_level === 'High') {
    riskColor = '#EF4444';
    iconName = 'warning';
  }

  const handleDone = () => {
    navigation.popToTop();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: riskColor + '20' }]}>
          <Ionicons name={iconName} size={64} color={riskColor} />
        </View>

        <Text style={[styles.title, { color: theme.colors.text }]}>{t('Assessment Complete')}</Text>
        
        <View style={[styles.resultCard, { backgroundColor: theme.colors.surface, borderColor: riskColor }]}>
          <Text style={[styles.riskLabel, { color: theme.colors.text + '80' }]}>{t('Risk Level')}</Text>
          <Text style={[styles.riskValue, { color: riskColor }]}>{t(result.risk_level)}</Text>
        </View>

        <Text style={[styles.guidanceText, { color: theme.colors.text }]}>
          {t(result.guidance)}
        </Text>

      </View>

      <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleDone}>
          <Text style={styles.buttonText}>{t('Done')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 32 },
  resultCard: {
    width: '100%',
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: 24,
  },
  riskLabel: { fontSize: 16, marginBottom: 8 },
  riskValue: { fontSize: 28, fontWeight: 'bold' },
  guidanceText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    opacity: 0.9,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
  },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
