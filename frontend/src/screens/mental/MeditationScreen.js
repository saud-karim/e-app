import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Modal } from 'react-native';
import { Audio } from 'expo-av';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRTLStyle } from '../../theme/RTLContext';

export default function MeditationScreen({ navigation }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();

  const [duration, setDuration] = useState(300); // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [selectedSound, setSelectedSound] = useState('Mute');
  const [soundObject, setSoundObject] = useState(null);
  const timerRef = useRef(null);

  const SOUNDS = [
    { id: 'Mute', name: t('Mute'), icon: 'volume-mute-outline' },
    { id: 'Rain', name: t('Rain Sounds'), icon: 'rainy-outline' },
    { id: 'Ocean', name: t('Ocean Waves'), icon: 'water-outline' },
    { id: 'Forest', name: t('Nature & Forest'), icon: 'leaf-outline' },
    { id: 'WhiteNoise', name: t('White Noise'), icon: 'radio-outline' },
  ];

  const SOUND_URLS = {
    Rain: 'https://assets.mixkit.co/active_storage/sfx/2395/2395-preview.mp3',
    Ocean: 'https://assets.mixkit.co/active_storage/sfx/137/137-preview.mp3',
    Forest: 'https://assets.mixkit.co/active_storage/sfx/2405/2405-preview.mp3',
    WhiteNoise: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3'
  };

  const handleSelectSound = async (soundId) => {
    setSelectedSound(soundId);
    setShowSoundModal(false);
    
    // Stop any currently playing sound
    if (soundObject) {
      await soundObject.unloadAsync();
      setSoundObject(null);
    }
    
    // Load and play new sound
    if (soundId !== 'Mute' && SOUND_URLS[soundId]) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: SOUND_URLS[soundId] },
          { shouldPlay: true, isLooping: true, volume: 0.5 }
        );
        setSoundObject(newSound);
      } catch (error) {
        console.error("Error playing sound", error);
      }
    }
  };

  // Cleanup sound on unmount
  useEffect(() => {
    return soundObject
      ? () => {
          soundObject.unloadAsync();
        }
      : undefined;
  }, [soundObject]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };

  const changeDuration = (mins) => {
    setIsActive(false);
    setDuration(mins * 60);
    setTimeLeft(mins * 60);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a completion sound or animation here in real app
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('Meditation')}</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('Find Your Peace')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
            {t('Close your eyes and listen to the silence.')}
          </Text>
        </View>

        <View style={styles.timerContainer}>
          <View style={[styles.timerCircle, { borderColor: theme.colors.primary }]}>
            <Text style={[styles.timerText, { color: theme.colors.text }]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>

        <View style={styles.durationSelector}>
          {[5, 10, 15].map((mins) => (
            <TouchableOpacity 
              key={mins}
              style={[
                styles.durationChip, 
                { 
                  backgroundColor: duration === mins * 60 ? theme.colors.primary : theme.colors.background,
                  borderColor: theme.colors.primary
                }
              ]}
              onPress={() => changeDuration(mins)}
            >
              <Text style={[
                styles.durationText, 
                { color: duration === mins * 60 ? '#FFF' : theme.colors.text }
              ]}>
                {mins} {t('min')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.controls, rtl.row]}>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}
            onPress={resetTimer}
          >
            <Ionicons name="refresh" size={28} color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
            onPress={toggleTimer}
          >
            <Ionicons name={isActive ? "pause" : "play"} size={36} color="#FFF" style={{ marginLeft: isActive ? 0 : 4 }} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.iconButton, 
              { backgroundColor: selectedSound !== 'Mute' ? theme.colors.primary + '20' : theme.colors.surface }
            ]}
            onPress={() => setShowSoundModal(true)}
          >
            <Ionicons 
              name={selectedSound !== 'Mute' ? "musical-notes" : "musical-notes-outline"} 
              size={28} 
              color={selectedSound !== 'Mute' ? theme.colors.primary : theme.colors.text} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sound Selection Modal */}
      <Modal
        visible={showSoundModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSoundModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{t('Ambient Sound')}</Text>
              <TouchableOpacity onPress={() => setShowSoundModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            {SOUNDS.map((sound) => (
              <TouchableOpacity 
                key={sound.id}
                style={[
                  styles.soundItem,
                  { borderColor: theme.colors.border },
                  selectedSound === sound.id && { backgroundColor: theme.colors.primary + '20', borderColor: theme.colors.primary }
                ]}
                onPress={() => handleSelectSound(sound.id)}
              >
                <Ionicons name={sound.icon} size={24} color={selectedSound === sound.id ? theme.colors.primary : theme.colors.text} />
                <Text style={[
                  styles.soundText, 
                  { color: selectedSound === sound.id ? theme.colors.primary : theme.colors.text }
                ]}>
                  {sound.name}
                </Text>
                {selectedSound === sound.id && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} style={{ marginLeft: 'auto' }} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 300, opacity: 0.15 },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 10 : 30, paddingBottom: 16, alignItems: 'center', justifyContent: 'space-between' },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  content: { flex: 1, alignItems: 'center', padding: 24, justifyContent: 'space-between' },
  textContainer: { alignItems: 'center', marginTop: 20 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
  timerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  timerCircle: { width: 260, height: 260, borderRadius: 130, borderWidth: 8, justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, backgroundColor: 'transparent' },
  timerText: { fontSize: 64, fontWeight: '200', letterSpacing: 2 },
  durationSelector: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  durationChip: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24, borderWidth: 1 },
  durationText: { fontSize: 16, fontWeight: 'bold' },
  controls: { alignItems: 'center', gap: 40, marginBottom: 40 },
  iconButton: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  playButton: { width: 84, height: 84, borderRadius: 42, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  soundItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  soundText: { fontSize: 16, fontWeight: '600', marginLeft: 16 }
});
