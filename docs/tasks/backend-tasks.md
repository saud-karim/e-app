# REMIND ME — Backend Tasks (Laravel + MySQL)
> All tasks strictly based on app.md features. No more, no less.

---

## Project Setup

### Laravel Project Initialization
- [ ] Create Laravel project: `laravel new remind-me-api`
- [ ] Configure `.env`: database credentials, app key, app URL
- [ ] Setup MySQL database: `remind_me_db`
- [ ] Install Sanctum for API token authentication
- [ ] Configure CORS for React Native client
- [ ] Set timezone to `Africa/Cairo`
- [ ] Configure localization: `ar` (default) + `en`
- [ ] Setup queue driver for notifications (database or Redis)
- [ ] Setup `api.php` route prefix `/api/v1/`

---

## Feature 1: Medication Reminder System

### Database Migrations

- [ ] **Create `medications` table**
```
id, user_id (FK), name, dosage_amount, dosage_unit,
frequency_type (daily/twice_daily/three_times/weekly/custom),
frequency_custom (JSON, nullable), start_date, end_date (nullable),
is_ongoing (boolean), notes (text, nullable),
refill_threshold_days (int, nullable), is_active (boolean),
created_at, updated_at
```

- [ ] **Create `reminders` table**
```
id, user_id (FK), medication_id (FK),
reminder_times (JSON — array of HH:MM times),
snooze_duration_minutes (int, default 10),
sound_setting (string), is_enabled (boolean),
created_at, updated_at
```

- [ ] **Create `medication_logs` table**
```
id, user_id (FK), medication_id (FK),
scheduled_at (datetime), action (enum: taken/skipped/snoozed),
acted_at (datetime, nullable), skip_reason (string, nullable),
created_at, updated_at
```

### Models
- [ ] `Medication.php` — belongs to User, has many MedicationLogs, has one Reminder
- [ ] `Reminder.php` — belongs to Medication
- [ ] `MedicationLog.php` — belongs to User, belongs to Medication

### Controllers
- [ ] **MedicationController**
  - `index()` — GET /api/v1/medications → return all user medications
  - `store()` — POST /api/v1/medications → create medication + reminder schedule
  - `show($id)` — GET /api/v1/medications/{id} → return one medication
  - `update($id)` — PUT /api/v1/medications/{id} → update + reschedule reminders
  - `destroy($id)` — DELETE /api/v1/medications/{id} → soft delete + cancel reminders
  - `history($id)` — GET /api/v1/medications/{id}/history → return dose logs

- [ ] **ReminderController**
  - `logAction()` — POST /api/v1/medication-logs → log taken/skipped/snoozed
  - `getLogs()` — GET /api/v1/medication-logs → return full history
  - `updateSettings()` — PUT /api/v1/reminders/settings → update global reminder prefs

### Services
- [ ] **NotificationService**
  - `scheduleReminder(Medication $med)` — Queue push notifications at each reminder time
  - `cancelReminder(Medication $med)` — Remove queued notifications
  - `rescheduleReminder(Medication $med)` — Cancel + re-create on medication update

- [ ] **RiskScoringService** *(shared across features)*
  - `calculateScore(User $user): int`
  - Inputs: adherence rate (past 7 days) + interaction count + missed doses + mood score
  - Returns: score 0–100

### Validation Rules
- Medication name: required, string, max:255
- Dosage amount: required, numeric, min:0
- Dosage unit: required, in:[mg, ml, tablet, drops, unit]
- Frequency type: required, in:[daily, twice_daily, three_times, weekly, custom]
- Start date: required, date
- End date: nullable, date, after_or_equal:start_date

---

## Feature 2: Drug Interaction Checker

### Database Migrations

- [ ] **Create `drug_interactions` table**
```
id, user_id (FK), medications_checked (JSON),
interactions_found (JSON), overall_risk_level (enum: low/medium/high/none),
checked_at (datetime), created_at, updated_at
```

### Models
- [ ] `DrugInteraction.php` — belongs to User

