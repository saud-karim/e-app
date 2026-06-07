# REMIND ME — Implementation Plan
> **6 October Technological University | Faculty of Applied Health Sciences Technology**
> Supervised by: Dr. Hager

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile Frontend | React Native |
| Backend API | Laravel (PHP) |
| Database | MySQL |

---

## 🗺️ Overview of Phases

| Phase | Name | Screens | Backend Modules |
|-------|------|:-------:|----------------|
| 1 | Authentication & Profile Setup | 14 | Auth, Profile |
| 2 | Home Dashboard & Medication Management | 24 | Medication, Reminder |
| 3 | Drug Interaction | 6 | Drug Interaction (AI) |
| 4 | Mental Health & Self-Assessment | 20 | Mental Health, Assessment |
| 5 | AI Features | 5 | AI Assistant, Voice, Predictions |
| 6 | Reports, Caregiver & Settings | 16 | Reports, Caregiver, Emergency, Settings |
| **Total** | | **85** | |

---

## Phase 1 — Authentication & Profile Setup
**Screens:** 8 (Authentication) + 6 (Profile Setup) = **14 Screens**

### React Native Tasks
| Task | Screen(s) | Details |
|------|-----------|---------|
| Splash Screen | Screen 1 | App logo, auto-redirect after brief display |
| Onboarding Flow | Screens 2–4 | 3-step onboarding, shown only on first launch |
| Sign Up Screen | Screen 6 | Form with validation, calls POST /api/register |
| OTP Verification | Screen 7 | 4/6-digit OTP input, calls POST /api/verify-otp |
| Login Screen | Screen 5 | Form with validation, calls POST /api/login |
| Forgot Password | Screen 8 | Email input, calls POST /api/forgot-password |
| Personal Info | Screen 9 | Name, contact fields |
| Age & Gender | Screen 10 | Age input, gender selector |
| Chronic Diseases | Screen 11 | Multi-select or text entry |
| Allergies | Screen 12 | Multi-select or text entry |
| Emergency Contact | Screen 13 | Name and phone number |
| Upload Medical Reports | Screen 14 | File picker, upload to API |

### Laravel Backend Tasks
| Task | Endpoint | Details |
|------|----------|---------|
| User Registration | POST /api/register | Validate input, create user, send OTP |
| OTP Verification | POST /api/verify-otp | Validate OTP, activate account |
| Login | POST /api/login | Validate credentials, return auth token |
| Forgot Password | POST /api/forgot-password | Send reset OTP or link |
| Reset Password | POST /api/reset-password | Validate reset token, update password |
| Save Profile | POST /api/profile | Store personal info, diseases, allergies, emergency contact |
| Upload Medical Reports | POST /api/profile/reports | Handle file upload, store securely |

### MySQL Tables
| Table | Fields |
|-------|--------|
| `users` | id, name, email/phone, password, status, created_at |
| `user_profiles` | id, user_id, age, gender, chronic_diseases, allergies, emergency_contact_name, emergency_contact_phone |
| `medical_reports` | id, user_id, file_path, uploaded_at |

---

## Phase 2 — Home Dashboard & Medication Management
**Screens:** 6 (Dashboard) + 12 (Medication) + 6 (Reminders) = **24 Screens**

### React Native Tasks
| Task | Screen(s) | Details |
|------|-----------|---------|
| Home Dashboard | Screen 15 | Fetch and display: risk score, today's medications, missed doses, quick actions |
| Daily Timeline | Screen 16 | Chronological list of today's medication events |
| Upcoming Medications | Screen 17 | Future scheduled doses list |
| Missed Doses | Screen 18 | List of missed/skipped doses |
| Quick Actions | Screen 19 | Shortcut buttons to core modules |
| Risk Score | Screen 20 | Color-coded risk widget |
| Add Medication | Screen 21 | Multi-step form: name, dosage, frequency, duration, time, notes |
| Medication Details | Screen 22 | Full view of one medication |
| Dosage Setup | Screen 23 | Dose amount and unit |
| Frequency Setup | Screen 24 | Frequency selection |
| Duration | Screen 25 | Start/end date picker |
| Reminder Time | Screen 26 | Time picker, multiple times |
| Medication List | Screen 27 | Scrollable list of all medications |
| Edit Medication | Screen 28 | Pre-filled editable form |
| Delete Confirmation | Screen 29 | Confirmation modal |
| Medication History | Screen 30 | Log of all dose events |
| Refill Reminder | Screen 31 | Supply counter and threshold |
| Notes | Screen 32 | Free-text notes |
| Reminder Notification | Screen 33 | Push notification with actions |
| Snooze Reminder | Screen 34 | Snooze duration selector |
| Mark as Taken | Screen 35 | Confirmation with timestamp |
| Skip Dose | Screen 36 | Skip with optional reason |
| Reminder Settings | Screen 37 | Global reminder preferences |
| Sound Settings | Screen 38 | Notification sound selector |

