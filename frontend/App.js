import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeContext';
import { RTLProvider } from './src/theme/RTLContext';
import { NotificationProvider } from './src/context/NotificationContext';
import './src/locales/i18n'; // Initialize i18n
import AppNavigator from './src/navigation/AppNavigator';

if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus, 
    input:-webkit-autofill:active {
        transition: background-color 5000s ease-in-out 0s !important;
        -webkit-text-fill-color: inherit !important;
    }
  `;
  document.head.appendChild(style);
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RTLProvider>
          <NotificationProvider>
            <AppNavigator />
          </NotificationProvider>
        </RTLProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