### Controllers
- [ ] **DrugInteractionController**
  - `check()` — POST /api/v1/drug-interactions/check
    - Receives: array of medication names
    - Calls DrugInteractionService
    - Returns: interactions array with risk levels and suggested alternatives
    - Saves result to `drug_interactions` table
  - `scan()` — POST /api/v1/drug-interactions/scan
    - Receives: image (prescription photo)
    - Calls AI service to extract medication names from image
    - Runs check() logic on extracted medications
    - Returns: extracted meds + interaction results
  - `history()` — GET /api/v1/drug-interactions → return past checks

### Services
- [ ] **DrugInteractionService**
  - `check(array $medicationNames): array`
    - Query drug interaction database/API
    - Return: `[{ medications: [], severity: 'high', description: '', alternatives: [] }]`
  - `extractFromPrescription(string $imagePath): array`
    - Call AI/OCR service with prescription image
    - Return: extracted medication name strings

### Validation Rules
- medications: required, array, min:2
- medications.*: string
- image: required (for scan), mimes:jpg,jpeg,png,pdf, max:5120

---

## Feature 3: AI Assistant

### Controllers
- [ ] **AIAssistantController**
  - `chat()` — POST /api/v1/ai/chat
    - Receives: user message text
    - Context: user's medication list + mood history + adherence data
    - Returns: AI response text
  - `voice()` — POST /api/v1/ai/voice
    - Receives: audio file
    - Transcribes audio to text
    - Processes as chat message
    - Returns: transcription + AI response
  - `suggestions()` — GET /api/v1/ai/suggestions
    - Analyzes user data patterns
    - Returns: array of suggestion objects `{icon_key, title_ar, title_en, description_ar, description_en, action}`
  - `predictions()` — GET /api/v1/ai/predictions
    - Analyzes behavioral patterns
    - Returns: array of prediction alert objects `{severity, title_ar, title_en, body_ar, body_en}`
  - `behaviorAnalysis()` — GET /api/v1/ai/behavior
    - Returns: adherence trend data, mood pattern data, correlation data, AI summary

### Note on Bilingual AI Responses
- All AI-generated text returned with both `_ar` and `_en` fields
- Example: `{ "title_ar": "...", "title_en": "..." }`
- Frontend renders the correct language based on user locale setting

---

## Feature 4: Mental Health Support (Anonymous Mode)

### Database Migrations

- [ ] **Create `mood_entries` table**
```
id, user_id (FK, nullable — null when anonymous),
anonymous_session_id (string, nullable),
mood_score (int 1–5), anxiety_score (int 1–10),
sleep_hours (decimal), sleep_quality (enum: poor/fair/good),
comment (text, nullable), logged_at (datetime),
created_at, updated_at
```

- [ ] **Create `journal_entries` table**
```
id, user_id (FK, nullable — null when anonymous),
anonymous_session_id (string, nullable),
content (text), written_at (datetime),
created_at, updated_at
```

### Models
- [ ] `MoodEntry.php` — belongs to User (nullable), anonymous session support
- [ ] `JournalEntry.php` — belongs to User (nullable), anonymous session support

### Middleware
- [ ] **AnonymousMode middleware**
  - When anonymous session active: strips `user_id` from stored records
  - Assigns `anonymous_session_id` (UUID stored in session only)
  - Prevents any user identity from being linked to mental health data

### Controllers
- [ ] **MentalHealthController**
  - `saveMoodEntry()` — POST /api/v1/mental-health/mood
    - Saves mood, anxiety, sleep data
    - Respects anonymous mode middleware
  - `getMoodHistory()` — GET /api/v1/mental-health/mood
    - Returns mood entries for user (or anonymous session)
  - `saveJournal()` — POST /api/v1/mental-health/journal
    - Saves journal text anonymously
  - `chat()` — POST /api/v1/mental-health/chat
    - Anonymous AI chat (no user identity in AI context)
    - Returns supportive AI response
  - `getInsights()` — GET /api/v1/mental-health/insights
    - AI analysis of mood/anxiety/sleep patterns
    - Returns insight objects `{icon_key, title_ar, title_en, body_ar, body_en}`
  - `getMoodAnalysis()` — GET /api/v1/mental-health/mood-analysis
    - Returns time-series mood data for charts
    - Period: week / month

