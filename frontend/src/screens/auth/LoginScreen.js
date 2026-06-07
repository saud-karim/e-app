import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Dimensions, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api, { setAuthToken } from '../../services/api';
import { useRTLStyle } from '../../theme/RTLContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const rtl = useRTLStyle();
  
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      // Send actual credentials to the backend
      const response = await api.login({
        email_or_phone: emailOrPhone,
        password: password
      });
      await setAuthToken(response.data.token);
      
      // Save user info
      if (response.data.user) {
        await AsyncStorage.setItem('user_name', response.data.user.name);
        if (response.data.user.email) {
          await AsyncStorage.setItem('user_email', response.data.user.email);
        }
      }

      navigation.replace('Main');
    } catch (error) {
      console.error(error);
      Alert.alert(t('Error'), t('Failed to login'));
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
        <View style={[styles.topBar, rtl.row, rtl.row]}>
          <TouchableOpacity onPress={toggleLanguage} style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.iconButtonText, { color: theme.colors.primary }]}>
              {i18n.language === 'ar' ? 'EN' : 'ع'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme} style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name={isDark ? "sunny" : "moon"} size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="medical" size={40} color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('Welcome Back')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            {t('Login to continue your health journey')}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
          <View style={styles.form}>
            
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

            <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>{t('Forgot Password?')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={loading}
              style={styles.buttonContainer}
            >
              <LinearGradient
                colors={loading ? [theme.colors.border, theme.colors.border] : [theme.colors.primary, '#6B89FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, rtl.row, rtl.row]}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>{t('Login')}</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.buttonIcon} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={[styles.dividerContainer, rtl.row, rtl.row]}>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerText, { color: theme.colors.text + '80' }]}>{t('OR')}</Text>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            </View>

            <TouchableOpacity style={styles.signUpContainer} onPress={() => navigation.navigate('SignUp')}>
              <Text style={[styles.signUpText, { color: theme.colors.text }]}>
                {t("Don't have an account?")} <Text style={[styles.signUpLink, { color: theme.colors.primary }]}>{t('Sign Up')}</Text>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    marginTop: Platform.OS === 'web' ? 0 : 20,
    zIndex: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  iconButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  forgotPassword: {
    alignItems: 'flex-end',
    marginTop: -4,
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontWeight: '600',
    fontSize: 14,
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  signUpContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  signUpText: {
    fontSize: 15,
  },
  signUpLink: {
    fontWeight: 'bold',
  },
});
