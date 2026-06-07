# REMIND ME — Project Rules & Standards

> These rules apply to every part of the project (Frontend + Backend).
> Every team member must read and follow this document before writing any code.

---

## Rule 1: No Emojis in the Application UI

**FORBIDDEN:** Using emojis anywhere in the app interface — buttons, labels, notifications, chat messages, cards, banners, or any visible text.

**REQUIRED:** Use a professional icon library instead.

**Approved Icon Library:**
- `react-native-vector-icons` — MaterialCommunityIcons + Ionicons sets
- Fallback: `@expo/vector-icons` (if using Expo)

**Examples:**

| Wrong (Emoji) | Correct (Icon Library) |
|--------------|----------------------|
| "💊 Add Medication" | `<Icon name="pill" />` + "Add Medication" |
| "⚠️ Warning" | `<Icon name="alert-circle" />` + "Warning" |
| "🧠 Mental Health" | `<Icon name="brain" />` + "Mental Health" |
| "📊 Reports" | `<Icon name="chart-bar" />` + "Reports" |
| "🔔 Reminder" | `<Icon name="bell" />` + "Reminder" |
| "✅ Taken" | `<Icon name="check-circle" />` + "Taken" |
| "❌ Skip" | `<Icon name="close-circle" />` + "Skip" |
| "😊 Mood" | `<Icon name="emoticon-happy-outline" />` + "Mood" |
| "🆘 Emergency" | `<Icon name="phone-alert" />` + "Emergency" |

**Where this applies:**
- Screen titles and labels
- Button text
- Push notification content
- AI responses displayed to user
- Status badges
- Empty states
- Error and success messages
- PDF report content

---

## Rule 2: No Hardcoded Colors

**FORBIDDEN:** Writing any hex code, RGB, or color name directly in a component stylesheet.

```js
// WRONG
color: '#FF0000'
backgroundColor: 'white'
borderColor: 'gray'

// CORRECT
color: theme.status.danger
backgroundColor: theme.background.primary
borderColor: theme.border
```

**Required:** All colors must come from the theme token system defined in `frontend-tasks.md`.
- Use `useTheme()` hook in every component
- Theme tokens cover Light Mode and Dark Mode automatically

---

## Rule 3: No Hardcoded Strings (Bilingual Mandatory)

**FORBIDDEN:** Writing any user-visible text directly in JSX or PHP responses without translation support.

```jsx
// WRONG
<Text>Add Medication</Text>
<Text>حدث خطأ</Text>

// CORRECT
<Text>{t('medication.add')}</Text>
```

**Required:**
- All user-visible text must go through the `t()` translation function
- Two locale files maintained: `ar.json` (default) + `en.json`
- Arabic text must use the **Cairo** font
- English text must use the **Inter** font
- RTL layout must activate automatically when Arabic is selected (`I18nManager.forceRTL(true)`)
- Backend API responses must always include both `_ar` and `_en` fields for any text shown to users

---

## Rule 4: Dark Mode and Light Mode Must Both Be Fully Supported

**FORBIDDEN:**
- Screens that only look correct in one mode
- Testing only in light mode and skipping dark mode
- Using white text on white background or dark text on dark background due to missing theme support

**Required:**
- Every screen and component must be tested in both Light Mode and Dark Mode before being considered done
- Theme switching must be instant (no app restart required)
- System theme (auto) must be supported as a third option
- The theme preference is saved to `user_settings.theme` via the Settings API

---

## Rule 5: No Placeholder or Stock Images

**FORBIDDEN:** Using placeholder images, Lorem Ipsum text, stock photos, or "coming soon" placeholders in any deliverable screen.

**Required:**
- Every screen must contain real, relevant content
- Illustrations used in Onboarding and empty states must be custom SVGs or generated assets — not downloaded stock art
- Empty states must display a meaningful icon (from the icon library) + a helpful bilingual message, not a blank screen or placeholder

---

## Rule 6: Logo Usage Rules

**The app logo must:**
- Be used only in: Splash Screen, Onboarding screens, Login screen header, exported PDF reports
- Have both a light-background version and a dark-background version
- Never be stretched, distorted, or recolored outside approved brand colors
- Never be replaced by text or emoji

**FORBIDDEN:**
- Using the logo inside body content of any operational screen (Dashboard, Medications, etc.)
- Using the logo as a loading spinner
- Using the logo at sizes smaller than 48x48px

---

## Rule 7: Typography Rules

**Font Families:**
- Arabic content: **Cairo** (Google Fonts)
- English content: **Inter** (Google Fonts)
- Both fonts must be loaded at app startup — no system default fonts in the UI

**FORBIDDEN:**
- Using system default fonts
- Mixing font families within a single label
- Using font sizes not defined in the typography scale

**Required font scale:**
- `xs: 12` / `sm: 14` / `base: 16` / `lg: 18` / `xl: 20` / `2xl: 24` / `3xl: 30`

---

## Rule 8: No Medical Diagnosis or Treatment Language

**FORBIDDEN:** Any text in the app that implies diagnosis, treatment, or prescribing.

**Forbidden phrases (in any language):**
- "You have [condition]"
- "You should take [medication]"
- "Stop taking this medication"
- "This medication will cure..."
- "Your diagnosis is..."