### Services
- [ ] **MoodCorrelationService**
  - `correlate(User $user): array`
  - Analyzes relationship between `mood_entries.mood_score` and `medication_logs.action`
  - Returns: correlation data array for frontend charting

### Validation Rules
- mood_score: required, integer, between:1,5
- anxiety_score: required, integer, between:1,10
- sleep_hours: required, numeric, between:0,24
- sleep_quality: required, in:[poor, fair, good]

---

## Feature 5: Self-Assessment (Screening Only)

### Database Migrations

- [ ] **Create `assessments` table**
```
id, user_id (FK, nullable), anonymous_session_id (nullable),
result_level (enum: mild/moderate/high, nullable),
completed_at (datetime, nullable), created_at, updated_at
```

- [ ] **Create `assessment_answers` table**
```
id, assessment_id (FK), question_key (string),
answer_value (string), created_at
```

### Models
- [ ] `Assessment.php` — belongs to User (nullable), has many AssessmentAnswers
- [ ] `AssessmentAnswer.php` — belongs to Assessment

### Controllers
- [ ] **AssessmentController**
  - `start()` — POST /api/v1/assessments
    - Creates new assessment session
    - Returns: assessment_id + questions array (with `question_ar`, `question_en`, `options_ar`, `options_en`)
  - `saveAnswer()` — POST /api/v1/assessments/{id}/answers
    - Saves one answer per call
  - `getResult()` — GET /api/v1/assessments/{id}/result
    - Calculates score from all answers
    - Returns: `{ level: 'mild'|'moderate'|'high', score: int, guidance_ar: '', guidance_en: '' }`
    - Disclaimer appended: "This is a screening result — not a medical diagnosis"

### Scoring Logic (Service)
- [ ] **AssessmentScoringService**
  - `calculateResult(Assessment $assessment): string`
  - Score thresholds: Mild (0–33%) / Moderate (34–66%) / High (67–100%)
  - Returns: result level string

---

## Feature 6: Mood Tracking & Analysis

> Integrated within Feature 4 (Mental Health Module)
> Same tables: `mood_entries`, same controller: MentalHealthController
> Additional endpoint:

- [ ] `getMoodAnalysis()` — GET /api/v1/mental-health/mood-analysis?period=week|month
  - Returns: `{ labels: [], datasets: [{ mood: [], anxiety: [], sleep: [] }] }`
  - All labels in both languages: `{ label_ar: '...', label_en: '...' }`

---

## Feature 7: Emergency Alerts

### Controllers
- [ ] **EmergencyAlertController**
  - `trigger()` — POST /api/v1/emergency-alert
    - Receives: source (mental_health_crisis | caregiver_module)
    - Sends immediate push notification to all linked emergency contacts
    - Logs alert event
    - Returns: `{ success: true, contacts_notified: int, sent_at: datetime }`

### Services
- [ ] **EmergencyAlertService**
  - `send(User $user, string $source): void`
  - Fetches all emergency contacts from `user_profiles.emergency_contact_phone`
  - Fetches all caregiver relations from `caregiver_relations` table
  - Sends push notification + SMS (if configured) to all contacts
  - Logs to emergency_alert_logs

### Database Migrations
- [ ] **Create `emergency_alert_logs` table**
```
id, user_id (FK), source (enum: mental_health_crisis/caregiver_module),
contacts_notified (int), triggered_at (datetime), created_at
```

---

## Feature 8: Reports & Analytics