### Laravel Backend Tasks
| Task | Endpoint | Details |
|------|----------|---------|
| Get Dashboard Data | GET /api/dashboard | Return risk score, today's meds, missed doses |
| Create Medication | POST /api/medications | Save medication record |
| Get Medications | GET /api/medications | Return all user medications |
| Get Medication | GET /api/medications/{id} | Return one medication |
| Update Medication | PUT /api/medications/{id} | Update medication fields |
| Delete Medication | DELETE /api/medications/{id} | Remove medication |
| Log Dose Event | POST /api/medication-logs | Log taken/skipped/snoozed event |
| Get Medication History | GET /api/medication-logs | Return full dose history |
| Get Risk Score | GET /api/risk-score | Calculate and return current risk score |
| Schedule Reminder | POST /api/reminders | Create reminder schedule |
| Update Reminder Settings | PUT /api/reminders/settings | Update global reminder prefs |

### MySQL Tables
| Table | Fields |
|-------|--------|
| `medications` | id, user_id, name, dosage, unit, frequency, start_date, end_date, notes, is_active |
| `medication_logs` | id, user_id, medication_id, scheduled_at, action (taken/skipped/snoozed), acted_at |
| `reminders` | id, user_id, medication_id, reminder_times (JSON), snooze_duration, sound_setting, is_enabled |

### Services
| Service | Logic |
|---------|-------|
| `RiskScoringService` | Calculates risk score from: adherence rate, interaction count, missed doses, mood data |
| `NotificationService` | Schedules and sends push notifications at reminder times |

---

## Phase 3 — Drug Interaction
**Screens:** 6 Screens

### React Native Tasks
| Task | Screen(s) | Details |
|------|-----------|---------|
| Interaction Checker | Screen 39 | Search/select medication inputs, trigger check |
| Scan Prescription (AI) | Screen 40 | Camera access, send image to AI API |
| Interaction Results | Screen 41 | List of detected interactions |
| Risk Level | Screen 42 | Color-coded risk badges per interaction |
| Warning Alert | Screen 43 | High-severity alert UI |
| Suggested Alternatives | Screen 44 | Safe alternative list with disclaimer |

### Laravel Backend Tasks
| Task | Endpoint | Details |
|------|----------|---------|
| Check Interactions | POST /api/drug-interactions/check | Receive medication list, return interactions |
| Scan Prescription | POST /api/drug-interactions/scan | Receive image, extract medications via AI, return interactions |
| Get Interaction History | GET /api/drug-interactions | Return past interaction checks |

### MySQL Tables
| Table | Fields |
|-------|--------|
| `drug_interactions` | id, user_id, medications_checked (JSON), interactions_found (JSON), risk_level, checked_at |

### Services
| Service | Logic |
|---------|-------|
| `DrugInteractionService` | AI-based detection: checks medication combinations against interaction database, returns risk level and suggested alternatives |

---

## Phase 4 — Mental Health Module & Self-Assessment
**Screens:** 15 (Mental Health) + 5 (Self-Assessment) = **20 Screens**

### React Native Tasks
| Task | Screen(s) | Details |
|------|-----------|---------|
| Enter Anonymous Mode | Screen 55 | Anonymity explanation, enable anonymous session |
| Mental Dashboard | Screen 56 | Mood summary, check-in streak, tool shortcuts |
| Daily Check-In | Screen 57 | Unified check-in: mood + anxiety + sleep |
| Mood Input | Screen 58 | Mood scale selector |
| Anxiety Level | Screen 59 | Anxiety scale selector |
| Sleep Tracker | Screen 60 | Hours slept + quality rating |
| Journal Entry | Screen 61 | Private text editor |
| AI Chat Support | Screen 62 | Chat interface with AI |
| Guided Conversation | Screen 63 | Step-by-step AI dialogue |
| Breathing Exercise | Screen 64 | Animated breathing timer |
| Meditation Screen | Screen 65 | Meditation timer and content |
| Mood History | Screen 66 | Calendar/list of past check-ins |
| Mood Analysis | Screen 67 | Mood trend chart |
| Emotional Insights | Screen 68 | AI insight cards |
| Crisis Alert Screen | Screen 69 | Emergency alert trigger |
| Start Assessment | Screen 70 | Disclaimer + start button |
| Questions Screen | Screen 71 | Structured question flow |
| Progress Indicator | Screen 72 | Progress bar during assessment |
| Result Screen | Screen 73 | Mild/Moderate/High result + disclaimer |
| Guidance Screen | Screen 74 | Result-tailored supportive guidance |

