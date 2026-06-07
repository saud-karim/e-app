import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRTLStyle } from '../../theme/RTLContext';

export default function OTPVerificationScreen({ navigation, route }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();
  
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    navigation.navigate('ProfileSetup');
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
        <View style={styles.header}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.colors.surface }]} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="chatbubbles-outline" size={32} color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('Verification')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            {t('Enter the 4-digit code sent to you')}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
          <View style={styles.form}>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="----"
                placeholderTextColor={theme.colors.text + '40'}
                keyboardType="number-pad"
                maxLength={4}
                textAlign="center"
                value={otp}
                onChangeText={setOtp}
              />
            </View>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleVerify}
              style={styles.buttonContainer}
            >
              <LinearGradient
                colors={[theme.colors.primary, '#6B89FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, rtl.row, rtl.row]}
              >
                <Text style={styles.buttonText}>{t('Verify OTP')}</Text>
                <Ionicons name="checkmark-circle-outline" size={24} color="#FFF" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerLink}>
              <Text style={[styles.footerText, { color: theme.colors.text }]}>
                {t('Did not receive code?')} <Text style={[styles.resendLink, { color: theme.colors.primary }]}>{t('Resend')}</Text>
              </Text>
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
    justifyContent: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40,
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
    padding: 32,
    elevation: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    height: 80,
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontSize: 40,
    letterSpacing: 16,
    fontWeight: 'bold',
    width: '100%',
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
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
  footerLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 15,
  },
  resendLink: {
    fontWeight: 'bold',
  },
});
