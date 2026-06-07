import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useRTLStyle } from '../../theme/RTLContext';

export default function ScanPrescriptionScreen({ navigation }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();

  const [imageUri, setImageUri] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setResults(null);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert(t('Sorry, we need camera permissions to make this work!'));
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setResults(null);
    }
  };

  const simulateAIScan = () => {
    setIsScanning(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setIsScanning(false);
      setResults([
        { id: 1, name: 'Amoxicillin', dosage: '500', unit: 'mg', frequency: 'Twice a day' },
        { id: 2, name: 'Panadol Advance', dosage: '500', unit: 'mg', frequency: 'Every 8 hours' },
      ]);
    }, 3000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primary + '20', 'transparent']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      <View style={[styles.header, rtl.row]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name={rtl.isRTL ? "arrow-forward" : "arrow-back"} size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('AI Smart Scan')}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!imageUri ? (
          <View style={styles.placeholderContainer}>
            <View style={[styles.lottiePlaceholder, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Ionicons name="scan-outline" size={80} color={theme.colors.primary} />
              <Text style={[styles.placeholderText, { color: theme.colors.text }]}>
                {t('Scan your prescription or medication box to automatically extract the details.')}
              </Text>
            </View>

            <View style={[styles.actionRow, rtl.row]}>
              <TouchableOpacity style={[styles.actionBtn, rtl.row, { backgroundColor: theme.colors.primary }]} onPress={takePhoto}>
                <Ionicons name="camera" size={24} color="#FFF" />
                <Text style={[styles.actionBtnText, { color: '#FFF' }]}>{t('Take Photo')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionBtn, rtl.row, { backgroundColor: theme.colors.primary + '15' }]} onPress={pickImage}>
                <Ionicons name="images" size={24} color={theme.colors.primary} />
                <Text style={[styles.actionBtnText, { color: theme.colors.primary }]}>{t('Gallery')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.previewContainer}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            
            {isScanning ? (
              <View style={[styles.scanningOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.scanningText}>{t('Analyzing with AI...')}</Text>
              </View>
            ) : null}

            {!isScanning && !results ? (
              <View style={[styles.repickRow, rtl.row]}>
                <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: theme.colors.primary + '15', borderWidth: 0 }]} onPress={() => setImageUri(null)}>
                  <Text style={[styles.secondaryBtnText, { color: theme.colors.primary }]}>{t('Retake')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.primaryBtn, rtl.row, { backgroundColor: theme.colors.primary }]} onPress={simulateAIScan}>
                  <Ionicons name="sparkles" size={20} color="#FFF" />
                  <Text style={[styles.primaryBtnText, { color: '#FFF', marginHorizontal: 8 }]}>{t('Extract Data')}</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}

        {results && (
          <View style={styles.resultsContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('Extracted Medications')}</Text>
            {results.map((item) => (
              <View key={item.id} style={[styles.resultCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Ionicons name="medical" size={24} color={theme.colors.primary} />
                <View style={styles.resultInfo}>
                  <Text style={[styles.resultName, { color: theme.colors.text }]}>{item.name}</Text>
                  <Text style={[styles.resultDosage, { color: theme.colors.text + '80' }]}>{item.dosage} {item.unit} • {item.frequency}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>
            ))}

            <TouchableOpacity 
              style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
              onPress={() => {
                navigation.navigate('AddMedication');
              }}
            >
              <Text style={styles.addBtnText}>{t('Add to My Medications')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 200, opacity: 0.15 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, alignItems: 'center', justifyContent: 'space-between' },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center', marginHorizontal: 10 },
  content: { padding: 20, paddingBottom: 40 },
  placeholderContainer: { alignItems: 'center', marginTop: 40 },
  lottiePlaceholder: { width: '100%', height: 250, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', padding: 32, marginBottom: 32 },
  placeholderText: { textAlign: 'center', fontSize: 16, marginTop: 16, lineHeight: 24 },
  actionRow: { flexDirection: 'row', gap: 16, width: '100%' },
  actionBtn: { flex: 1, height: 56, borderRadius: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  actionBtnText: { fontSize: 16, fontWeight: 'bold', marginStart: 8 },
  previewContainer: { width: '100%', borderRadius: 24, overflow: 'hidden', backgroundColor: '#000', marginBottom: 24 },
  previewImage: { width: '100%', height: 350, resizeMode: 'cover' },
  scanningOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  scanningText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 16, letterSpacing: 1 },
  repickRow: { flexDirection: 'row', padding: 16, gap: 16, backgroundColor: '#000' },
  secondaryBtn: { flex: 1, height: 50, borderRadius: 25, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' },
  secondaryBtnText: { fontSize: 16, fontWeight: 'bold' },
  primaryBtn: { flex: 2, height: 50, borderRadius: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { fontSize: 16, fontWeight: 'bold' },
  resultsContainer: { marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  resultCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  resultInfo: { flex: 1, marginHorizontal: 12 },
  resultName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  resultDosage: { fontSize: 14 },
  addBtn: { width: '100%', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 24, elevation: 4 },
  addBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
