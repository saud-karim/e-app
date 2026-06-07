# REMIND ME — Frontend Tasks (React Native)
> All tasks strictly based on app.md features. No more, no less.

---

## Design System (Applied to ALL Screens)

### Bilingual Support (Arabic / English)
- All text must be wrapped in `i18n` translation function `t('key')`
- Two locale files: `ar.json` + `en.json`
- RTL layout enabled for Arabic (`I18nManager.forceRTL(true)`)
- Language toggle available in Settings → Language screen
- Default language: Arabic (with English option)
- Date/number formatting must respect locale

### Dark Mode / Light Mode
- App must support both themes from launch
- Theme toggle available in Settings
- All colors defined via theme tokens — no hardcoded colors anywhere
- `useTheme()` hook used in every component
- System default respected on first launch

### Color Tokens (Both Themes)

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `background.primary` | `#FFFFFF` | `#0F1117` |
| `background.secondary` | `#F5F6FA` | `#1A1D27` |
| `background.card` | `#FFFFFF` | `#22263A` |
| `text.primary` | `#1A1D27` | `#FFFFFF` |
| `text.secondary` | `#6B7280` | `#9CA3AF` |
| `text.muted` | `#9CA3AF` | `#6B7280` |
| `brand.primary` | `#4F6EF7` | `#6B89FF` |
| `brand.secondary` | `#38BFA1` | `#4DD9BE` |
| `status.success` | `#22C55E` | `#4ADE80` |
| `status.warning` | `#F59E0B` | `#FCD34D` |
| `status.danger` | `#EF4444` | `#F87171` |
| `status.info` | `#3B82F6` | `#60A5FA` |
| `border` | `#E5E7EB` | `#2D3148` |
| `overlay` | `rgba(0,0,0,0.5)` | `rgba(0,0,0,0.7)` |

### Typography
- Font Family: **Inter** (Latin) + **Cairo** (Arabic)
- Scale: `xs: 12` / `sm: 14` / `base: 16` / `lg: 18` / `xl: 20` / `2xl: 24` / `3xl: 30`
- Weight: `regular: 400` / `medium: 500` / `semibold: 600` / `bold: 700`

### Icon Library
- **Library:** `react-native-vector-icons` (MaterialCommunityIcons + Ionicons)
- NO emojis anywhere in the UI
- All icons sized consistently: `sm: 16` / `md: 20` / `lg: 24` / `xl: 28`
- Icon color always follows theme token

### Spacing System
- Base unit: `4px`
- Scale: `xs:4` / `sm:8` / `md:16` / `lg:24` / `xl:32` / `2xl:48`

### Border Radius
- `sm: 8` / `md: 12` / `lg: 16` / `xl: 24` / `full: 9999`

---

## Feature 1: Medication Reminder System

> Screens: Add Medication (21), Medication Details (22), Dosage Setup (23), Frequency Setup (24), Duration (25), Reminder Time (26), Medication List (27), Edit Medication (28), Delete Confirmation (29), Medication History (30), Refill Reminder (31), Notes (32), Reminder Notification (33), Snooze Reminder (34), Mark as Taken (35), Skip Dose (36), Reminder Settings (37), Sound Settings (38)

### UI Tasks

- [ ] **MedicationListScreen**
  - Card per medication showing: name, dosage, next reminder time, adherence badge
  - Swipe-to-delete with confirmation
  - FAB (Floating Action Button) to add new medication
  - Empty state with icon + bilingual message
  - Dark/Light card background via `background.card`

- [ ] **AddMedicationScreen** (Multi-step form)
  - Step 1: Medication name (text input, bilingual label)
  - Step 2: Dosage Setup (numeric input + unit picker: mg/ml/tablet/drops)
  - Step 3: Frequency Setup (options: daily / twice daily / three times / weekly / custom)
  - Step 4: Duration (date picker: start date + end date OR "Ongoing" toggle)
  - Step 5: Reminder Time (time picker, option to add multiple times per day)
  - Step 6: Notes (optional free-text)
  - Progress indicator showing step number
  - Back/Next navigation
  - Save triggers API call + notification schedule

- [ ] **MedicationDetailsScreen**
  - Full medication info display
  - Edit button → EditMedicationScreen
  - Delete button → DeleteConfirmationScreen modal
  - Medication history shortcut link

- [ ] **EditMedicationScreen**
  - Same form as Add but pre-filled
  - Save updates record and reschedules reminders

- [ ] **DeleteConfirmationScreen**
  - Modal overlay (not full screen)
  - Warning message in Arabic + English
  - "Delete" button (danger color) + "Cancel" button

