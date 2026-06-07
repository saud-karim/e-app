import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, SafeAreaView, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRTLStyle } from '../../theme/RTLContext';

export default function BreathingExerciseScreen({ navigation }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();

  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Ready'); // Inhale, Hold, Exhale, Ready
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  
  // Ref to track if component is unmounted or stopped to prevent memory leaks in async tasks
  const isRunning = useRef(false);

  const startBreathing = () => {
    setIsActive(true);
    isRunning.current = true;
    breathCycle();
  };

  const stopBreathing = () => {
    setIsActive(false);
    isRunning.current = false;
    scaleAnim.stopAnimation();
    opacityAnim.stopAnimation();
    scaleAnim.setValue(1);
    opacityAnim.setValue(0.3);
    setPhase('Ready');
  };

  const breathCycle = () => {
    if (!isRunning.current) return;
    
    // Inhale
    setPhase('Inhale');
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 2.5,
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 4000,
        useNativeDriver: true,
      })
    ]).start(({ finished }) => {
      if (finished && isRunning.current) {
        // Hold
        setPhase('Hold');
        setTimeout(() => {
          if (!isRunning.current) return;
          // Exhale
          setPhase('Exhale');
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 4000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: 4000,
              useNativeDriver: true,
            })
          ]).start(({ finished: exFinished }) => {
            if (exFinished && isRunning.current) {
              breathCycle(); // Loop
            }
          });
        }, 2000);
      }
    });
  };

  useEffect(() => {
    return () => stopBreathing(); // Cleanup on unmount
  }, []);

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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('Breathing')}</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('Relax and Breathe')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
            {t('Follow the circle to reduce stress and anxiety.')}
          </Text>
        </View>

        <View style={styles.animationContainer}>
          <Animated.View 
            style={[
              styles.circleOuter, 
              { 
                backgroundColor: theme.colors.primary,
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]} 
          />
          <View style={[styles.circleInner, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.phaseText}>{t(phase)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.actionButton, 
            { backgroundColor: isActive ? theme.colors.notification : theme.colors.primary }
          ]}
          onPress={isActive ? stopBreathing : startBreathing}
        >
          <Text style={styles.actionButtonText}>
            {isActive ? t('Stop') : t('Start Breathing')}
          </Text>
        </TouchableOpacity>
      </View>
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
  animationContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  circleOuter: { position: 'absolute', width: 120, height: 120, borderRadius: 60 },
  circleInner: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  phaseText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  actionButton: { width: '100%', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 4, marginBottom: 20 },
  actionButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 }
});
