import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRTLStyle } from '../../theme/RTLContext';

export default function UploadMedicalReportsScreen({ navigation }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();
  
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUpload = () => {
    // Logic to select and upload document (via DocumentPicker)
    // For now we just mock adding a file
    setUploadedFiles([...uploadedFiles, `Report_${uploadedFiles.length + 1}.pdf`]);
  };

  const handleFinish = () => {
    // Submit all data to backend and finalize onboarding
    navigation.navigate('Main');
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
            <View style={[styles.progressFill, { backgroundColor: theme.colors.primary, width: '100%' }]} />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.text }]}>{t('Step 6 of 6')}</Text>
        </View>

        <View style={styles.header}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.colors.surface }]} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="document-text-outline" size={32} color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('Medical Reports')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            {t('Upload any past medical reports or prescriptions')}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
          <View style={styles.form}>
            
            <TouchableOpacity 
              style={[styles.uploadBox, { backgroundColor: theme.colors.background, borderColor: theme.colors.primary }]}
              onPress={handleUpload}
              activeOpacity={0.7}
            >
              <View style={[styles.uploadIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="cloud-upload-outline" size={32} color={theme.colors.primary} />
              </View>
              <Text style={[styles.uploadTitle, { color: theme.colors.text }]}>{t('Tap to Upload')}</Text>
              <Text style={[styles.uploadSubtitle, { color: theme.colors.text + '80' }]}>
                {t('PDF, PNG, JPG (Max 5MB)')}
              </Text>
            </TouchableOpacity>

            {uploadedFiles.length > 0 && (
              <View style={styles.filesList}>
                <Text style={[styles.label, { color: theme.colors.text }]}>{t('Uploaded Files')}</Text>
                {uploadedFiles.map((file, index) => (
                  <View key={index} style={[styles.fileItem, rtl.row, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                    <Ionicons name="document" size={24} color={theme.colors.primary} />
                    <Text style={[styles.fileName, { color: theme.colors.text }]}>{file}</Text>
                    <TouchableOpacity onPress={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}>
                      <Ionicons name="close-circle" size={24} color={theme.colors.notification} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleFinish}
              style={[styles.buttonContainer, { marginTop: 32 }]}
            >
              <LinearGradient
                colors={['#10B981', '#34D399']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, rtl.row, rtl.row]}
              >
                <Text style={styles.buttonText}>{t('Complete Setup')}</Text>
                <Ionicons name="checkmark-circle" size={20} color="#FFF" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleFinish}
            >
              <Text style={[styles.skipButtonText, { color: theme.colors.text + '80' }]}>{t('Skip for now')}</Text>
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
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 14,
  },
  filesList: {
    marginTop: 16,
    gap: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    marginStart: 4,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
  },
  fileName: {
    flex: 1,
    marginStart: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  buttonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#10B981',
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
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
