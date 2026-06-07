import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRTLStyle } from '../../theme/RTLContext';

export default function InteractionResultsScreen({ route, navigation }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();

  const { result, drugs } = route.params;
  
  const isDanger = result.risk_level === 'High';
  const isWarning = result.risk_level === 'Moderate';
  const isSafe = result.risk_level === 'Safe';

  const riskColor = isDanger ? '#EF4444' : isWarning ? '#F59E0B' : '#10B981';
  const riskIcon = isDanger ? 'warning' : isWarning ? 'alert-circle' : 'checkmark-circle';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, rtl.row, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('Interaction Results')}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Checked Drugs List */}
        <View style={[styles.drugsList, rtl.row, rtl.row]}>
          {drugs.map((drug, index) => (
            <React.Fragment key={index}>
              <Text style={[styles.drugName, { color: theme.colors.text }]}>{drug}</Text>
              {index < drugs.length - 1 && (
                <Ionicons name="add" size={20} color={theme.colors.text + '50'} style={{ marginHorizontal: 8 }} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Risk Banner */}
        <LinearGradient
          colors={[riskColor, riskColor + '90']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.riskBanner}
        >
          <Ionicons name={riskIcon} size={48} color="#FFF" />
          <Text style={styles.riskLevelText}>{t(result.risk_level)} {t('Risk')}</Text>
          <Text style={styles.riskTitleText}>{t(result.title)}</Text>
        </LinearGradient>

        {/* Description */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={[styles.sectionHeader, rtl.row, rtl.row]}>
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('Details')}</Text>
          </View>
          <Text style={[styles.sectionText, { color: theme.colors.text + '90' }]}>{t(result.description)}</Text>
        </View>

        {/* Required Action */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={[styles.sectionHeader, rtl.row, rtl.row]}>
            <Ionicons name="medical-outline" size={24} color={riskColor} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('Action Required')}</Text>
          </View>
          <Text style={[styles.sectionText, { color: riskColor, fontWeight: 'bold' }]}>{t(result.action_required)}</Text>
        </View>

        {/* Alternatives */}
        {result.alternatives && result.alternatives.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={[styles.sectionHeader, rtl.row, rtl.row]}>
              <Ionicons name="bulb-outline" size={24} color="#F59E0B" />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('Suggested Alternatives')}</Text>
            </View>
            {result.alternatives.map((alt, idx) => (
              <View key={idx} style={[styles.altRow, rtl.row, rtl.row]}>
                <Ionicons name="checkmark" size={20} color="#10B981" />
                <Text style={[styles.altText, { color: theme.colors.text }]}>{alt}</Text>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
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
  drugsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#8B5CF615',
    padding: 16,
    borderRadius: 16,
  },
  drugName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  riskBanner: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  riskLevelText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 12,
    marginBottom: 8,
  },
  riskTitleText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginStart: 8,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
  },
  altRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#10B98110',
    padding: 12,
    borderRadius: 12,
  },
  altText: {
    fontSize: 15,
    marginStart: 8,
    fontWeight: '500',
  }
});
