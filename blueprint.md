# Dear Me V2.1: Future Self Time Capsule (Restored & Enhanced)

## 1. Concept & Persona
"Dear Me" is a sophisticated, emotional time capsule application. It acts as a **10-year experienced life planner and emotional therapist**, helping users connect with their future selves through a warm, encouraging, and professional tone.

## 2. Main Feature: Time-Sealing & Email Delivery
Instead of traditional messaging, the app uses an internal **"Time-Sealing"** mechanism combined with email notifications.
- **Flow**: User writes a letter -> **Enter Recipient Email** -> Click "**밀봉해 드립니다**" (Seal for you) -> Select Unlock Date -> Content is sealed and saved to Firestore.
- **Email Integration**: A scheduled **Cloudflare Worker** checks Firestore daily for capsules whose `unlock_date` has arrived. It sends an email via **Resend** with a unique link.
- **Link Logic**: The email contains a link like `https://dear-me.pages.dev/?id=DOCUMENT_ID`.
- **Viewing Logic**: When the app loads, it checks for an `id` parameter. If present, it fetches the capsule. If the `unlock_date` has passed, it displays the message in a beautiful "Open" view. If not, it shows a "Still Sealed" countdown.

## 3. Functional Features
- **Theme Switcher**: Functional side menu item (🎨) that cycles through **Classic**, **Midnight**, and **Forest** themes, updating both the app container and the global background.
- **Today's Date Toggle**: A button ("📅 오늘 요일 입력하기") to select a reference date and get intelligent suggestions.
- **Side Navigation Menu**: A top-left dropdown menu (☰) for secondary settings.
- **Cinematic Quote Guide**: Animated ghost-text in the message area to inspire writing.

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
- **Deployment**: Optimized Cloudflare Assets configuration in `wrangler.toml` excluding development artifacts.

## 6. Implementation Plan (Status)
1. [x] Restore Menu and Today Toggle HTML/CSS/JS.
2. [x] Add Email input field to the time capsule form.
3. [x] Rename the sealing button to "밀봉해 드립니다".
4. [x] Implement functional Theme Switcher.
5. [x] Optimize deployment configuration.
6. [ ] Update Firestore logic with actual Firebase credentials.
7. [ ] Implement URL parameter handling for viewing capsules (`?id=...`).
8. [ ] Create a beautiful "Letter Opened" view.
9. [ ] Implement Cloudflare Worker for scheduled email sending (Cron Trigger).
10. [ ] Integrate Resend API for email delivery.
