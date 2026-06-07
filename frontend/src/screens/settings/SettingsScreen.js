import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Switch, I18nManager, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRTLStyle } from '../../theme/RTLContext';

export default function SettingsScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const rtl = useRTLStyle();
  const { t, i18n } = useTranslation();

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    const isRTL = newLang === 'ar';
    
    await i18n.changeLanguage(newLang);
    I18nManager.forceRTL(isRTL);
    I18nManager.allowRTL(isRTL);

    if (Platform.OS === 'web') {
      window.location.reload();
    } else {
      Alert.alert(
        isRTL ? "إعادة التشغيل مطلوبة" : "Restart Required", 
        isRTL ? "يرجى إعادة تشغيل التطبيق لتطبيق اتجاه الشاشة الجديد." : "Please restart the app to apply the new layout direction."
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, rtl.row, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('Settings')}</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.settingRow, rtl.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={[styles.settingInfo, rtl.row, rtl.row]}>
            <Ionicons name="moon" size={24} color={theme.colors.primary} style={styles.icon} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>{t('Dark Mode')}</Text>
          </View>
          <Switch 
            value={isDark} 
            onValueChange={toggleTheme} 
            trackColor={{ false: '#767577', true: theme.colors.primary }}
          />
        </View>

        <TouchableOpacity 
          style={[styles.settingRow, rtl.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          onPress={toggleLanguage}
        >
          <View style={[styles.settingInfo, rtl.row, rtl.row]}>
            <Ionicons name="language" size={24} color="#10B981" style={styles.icon} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>{t('Language')}</Text>
          </View>
          <Text style={[styles.langText, { color: theme.colors.text + '80' }]}>
            {i18n.language === 'en' ? 'English' : 'العربية'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backButton: { padding: 8, marginStart: -8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: { marginEnd: 16 },
  settingText: { fontSize: 16, fontWeight: '600' },
  langText: { fontSize: 14, fontWeight: 'bold' }
});
