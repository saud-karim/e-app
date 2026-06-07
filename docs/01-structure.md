# REMIND ME — Project Structure
> **6 October Technological University | Faculty of Applied Health Sciences Technology**
> Supervised by: Dr. Hager

---

## 🛠️ Tech Stack

| Layer | Technology | Role |
|-------|------------|------|
| **Mobile Frontend** | React Native | Cross-platform mobile app (iOS & Android) |
| **Backend API** | Laravel (PHP) | RESTful API, business logic, auth, notifications |
| **Database** | MySQL | Relational data storage |

---

## 🗂️ Full Folder Structure

```
remind-me/
│
├── 📱 frontend/                        # React Native Mobile App
│   ├── src/
│   │   ├── navigation/
│   │   │   ├── AppNavigator.js         # Root navigator
│   │   │   ├── AuthNavigator.js        # Auth flow stack
│   │   │   └── MainNavigator.js        # Main tab + stack navigator
│   │   │
│   │   ├── screens/
│   │   │   │
│   │   │   ├── auth/                   # 8 Screens
│   │   │   │   ├── SplashScreen.js
│   │   │   │   ├── Onboarding1Screen.js
│   │   │   │   ├── Onboarding2Screen.js
│   │   │   │   ├── Onboarding3Screen.js
│   │   │   │   ├── LoginScreen.js
│   │   │   │   ├── SignUpScreen.js
│   │   │   │   ├── OTPVerificationScreen.js
│   │   │   │   └── ForgotPasswordScreen.js
│   │   │   │
│   │   │   ├── profile/                # 6 Screens
│   │   │   │   ├── PersonalInfoScreen.js
│   │   │   │   ├── AgeGenderScreen.js
│   │   │   │   ├── ChronicDiseasesScreen.js
│   │   │   │   ├── AllergiesScreen.js
│   │   │   │   ├── EmergencyContactScreen.js
│   │   │   │   └── UploadMedicalReportsScreen.js
│   │   │   │
│   │   │   ├── dashboard/              # 6 Screens
│   │   │   │   ├── HomeDashboardScreen.js
│   │   │   │   ├── DailyTimelineScreen.js
│   │   │   │   ├── UpcomingMedicationsScreen.js
│   │   │   │   ├── MissedDosesScreen.js
│   │   │   │   ├── QuickActionsScreen.js
│   │   │   │   └── RiskScoreScreen.js
│   │   │   │
│   │   │   ├── medication/             # 12 Screens
│   │   │   │   ├── AddMedicationScreen.js
│   │   │   │   ├── MedicationDetailsScreen.js
│   │   │   │   ├── DosageSetupScreen.js
│   │   │   │   ├── FrequencySetupScreen.js
│   │   │   │   ├── DurationScreen.js
│   │   │   │   ├── ReminderTimeScreen.js
│   │   │   │   ├── MedicationListScreen.js
│   │   │   │   ├── EditMedicationScreen.js
│   │   │   │   ├── DeleteConfirmationScreen.js
│   │   │   │   ├── MedicationHistoryScreen.js
│   │   │   │   ├── RefillReminderScreen.js
│   │   │   │   └── NotesScreen.js
│   │   │   │
│   │   │   ├── reminders/              # 6 Screens
│   │   │   │   ├── ReminderNotificationScreen.js
│   │   │   │   ├── SnoozeReminderScreen.js
│   │   │   │   ├── MarkAsTakenScreen.js
│   │   │   │   ├── SkipDoseScreen.js
│   │   │   │   ├── ReminderSettingsScreen.js
│   │   │   │   └── SoundSettingsScreen.js
│   │   │   │
│   │   │   ├── drug-interaction/       # 6 Screens
│   │   │   │   ├── InteractionCheckerScreen.js
│   │   │   │   ├── ScanPrescriptionScreen.js
│   │   │   │   ├── InteractionResultsScreen.js
│   │   │   │   ├── RiskLevelScreen.js
│   │   │   │   ├── WarningAlertScreen.js
│   │   │   │   └── SuggestedAlternativesScreen.js
│   │   │   │
│   │   │   ├── reports/                # 5 Screens
│   │   │   │   ├── AdherenceReportScreen.js
│   │   │   │   ├── WeeklyReportScreen.js
│   │   │   │   ├── MonthlyReportScreen.js
│   │   │   │   ├── HealthChartsScreen.js
│   │   │   │   └── ExportPDFScreen.js
│   │   │   │
│   │   │   ├── caregiver/              # 5 Screens
│   │   │   │   ├── AddDoctorScreen.js
│   │   │   │   ├── ShareDataScreen.js
│   │   │   │   ├── CaregiverAccessScreen.js
│   │   │   │   ├── NotificationsToCaregiverScreen.js
│   │   │   │   └── EmergencyAlertScreen.js
│   │   │   │
│   │   │   ├── mental-health/          # 15 Screens
│   │   │   │   ├── EnterAnonymousModeScreen.js
│   │   │   │   ├── MentalDashboardScreen.js
│   │   │   │   ├── DailyCheckInScreen.js
│   │   │   │   ├── MoodInputScreen.js
│   │   │   │   ├── AnxietyLevelScreen.js
│   │   │   │   ├── SleepTrackerScreen.js
│   │   │   │   ├── JournalEntryScreen.js
│   │   │   │   ├── AIChatSupportScreen.js
│   │   │   │   ├── GuidedConversationScreen.js
│   │   │   │   ├── BreathingExerciseScreen.js
│   │   │   │   ├── MeditationScreen.js
│   │   │   │   ├── MoodHistoryScreen.js
│   │   │   │   ├── MoodAnalysisScreen.js
│   │   │   │   ├── EmotionalInsightsScreen.js
│   │   │   │   └── CrisisAlertScreen.js
│   │   │   │
│   │   │   ├── self-assessment/        # 5 Screens
│   │   │   │   ├── StartAssessmentScreen.js
│   │   │   │   ├── QuestionsScreen.js
│   │   │   │   ├── ProgressIndicatorScreen.js
│   │   │   │   ├── ResultScreen.js
│   │   │   │   └── GuidanceScreen.js
│   │   │   │
│   │   │   ├── ai/                     # 5 Screens
│   │   │   │   ├── AIAssistantScreen.js
│   │   │   │   ├── VoiceInputScreen.js
│   │   │   │   ├── SmartSuggestionsScreen.js
│   │   │   │   ├── PredictionAlertsScreen.js
│   │   │   │   └── BehaviorAnalysisScreen.js
│   │   │   │
│   │   │   ├── settings/               # 4 Screens
│   │   │   │   ├── SettingsScreen.js
│   │   │   │   ├── LanguageScreen.js
│   │   │   │   ├── NotificationsScreen.js
│   │   │   │   └── PrivacySecurityScreen.js
│   │   │   │
│   │   │   └── ux/                     # 2 Screens
│   │   │       ├── LoadingScreen.js
│   │   │       └── SuccessErrorScreen.js
│   │   │
│   │   ├── components/                 # Reusable UI components
│   │   │   ├── MedicationCard.js
│   │   │   ├── ReminderBadge.js
│   │   │   ├── RiskScoreWidget.js
│   │   │   ├── MoodSlider.js
│   │   │   ├── ProgressBar.js
│   │   │   ├── AIChat.js
│   │   │   └── EmergencyButton.js
│   │   │
│   │   ├── services/                   # API calls to Laravel backend
│   │   │   ├── authService.js
│   │   │   ├── medicationService.js
│   │   │   ├── reminderService.js
│   │   │   ├── drugInteractionService.js
│   │   │   ├── mentalHealthService.js
│   │   │   ├── reportService.js
│   │   │   ├── caregiverService.js
│   │   │   ├── aiService.js
│   │   │   └── emergencyService.js
│   │   │
│   │   ├── store/                      # State management
│   │   │   ├── authStore.js
│   │   │   ├── medicationStore.js
│   │   │   └── mentalHealthStore.js
│   │   │
│   │   └── utils/
│   │       ├── notifications.js        # Push notification helpers
│   │       ├── voiceInput.js           # Voice input helpers
│   │       └── pdfExport.js            # PDF generation
│   │
│   ├── package.json
│   └── app.json
│
│
├── ⚙️ backend/                         # Laravel (PHP) API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── ProfileController.php
│   │   │   │   ├── MedicationController.php
│   │   │   │   ├── ReminderController.php
│   │   │   │   ├── DrugInteractionController.php
│   │   │   │   ├── MentalHealthController.php
│   │   │   │   ├── AssessmentController.php
│   │   │   │   ├── ReportController.php
│   │   │   │   ├── CaregiverController.php
│   │   │   │   ├── AIAssistantController.php
│   │   │   │   └── EmergencyAlertController.php
│   │   │   │
│   │   │   └── Middleware/
│   │   │       ├── Authenticate.php
│   │   │       └── AnonymousMode.php   # Strips identity for mental health
│   │   │
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── UserProfile.php
│   │   │   ├── Medication.php
│   │   │   ├── MedicationLog.php
│   │   │   ├── Reminder.php
│   │   │   ├── DrugInteraction.php
│   │   │   ├── MoodEntry.php
│   │   │   ├── JournalEntry.php
│   │   │   ├── Assessment.php
│   │   │   ├── AssessmentAnswer.php
│   │   │   ├── Report.php
│   │   │   └── CaregiverRelation.php
│   │   │
│   │   └── Services/
│   │       ├── DrugInteractionService.php   # AI interaction logic
│   │       ├── RiskScoringService.php       # Smart risk score calc
│   │       ├── NotificationService.php      # Push notifications
│   │       ├── ReportGeneratorService.php   # PDF + chart data
│   │       ├── MoodCorrelationService.php   # Mood ↔ medication link
│   │       ├── PredictiveReminderService.php
│   │       └── EmergencyAlertService.php
│   │
│   ├── routes/
│   │   └── api.php                     # All API endpoints
│   │
│   ├── database/
│   │   └── migrations/                 # MySQL table definitions
│   │
│   └── .env                            # DB credentials, API keys
│
│
└── 🗄️ database/                        # MySQL Schema
    ├── users
    ├── user_profiles
    ├── medications
    ├── medication_logs
    ├── reminders
    ├── drug_interactions
    ├── mood_entries
    ├── journal_entries
    ├── assessments
    ├── assessment_answers
    ├── reports
    └── caregiver_relations
```

