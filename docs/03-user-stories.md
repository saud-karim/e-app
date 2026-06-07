# REMIND ME — User Stories (Full & Deep)
> **6 October Technological University | Faculty of Applied Health Sciences Technology**
> Supervised by: Dr. Hager

---

## 📌 Format

Each user story follows this format:
> **As a** [user type], **I want to** [action], **so that** [outcome].
> - **Acceptance Criteria:** What must be true for this story to be "done"
> - **Notes:** Any important constraints or rules

---

## 🔐 Module 1: Authentication (8 Screens)

---

### US-01 — Splash Screen
**As a** user launching the app,
**I want to** see the app splash screen on startup,
**so that** I know the app is loading and feel a branded first impression.

**Acceptance Criteria:**
- App displays branded splash screen on every launch
- Splash screen transitions automatically to Onboarding (first time) or Login (returning user)

---

### US-02 — Onboarding
**As a** first-time user,
**I want to** see 3 onboarding screens that explain what the app does,
**so that** I understand the app's purpose before committing to sign up.

**Acceptance Criteria:**
- 3 sequential onboarding screens displayed on first launch only
- Each screen explains a core value: medication reminders, drug safety, mental support
- User can skip onboarding or navigate forward/back
- Onboarding does not repeat after first completion

---

### US-03 — Sign Up
**As a** new user,
**I want to** create an account with my basic information,
**so that** I can access the app with my own personal data.

**Acceptance Criteria:**
- Registration form accepts required fields
- Account is created and stored in the system
- User is redirected to OTP Verification after successful registration

---

### US-04 — OTP Verification
**As a** newly registered user,
**I want to** verify my account with a one-time password (OTP),
**so that** my account is secure and validated.

**Acceptance Criteria:**
- OTP sent to user's contact (phone/email) after registration
- User enters OTP code on the verification screen
- Account is activated upon correct OTP entry
- OTP expires after a set time and can be resent

---

### US-05 — Login
**As a** registered user,
**I want to** log in with my credentials,
**so that** I can access my personal dashboard and data.

**Acceptance Criteria:**
- Login form accepts credentials
- Successful login redirects to Home Dashboard
- Failed login displays appropriate error message

---

### US-06 — Forgot Password
**As a** registered user who forgot their password,
**I want to** reset my password,
**so that** I can regain access to my account.

**Acceptance Criteria:**
- User can initiate password reset from the login screen
- Reset link or OTP sent to registered contact
- User can set a new password after verification
- User is redirected to Login after successful reset

---

## 👤 Module 2: Profile Setup (6 Screens)

---

### US-07 — Personal Information
**As a** new user completing setup,
**I want to** enter my personal information,
**so that** the app can personalize my experience.

**Acceptance Criteria:**
- User can enter and save personal information
- Data is stored in the user profile

---

### US-08 — Age & Gender
**As a** new user,
**I want to** provide my age and gender,
**so that** the app can factor these into health monitoring.

**Acceptance Criteria:**
- User can select/enter age and gender
- Data saved to profile

---

### US-09 — Chronic Diseases
**As a** patient with chronic conditions,
**I want to** log my chronic diseases during setup,
**so that** the app is aware of my health background.

**Acceptance Criteria:**
- User can select or enter chronic diseases
- Data saved to profile and used in risk scoring

---

### US-10 — Allergies
**As a** patient,
**I want to** enter my known allergies,
**so that** the app can flag potential allergen conflicts.

**Acceptance Criteria:**
- User can add one or more allergies
- Allergy data saved to profile

---

### US-11 — Emergency Contact
**As a** user,
**I want to** add an emergency contact during setup,
**so that** the app knows who to notify in a crisis.

**Acceptance Criteria:**
- User can enter emergency contact name and number
- Emergency contact used in Emergency Alert system

---

### US-12 — Upload Medical Reports
**As a** patient,
**I want to** upload my existing medical reports,
**so that** the app has my health history on record.

**Acceptance Criteria:**
- User can upload one or more medical report files
- Files stored securely in user profile

---

## 🏠 Module 3: Home & Dashboard (6 Screens)

---

### US-13 — Home Dashboard
**As a** patient,
**I want to** see a home dashboard when I open the app,
**so that** I get an immediate summary of my medication and health status.

**Acceptance Criteria:**
- Dashboard displays: today's medication summary, risk score, upcoming medications, missed doses, quick action shortcuts

