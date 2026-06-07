import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nManager } from 'react-native';
import i18n from '../locales/i18n';

const RTLContext = createContext({ isRTL: true });

export const RTLProvider = ({ children }) => {
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');

  useEffect(() => {
    const handleLanguageChange = (lang) => {
      const rtl = lang === 'ar';
      setIsRTL(rtl);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, []);

  return (
    <RTLContext.Provider value={{ isRTL }}>
      {children}
    </RTLContext.Provider>
  );
};

export const useRTL = () => useContext(RTLContext);

// Helper hook for conditional row direction
export const useRTLStyle = () => {
  const { isRTL } = useRTL();
  return {
    row: { flexDirection: 'row' }, // Provide standard row, RN will mirror it natively
    rowReverse: { flexDirection: 'row-reverse' },
    textAlign: { textAlign: isRTL ? 'right' : 'left' },
    textAlignReverse: { textAlign: isRTL ? 'left' : 'right' },
    alignSelf: isRTL ? 'flex-end' : 'flex-start',
    iconFlip: { transform: [{ scaleX: isRTL ? -1 : 1 }] },
  };
};
