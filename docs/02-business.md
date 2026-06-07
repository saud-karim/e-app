# REMIND ME — Business Logic & Business Plan
> **6 October Technological University | Faculty of Applied Health Sciences Technology**
> Supervised by: Dr. Hager

---

## 🎯 Mission Statement

> *"To improve patient safety and treatment adherence by combining medication management with intelligent mental health support in a safe and private environment."*

---

## ❗ Problem → Root Cause Analysis

| # | Problem | Root Cause | Impact |
|---|---------|-----------|--------|
| 1 | Forgetting medication doses | No structured reminder system | Treatment failure, disease progression |
| 2 | Incorrect drug usage | Lack of patient education | Health complications, overdose risk |
| 3 | Dangerous drug interactions | No real-time interaction checking | Life-threatening reactions |
| 4 | Lack of continuous monitoring | No remote visibility for caregivers | Delayed crisis response |
| 5 | Mental health struggles affecting adherence | Psychological barriers reduce motivation | Drop in treatment compliance |
| 6 | Fear of seeking psychological help | Social stigma, lack of privacy | Untreated mental health conditions |

---

## ✅ Solution → Value Mapping

| Solution | Business Value | Addressed Problem |
|---------|---------------|------------------|
| Reminds patients of medications | Increases treatment adherence | Problem 1 |
| Detects drug interactions | Prevents dangerous medical errors | Problem 3 |
| Tracks adherence | Creates accountability and progress visibility | Problem 1, 4 |
| Provides mental support (without diagnosis) | Lowers stigma, makes support accessible | Problem 5, 6 |
| Offers anonymous safe space for users | Removes identity barrier to mental care | Problem 6 |
| Uses AI to assist and guide users | Scales personalized guidance without clinical staff | All Problems |

---

## 👥 Target User Segments — Deep Dive

### 1. Patients with Chronic Diseases
- **Need:** Consistent daily medication management
- **Risk Without App:** Missing doses → disease flare-ups
- **How REMIND ME Serves Them:** Medication Reminder System, Drug Interaction Checker, Adherence Reports

### 2. Elderly People
- **Need:** Simple, clear reminders with caregiver oversight
- **Risk Without App:** Missed doses, dangerous self-medication
- **How REMIND ME Serves Them:** Smart Reminders, Caregiver Module, Voice-Based Interaction, Emergency Alerts

### 3. People with Mental Health Struggles
- **Need:** Non-judgmental, private mental support
- **Risk Without App:** Untreated mental conditions worsening medication adherence
- **How REMIND ME Serves Them:** Anonymous Mental Health Module, Daily Check-In, AI Chat Support, Breathing & Meditation, Crisis Alert

### 4. Users Who Avoid Visiting Doctors
- **Need:** Guidance and self-awareness without clinical barrier
- **Risk Without App:** Self-medication errors, unmonitored conditions
- **How REMIND ME Serves Them:** AI Assistant, Self-Assessment (Screening Only), Smart Suggestions, Drug Interaction Checker

### 5. Caregivers (Family Members)
- **Need:** Remote visibility into patient medication status
- **Risk Without App:** Unable to intervene in time
- **How REMIND ME Serves Them:** Caregiver Access Module, Notifications to Caregiver, Emergency Alert, Share Data

---

## 🔑 Core Business Logic Per Feature

### 1. Medication Reminder System
**Logic Flow:**
1. User adds medication → sets dosage, frequency, duration, reminder time
2. System schedules notification at specified time(s) daily
3. At reminder time → push notification sent to device
4. User responds: Mark as Taken / Snooze / Skip
5. Response logged in `medication_logs` table
6. Adherence rate calculated for reports and risk score

**Business Rule:** Every dose interaction (taken/skipped/snoozed) must be recorded and timestamped.

---

### 2. Drug Interaction Checker
**Logic Flow:**
1. User inputs medications manually OR scans prescription using AI
2. System checks all medication combinations against interaction database
3. Detected interactions are categorized by Risk Level (Low / Medium / High)
4. Warning alerts displayed with severity explanation
5. Suggested safe alternatives displayed for high-risk interactions

**Business Rule:** The app provides interaction information and alternatives — it does NOT recommend stopping or changing medication without a doctor.

---

### 3. Smart Risk Scoring System
**Logic Flow:**
1. Risk Score is calculated from multiple data points:
   - Medication adherence rate (% of doses taken on time)
   - Number of detected drug interactions
   - Mood and mental health check-in data
   - Missed doses in past 7 days
2. Score displayed on Home Dashboard as a visual indicator
3. Score updates dynamically with each new event

**Business Rule:** Risk Score is a monitoring tool only — not a medical diagnostic tool.

---

