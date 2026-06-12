import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRTLStyle } from '../../theme/RTLContext';

export default function AgeGenderScreen({ navigation, route }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();
  
  const [day, setDay] = useState(route.params?.age ? '01' : '');
  const [month, setMonth] = useState(route.params?.age ? '01' : '');
  const [year, setYear] = useState(route.params?.age ? (new Date().getFullYear() - route.params.age).toString() : '');
  const [gender, setGender] = useState(route.params?.gender || '');

  const handleNext = () => {
    let age = null;
    if (year) {
      age = new Date().getFullYear() - parseInt(year);
    }
    navigation.navigate('ChronicDiseases', {
      ...route.params,
      age,
      gender
    });
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primary + '80', 'transparent']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
            <View style={[styles.progressFill, { backgroundColor: theme.colors.primary, width: '33%' }]} />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.text }]}>{t('Step 2 of 6')}</Text>
        </View>

        <View style={styles.header}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.colors.surface }]} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="calendar-outline" size={32} color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('Age & Gender')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            {t('Help us personalize your experience')}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
          <View style={styles.form}>
            
            <Text style={[styles.label, { color: theme.colors.text }]}>{t('Date of Birth')}</Text>
            <View style={[styles.dobContainer, rtl.row, rtl.row]}>
              <View style={[styles.inputContainer, styles.dobInputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                <TextInput
                  style={[styles.input, styles.dobInput, { color: theme.colors.text }]}
                  placeholder={t('DD')}
                  placeholderTextColor={theme.colors.text + '60'}
                  keyboardType="numeric"
                  maxLength={2}
                  value={day}
                  onChangeText={setDay}
                />
              </View>
              <Text style={[styles.separator, { color: theme.colors.text + '80' }]}>/</Text>
              <View style={[styles.inputContainer, styles.dobInputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                <TextInput
                  style={[styles.input, styles.dobInput, { color: theme.colors.text }]}
                  placeholder={t('MM')}
                  placeholderTextColor={theme.colors.text + '60'}
                  keyboardType="numeric"
                  maxLength={2}
                  value={month}
                  onChangeText={setMonth}
                />
              </View>
              <Text style={[styles.separator, { color: theme.colors.text + '80' }]}>/</Text>
              <View style={[styles.inputContainer, styles.dobInputWrapper, { flex: 1.5, backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                <TextInput
                  style={[styles.input, styles.dobInput, { color: theme.colors.text }]}
                  placeholder={t('YYYY')}
                  placeholderTextColor={theme.colors.text + '60'}
                  keyboardType="numeric"
                  maxLength={4}
                  value={year}
                  onChangeText={setYear}
                />
              </View>
            </View>

            <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>{t('Gender')}</Text>
            <View style={[styles.genderContainer, rtl.row, rtl.row]}>
              <TouchableOpacity
                style={[
                  styles.genderCard,
                  { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
                  gender === 'male' && { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '10' }
                ]}
                onPress={() => setGender('male')}
              >
                <Ionicons 
                  name="male" 
                  size={40} 
                  color={gender === 'male' ? theme.colors.primary : theme.colors.text + '80'} 
                />
                <Text style={[
                  styles.genderText,
                  { color: gender === 'male' ? theme.colors.primary : theme.colors.text }
                ]}>{t('Male')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderCard,
                  { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
                  gender === 'female' && { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '10' }
                ]}
                onPress={() => setGender('female')}
              >
                <Ionicons 
                  name="female" 
                  size={40} 
                  color={gender === 'female' ? theme.colors.primary : theme.colors.text + '80'} 
                />
                <Text style={[
                  styles.genderText,
                  { color: gender === 'female' ? theme.colors.primary : theme.colors.text }
                ]}>{t('Female')}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleNext}
              style={styles.buttonContainer}
            >
              <LinearGradient
                colors={[theme.colors.primary, '#6B89FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, rtl.row, rtl.row]}
              >
                <Text style={styles.buttonText}>{t('Continue')}</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    opacity: 0.15,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'auto',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.7,
    textAlign: 'center',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: -8,
    marginStart: 4,
  },
  dobContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dobInputWrapper: {
    flex: 1,
    paddingHorizontal: 0,
  },
  separator: {
    fontSize: 24,
    fontWeight: '300',
    marginHorizontal: 8,
  },
  inputContainer: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  dobInput: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  genderCard: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  genderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#4F6EF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  button: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginStart: 8,
  },
});
