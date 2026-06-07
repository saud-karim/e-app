import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, ActivityIndicator, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, ProgressChart } from 'react-native-chart-kit';
import api from '../../services/api';
import { useRTLStyle } from '../../theme/RTLContext';
import GlobalHeader from '../../components/GlobalHeader';

const screenWidth = Dimensions.get('window').width;

export default function ReportsScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
    const unsubscribe = navigation.addListener('focus', fetchReport);
    return unsubscribe;
  }, [navigation]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.getAdherenceReport();
      setReport(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => `rgba(${isDark ? '139, 92, 246' : '99, 102, 241'}, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    labelColor: () => theme.colors.text + '80',
    fillShadowGradientOpacity: 1,
  };

  const progressData = {
    labels: ["Compliance"],
    data: [report ? report.overall_compliance / 100 : 0]
  };

  const barData = {
    labels: report ? report.weekly_chart.labels.map(l => t(l)) : [],
    datasets: [
      {
        data: report ? report.weekly_chart.taken : []
      }
    ]
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GlobalHeader title={t('Analytics')} subtitle={t('Track your progress')} showGradient={false} />

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Compliance Circle */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{t('Overall Compliance')}</Text>
          <View style={styles.chartWrapper}>
            <ProgressChart
              data={progressData}
              width={screenWidth - 80}
              height={180}
              strokeWidth={16}
              radius={60}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Green
              }}
              hideLegend={true}
            />
            <View style={styles.centerTextContainer}>
              <Text style={[styles.percentageText, { color: theme.colors.text }]}>
                {report ? report.overall_compliance : 0}%
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly Adherence Bar Chart */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{t('Weekly Doses Taken')}</Text>
          <BarChart
            style={{ marginVertical: 8, borderRadius: 16 }}
            data={barData}
            width={screenWidth - 60}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            showValuesOnTopOfBars={true}
          />
        </View>

        {/* Insights */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{t('Summary')}</Text>
          <View style={[styles.statRow, rtl.row, rtl.row]}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#10B981' }]}>{report ? report.total_doses : 0}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>{t('Total Doses')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#EF4444' }]}>
                {report ? report.weekly_chart.missed.reduce((a,b)=>a+b, 0) : 0}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>{t('Missed')}</Text>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  }
});