---

### US-14 — Daily Timeline
**As a** patient,
**I want to** view a daily timeline of my medications,
**so that** I can see what I've taken and what's coming up throughout the day.

**Acceptance Criteria:**
- Timeline shows all medications for today in chronological order
- Each entry shows: medication name, time, status (taken/skipped/upcoming)

---

### US-15 — Upcoming Medications
**As a** patient,
**I want to** see a list of my upcoming scheduled medications,
**so that** I can prepare in advance.

**Acceptance Criteria:**
- List shows all scheduled medications not yet due
- Ordered by time

---

### US-16 — Missed Doses
**As a** patient,
**I want to** see a list of doses I've missed,
**so that** I can be aware of gaps in my treatment.

**Acceptance Criteria:**
- Displays all missed doses for the current day and recent history
- Each entry shows medication name, scheduled time, and missed status

---

### US-17 — Quick Actions
**As a** patient,
**I want to** access quick action shortcuts from the dashboard,
**so that** I can navigate to key features instantly without extra steps.

**Acceptance Criteria:**
- Quick actions available: Add Medication, Check Interactions, Mental Health, AI Assistant
- Each shortcut navigates directly to the corresponding module

---

### US-18 — Risk Score
**As a** patient,
**I want to** view my current risk score on the dashboard,
**so that** I understand my overall health risk level at a glance.

**Acceptance Criteria:**
- Risk score displayed visually (color-coded)
- Score reflects: adherence rate, drug interactions, mood data, missed doses
- Score is a monitoring indicator — not a medical diagnosis

---

## 💊 Module 4: Medication Management (12 Screens)

---

### US-19 — Add Medication
**As a** patient,
**I want to** add a new medication to my list,
**so that** the app can remind me and track my usage.

**Acceptance Criteria:**
- User can enter: medication name, dosage, frequency, duration, reminder time, notes
- Medication saved and appears in Medication List

---

### US-20 — Medication Details
**As a** patient,
**I want to** view full details of a specific medication,
**so that** I can review its settings and history.

**Acceptance Criteria:**
- Displays all information for the selected medication
- Provides access to Edit and Delete options

---

### US-21 — Dosage Setup
**As a** patient adding a medication,
**I want to** configure the dosage details,
**so that** the reminder is accurate to my prescription.

**Acceptance Criteria:**
- User can set dose amount and unit (mg, ml, tablet, etc.)

---

### US-22 — Frequency Setup
**As a** patient,
**I want to** set how often I take a medication (daily, twice daily, weekly, etc.),
**so that** reminders are scheduled at the right intervals.

**Acceptance Criteria:**
- User can select frequency from preset options or custom schedule

---

### US-23 — Duration
**As a** patient,
**I want to** set the start and end date for a medication course,
**so that** reminders stop automatically when the course is complete.

**Acceptance Criteria:**
- User can set start date and end date or select "ongoing"
- Reminders are deactivated after end date

---

### US-24 — Reminder Time
**As a** patient,
**I want to** set the specific time(s) I should be reminded each day,
**so that** notifications come at the right moment.

**Acceptance Criteria:**
- User can select one or multiple daily reminder times
- Times saved and used to schedule push notifications

---

### US-25 — Medication List
**As a** patient,
**I want to** see a complete list of all my medications,
**so that** I can manage them in one place.

**Acceptance Criteria:**
- All active medications displayed
- Each entry shows: name, dosage, frequency, next reminder time
- User can tap any medication to view details

---

### US-26 — Edit Medication
**As a** patient,
**I want to** edit an existing medication's details,
**so that** I can update it if my prescription changes.

**Acceptance Criteria:**
- All medication fields are editable
- Changes saved and reflected immediately in reminders and list

---

### US-27 — Delete Confirmation
**As a** patient,
**I want to** see a confirmation prompt before deleting a medication,
**so that** I don't accidentally remove important data.

**Acceptance Criteria:**
- Deletion requires explicit confirmation
- On confirm: medication removed from list and future reminders cancelled

---

### US-28 — Medication History
**As a** patient,
**I want to** view the full history of my medication doses (taken/skipped/snoozed),
**so that** I can track my past adherence.

**Acceptance Criteria:**
- History shows all logged dose events
- Each event shows: medication name, scheduled time, actual action, timestamp

---

### US-29 — Refill Reminder
**As a** patient,
**I want to** receive a reminder when my medication supply is running low,
**so that** I can get a refill before I run out.