### Laravel Backend Tasks
| Task | Endpoint | Details |
|------|----------|---------|
| Save Mood Entry | POST /api/mental-health/mood | Save mood, anxiety, sleep (anonymous flag) |
| Get Mood History | GET /api/mental-health/mood | Return mood entries (filtered by anonymous session if applicable) |
| Save Journal Entry | POST /api/mental-health/journal | Save journal text (anonymous, no identity link) |
| AI Chat | POST /api/mental-health/chat | Send user message, return AI response |
| Get Emotional Insights | GET /api/mental-health/insights | AI analysis of mood patterns |
| Trigger Crisis Alert | POST /api/emergency-alert | Send emergency notification to all linked contacts |
| Start Assessment | POST /api/assessments | Create new assessment session |
| Save Assessment Answer | POST /api/assessments/{id}/answers | Save each answer |
| Get Assessment Result | GET /api/assessments/{id}/result | Calculate and return Mild/Moderate/High |

### MySQL Tables
| Table | Fields |
|-------|--------|
| `mood_entries` | id, user_id (nullable for anonymous), anonymous_session_id, mood_score, anxiety_score, sleep_hours, sleep_quality, logged_at |
| `journal_entries` | id, user_id (nullable), anonymous_session_id, content, written_at |
| `assessments` | id, user_id (nullable), anonymous_session_id, result_level, completed_at |
| `assessment_answers` | id, assessment_id, question_key, answer_value |

### Services
| Service | Logic |
|---------|-------|
| `MoodCorrelationService` | Analyzes relationship between mood scores and medication adherence |
| `EmergencyAlertService` | Sends immediate push/SMS to all linked emergency contacts |

---

## Phase 5 — AI Features
**Screens:** 5 Screens

### React Native Tasks
| Task | Screen(s) | Details |
|------|-----------|---------|
| AI Assistant | Screen 75 | Central chat interface with AI |
| Voice Input | Screen 76 | Microphone, speech-to-text, AI response |
| Smart Suggestions | Screen 77 | AI-generated suggestion cards |
| Prediction Alerts | Screen 78 | Proactive alert cards |
| Behavior Analysis | Screen 79 | Charts and AI analysis of user patterns |

### Laravel Backend Tasks
| Task | Endpoint | Details |
|------|----------|---------|
| AI Assistant Chat | POST /api/ai/chat | Process text input, return AI response |
| Voice Input Transcription | POST /api/ai/voice | Receive audio, return transcribed + processed text |
| Get Smart Suggestions | GET /api/ai/suggestions | Return personalized suggestions based on user data |
| Get Prediction Alerts | GET /api/ai/predictions | Return proactive AI alerts based on behavioral patterns |
| Get Behavior Analysis | GET /api/ai/behavior | Return full behavior analysis report |

### Services
| Service | Logic |
|---------|-------|
| `PredictiveReminderService` | Analyzes adherence patterns, generates proactive alerts (e.g., "You often miss evening doses") |

---

## Phase 6 — Reports, Caregiver Module & Settings
**Screens:** 5 (Reports) + 5 (Caregiver) + 4 (Settings) + 2 (UX) = **16 Screens**

### React Native Tasks
| Task | Screen(s) | Details |
|------|-----------|---------|
| Adherence Report | Screen 45 | Overall adherence stats |
| Weekly Report | Screen 46 | 7-day adherence summary |
| Monthly Report | Screen 47 | 30-day adherence overview |
| Health Charts | Screen 48 | Visual trend charts |
| Export PDF | Screen 49 | Generate and share PDF |
| Add Doctor | Screen 50 | Doctor profile form |
| Share Data | Screen 51 | Data sharing selection UI |
| Caregiver Access | Screen 52 | Read-only patient view |
| Notifications to Caregiver | Screen 53 | Caregiver alert settings |
| Emergency Alert | Screen 54 | Emergency button |
| Settings | Screen 80 | Settings hub |
| Language | Screen 81 | Language selector |
| Notifications | Screen 82 | Notification toggles |
| Privacy & Security | Screen 83 | Privacy controls |
| Loading Screen | Screen 84 | Global loading indicator |
| Success / Error Screen | Screen 85 | Action result feedback |

### Laravel Backend Tasks
| Task | Endpoint | Details |
|------|----------|---------|
| Get Adherence Report | GET /api/reports/adherence | Adherence stats for user |
| Get Weekly Report | GET /api/reports/weekly | Last 7 days data |
| Get Monthly Report | GET /api/reports/monthly | Last 30 days data |
| Export PDF | GET /api/reports/export-pdf | Generate and return PDF |
| Add Doctor/Caregiver | POST /api/caregivers | Create caregiver relation |
| Get Caregiver Access Data | GET /api/caregivers/{id}/patient-data | Return shared patient data (read-only) |
| Update Caregiver Notifications | PUT /api/caregivers/{id}/notifications | Configure caregiver alert prefs |
| Update Settings | PUT /api/settings | Save language, notification, privacy prefs |

