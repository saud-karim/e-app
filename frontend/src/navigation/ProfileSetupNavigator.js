import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PersonalInfoScreen from '../screens/profile/PersonalInfoScreen';
import AgeGenderScreen from '../screens/profile/AgeGenderScreen';
import ChronicDiseasesScreen from '../screens/profile/ChronicDiseasesScreen';
import AllergiesScreen from '../screens/profile/AllergiesScreen';
import EmergencyContactScreen from '../screens/profile/EmergencyContactScreen';
import UploadMedicalReportsScreen from '../screens/profile/UploadMedicalReportsScreen';

const Stack = createNativeStackNavigator();

export default function ProfileSetupNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="AgeGender" component={AgeGenderScreen} />
      <Stack.Screen name="ChronicDiseases" component={ChronicDiseasesScreen} />
      <Stack.Screen name="Allergies" component={AllergiesScreen} />
      <Stack.Screen name="EmergencyContact" component={EmergencyContactScreen} />
      <Stack.Screen name="UploadMedicalReports" component={UploadMedicalReportsScreen} />
    </Stack.Navigator>
  );
}
