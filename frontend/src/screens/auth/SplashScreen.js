import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const hasSeenOnboarding = await AsyncStorage.getItem('has_seen_onboarding');
        
        setTimeout(() => {
          if (token) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          } else if (hasSeenOnboarding === 'true') {
            navigation.replace('Login');
          } else {
            navigation.replace('Onboarding');
          }
        }, 1500);
      } catch (error) {
        setTimeout(() => {
          navigation.replace('Login');
        }, 1500);
      }
    };
    
    checkAuth();
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <Text style={[styles.title, { color: theme.colors.surface }]}>
        REMIND ME
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.surface }]}>
        {t('Your Health Assistant')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    opacity: 0.9,
  },
});