### Controllers
- [ ] **ReportController**
  - `adherence()` — GET /api/v1/reports/adherence
    - Calculates: total scheduled vs taken/skipped/missed
    - Returns: `{ adherence_pct: float, taken: int, missed: int, skipped: int }`
  - `weekly()` — GET /api/v1/reports/weekly
    - 7-day breakdown per day
    - Returns: `{ days: [{ date, label_ar, label_en, taken, missed, skipped }] }`
  - `monthly()` — GET /api/v1/reports/monthly
    - 30-day overview
    - Returns: `{ adherence_pct: float, days: [...], notable_events: [...] }`
  - `exportPdf()` — GET /api/v1/reports/export-pdf
    - Generates PDF using Laravel DomPDF or Barryvdh
    - PDF contains: patient name, medication list, adherence summary, charts data
    - Returns: PDF file stream

### Database Migrations
- [ ] **Create `reports` table**
```
id, user_id (FK), type (enum: adherence/weekly/monthly),
data (JSON), generated_at (datetime), created_at, updated_at
```

### Services
- [ ] **ReportGeneratorService**
  - `generateAdherenceReport(User $user, array $filters): array`
  - `generateWeeklyReport(User $user): array`
  - `generateMonthlyReport(User $user): array`
  - `exportToPdf(User $user): string` → returns PDF path

---

## Cross-Cutting Backend Tasks

### Authentication Module
- [ ] **AuthController**
  - `register()` — POST /api/v1/register
  - `verifyOtp()` — POST /api/v1/verify-otp
  - `login()` — POST /api/v1/login → returns Sanctum token
  - `forgotPassword()` — POST /api/v1/forgot-password
  - `resetPassword()` — POST /api/v1/reset-password
  - `logout()` — POST /api/v1/logout

- [ ] **Create `users` table**
```
id, name, email, phone, password (hashed),
otp_code (nullable), otp_expires_at (nullable),
status (enum: pending/active), email_verified_at (nullable),
created_at, updated_at
```

### Profile Module
- [ ] **ProfileController**
  - `store()` — POST /api/v1/profile
  - `show()` — GET /api/v1/profile
  - `update()` — PUT /api/v1/profile
  - `uploadReports()` — POST /api/v1/profile/reports

- [ ] **Create `user_profiles` table**
```
id, user_id (FK), age (int), gender (enum: male/female/other),
chronic_diseases (JSON), allergies (JSON),
emergency_contact_name, emergency_contact_phone,
created_at, updated_at
```

- [ ] **Create `medical_reports` table**
```
id, user_id (FK), file_path (string), original_name (string),
uploaded_at (datetime), created_at
```

### Caregiver & Doctor Module
- [ ] **CaregiverController**
  - `addCaregiver()` — POST /api/v1/caregivers
  - `getPatientData($id)` — GET /api/v1/caregivers/{id}/patient-data
  - `updateNotifications($id)` — PUT /api/v1/caregivers/{id}/notifications
  - `listCaregivers()` — GET /api/v1/caregivers

- [ ] **Create `caregiver_relations` table**
```
id, patient_user_id (FK), caregiver_name, caregiver_phone,
role (enum: doctor/caregiver), data_sharing_enabled (boolean),
notifications_enabled (boolean), notifications_config (JSON),
created_at, updated_at
```

### Dashboard & Risk Score
- [ ] **DashboardController**
  - `getDashboard()` — GET /api/v1/dashboard
    - Returns: risk_score, today_medications, upcoming_medications, missed_doses_today
  - `getRiskScore()` — GET /api/v1/risk-score
    - Calls RiskScoringService
    - Returns: `{ score: int, level: 'low'|'medium'|'high', factors: {...} }`

### Settings Module
- [ ] **SettingsController**
  - `get()` — GET /api/v1/settings
  - `update()` — PUT /api/v1/settings

- [ ] **Create `user_settings` table**
```
id, user_id (FK), language (enum: ar/en, default: ar),
theme (enum: light/dark/system, default: system),
notifications_enabled (boolean), medication_reminders_enabled (boolean),
caregiver_alerts_enabled (boolean), ai_alerts_enabled (boolean),
created_at, updated_at
```

---

## Bilingual API Response Standard

All API responses that include user-visible text must include both languages:

```json
{
  "title_ar": "عنوان بالعربي",
  "title_en": "Title in English",
  "body_ar": "نص بالعربي",
  "body_en": "Body in English"
}
```

