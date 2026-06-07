import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Animated, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRTLStyle } from '../../theme/RTLContext';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

export default function MenuScreen({ navigation }) {
  const { theme } = useTheme();
  const rtl = useRTLStyle();
  const { t, i18n } = useTranslation();
  
  const slideAnim = useRef(new Animated.Value(i18n.language === 'ar' ? -DRAWER_WIDTH : DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [userName, setUserName] = React.useState('User');
  const [userEmail, setUserEmail] = React.useState('user@example.com');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();

    const fetchUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('user_name');
        const email = await AsyncStorage.getItem('user_email');
        if (name) setUserName(name);
        if (email) setUserEmail(email);
      } catch (e) {}
    };
    fetchUserData();
  }, []);

  const closeMenu = (callback) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: i18n.language === 'ar' ? -DRAWER_WIDTH : DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(() => {
      navigation.goBack();
      if (callback && typeof callback === 'function') callback();
    });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('auth_token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };
  const menuItems = [
    {
      title: t('Medical Profile'),
      subtitle: t('Update your health information'),
      icon: 'medical-outline',
      color: '#10B981',
      onPress: () => closeMenu(() => navigation.navigate('ProfileSetup'))
    },
    {
      title: t('Self-Assessment'),
      subtitle: t('Take a quick mental health check'),
      icon: 'clipboard-outline',
      color: '#3B82F6',
      onPress: () => closeMenu(() => navigation.navigate('SelfAssessment'))
    },
    {
      title: t('Settings'),
      subtitle: t('Theme, Language, Notifications'),
      icon: 'settings-outline',
      color: '#8B5CF6',
      onPress: () => closeMenu(() => navigation.navigate('Settings'))
    },
    {
      title: t('Log Out'),
      subtitle: t('Sign out of your account'),
      icon: 'log-out-outline',
      color: '#EF4444',
      onPress: handleLogout
    }
  ];

  return (
    <View style={styles.overlayContainer}>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.backdropTouch} onPress={() => closeMenu()} activeOpacity={1} />
      </Animated.View>

      <Animated.View 
        style={[
          styles.drawer, 
          { 
            backgroundColor: theme.colors.background,
            transform: [{ translateX: slideAnim }],
            [i18n.language === 'ar' ? 'left' : 'right']: 0
          }
        ]}
      >
        <View style={[styles.header, rtl.rowReverse, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.headerTitle, rtl.textAlignReverse, { color: theme.colors.text }]}>{t('Menu')}</Text>
          <TouchableOpacity onPress={() => closeMenu()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.profileCard, rtl.rowReverse, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="person" size={28} color={theme.colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, rtl.textAlignReverse, { color: theme.colors.text }]}>{userName}</Text>
              <Text style={[styles.profileEmail, rtl.textAlignReverse, { color: theme.colors.text + '80' }]}>{userEmail}</Text>
            </View>
          </View>

          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.menuItem, rtl.rowReverse, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                onPress={item.onPress}
              >
                <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <View style={styles.menuText}>
                  <Text style={[styles.menuTitle, rtl.textAlignReverse, { color: theme.colors.text }]}>{item.title}</Text>
                  <Text style={[styles.menuSubtitle, rtl.textAlignReverse, { color: theme.colors.text + '80' }]}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.text + '40'} style={{ transform: [{ scaleX: i18n.language === 'ar' ? 1 : -1 }] }} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: { flex: 1, flexDirection: 'row', overflow: 'hidden' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  backdropTouch: { flex: 1 },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  closeButton: { padding: 4 },
  content: { padding: 20 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    gap: 12,
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  profileEmail: { fontSize: 12 },
  menuContainer: { gap: 12 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  iconBox: {
    width: 40, height: 40, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  menuSubtitle: { fontSize: 12 }
});
