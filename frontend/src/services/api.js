import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1'; // Use IP address for Android Emulator, e.g., 'http://10.0.2.2:8000/api/v1'

export const getAuthToken = async () => {
  return await AsyncStorage.getItem('auth_token');
};

export const setAuthToken = async (token) => {
  await AsyncStorage.setItem('auth_token', token);
};

const apiCall = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  
  const headers = {
    'Accept': 'application/json',
    ...options.headers,
  };

  if (options.body && options.body instanceof FormData) {
    // Let the browser set Content-Type for FormData
    delete headers['Content-Type'];
  } else {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message_ar || data.message || 'API request failed');
  }

  return data;
};

export default {
  // Auth
  login: (credentials) => apiCall('/login', { method: 'POST', body: JSON.stringify(credentials) }),
  testLogin: () => apiCall('/test-login', { method: 'POST' }),
  register: (data) => apiCall('/register', { method: 'POST', body: JSON.stringify(data) }),
  verifyOtp: (data) => apiCall('/verify-otp', { method: 'POST', body: JSON.stringify(data) }),
  
  // Medications
  getMedications: () => apiCall('/medications'),
  addMedication: (data) => apiCall('/medications', { method: 'POST', body: JSON.stringify(data) }),
  updateMedication: (id, data) => apiCall(`/medications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMedication: (id) => apiCall(`/medications/${id}`, { method: 'DELETE' }),
  logIntake: (data) => apiCall('/medication-logs', { method: 'POST', body: JSON.stringify(data) }),
  
  // Dashboard
  getDashboard: () => apiCall('/dashboard'),

  // Interactions
  checkInteractions: (medicationsArray) => apiCall('/interactions/check', { method: 'POST', body: JSON.stringify({ medications: medicationsArray }) }),

  // Mental Health
  getMoodLogs: () => apiCall('/mood-logs'),
  addMoodLog: (data) => apiCall('/mood-logs', { method: 'POST', body: JSON.stringify(data) }),
  
  // AI Chat
  sendChatMessage: (message) => apiCall('/ai-chat', { method: 'POST', body: JSON.stringify({ message }) }),

  // Reports
  getAdherenceReport: () => apiCall('/reports/adherence'),

  // Profile
  updateProfile: (data) => apiCall('/profile', { method: 'POST', body: JSON.stringify(data) }),
  uploadMedicalReport: (formData) => apiCall('/profile/reports', { method: 'POST', body: formData }),

  // Caregivers
  getCaregivers: () => apiCall('/caregivers'),
  addCaregiver: (data) => apiCall('/caregivers', { method: 'POST', body: JSON.stringify(data) }),
  removeCaregiver: (id) => apiCall(`/caregivers/${id}`, { method: 'DELETE' }),

  // Assessment
  submitAssessment: (score) => apiCall('/assessment/submit', { method: 'POST', body: JSON.stringify({ score }) }),
};
