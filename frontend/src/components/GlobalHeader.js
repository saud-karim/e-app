import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRTLStyle } from '../theme/RTLContext';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export default function GlobalHeader({ title, subtitle, showGradient = true }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const rtl = useRTLStyle();
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const name = await AsyncStorage.getItem('user_name');
        if (name) setUserName(name.split(' ')[0]); // Get first name
      } catch (e) {}
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      {showGradient && (
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primary + '60', 'transparent']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      )}
      <View style={[styles.header, rtl.row]}>
        <View style={styles.titleContainer}>
          <Text style={[styles.greeting, { color: theme.colors.text }]}>
            {title || `${t('Hello,')} ${userName} 👋`}
          </Text>
          <Text style={[styles.dateText, { color: theme.colors.text + '80' }]}>
            {subtitle || t('Today is a good day to be healthy!')}
          </Text>
        </View>
        <View style={[styles.headerActions, rtl.row]}>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate('NotificationsList')}
          >
            <Ionicons name="notifications-outline" size={22} color={theme.colors.text} />
            {/* Show badge conditionally later if needed */}
            <View style={styles.badge} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, marginStart: 12 }]}
            onPress={() => navigation.navigate('Menu')}
          >
            <Ionicons name="menu" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 10,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    opacity: 0.15,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  greeting: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  dateText: { fontSize: 14 },
  headerActions: { alignItems: 'center' },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
});
