import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MedicationsListScreen from '../screens/medications/MedicationsListScreen';
import AddMedicationScreen from '../screens/medications/AddMedicationScreen';
import EditMedicationScreen from '../screens/medications/EditMedicationScreen';
import MedicationDetailsScreen from '../screens/medications/MedicationDetailsScreen';
import ScanPrescriptionScreen from '../screens/medications/ScanPrescriptionScreen';

const Stack = createNativeStackNavigator();

export default function MedicationNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MedicationsList" component={MedicationsListScreen} />
      <Stack.Screen name="MedicationDetails" component={MedicationDetailsScreen} />
      <Stack.Screen name="AddMedication" component={AddMedicationScreen} />
      <Stack.Screen name="EditMedication" component={EditMedicationScreen} />
      <Stack.Screen name="ScanPrescription" component={ScanPrescriptionScreen} />
    </Stack.Navigator>
  );
}