- [ ] **MedicationHistoryScreen**
  - Scrollable log of all dose events
  - Each entry: medication name, scheduled time, action badge (Taken/Skipped/Snoozed), timestamp
  - Filter by medication and date range
  - Color-coded action badges using status tokens

- [ ] **RefillReminderScreen**
  - Days remaining counter with visual progress ring
  - Threshold setting slider
  - Enable/disable refill alert toggle

- [ ] **ReminderNotificationScreen**
  - Push notification with: medication name, dose info
  - Action buttons: Mark as Taken / Snooze / Skip
  - Notification sound plays on delivery

- [ ] **SnoozeReminderScreen**
  - Duration options: 5 min / 10 min / 15 min / 30 min
  - Confirm button

- [ ] **MarkAsTakenScreen**
  - Medication name display
  - Timestamp auto-set to current time
  - Confirm button with success animation

- [ ] **SkipDoseScreen**
  - Medication name display
  - Optional reason selector (too busy / side effect / other)
  - Confirm Skip button

- [ ] **ReminderSettingsScreen**
  - Global reminder enable/disable toggle
  - Default snooze duration setting
  - Per-medication reminder override option

- [ ] **SoundSettingsScreen**
  - List of notification sounds with preview play button
  - Currently selected sound highlighted
  - Save selection

---

## Feature 2: Drug Interaction Checker

> Screens: Interaction Checker (39), Scan Prescription AI (40), Interaction Results (41), Risk Level (42), Warning Alert (43), Suggested Alternatives (44)

### UI Tasks

- [ ] **InteractionCheckerScreen**
  - Search bar for medications with autocomplete
  - Selected medications displayed as removable chips/tags
  - "Check Interactions" button
  - Bilingual labels and placeholders

- [ ] **ScanPrescriptionScreen**
  - Camera view with frame overlay for prescription
  - "Capture" button
  - Processing state: loading overlay + bilingual "Analyzing..." text
  - Preview of extracted medications before confirming

- [ ] **InteractionResultsScreen**
  - List of detected interactions
  - Each card shows: pair of medications + brief interaction description
  - Risk Level badge on each card (color-coded)
  - Empty state when no interactions found (success style)

- [ ] **RiskLevelScreen**
  - Visual risk indicator: Low (green) / Medium (amber) / High (red)
  - Color tokens: `status.success` / `status.warning` / `status.danger`
  - Plain-language explanation in Arabic + English

- [ ] **WarningAlertScreen**
  - Full-screen prominent warning for high-risk interactions
  - Alert icon (from icon library — NO emoji)
  - Affected medications clearly listed
  - Explanation text bilingual
  - "View Alternatives" button

- [ ] **SuggestedAlternativesScreen**
  - List of safer medication alternatives
  - Each item shows: medication name + why it's safer
  - Disclaimer note (bilingual): "These are suggestions. Consult your doctor."

---

## Feature 3: AI Assistant

> Screens: AI Assistant (75), Voice Input (76), Smart Suggestions (77), Prediction Alerts (78), Behavior Analysis (79)

### UI Tasks

- [ ] **AIAssistantScreen**
  - Chat-style interface: user message bubbles + AI response bubbles
  - Message bubbles color-coded: user (`brand.primary`) / AI (`background.secondary`)
  - Text input bar + Send button
  - Voice Input button (microphone icon from icon library)
  - Messages support Arabic RTL and English LTR dynamically per message direction
  - Loading indicator while AI responds

- [ ] **VoiceInputScreen**
  - Microphone animation (pulse ring) while recording
  - "Tap to Speak" / "Listening..." text (bilingual)
  - Stop/Cancel button
  - Transcription preview before sending to AI

- [ ] **SmartSuggestionsScreen**
  - Suggestion cards with icon + title + brief description
  - Each card is actionable (tap to apply or view more)
  - Cards pulled from AI analysis of user data
  - Bilingual content

- [ ] **PredictionAlertsScreen**
  - Alert cards with: icon, prediction title, explanation, recommended action
  - Color severity: info / warning / danger using status tokens
  - Bilingual content

- [ ] **BehaviorAnalysisScreen**
  - Section 1: Adherence trend chart (line chart)
  - Section 2: Mood pattern chart
  - Section 3: Medication ↔ Mood correlation visual
  - AI-generated plain-language summary below charts (bilingual)
  - All chart labels bilingual

---

## Feature 4: Mental Health Support (Anonymous Mode)

> Screens: Enter Anonymous Mode (55), Mental Dashboard (56), Daily Check-In (57), Mood Input (58), Anxiety Level (59), Sleep Tracker (60), Journal Entry (61), AI Chat Support (62), Guided Conversation (63), Breathing Exercise (64), Meditation Screen (65), Mood History (66), Mood Analysis (67), Emotional Insights (68), Crisis Alert Screen (69)