**Acceptance Criteria:**
- User can set a refill threshold (e.g., 5 days remaining)
- App sends notification when threshold is reached

---

### US-30 — Notes
**As a** patient,
**I want to** add personal notes to a medication,
**so that** I can record special instructions or reminders for myself.

**Acceptance Criteria:**
- Free-text notes field available on medication record
- Notes displayed on Medication Details screen

---

## ⏰ Module 5: Smart Reminder System (6 Screens)

---

### US-31 — Reminder Notification
**As a** patient,
**I want to** receive a push notification when it's time to take my medication,
**so that** I don't forget a dose.

**Acceptance Criteria:**
- Notification arrives at the scheduled reminder time
- Notification displays medication name and dose

---

### US-32 — Snooze Reminder
**As a** patient,
**I want to** snooze a reminder,
**so that** I'm reminded again shortly without marking the dose as missed.

**Acceptance Criteria:**
- Snooze option available in notification and in app
- Snooze duration is configurable
- Snoozed event logged in medication history

---

### US-33 — Mark as Taken
**As a** patient,
**I want to** mark a dose as taken,
**so that** the app records my adherence accurately.

**Acceptance Criteria:**
- Mark as Taken option in notification and app
- Action logged with timestamp
- Adherence report updated accordingly

---

### US-34 — Skip Dose
**As a** patient,
**I want to** skip a dose intentionally,
**so that** the app records my decision without treating it as a missed dose by default.

**Acceptance Criteria:**
- Skip Dose option available in notification and app
- Skip logged in medication history with reason (optional)

---

### US-35 — Reminder Settings
**As a** patient,
**I want to** configure my reminder preferences,
**so that** notifications work the way I want.

**Acceptance Criteria:**
- User can enable/disable reminders globally or per medication
- User can configure snooze duration

---

### US-36 — Sound Settings
**As a** patient,
**I want to** choose the notification sound for my reminders,
**so that** I can distinguish medication alerts from other notifications.

**Acceptance Criteria:**
- User can select from available notification sounds
- Setting applied to all medication reminders

---

## 💊 Module 6: Drug Interaction (6 Screens)

---

### US-37 — Interaction Checker
**As a** patient,
**I want to** manually enter or select medications to check for interactions,
**so that** I can identify dangerous combinations before taking them.

**Acceptance Criteria:**
- User can search and select multiple medications
- System checks selected medications against interaction database
- Results displayed clearly

---

### US-38 — Scan Prescription (AI)
**As a** patient,
**I want to** scan my prescription using AI,
**so that** the app can automatically identify my medications and check interactions.

**Acceptance Criteria:**
- Camera/image input available for prescription scanning
- AI extracts medication names from the prescription image
- Extracted medications checked for interactions automatically

---

### US-39 — Interaction Results
**As a** patient,
**I want to** view the results of my drug interaction check,
**so that** I know which of my medications conflict with each other.

**Acceptance Criteria:**
- Results list shows all detected interactions
- Each interaction shows: medications involved, severity, explanation

---

### US-40 — Risk Level
**As a** patient,
**I want to** see the risk level of each detected drug interaction,
**so that** I understand how serious each conflict is.

**Acceptance Criteria:**
- Risk level displayed with color coding (e.g., Green/Yellow/Red)
- Each level has a plain-language explanation

---

### US-41 — Warning Alert
**As a** patient,
**I want to** see a clear warning alert for high-risk drug interactions,
**so that** I am immediately aware of a potentially dangerous situation.

**Acceptance Criteria:**
- High-risk interactions trigger a prominent visual warning
- Warning includes: which medications conflict and why

---

### US-42 — Suggested Alternatives
**As a** patient who has a high-risk interaction,
**I want to** see suggested safe alternative medications,
**so that** I can discuss safer options with my doctor.

**Acceptance Criteria:**
- Alternative medications displayed for high-risk interactions
- Note clearly states these are suggestions — not prescriptions

---

## 📊 Module 7: Reports & Analytics (5 Screens)

---

### US-43 — Adherence Report
**As a** patient,
**I want to** view my overall medication adherence report,
**so that** I can measure how consistently I am following my treatment.

**Acceptance Criteria:**
- Report shows: total doses scheduled vs. taken, adherence percentage
- Data filterable by medication and date range

---

### US-44 — Weekly Report
**As a** patient,
**I want to** view a weekly summary of my adherence,
**so that** I can track short-term progress.

