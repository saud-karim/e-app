import React from 'react';
import { NavigationContainer, DefaultTheme as NavDefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import AuthNavigator from './AuthNavigator';
import ProfileSetupNavigator from './ProfileSetupNavigator';
import MainTabNavigator from './MainTabNavigator';
import InteractionCheckerScreen from '../screens/interactions/InteractionCheckerScreen';
import InteractionResultsScreen from '../screens/interactions/InteractionResultsScreen';
import ReminderSettingsScreen from '../screens/reminders/ReminderSettingsScreen';
import ReminderNotificationScreen from '../screens/reminders/ReminderNotificationScreen';
import MentalDashboardScreen from '../screens/mental/MentalDashboardScreen';
import DailyCheckInScreen from '../screens/mental/DailyCheckInScreen';
import AIChatScreen from '../screens/mental/AIChatScreen';
import BreathingExerciseScreen from '../screens/mental/BreathingExerciseScreen';
import MeditationScreen from '../screens/mental/MeditationScreen';
import MenuScreen from '../screens/settings/MenuScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import SelfAssessmentScreen from '../screens/mentalHealth/SelfAssessmentScreen';
import AssessmentResultsScreen from '../screens/mentalHealth/AssessmentResultsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isDark } = useTheme();

  return (
    <NavigationContainer theme={isDark ? DarkTheme : LightTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* For now, we default to Auth flow */}
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupNavigator} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="InteractionChecker" component={InteractionCheckerScreen} />
        <Stack.Screen name="InteractionResults" component={InteractionResultsScreen} />
        <Stack.Screen name="ReminderSettings" component={ReminderSettingsScreen} />
        <Stack.Screen 
          name="ReminderNotification" 
          component={ReminderNotificationScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen name="MentalDashboard" component={MentalDashboardScreen} />
        <Stack.Screen name="DailyCheckIn" component={DailyCheckInScreen} />
        <Stack.Screen name="AIChat" component={AIChatScreen} />
        <Stack.Screen name="BreathingExercise" component={BreathingExerciseScreen} />
        <Stack.Screen name="Meditation" component={MeditationScreen} />
        <Stack.Screen 
          name="Menu" 
          component={MenuScreen} 
          options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }} 
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="SelfAssessment" component={SelfAssessmentScreen} />
        <Stack.Screen name="AssessmentResults" component={AssessmentResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const LightTheme = {
  ...NavDefaultTheme,
  colors: {
    ...NavDefaultTheme.colors,
    primary: '#208AEF',
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#1F2937',
    border: '#E5E7EB',
    notification: '#E33629',
  },
};

const DarkTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    primary: '#3B9DF2',
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    border: '#374151',
    notification: '#E33629',
  },
};