---

## 🔗 API Communication Flow

```
React Native App
      │
      │  HTTP/REST (JSON)
      ▼
Laravel API (routes/api.php)
      │
      ├── Controllers (handle requests)
      │       │
      │       ├── Models (Eloquent ORM → MySQL)
      │       └── Services (business logic)
      │
      ▼
   MySQL Database
```

---

## 🗄️ MySQL Tables Summary

| Table | Purpose |
|-------|---------|
| `users` | Account credentials and auth tokens |
| `user_profiles` | Age, gender, chronic diseases, allergies, emergency contact |
| `medications` | Medication records per user |
| `medication_logs` | Every taken/skipped/snoozed dose event |
| `reminders` | Scheduled reminder times and settings |
| `drug_interactions` | Detected interaction records |
| `mood_entries` | Daily mood, anxiety, sleep logs (anonymous flag) |
| `journal_entries` | Private journal text (anonymous flag) |
| `assessments` | Self-assessment sessions |
| `assessment_answers` | Individual answers per session |
| `reports` | Generated adherence/weekly/monthly reports |
| `caregiver_relations` | Patient ↔ caregiver/doctor relationships |

---

## 📱 React Native Module Map (85 Screens)

| Module | Screens Count | Folder |
|--------|:---:|--------|
| Authentication | 8 | `screens/auth/` |
| Profile Setup | 6 | `screens/profile/` |
| Home & Dashboard | 6 | `screens/dashboard/` |
| Medication Management | 12 | `screens/medication/` |
| Smart Reminder System | 6 | `screens/reminders/` |
| Drug Interaction | 6 | `screens/drug-interaction/` |
| Reports & Analytics | 5 | `screens/reports/` |
| Caregiver & Doctor Module | 5 | `screens/caregiver/` |
| Mental Health Module | 15 | `screens/mental-health/` |
| Self-Assessment | 5 | `screens/self-assessment/` |
| AI Features | 5 | `screens/ai/` |
| Settings | 4 | `screens/settings/` |
| UX Screens | 2 | `screens/ux/` |
| **Total** | **85** | |

---

*REMIND ME Project Proposal | 6 October Technological University | Faculty of Applied Health Sciences Technology*