### UI Tasks

- [ ] **EnterAnonymousModeScreen**
  - Explanation card: what is anonymous mode (bilingual)
  - List of what IS and IS NOT stored
  - Shield icon (from icon library)
  - "Enter Anonymously" button
  - Subtle animation on entry

- [ ] **MentalDashboardScreen**
  - Today's mood summary widget (mood icon + label, from icon library)
  - Check-in streak counter
  - Quick access buttons: Check-In / Journal / Breathing / AI Chat
  - Recent mood mini-chart (last 7 days)
  - Dark/light mode appropriate calming color palette

- [ ] **DailyCheckInScreen**
  - Step-by-step check-in flow: Mood → Anxiety → Sleep
  - Progress indicator
  - Save & Exit option

- [ ] **MoodInputScreen**
  - Horizontal slider or 5-point icon scale for mood
  - Icons from icon library (face-style icons, NOT emojis)
  - Optional text comment field
  - Bilingual labels

- [ ] **AnxietyLevelScreen**
  - Numbered scale 1–10 with labels (Low / Medium / High)
  - Visual fill indicator
  - Bilingual labels

- [ ] **SleepTrackerScreen**
  - Hours slept: numeric input or +/- stepper
  - Sleep quality: 3-option selector (Poor / Fair / Good)
  - Bilingual labels

- [ ] **JournalEntryScreen**
  - Full-screen text editor feel
  - Date header auto-set
  - Character count indicator
  - Save button
  - Anonymous storage notice (bilingual)

- [ ] **AIChatSupportScreen**
  - Same chat UI as AI Assistant but:
  - Anonymous session badge visible
  - Disclaimer: "This is not medical treatment" (bilingual)
  - Supportive, calming color variant in dark mode

- [ ] **GuidedConversationScreen**
  - Step-by-step AI-led dialogue
  - AI prompt → User response cards
  - Progress through dialogue steps
  - Calming visual theme

- [ ] **BreathingExerciseScreen**
  - Animated breathing circle: expands (Inhale) / holds / contracts (Exhale)
  - Phase label: Inhale / Hold / Exhale (bilingual)
  - Timer countdown per phase
  - Start / Pause / Exit controls

- [ ] **MeditationScreen**
  - Meditation timer with circular progress ring
  - Duration selector before starting (5 / 10 / 15 / 20 min)
  - Play / Pause / Stop controls
  - Calming ambient visual (gradient animation, no external images)
  - Bilingual session label

- [ ] **MoodHistoryScreen**
  - Calendar or list toggle view
  - Each day shows: mood icon (from icon library) + anxiety level + sleep rating
  - Filter by date range
  - Anonymous mode disclaimer footer

- [ ] **MoodAnalysisScreen**
  - Line chart of mood over selected period
  - Dip/peak highlights annotated
  - Period filter: Week / Month
  - Bilingual axis labels

- [ ] **EmotionalInsightsScreen**
  - AI-generated insight cards
  - Each card: icon + insight title + explanation (bilingual)
  - Cards styled with soft brand colors
  - Disclaimer: "Not a diagnosis" (bilingual)

- [ ] **CrisisAlertScreen**
  - Prominent, high-urgency design
  - Large "Trigger Crisis Alert" button (danger color)
  - Confirmation modal before sending
  - Crisis support information displayed below button (bilingual)
  - Emergency contacts list preview

---

## Feature 5: Self-Assessment (Screening Only)

> Screens: Start Assessment (70), Questions Screen (71), Progress Indicator (72), Result (73), Guidance (74)

### UI Tasks

- [ ] **StartAssessmentScreen**
  - Clear assessment title (bilingual)
  - What to expect description
  - Disclaimer card (bilingual): "This is a screening tool — not a medical diagnosis"
  - Start button

- [ ] **QuestionsScreen**
  - One question displayed at a time
  - Answer options as selectable cards
  - Bilingual question + answer text
  - Back / Next navigation

- [ ] **ProgressIndicatorScreen** (embedded in Questions flow)
  - Linear progress bar at top of Questions screen
  - "Question X of Y" label (bilingual)

- [ ] **ResultScreen**
  - Result badge: Mild (green) / Moderate (amber) / High (red)
  - Color tokens: `status.success` / `status.warning` / `status.danger`
  - Plain-language result explanation (bilingual)
  - Disclaimer card (bilingual): "This is a screening result — NOT a medical diagnosis"
  - "View Guidance" button

