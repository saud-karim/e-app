import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Smart Medication Reminders',
    description: 'Never miss a dose with our intelligent reminder system that adapts to your schedule.',
    icon: 'alarm-outline',
  },
  {
    id: '2',
    title: 'AI Health Assistant',
    description: 'Get instant answers and support from our advanced AI designed for your well-being.',
    icon: 'chatbubbles-outline',
  },
  {
    id: '3',
    title: 'Complete Health Tracking',
    description: 'Monitor your physical and mental health seamlessly in one secure place.',
    icon: 'fitness-outline',
  },
];

export default function OnboardingScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width);
  const slidesRef = useRef(null);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('has_seen_onboarding', 'true');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      navigation.replace('Login');
    }
  };

  const scrollToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
    }
  };

  const onLayout = (event) => {
    const layoutWidth = event.nativeEvent.layout.width;
    if (layoutWidth > 0 && layoutWidth !== containerWidth) {
      setContainerWidth(layoutWidth);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={completeOnboarding}>
          <Text style={[styles.skipText, { color: theme.colors.primary }]}>
            {currentIndex === SLIDES.length - 1 ? '' : t('Skip')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.slide}>
          <View style={styles.iconContainer}>
            <Ionicons name={SLIDES[currentIndex].icon} size={120} color={theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {t(SLIDES[currentIndex].title)}
            </Text>
            <Text style={[styles.description, { color: theme.colors.text }]}>
              {t(SLIDES[currentIndex].description)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index.toString()}
              style={[
                styles.dot,
                { backgroundColor: theme.colors.primary },
                currentIndex === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={scrollToNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? t('Get Started') : t('Next')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 0.4,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
  },
  footer: {
    height: 120,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
  },
  dotInactive: {
    width: 8,
    opacity: 0.3,
  },
  button: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
