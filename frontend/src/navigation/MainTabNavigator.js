import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import HomeDashboardScreen from '../screens/home/HomeDashboardScreen';
import MedicationNavigator from './MedicationNavigator';
import MentalHealthDashboardScreen from '../screens/mentalHealth/MentalHealthDashboardScreen';
import ReportsScreen from '../screens/reports/ReportsScreen';
import CaregiverScreen from '../screens/reports/CaregiverScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MedicationsTab') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'MentalHealth') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Caregiver') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text + '80',
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 5,
          paddingTop: 5,
          elevation: 10,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeDashboardScreen} options={{ title: t('Home') }} />
      <Tab.Screen name="MedicationsTab" component={MedicationNavigator} options={{ title: t('Meds') }} />
      <Tab.Screen name="MentalHealth" component={MentalHealthDashboardScreen} options={{ title: t('Mental Health') }} />
      <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: t('Reports') }} />
      <Tab.Screen name="Caregiver" component={CaregiverScreen} options={{ title: t('Care Team') }} />
    </Tab.Navigator>
  );
}
