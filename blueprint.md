# Dear Me V2: Future Self Time Capsule

## 1. Concept & Persona
"Dear Me" is a sophisticated, emotional time capsule application. It acts as a **10-year experienced life planner and emotional therapist**, helping users connect with their future selves through a warm, encouraging, and professional tone.

## 2. Main Feature: Time-Sealing
Instead of traditional messaging, the app uses an internal **"Time-Sealing"** mechanism.
- **Flow**: User writes a letter -> Click "Seal with Love" (사랑을 담아 밀봉하기) -> Select Unlock Date (using manual DatePicker) -> Content is sealed and saved to Firestore.
- **Locked State**: Content remains locked and stored securely in Firestore until the `unlock_date`.

## 3. Adaptive Greeting Logic
The landing screen provides a personalized greeting based on time/context:
- **Sunday Evening (after 5 PM)**: Focus on overcoming "Monday Blues" with a specific small task for the week.
- **1st Day of Month**: Focus on seasonal travel, holiday suggestions, and encouraging new monthly goals.
- **Default**: Warm, professional encouragement from your personal life planner.

## 4. Technical Specifications
- **Frontend**: Modern, minimal UI with soft pastel gradients and elegant serif fonts (`Noto Serif KR`).
- **Database (Firebase Firestore)**:
  - Collection: `capsules`
  - Document Fields: `{ uid, content, created_at, unlock_date, is_opened }`
- **Notifications**: (Concept) Firebase Cloud Messaging (FCM) to alert users when a gift arrives.

## 5. UI/UX Strategy (Vibe-driven)
- **Aesthetics**: Premium, tactile feel with subtle noise textures and deep shadows.
- **Layout**: Clean, immersive workspace for writing. No cluttered inputs.
- **Interactivity**: Sophisticated buttons and smooth transitions that emphasize the "sealing" process.

## 6. Implementation Plan (V2)
1. Add Firebase SDK CDN links to `index.html`.
2. Update `main.js` with Firebase initialization and Firestore saving logic.
3. Refactor `<dear-me-app>` UI components to follow the Vibe-driven design.
4. Implement the enhanced adaptive greeting logic.
5. Retain the manual date input for unlock date per user preference.
