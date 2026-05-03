# Dear Me Blueprint

## Overview
"Dear Me" is an elegant and intimate web application designed for users to write letters or set goals for their future selves. It combines a luxurious, premium aesthetic with the warmth of personal care, treating future goals as "gifts" rather than just tasks.

## Current State & Outline
- **Version**: V1.1 (Tomorrow's Day Calculator added)
- **Features**: 
  - Capsule creation interface.
  - Future greeting and intuitive wording.
  - **Tomorrow's Day Calculator**: A utility at the bottom to check what day of the week tomorrow will be based on a selected date.
- **Design Strategy**: 
  - **Concept**: Elegant, warm, "Flow of Time".
  - **Colors**: Soft, warm pastel gradients.
  - **Typography**: Noto Serif KR & Noto Sans KR.

## UX Scenarios
- **Greeting**: "안녕하세요, 미래의 당신은 어떤 모습인가요?"
- **Tomorrow Preview**: "오늘의 날짜를 입력하면 내일의 요일을 미리 알려드립니다." (Enter today's date and we'll tell you tomorrow's day.)
- **Action Phrase**: "미래의 나에게 선물 보내기"

## Firebase Implementation Plan (Future)
- **Firestore**: Create a `Capsules` (or `Letters`) collection. Key fields: `content`, `createdAt`, `unlockDate`. Logic will hide contents until `currentTime >= unlockDate`.
- **FCM**: Implement Push Notifications to alert users when a capsule unlocks.

## Current Plan
1. Apply the new visual identity (Google Fonts: Noto Serif KR, Noto Sans KR, pastel gradient).
2. Build the main Web Component representing the capsule creation form using the new UX scenarios.
3. Commit and push the new UI foundation to GitHub.