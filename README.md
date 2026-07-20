# Smart Field Survey 🚀 (Native Mobile App)

A modern, high-performance **React Native & Expo** mobile application designed for field inspection survey logging, real-time device API integrations (Camera, GPS, Contacts, Clipboard), and interactive survey analytics.

Features a **Creative Floating Pill Navigation Bar** in stealth shades of black, coupled with vibrant high-contrast action controls.

---

## 📱 Key Features & App Modules

### 1. 🏠 Smart Dashboard (`index.jsx`)
- **Daily Survey Counter**: High-contrast obsidian black counter badge displaying real-time surveys completed today.
- **Quick Action Pill Buttons**: Instant navigation to start a new survey or view past survey history.
- **Recent Logs Summary**: Displays the 3 most recent field surveys with priority badges (High, Medium, Low) and location tags.

### 2. 📝 Field Survey Logging Module (`new-survey.jsx`)
- **Interactive Form Controls**: Rounded pill-style form inputs with real-time field validation.
- **Draft State Persistence**: Powered by `SurveyContext` to preserve user input across screen switches.
- **Form Preview & Fix Mode**: Full preview modal prior to final log submission.

### 3. 📸 Native Camera Capture Module (`expo-camera`)
- **Built-in Camera Modal**: Seamlessly opens the device camera inside the app to capture site photographs.
- **Photo Timestamping**: Links site photos directly to the active survey draft with exact timestamps.

### 4. 📍 Real-Time GPS Tracking Module (`expo-location`)
- **GPS Coordinates Retrieval**: Fetches device latitude, longitude, and accuracy radius on demand.
- **Location Linkage**: Automatically attaches geographical data to survey reports.

### 5. 👥 Device Contacts Picker Module (`expo-contacts`)
- **Contact Picker**: Accesses system contacts to select and link site contact persons ("Buddies") to survey entries.
- **Search & Filter**: Allows searching contacts by name or phone number.

### 6. 📋 Clipboard Tool Module (`expo-clipboard`)
- **Quick Clipboard Integration**: Enables 1-tap pasting of copied text notes directly into survey descriptions.

### 7. 📂 Survey History & Search Module (`history.jsx`)
- **Live Search Bar**: Search logs by site name or client name in real time.
- **Priority Filter Chips**: Interactive filter pills for `All`, `High 🔥`, `Medium ⚡`, and `Low 🍀` priorities.
- **Log Management**: Supports inspecting full survey details or permanently deleting entries.

### 8. 📊 Profile & Analytics Module (`profile.jsx`)
- **Student Profile**: Displays user credentials and student roll number.
- **Metric Cards**: Total logs count and daily completion stats.
- **Priority Breakdown**: Visual progress bars categorizing surveys by priority level.

### 9. 🗄️ Custom Drawer Navigation (`app/(drawer)/_layout.jsx`)
- **Drawer Menu**: Custom drawer layout with profile header, quick native API shortcuts, and daily counter badge.

---

## 📦 Native Modules & Dependencies Used

| Module / Package | Version | Purpose |
| :--- | :--- | :--- |
| **`expo`** | `~54.0.35` | Core Expo framework & app runner |
| **`react-native`** | `0.81.5` | Cross-platform mobile UI framework |
| **`expo-router`** | `~6.0.24` | File-based routing & tab/drawer navigation |
| **`expo-camera`** | `~17.0.10` | Device camera access & photo capture |
| **`expo-location`** | `~19.0.8` | Foreground GPS location retrieval |
| **`expo-contacts`** | `~15.0.11` | Access and filter device contacts |
| **`expo-clipboard`** | `~8.0.8` | System clipboard read/write utilities |
| **`@react-navigation/drawer`** | `^7.13.2` | Side navigation drawer layout |
| **`@expo/vector-icons`** | `^15.0.3` | Ionicons vector icons set |
| **`react-native-reanimated`** | `~4.1.1` | Fluid animations & gestures |
| **`react-native-gesture-handler`**| `~2.28.0` | Touch & swipe gesture handling |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- Expo Go app on iOS/Android device, or Android Studio / Xcode emulators.

### Installation

1. Navigate to the project directory:
   ```bash
   cd assi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npx expo start
   ```

4. Run on specific platform:
   - **Android**: Press `a` or run `npx expo start --android`
   - **iOS**: Press `i` or run `npx expo start --ios`
   - **Web**: Press `w` or run `npx expo start --web`

---

## 👨‍💻 Author
- **Developer**: Sai Janjirala
- **Roll Number**: `2026-NATIVE-ASS`
