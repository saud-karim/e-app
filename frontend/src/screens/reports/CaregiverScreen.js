import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useRTLStyle } from '../../theme/RTLContext';
import GlobalHeader from '../../components/GlobalHeader';

export default function CaregiverScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const rtl = useRTLStyle();
  const { t } = useTranslation();
  
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('');

  useEffect(() => {
    fetchCaregivers();
  }, []);

  const fetchCaregivers = async () => {
    try {
      setLoading(true);
      const res = await api.getCaregivers();
      setCaregivers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!name || !email) {
      Alert.alert(t('Error'), t('Name and Email are required.'));
      return;
    }

    try {
      setLoading(true);
      await api.addCaregiver({ name, email, relation });
      setName('');
      setEmail('');
      setRelation('');
      fetchCaregivers();
    } catch (error) {
      console.error(error);
      Alert.alert(t('Error'), t('Failed to add caregiver'));
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      setLoading(true);
      await api.removeCaregiver(id);
      fetchCaregivers();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GlobalHeader title={t('Care Team')} subtitle={t('Your health contacts')} showGradient={false} />

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={[styles.infoBanner, rtl.row, { backgroundColor: theme.colors.primary + '15' }]}>
          <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            {t('Add a doctor or family member to share your progress and alert them in emergencies.')}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('Add New Contact')}</Text>
        
        <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
          <TextInput
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder={t("Name")}
            placeholderTextColor={theme.colors.text + '50'}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder={t("Email")}
            placeholderTextColor={theme.colors.text + '50'}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder={t("Relation (e.g., Doctor, Mother)")}
            placeholderTextColor={theme.colors.text + '50'}
            value={relation}
            onChangeText={setRelation}
          />
          
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleAdd}
            disabled={loading}
          >
            <Text style={styles.addButtonText}>{t('Send Invite')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 24 }]}>{t('Your Care Team')}</Text>

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 20 }} />
        ) : caregivers.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.colors.text + '80' }]}>{t('No contacts added yet.')}</Text>
        ) : (
          caregivers.map((person) => (
            <View key={person.id} style={[styles.personCard, rtl.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.personInfo}>
                <Text style={[styles.personName, { color: theme.colors.text }]}>{person.name}</Text>
                <Text style={[styles.personRole, { color: theme.colors.primary }]}>{person.relation || 'Contact'}</Text>
                <Text style={[styles.personEmail, { color: theme.colors.text + '80' }]}>{person.email}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemove(person.id)} style={styles.removeBtn}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  infoBanner: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginStart: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formContainer: {
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  addButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  personCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  personRole: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  personEmail: {
    fontSize: 13,
  },
  removeBtn: {
    padding: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  }
});