**Acceptance Criteria:**
- Report covers the last 7 days
- Shows: doses taken, missed, skipped per day

---

### US-45 — Monthly Report
**As a** patient,
**I want to** view a monthly summary of my adherence,
**so that** I can see my long-term treatment consistency.

**Acceptance Criteria:**
- Report covers the last 30 days
- Shows trends over the month

---

### US-46 — Health Charts
**As a** patient,
**I want to** view visual charts of my health data over time,
**so that** I can spot trends in my adherence and mood.

**Acceptance Criteria:**
- Charts display: adherence over time, mood over time, risk score history
- Charts are interactive (zoom, filter by date)

---

### US-47 — Export PDF
**As a** patient,
**I want to** export my health report as a PDF,
**so that** I can share it with my doctor or keep it for my records.

**Acceptance Criteria:**
- PDF generated with adherence data, medication list, and key metrics
- PDF can be saved or shared from the device

---

## 👨‍⚕️ Module 8: Caregiver & Doctor Module (5 Screens)

---

### US-48 — Add Doctor
**As a** patient,
**I want to** add my doctor's details to the app,
**so that** my care relationship is connected within the app.

**Acceptance Criteria:**
- User can add doctor name and contact info
- Doctor profile stored in caregiver relations

---

### US-49 — Share Data
**As a** patient,
**I want to** share my health data with a caregiver or doctor,
**so that** they can monitor my treatment remotely.

**Acceptance Criteria:**
- Patient explicitly chooses what data to share
- Sharing is opt-in and can be revoked at any time

---

### US-50 — Caregiver Access
**As a** caregiver,
**I want to** access the patient's medication and health status,
**so that** I can monitor their condition and intervene if needed.

**Acceptance Criteria:**
- Caregiver has read-only access to shared patient data
- Caregiver cannot modify patient data

---

### US-51 — Notifications to Caregiver
**As a** caregiver,
**I want to** receive automated notifications about the patient's medication status,
**so that** I can ensure they are following their treatment plan.

**Acceptance Criteria:**
- Caregiver receives alerts for: missed doses, low refill, high risk score events

---

### US-52 — Emergency Alert
**As a** patient in an emergency,
**I want to** trigger an emergency alert,
**so that** my emergency contacts are immediately notified.

**Acceptance Criteria:**
- Emergency alert button accessible in Caregiver Module and Crisis Alert Screen
- Alert sent instantly to all linked emergency contacts
- Alert includes: patient identity, timestamp, and trigger source

---

## 🧠 Module 9: Mental Health Module (15 Screens)

---

### US-53 — Enter Anonymous Mode
**As a** user struggling with mental health,
**I want to** enter an anonymous mode before accessing mental health features,
**so that** I can seek support without my identity being linked to my mental health data.

**Acceptance Criteria:**
- Anonymous mode decouples user identity from mental health records
- User is informed what data is and is not stored
- Session continues anonymously until user exits mode

---

### US-54 — Mental Dashboard
**As a** user in the mental health module,
**I want to** see a dashboard of my mental health summary,
**so that** I get an overview of my current mental state and available actions.

**Acceptance Criteria:**
- Dashboard shows: today's mood, latest check-in, mood trend, available tools

---

### US-55 — Daily Check-In
**As a** user,
**I want to** complete a daily mental health check-in,
**so that** the app can track my mental state over time.

**Acceptance Criteria:**
- Check-in prompts: Mood Input, Anxiety Level, Sleep Tracker
- Data saved to mood entries (anonymously if in anonymous mode)

---

### US-56 — Mood Input
**As a** user,
**I want to** log my current mood,
**so that** the app can track patterns in my emotional state.

**Acceptance Criteria:**
- User selects or rates their mood
- Mood saved with timestamp

---

### US-57 — Anxiety Level
**As a** user,
**I want to** log my anxiety level,
**so that** the app can monitor my stress patterns.

**Acceptance Criteria:**
- User rates anxiety on a defined scale
- Data saved with timestamp

---

### US-58 — Sleep Tracker
**As a** user,
**I want to** log my sleep duration and quality,
**so that** the app can factor sleep into my mental health analysis.

**Acceptance Criteria:**
- User enters sleep duration and quality rating
- Data saved with timestamp

---

### US-59 — Journal Entry
**As a** user,
**I want to** write a private journal entry,
**so that** I can express my thoughts and feelings safely.

