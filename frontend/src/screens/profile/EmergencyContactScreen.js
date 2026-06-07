import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRTLStyle } from '../../theme/RTLContext';

export default function EmergencyContactScreen({ navigation }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();
  
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');

  const handleNext = () => {
    navigation.navigate('UploadMedicalReports');
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
            <View style={[styles.progressFill, { backgroundColor: theme.colors.primary, width: '83%' }]} />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.text }]}>{t('Step 5 of 6')}</Text>
        </View>

        <View style={styles.header}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.colors.surface }]} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="call-outline" size={32} color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('Emergency Contact')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            {t('Who should we call in an emergency?')}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
          <View style={styles.form}>
            
            <Text style={[styles.label, { color: theme.colors.text }]}>{t('Contact Name')}</Text>
            <View style={[styles.inputContainer, rtl.row, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <Ionicons name="person-outline" size={20} color={theme.colors.text + '80'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder={t('e.g. John Doe')}
                placeholderTextColor={theme.colors.text + '60'}
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={[styles.label, { color: theme.colors.text }]}>{t('Relationship')}</Text>
            <View style={[styles.inputContainer, rtl.row, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <Ionicons name="people-outline" size={20} color={theme.colors.text + '80'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder={t('e.g. Brother, Friend')}
                placeholderTextColor={theme.colors.text + '60'}
                value={relation}
                onChangeText={setRelation}
              />
            </View>

            <Text style={[styles.label, { color: theme.colors.text }]}>{t('Phone Number')}</Text>
            <View style={[styles.inputContainer, rtl.row, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <Ionicons name="call-outline" size={20} color={theme.colors.text + '80'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder={t('e.g. +1 234 567 890')}
                placeholderTextColor={theme.colors.text + '60'}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginEnd: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  buttonContainer: {
    marginTop: 16,
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
