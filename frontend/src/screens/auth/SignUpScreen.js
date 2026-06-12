import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRTLStyle } from '../../theme/RTLContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

const { width } = Dimensions.get('window');

export default function SignUpScreen({ navigation }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();
  
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    setError(null);
    if (!name || !emailOrPhone || !password || !passwordConfirmation) {
      setError(t('Please fill all fields'));
      return;
    }
    if (password !== passwordConfirmation) {
      setError(t('Passwords do not match'));
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name,
        password,
        password_confirmation: passwordConfirmation
      };
      
      if (emailOrPhone.includes('@')) {
        payload.email = emailOrPhone;
      } else {
        payload.phone = emailOrPhone;
      }

      const response = await api.register(payload);
      
      if (response.success && response.data?.user_id) {
        await AsyncStorage.setItem('user_name', name);
        if (payload.email) await AsyncStorage.setItem('user_email', payload.email);

        navigation.navigate('OTPVerification', { user_id: response.data.user_id });
      } else {
        setError(response.message_ar || response.message_en || t('Registration failed'));
      }
    } catch (e) {
      setError(e.message || t('An error occurred'));
    } finally {
      setLoading(false);
    }
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
            <Ionicons name="person-add" size={32} color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('Create Account')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            {t('Join us and manage your health')}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
          <View style={styles.form}>
            
            {error ? (
              <View style={[styles.errorBox, { backgroundColor: '#EF444420', borderColor: '#EF4444' }]}>
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            
            <View style={[styles.inputContainer, rtl.row, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <Ionicons name="person-outline" size={20} color={theme.colors.text + '80'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder={t('Full Name')}
                placeholderTextColor={theme.colors.text + '60'}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={[styles.inputContainer, rtl.row, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <Ionicons name="mail-outline" size={20} color={theme.colors.text + '80'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder={t('Email or Phone Number')}
                placeholderTextColor={theme.colors.text + '60'}
                value={emailOrPhone}
                onChangeText={setEmailOrPhone}
                autoCapitalize="none"
              />
            </View>
            
            <View style={[styles.inputContainer, rtl.row, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.text + '80'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder={t('Password')}
                placeholderTextColor={theme.colors.text + '60'}
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                <Ionicons name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} size={20} color={theme.colors.text + '80'} />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, rtl.row, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.text + '80'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder={t('Confirm Password')}
                placeholderTextColor={theme.colors.text + '60'}
                secureTextEntry={!isPasswordVisible}
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
              />
            </View>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleSignUp}
              style={styles.buttonContainer}
              disabled={loading}
            >
              <LinearGradient
                colors={[theme.colors.primary, '#6B89FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, rtl.row, rtl.row]}
              >
                <Text style={styles.buttonText}>{loading ? t('Creating...') : t('Sign Up')}</Text>
                {!loading && <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.buttonIcon} />}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginContainer} onPress={() => navigation.goBack()}>
              <Text style={[styles.loginText, { color: theme.colors.text }]}>
                {t('Already have an account?')} <Text style={[styles.loginLink, { color: theme.colors.primary }]}>{t('Login')}</Text>
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
  eyeIcon: {
    padding: 8,
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
  loginContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loginText: {
    fontSize: 15,
  },
  loginLink: {
    fontWeight: 'bold',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  errorText: {
    color: '#EF4444',
    marginStart: 8,
    flex: 1,
    fontSize: 14,
  },
});
