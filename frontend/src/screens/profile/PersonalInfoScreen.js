import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRTLStyle } from '../../theme/RTLContext';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function PersonalInfoScreen({ navigation, route }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();
  
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodType, setBloodType] = useState('');

  const handleNext = () => {
    navigation.navigate('AgeGender', {
      ...route.params,
      height,
      weight,
      blood_type: bloodType
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
        
        <View style={styles.topBar}>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: theme.colors.surface }]} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
            <View style={[styles.progressFill, { backgroundColor: theme.colors.primary, width: '16%' }]} />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.text }]}>{t('Step 1 of 6')}</Text>
        </View>

        <View style={styles.header}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="body-outline" size={32} color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('Physical Info')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            {t('Let us know your basic physical attributes')}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
          <View style={styles.form}>
            
            <Text style={[styles.label, { color: theme.colors.text }]}>{t('Height (cm)')}</Text>
            <View style={[styles.inputContainer, rtl.row, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <Ionicons name="arrow-up-outline" size={20} color={theme.colors.text + '80'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="175"
                placeholderTextColor={theme.colors.text + '60'}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
              <Text style={[styles.unitText, { color: theme.colors.text + '80' }]}>cm</Text>
            </View>

            <Text style={[styles.label, { color: theme.colors.text }]}>{t('Weight (kg)')}</Text>
            <View style={[styles.inputContainer, rtl.row, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <Ionicons name="scale-outline" size={20} color={theme.colors.text + '80'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="70"
                placeholderTextColor={theme.colors.text + '60'}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
              <Text style={[styles.unitText, { color: theme.colors.text + '80' }]}>kg</Text>
            </View>

            <Text style={[styles.label, { color: theme.colors.text, marginTop: 8 }]}>{t('Blood Type')}</Text>
            <View style={[styles.bloodTypeGrid, rtl.row, rtl.row]}>
              {BLOOD_TYPES.map((type) => {
                const isSelected = bloodType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.bloodTypeButton,
                      { 
                        backgroundColor: isSelected ? theme.colors.primary : theme.colors.background,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border
                      }
                    ]}
                    onPress={() => setBloodType(type)}
                  >
                    <Text style={[
                      styles.bloodTypeText,
                      { color: isSelected ? '#FFF' : theme.colors.text }
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 24,
  },
  closeButton: {
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
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    marginStart: 8,
  },
  bloodTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  bloodTypeButton: {
    width: '22%',
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodTypeText: {
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
