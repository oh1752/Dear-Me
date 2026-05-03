# Dear Me Blueprint

## Overview
"Dear Me" is an elegant and intimate web application designed for users to write letters or set goals for their future selves. It combines a luxurious, premium aesthetic with the warmth of personal care, treating future goals as "gifts" rather than just tasks.

## Current State & Outline
- **Version**: V1 (Concept & Basic UI setup)
- **Features**: 
  - Capsule creation interface.
  - Future greeting and intuitive wording.
- **Design Strategy**: 
  - **Concept**: Elegant, warm, "Flow of Time".
  - **Colors**: Soft, warm pastel gradients (e.g., warm beige to soft white) to evoke a sense of calm and premium feel.
  - **Typography**: Elegant Serif fonts (Noto Serif KR) for headers and welcoming texts to bring luxury, paired with clean Sans-serif (Noto Sans KR) for high readability in body texts.
  - **Iconography**: Envelope combined with clock elements (🕰️✉️) representing time capsules.

## UX Scenarios
- **Greeting**: Users are greeted with an imaginative prompt: "안녕하세요, 미래의 당신은 어떤 모습인가요?" (Hello, what does your future self look like?)
- **Action Phrase**: Instead of "Write Goal", the action is framed as "미래의 나에게 줄 선물" (A gift for my future self). Example: "6개월 뒤의 나에게 '운동하는 습관'을 선물하시겠어요?"
- **Notification (Future Implementation)**: "과거의 당신으로부터 응원이 도착했습니다." (Support has arrived from your past self.)

## Firebase Implementation Plan (Future)
- **Firestore**: Create a `Capsules` (or `Letters`) collection. Key fields: `content`, `createdAt`, `unlockDate`. Logic will hide contents until `currentTime >= unlockDate`.
- **FCM**: Implement Push Notifications to alert users when a capsule unlocks.

## Current Plan
1. Apply the new visual identity (Google Fonts: Noto Serif KR, Noto Sans KR, pastel gradient).
2. Build the main Web Component representing the capsule creation form using the new UX scenarios.
3. Commit and push the new UI foundation to GitHub.