### 4. Mental Health Module (Anonymous Mode)
**Logic Flow:**
1. User enters Anonymous Mode → identity is decoupled from mental health data
2. User completes Daily Check-In: Mood Input + Anxiety Level + Sleep Tracker
3. User optionally writes Journal Entry (stored without identity link)
4. User interacts with AI Chat Support for guided support
5. User can access Breathing Exercises and Meditation
6. System analyzes Mood History → generates Emotional Insights
7. If Crisis Alert triggered → emergency contact notified immediately

**Business Rule:** Mental health data stored in anonymous mode must have no personally identifiable link. The system provides support, NOT diagnosis.

---

### 5. Self-Assessment (Screening Only)
**Logic Flow:**
1. User starts assessment → presented with structured questions
2. Progress Indicator tracks completion percentage
3. Answers scored by the system
4. Result displayed: Mild / Moderate / High
5. Guidance Screen displayed based on result category

**Business Rule:** Result is a screening output only — it explicitly states it is NOT a medical diagnosis. The app does not prescribe or diagnose.

---

### 6. AI Assistant & AI Features
**Logic Flow:**
1. AI Assistant receives user input (text or voice)
2. Voice Input converts speech to text
3. AI processes context: user's medication list, mood history, adherence data
4. Smart Suggestions generated based on patterns
5. Prediction Alerts sent proactively (e.g., "You tend to skip doses on Fridays")
6. Behavior Analysis displays patterns over time

**Business Rule:** AI provides guidance and suggestions — all clinical decisions remain with the user and their healthcare provider.

---

### 7. Reports & Analytics
**Logic Flow:**
1. System continuously logs all medication events
2. Adherence Report: % of doses taken vs scheduled
3. Weekly Report: 7-day summary of adherence + mood trends
4. Monthly Report: 30-day comprehensive overview
5. Health Charts: Visual graphs of data over time
6. Export PDF: Generates downloadable report for doctor sharing

**Business Rule:** Reports are informational — intended to facilitate conversations with healthcare providers.

---

### 8. Caregiver & Doctor Module
**Logic Flow:**
1. Patient adds Doctor profile and/or Caregiver
2. Patient grants Caregiver Access to their medication data
3. Caregiver receives automated Notifications about medication status
4. Doctor can receive Shared Data reports (PDF or in-app)
5. Emergency Alert triggers immediate notification to all linked caregivers

**Business Rule:** Data sharing is opt-in and controlled by the patient. No data is shared without explicit patient consent.

---

### 9. Emergency Alert System
**Logic Flow:**
1. Emergency Alert can be triggered from:
   - Crisis Alert Screen (Mental Health Module)
   - Emergency Alert Screen (Caregiver Module)
2. Alert sent instantly to all linked emergency contacts
3. Alert includes patient status and timestamp

**Business Rule:** Emergency alerts are for crisis situations — not routine notifications.

---

## 💡 Innovation Logic — Why These Differentiators Matter

| Innovation | Business Logic |
|------------|---------------|
| **AI-based drug interaction detection** | Automates a safety check that previously required a pharmacist — scales to every user |
| **Anonymous mental health support system** | Removes the #1 barrier to mental health help-seeking: fear of judgment or identity exposure |
| **Self-assessment without diagnosis** | Provides value (self-awareness) while staying within ethical/legal boundaries |
| **Smart risk scoring system** | Turns raw data into a single actionable number — reduces cognitive load for users |
| **Mood and medication correlation** | Reveals the hidden link between mental state and treatment adherence — unique insight |
| **Emergency detection and alerts** | Creates a safety net for both physical and mental health crises |
| **Voice-based interaction** | Makes the app accessible for elderly users and low-tech literacy users |
| **Predictive reminders** | Proactive rather than reactive — AI learns the user's patterns and intervenes early |

---

## ⚖️ Ethical & Legal Boundaries

| Boundary | Detail |
|---------|--------|
| No medical diagnosis | The app does not diagnose any condition |
| No treatment prescription | The app does not recommend medications or treatments |
| Screening only | Self-assessment produces a level (Mild/Moderate/High), not a clinical diagnosis |
| Anonymous mental health data | Mental health records can be stored without identity link |
| Guidance only | The app offers guidance, monitoring, and support only |

> ⚠️ **Disclaimer:** This application does not provide medical diagnosis or treatment. It offers guidance, monitoring, and support only.

---

## 🔐 Data Privacy Logic

| Module | Privacy Rule |
|--------|-------------|
| Authentication | OTP-verified accounts, encrypted credentials |
| Mental Health (Anonymous Mode) | Data stored without personally identifiable information |
| Journal Entries | Stored only locally or anonymously — no identity link |
| Caregiver Data Sharing | Opt-in only, controlled by patient |
| Emergency Alerts | Sent only to pre-approved emergency contacts |
| Reports Export | Patient-controlled PDF export |

---

## 📣 Key Business Messages

- *"Our application extends healthcare beyond the clinic."*
- *"We support users who are afraid to seek help."*
- *"We provide guidance, not diagnosis."*

---

*REMIND ME Project Proposal | 6 October Technological University | Faculty of Applied Health Sciences Technology*