**Required:** Any result, suggestion, or guidance must include a disclaimer:
- Arabic: "هذا التطبيق لا يقدم تشخيصاً طبياً. يقدم إرشادات ودعماً فقط."
- English: "This app does not provide medical diagnosis or treatment. It offers guidance and support only."

**Where this disclaimer is required:**
- Self-Assessment Result screen
- Self-Assessment Guidance screen
- Drug Interaction Suggested Alternatives screen
- AI Chat Support screen (mental health)
- Emotional Insights screen

---

## Rule 9: Anonymous Mode Data Isolation

**FORBIDDEN:**
- Storing `user_id` in any `mood_entries`, `journal_entries`, or `assessments` record when the user is in Anonymous Mode
- Logging anonymous session data to any analytics or monitoring system that could link it to a user identity
- Displaying user name, email, phone, or profile photo anywhere inside Anonymous Mode

**Required:**
- Anonymous mode sessions use a UUID `anonymous_session_id` stored only for the duration of the session
- All mental health data from an anonymous session is retrievable only via that session ID — not via the user account
- Backend middleware `AnonymousMode.php` must strip identity before any mental health data is saved

---

## Rule 10: Push Notification Rules

**FORBIDDEN:**
- Sending push notifications without explicit user opt-in
- Sending more than one reminder notification per dose (unless user snoozes)
- Including medication names in notification previews on the lock screen (privacy concern for sensitive medications)

**Required:**
- Notification permission requested at first launch
- Each notification type has a separate enable/disable toggle in Settings → Notifications:
  - Medication Reminders
  - Caregiver Alerts
  - AI Prediction Alerts
  - Emergency Alerts
- Notification text must be in the user's selected language

---

## Rule 11: API Response Standards

**FORBIDDEN:**
- Returning plain strings as API responses
- Returning HTML in API responses
- Returning different response structures from different endpoints

**Required:** Every API response must follow this structure:
```json
{
  "success": true | false,
  "data": { ... } | null,
  "message_ar": "رسالة بالعربي",
  "message_en": "Message in English"
}
```
Error responses must include:
```json
{
  "success": false,
  "errors": { "field": ["error message"] },
  "message_ar": "فشلت العملية",
  "message_en": "Operation failed"
}
```

---

## Rule 12: Spacing and Layout Consistency

**FORBIDDEN:**
- Using arbitrary margin/padding values not in the spacing scale
- Inconsistent spacing between similar elements across different screens

**Required spacing scale (all values in px):**
- `xs: 4` / `sm: 8` / `md: 16` / `lg: 24` / `xl: 32` / `2xl: 48`

**Required border radius scale:**
- `sm: 8` / `md: 12` / `lg: 16` / `xl: 24` / `full: 9999`

---

## Rule 13: Disclaimer on Self-Assessment (Screening Only)

**FORBIDDEN:** Any screen in the Self-Assessment module that does not show the screening disclaimer.

**Required:**
- Disclaimer shown on Start Assessment screen (before user begins)
- Disclaimer shown on Result screen (alongside result)
- Result displayed ONLY as: Mild / Moderate / High — never as a named condition
- Arabic disclaimer: "هذه أداة فحص ذاتي فقط وليست تشخيصاً طبياً."
- English disclaimer: "This is a self-screening tool only — not a medical diagnosis."

---

## Rule 14: Code and Naming Conventions

### React Native
- Component files: `PascalCase` (e.g., `MedicationCard.js`)
- Screen files: `PascalCase` ending in `Screen` (e.g., `AddMedicationScreen.js`)
- Service files: `camelCase` ending in `Service` (e.g., `medicationService.js`)
- Constants: `UPPER_SNAKE_CASE`
- All component props must be typed (PropTypes or TypeScript)

### Laravel
- Controllers: `PascalCase` ending in `Controller` (e.g., `MedicationController.php`)
- Models: `PascalCase` singular (e.g., `Medication.php`)
- Services: `PascalCase` ending in `Service` (e.g., `DrugInteractionService.php`)
- Migration files: `snake_case` with timestamp prefix
- API routes: `kebab-case` (e.g., `/api/v1/drug-interactions`)
- All controller methods must have validation via Form Requests

---

## Rule 15: Features Scope Lock

**FORBIDDEN:** Adding any feature, screen, or function that is NOT listed in the original project proposal (`app.md`).

**The 8 Key Features are locked:**
1. Medication Reminder System
2. Drug Interaction Checker
3. AI Assistant
4. Mental Health Support (Anonymous Mode)
5. Self-Assessment (Screening, not diagnosis)
6. Mood Tracking & Analysis
7. Emergency Alerts
8. Reports & Analytics

**The 85 screens are locked** — no screens may be added or removed without a formal change to the project proposal approved by the supervisor.

**The 8 innovations are locked:**
1. AI-based drug interaction detection
2. Anonymous mental health support system
3. Self-assessment without diagnosis
4. Smart risk scoring system
5. Mood and medication correlation
6. Emergency detection and alerts
7. Voice-based interaction
8. Predictive reminders

---

*REMIND ME Project | 6 October Technological University | Faculty of Applied Health Sciences Technology*
*Supervised by: Dr. Hager*