Frontend selects the correct language key based on `user_settings.language`.

---

## API Response Format Standard

All responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message_ar": "تمت العملية بنجاح",
  "message_en": "Operation completed successfully"
}
```

Error responses:
```json
{
  "success": false,
  "errors": { ... },
  "message_ar": "حدث خطأ",
  "message_en": "An error occurred"
}
```

---

## Complete MySQL Table List

| Table | Feature |
|-------|---------|
| `users` | Authentication |
| `user_profiles` | Profile Setup |
| `medical_reports` | Profile Setup |
| `user_settings` | Settings |
| `medications` | Medication Management |
| `reminders` | Smart Reminder System |
| `medication_logs` | Smart Reminder System |
| `drug_interactions` | Drug Interaction |
| `mood_entries` | Mental Health + Mood Tracking |
| `journal_entries` | Mental Health |
| `assessments` | Self-Assessment |
| `assessment_answers` | Self-Assessment |
| `reports` | Reports & Analytics |
| `caregiver_relations` | Caregiver & Doctor Module |
| `emergency_alert_logs` | Emergency Alerts |

---

## Complete Endpoint List

| Method | Endpoint | Feature |
|--------|----------|---------|
| POST | /api/v1/register | Auth |
| POST | /api/v1/verify-otp | Auth |
| POST | /api/v1/login | Auth |
| POST | /api/v1/forgot-password | Auth |
| POST | /api/v1/reset-password | Auth |
| POST | /api/v1/logout | Auth |
| GET/POST/PUT | /api/v1/profile | Profile |
| POST | /api/v1/profile/reports | Profile |
| GET | /api/v1/medications | Medication |
| POST | /api/v1/medications | Medication |
| GET/PUT/DELETE | /api/v1/medications/{id} | Medication |
| GET | /api/v1/medications/{id}/history | Medication |
| POST | /api/v1/medication-logs | Reminder |
| GET | /api/v1/medication-logs | Reminder |
| PUT | /api/v1/reminders/settings | Reminder |
| POST | /api/v1/drug-interactions/check | Drug Interaction |
| POST | /api/v1/drug-interactions/scan | Drug Interaction |
| GET | /api/v1/drug-interactions | Drug Interaction |
| GET | /api/v1/dashboard | Dashboard |
| GET | /api/v1/risk-score | Dashboard |
| POST | /api/v1/mental-health/mood | Mental Health |
| GET | /api/v1/mental-health/mood | Mental Health |
| GET | /api/v1/mental-health/mood-analysis | Mood Tracking |
| POST | /api/v1/mental-health/journal | Mental Health |
| POST | /api/v1/mental-health/chat | Mental Health |
| GET | /api/v1/mental-health/insights | Mental Health |
| POST | /api/v1/assessments | Self-Assessment |
| POST | /api/v1/assessments/{id}/answers | Self-Assessment |
| GET | /api/v1/assessments/{id}/result | Self-Assessment |
| POST | /api/v1/ai/chat | AI Assistant |
| POST | /api/v1/ai/voice | AI Assistant |
| GET | /api/v1/ai/suggestions | AI Assistant |
| GET | /api/v1/ai/predictions | AI Assistant |
| GET | /api/v1/ai/behavior | AI Assistant |
| POST | /api/v1/emergency-alert | Emergency Alerts |
| GET | /api/v1/reports/adherence | Reports |
| GET | /api/v1/reports/weekly | Reports |
| GET | /api/v1/reports/monthly | Reports |
| GET | /api/v1/reports/export-pdf | Reports |
| GET | /api/v1/caregivers | Caregiver |
| POST | /api/v1/caregivers | Caregiver |
| GET | /api/v1/caregivers/{id}/patient-data | Caregiver |
| PUT | /api/v1/caregivers/{id}/notifications | Caregiver |
| GET/PUT | /api/v1/settings | Settings |

---

*REMIND ME | Laravel Backend Tasks | 6 October Technological University*