- [ ] **GuidanceScreen**
  - Tailored guidance based on result level (bilingual)
  - Suggested app tools: Breathing / AI Chat / Daily Check-In (with navigation links)
  - No clinical or treatment prescriptions — guidance only

---

## Feature 6: Mood Tracking & Analysis

> Embedded in Mental Health Module
> Screens: Mood Input (58), Mood History (66), Mood Analysis (67), Emotional Insights (68)

*(Tasks already covered in Feature 4 above — Mood Tracking is integrated within the Mental Health Module)*

---

## Feature 7: Emergency Alerts

> Screens: Emergency Alert (54 — Caregiver Module), Crisis Alert Screen (69 — Mental Health Module)

### UI Tasks

- [ ] **EmergencyAlertScreen** (Caregiver Module)
  - Prominent red emergency button with icon (from icon library)
  - Confirmation modal before sending
  - Linked emergency contacts listed with names
  - "Alert Sent" confirmation state with timestamp

- [ ] **CrisisAlertScreen** (Mental Health Module)
  - *(Covered above in Feature 4)*

---

## Feature 8: Reports & Analytics

> Screens: Adherence Report (45), Weekly Report (46), Monthly Report (47), Health Charts (48), Export PDF (49)

### UI Tasks

- [ ] **AdherenceReportScreen**
  - Adherence percentage displayed prominently (large number + ring chart)
  - Breakdown: Doses Taken / Missed / Skipped (with counts and %)
  - Filter by medication and date range
  - Bilingual labels

- [ ] **WeeklyReportScreen**
  - 7-day bar chart: one bar per day showing taken/missed/skipped
  - Summary stats below chart
  - Bilingual day labels (adapted for RTL in Arabic)

- [ ] **MonthlyReportScreen**
  - 30-day overview
  - Calendar heatmap or line chart
  - Monthly adherence percentage
  - Notable events highlighted (e.g., most missed day)
  - Bilingual

- [ ] **HealthChartsScreen**
  - Tab or scroll view with multiple charts:
    - Adherence over time
    - Mood over time
    - Risk Score history
  - Chart legend bilingual
  - Period filter: Week / Month / All

- [ ] **ExportPDFScreen**
  - Report preview summary
  - "Generate PDF" button
  - Progress indicator during generation
  - "Share" and "Download" options after generation
  - Bilingual PDF content

---

## Cross-Cutting Frontend Tasks

### Authentication Module (8 Screens)
- [ ] SplashScreen — branded, auto-redirect
- [ ] Onboarding (x3) — bilingual, skip option
- [ ] LoginScreen — form + validation
- [ ] SignUpScreen — form + validation
- [ ] OTPVerificationScreen — OTP input
- [ ] ForgotPasswordScreen — reset flow

### Profile Setup Module (6 Screens)
- [ ] PersonalInfoScreen
- [ ] AgeGenderScreen
- [ ] ChronicDiseasesScreen
- [ ] AllergiesScreen
- [ ] EmergencyContactScreen
- [ ] UploadMedicalReportsScreen

### Home & Dashboard Module (6 Screens)
- [ ] HomeDashboardScreen — risk score, daily summary, quick actions
- [ ] DailyTimelineScreen
- [ ] UpcomingMedicationsScreen
- [ ] MissedDosesScreen
- [ ] QuickActionsScreen
- [ ] RiskScoreScreen

### Caregiver & Doctor Module (5 Screens)
- [ ] AddDoctorScreen
- [ ] ShareDataScreen
- [ ] CaregiverAccessScreen
- [ ] NotificationsToCaregiverScreen
- [ ] EmergencyAlertScreen

### Settings Module (4 Screens)
- [ ] SettingsScreen
- [ ] LanguageScreen — Arabic / English toggle, RTL/LTR switch
- [ ] NotificationsScreen — per-type toggles
- [ ] PrivacySecurityScreen

### UX Screens (2 Screens)
- [ ] LoadingScreen — animated, branded
- [ ] SuccessErrorScreen — clear feedback with icon + message

---

## Screen Count Verification

| Module | Screens |
|--------|:-------:|
| Authentication | 8 |
| Profile Setup | 6 |
| Home & Dashboard | 6 |
| Medication Management | 12 |
| Smart Reminder System | 6 |
| Drug Interaction | 6 |
| Reports & Analytics | 5 |
| Caregiver & Doctor Module | 5 |
| Mental Health Module | 15 |
| Self-Assessment | 5 |
| AI Features | 5 |
| Settings | 4 |
| UX Screens | 2 |
| **Total** | **85** |

---

*REMIND ME | React Native Frontend Tasks | 6 October Technological University*