### MySQL Tables
| Table | Fields |
|-------|--------|
| `reports` | id, user_id, type (adherence/weekly/monthly), data (JSON), generated_at |
| `caregiver_relations` | id, patient_user_id, caregiver_user_id, role (doctor/caregiver), data_sharing_enabled, notifications_enabled |

### Services
| Service | Logic |
|---------|-------|
| `ReportGeneratorService` | Aggregates medication log data into reports and PDF exports |

---

## 📐 API Architecture (Laravel)

### Base URL
```
/api/v1/
```

### Authentication
All endpoints (except login/register/OTP) require:
```
Authorization: Bearer {token}
```

### Full Endpoint List by Module

| Module | Method | Endpoint |
|--------|--------|----------|
| **Auth** | POST | /api/register |
| | POST | /api/verify-otp |
| | POST | /api/login |
| | POST | /api/forgot-password |
| | POST | /api/reset-password |
| **Profile** | POST | /api/profile |
| | GET | /api/profile |
| | PUT | /api/profile |
| | POST | /api/profile/reports |
| **Medications** | GET | /api/medications |
| | POST | /api/medications |
| | GET | /api/medications/{id} |
| | PUT | /api/medications/{id} |
| | DELETE | /api/medications/{id} |
| **Medication Logs** | POST | /api/medication-logs |
| | GET | /api/medication-logs |
| **Reminders** | POST | /api/reminders |
| | PUT | /api/reminders/settings |
| **Drug Interaction** | POST | /api/drug-interactions/check |
| | POST | /api/drug-interactions/scan |
| | GET | /api/drug-interactions |
| **Dashboard** | GET | /api/dashboard |
| | GET | /api/risk-score |
| **Mental Health** | POST | /api/mental-health/mood |
| | GET | /api/mental-health/mood |
| | POST | /api/mental-health/journal |
| | POST | /api/mental-health/chat |
| | GET | /api/mental-health/insights |
| **Assessment** | POST | /api/assessments |
| | POST | /api/assessments/{id}/answers |
| | GET | /api/assessments/{id}/result |
| **AI** | POST | /api/ai/chat |
| | POST | /api/ai/voice |
| | GET | /api/ai/suggestions |
| | GET | /api/ai/predictions |
| | GET | /api/ai/behavior |
| **Reports** | GET | /api/reports/adherence |
| | GET | /api/reports/weekly |
| | GET | /api/reports/monthly |
| | GET | /api/reports/export-pdf |
| **Caregiver** | POST | /api/caregivers |
| | GET | /api/caregivers/{id}/patient-data |
| | PUT | /api/caregivers/{id}/notifications |
| **Emergency** | POST | /api/emergency-alert |
| **Settings** | GET | /api/settings |
| | PUT | /api/settings |

---

## 🗄️ Complete MySQL Schema Summary

| Table | Primary Purpose |
|-------|----------------|
| `users` | Accounts and credentials |
| `user_profiles` | Demographic and health background |
| `medical_reports` | Uploaded health documents |
| `medications` | Medication records |
| `medication_logs` | Dose event history (taken/skipped/snoozed) |
| `reminders` | Reminder schedules and settings |
| `drug_interactions` | Interaction check history |
| `mood_entries` | Daily mental health check-ins |
| `journal_entries` | Private journal records |
| `assessments` | Self-assessment sessions |
| `assessment_answers` | Individual question responses |
| `reports` | Generated health reports |
| `caregiver_relations` | Patient-caregiver/doctor relationships |

---

## ✅ Scope Confirmation

### In Scope — Exactly as per proposal
- All 85 screens across 13 modules
- All 8 Key Features: Medication Reminder, Drug Interaction Checker, AI Assistant, Mental Health Support (Anonymous), Self-Assessment (Screening), Mood Tracking & Analysis, Emergency Alerts, Reports & Analytics
- All 8 Innovations: AI drug detection, Anonymous mental health, Self-assessment without diagnosis, Smart risk scoring, Mood-medication correlation, Emergency alerts, Voice interaction, Predictive reminders

### Out of Scope
- Medical diagnosis
- Medical treatment prescription
- Replacement of professional medical advice
- Clinical mental health treatment

> ⚠️ **Disclaimer:** This application does not provide medical diagnosis or treatment. It offers guidance, monitoring, and support only.

---

*REMIND ME Project Proposal | 6 October Technological University | Faculty of Applied Health Sciences Technology*
