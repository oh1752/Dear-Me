# Dear Me V2.1: Future Self Time Capsule (Restored & Enhanced)

## 1. Concept & Persona
"Dear Me" is a sophisticated, emotional time capsule application. It acts as a **10-year experienced life planner and emotional therapist**, helping users connect with their future selves through a warm, encouraging, and professional tone.

## 2. Main Feature: Time-Sealing & Email Delivery
Instead of traditional messaging, the app uses an internal **"Time-Sealing"** mechanism combined with email notifications.
- **Flow**: User writes a letter -> **Enter Recipient Email** -> Click "**밀봉해 드립니다**" (Seal for you) -> Select Unlock Date -> Content is sealed and saved to Firestore.
- **Email Integration**: On the `unlock_date`, an email is sent to the user with a special link to view their capsule within the app.
- **Locked State**: Content remains locked and stored securely in Firestore until the `unlock_date`.

## 3. Restored Features
- **Today's Date Toggle**: A button ("📅 오늘 요일 입력하기") to select a reference date and get intelligent suggestions.
- **Side Navigation Menu**: A top-left dropdown menu (☰) for secondary settings (Theme, Anniversary Lock, Backup, Share).

## 4. Adaptive Greeting Logic
The landing screen provides a personalized greeting based on time/context:
- **Sunday Evening (after 5 PM)**: Focus on overcoming "Monday Blues".
- **1st Day of Month**: Focus on new monthly goals.
- **Default**: Warm, professional encouragement.

## 5. Technical Specifications
- **Frontend**: Modern, minimal UI with soft pastel gradients and elegant serif fonts (`Noto Serif KR`).
- **Database (Firebase Firestore)**:
  - Collection: `capsules`
  - Document Fields: `{ uid, content, email, created_at, unlock_date, is_opened }`

## 6. Implementation Plan
1. Restore Menu and Today Toggle HTML/CSS/JS.
2. Add Email input field to the time capsule form.
3. Rename the sealing button to "밀봉해 드립니다".
4. Update Firestore logic to save the `email` field.
