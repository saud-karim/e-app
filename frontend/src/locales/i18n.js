import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ar from './ar.json';
import en from './en.json';

const resources = {
  ar: { translation: ar },
  en: { translation: en }
};

// Apply RTL direction to the web document
const applyWebDirection = (lang) => {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const isRTL = lang === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // Inject or update RTL CSS
    let styleEl = document.getElementById('rtl-override');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'rtl-override';
      document.head.appendChild(styleEl);
    }

    if (isRTL) {
      styleEl.textContent = `
        [dir="rtl"] * {
          direction: rtl;
          text-align: right;
        }
        [dir="rtl"] input, [dir="rtl"] textarea {
          text-align: right;
        }
      `;
    } else {
      styleEl.textContent = `
        [dir="ltr"] * {
          direction: ltr;
          text-align: left;
        }
      `;
    }
  }
};

// Get saved language (sync-safe default with async persistence)
let savedLang = 'ar';

// Initialize i18n synchronously with default
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Then override with persisted language asynchronously
AsyncStorage.getItem('app_language').then((lang) => {
  if (lang && lang !== i18n.language) {
    i18n.changeLanguage(lang);
    applyWebDirection(lang);
    const isRTL = lang === 'ar';
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  } else {
    applyWebDirection(i18n.language);
  }
}).catch(() => {
  applyWebDirection(i18n.language);
});

// Apply on initial load
applyWebDirection(savedLang);
I18nManager.allowRTL(true);
I18nManager.forceRTL(savedLang === 'ar');

// Save language whenever it changes
i18n.on('languageChanged', (lang) => {
  AsyncStorage.setItem('app_language', lang).catch(() => {});
  applyWebDirection(lang);
  const isRTL = lang === 'ar';
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
});

export default i18n;
