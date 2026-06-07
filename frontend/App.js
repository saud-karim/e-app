import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeContext';
import { RTLProvider } from './src/theme/RTLContext';
import './src/locales/i18n'; // Initialize i18n
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RTLProvider>
          <AppNavigator />
        </RTLProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