**Acceptance Criteria:**
- Free-text journal input available
- Entries stored privately (no identity link in anonymous mode)

---

### US-60 — AI Chat Support
**As a** user seeking mental health support,
**I want to** chat with an AI support assistant,
**so that** I can receive guidance and feel heard without fear of judgment.

**Acceptance Criteria:**
- AI chat available within anonymous mental health mode
- AI provides supportive, non-diagnostic responses
- Chat history not linked to user identity in anonymous mode

---

### US-61 — Guided Conversation
**As a** user,
**I want to** engage in a guided conversation with the AI,
**so that** I can work through my thoughts in a structured way.

**Acceptance Criteria:**
- AI leads a structured dialogue designed for mental wellness support
- Conversation does not diagnose or prescribe

---

### US-62 — Breathing Exercise
**As a** user experiencing stress or anxiety,
**I want to** access a breathing exercise,
**so that** I can calm down using a guided technique.

**Acceptance Criteria:**
- Breathing exercise with visual/audio guidance available
- User can start, pause, and complete the exercise

---

### US-63 — Meditation Screen
**As a** user,
**I want to** access a guided meditation,
**so that** I can reduce stress and improve my mental wellbeing.

**Acceptance Criteria:**
- Meditation content available (audio or guided visual)
- User can start, pause, and stop

---

### US-64 — Mood History
**As a** user,
**I want to** view my mood logs over time,
**so that** I can see how my emotional state has changed.

**Acceptance Criteria:**
- History displayed as a list or calendar view
- Each entry shows: date, mood, anxiety level, sleep rating

---

### US-65 — Mood Analysis
**As a** user,
**I want to** see an analysis of my mood patterns,
**so that** I can understand trends in my mental health.

**Acceptance Criteria:**
- Visual trend analysis of mood over selected time period
- Highlights patterns (e.g., mood dips on specific days)

---

### US-66 — Emotional Insights
**As a** user,
**I want to** receive AI-generated emotional insights based on my data,
**so that** I can better understand my emotional patterns.

**Acceptance Criteria:**
- AI generates plain-language insights from mood/anxiety/sleep data
- Insights are supportive and non-diagnostic

---

### US-67 — Crisis Alert Screen
**As a** user experiencing a mental health crisis,
**I want to** trigger a crisis alert,
**so that** my emergency contacts are immediately notified and I receive crisis support information.

**Acceptance Criteria:**
- Crisis Alert accessible within Mental Health Module
- Triggers Emergency Alert to all linked contacts
- Displays crisis support information

---

## 📝 Module 10: Self-Assessment (5 Screens)

---

### US-68 — Start Assessment
**As a** user,
**I want to** start a mental health self-assessment,
**so that** I can gauge my current mental health level.

**Acceptance Criteria:**
- Assessment entry point with clear explanation that it is a screening tool — not a diagnosis
- User must acknowledge disclaimer before starting

---

### US-69 — Questions Screen
**As a** user taking the assessment,
**I want to** answer a structured set of questions,
**so that** the system can evaluate my mental health status.

**Acceptance Criteria:**
- Structured questions displayed one at a time or in a list
- User can answer and navigate between questions

---

### US-70 — Progress Indicator
**As a** user,
**I want to** see my progress through the assessment,
**so that** I know how many questions remain.

**Acceptance Criteria:**
- Progress bar or step indicator visible throughout assessment
- Updates in real-time as user answers questions

---

### US-71 — Result (Mild / Moderate / High)
**As a** user who completed the assessment,
**I want to** receive a result of Mild, Moderate, or High,
**so that** I understand my current mental health screening level.

**Acceptance Criteria:**
- Result clearly shows: Mild, Moderate, or High
- Result is accompanied by a plain-language explanation
- Screen explicitly states this is a screening result — NOT a medical diagnosis

---

### US-72 — Guidance Screen
**As a** user who received an assessment result,
**I want to** see a guidance screen with next steps,
**so that** I know what actions or support to consider based on my result.

**Acceptance Criteria:**
- Guidance tailored to result level (Mild / Moderate / High)
- Guidance is supportive and non-prescriptive
- Suggests using available app tools (breathing, meditation, AI chat) — not clinical treatment

---

## 🤖 Module 11: AI Features (5 Screens)

---

### US-73 — AI Assistant
**As a** user,
**I want to** interact with the central AI assistant,
**so that** I can get smart, personalized guidance about my health and medications.

**Acceptance Criteria:**
- AI assistant accessible from the main navigation
- Responds to user queries about medications, reminders, and health guidance
- Does not diagnose or prescribe

---

### US-74 — Voice Input
**As a** user,
**I want to** interact with the AI assistant using my voice,
**so that** I can use the app hands-free, especially useful for elderly users.

**Acceptance Criteria:**
- Voice input available in AI Assistant screen
- Speech converted to text and processed by AI
- Response displayed and optionally read aloud

---

### US-75 — Smart Suggestions
**As a** user,
**I want to** receive smart suggestions from the AI based on my usage patterns,
**so that** I can make better decisions about my health management.

**Acceptance Criteria:**
- AI generates personalized suggestions based on: adherence history, mood data, medication schedule
- Suggestions are actionable and non-prescriptive

---

### US-76 — Prediction Alerts
**As a** user,
**I want to** receive proactive prediction alerts from the AI,
**so that** I can take action before a problem occurs.

**Acceptance Criteria:**
- AI identifies patterns (e.g., user frequently misses Monday doses) and sends proactive alerts
- Alerts appear as notifications and within the AI Features module

---

### US-77 — Behavior Analysis
**As a** user,
**I want to** view an analysis of my behavior patterns,
**so that** I can understand my own health habits and where I need to improve.

**Acceptance Criteria:**
- Behavior analysis displays: adherence trends, mood patterns, interaction between mood and medication taking
- Data presented visually with plain-language summary

---

## ⚙️ Module 12: Settings (4 Screens)

---

### US-78 — Settings
**As a** user,
**I want to** access a settings screen,
**so that** I can manage all my app preferences in one place.

**Acceptance Criteria:**
- Settings screen links to: Language, Notifications, Privacy & Security
- All user-configurable options accessible from here

---

### US-79 — Language
**As a** user,
**I want to** change the app language,
**so that** I can use the app in my preferred language.

**Acceptance Criteria:**
- Language options available
- Changing language applies to the entire app immediately

---

### US-80 — Notifications
**As a** user,
**I want to** manage my notification preferences,
**so that** I receive only the alerts that are relevant to me.

**Acceptance Criteria:**
- User can enable/disable: medication reminders, caregiver alerts, AI prediction alerts, emergency alerts
- Settings saved and applied immediately

---

### US-81 — Privacy & Security
**As a** user,
**I want to** review and manage my privacy and security settings,
**so that** I feel confident my data is protected.

**Acceptance Criteria:**
- User can view what data is stored and how
- User can manage: data sharing permissions, anonymous mode preferences
- Security settings (e.g., app lock) available

---

## 🖥️ Module 13: UX Screens (2 Screens)

---

### US-82 — Loading Screen
**As a** user performing an action that takes time,
**I want to** see a loading screen,
**so that** I know the app is processing and haven't encountered an error.

**Acceptance Criteria:**
- Loading indicator displayed during any data fetch or processing operation
- Consistent visual style across the app

---

### US-83 — Success / Error Screen
**As a** user who completed an action,
**I want to** see a clear success or error message,
**so that** I know whether my action was completed or failed.

**Acceptance Criteria:**
- Success screen shown for: medication added, dose marked, report exported, alert sent, etc.
- Error screen shown for: network failure, invalid input, action failure
- Clear message and next-step action provided

---

## 📊 User Story Summary

| Module | Stories Count |
|--------|:---:|
| Authentication | 6 (US-01 to US-06) |
| Profile Setup | 6 (US-07 to US-12) |
| Home & Dashboard | 6 (US-13 to US-18) |
| Medication Management | 12 (US-19 to US-30) |
| Smart Reminder System | 6 (US-31 to US-36) |
| Drug Interaction | 6 (US-37 to US-42) |
| Reports & Analytics | 5 (US-43 to US-47) |
| Caregiver & Doctor Module | 5 (US-48 to US-52) |
| Mental Health Module | 15 (US-53 to US-67) |
| Self-Assessment | 5 (US-68 to US-72) |
| AI Features | 5 (US-73 to US-77) |
| Settings | 4 (US-78 to US-81) |
| UX Screens | 2 (US-82 to US-83) |
| **Total** | **83 User Stories** |

---

*REMIND ME Project Proposal | 6 October Technological University | Faculty of Applied Health Sciences Technology*
