# Dear Me Blueprint

## Overview
"Dear Me" is an elegant and intimate web application designed for users to write letters or set goals for their future selves. It combines a luxurious, premium aesthetic with the warmth of personal care, treating future goals as "gifts" rather than just tasks.

## Current State & Outline
- **Version**: V1.3 (Side Menu Dropdown added)
- **Features**: 
  - Capsule creation interface.
  - Future greeting and intuitive wording.
  - **Tomorrow's Day Calculator**: A utility to check tomorrow's day of the week.
  - **Intelligent Suggestions**: Expert-curated phrases suggested automatically on Sundays (Monday Blues prevention) and the 1st of every month (New Beginnings).
    - **Eve-of-Month Detection**: Automatically suggests "New Beginning" phrases on the last day of the month.
  - **Navigation & Settings Menu**: A top-left dropdown menu (☰) containing:
    - 🎨 테마 (Theme)
    - 🔒 기념일 잠금 (Anniversary Lock)
    - 💾 백업 및 복원 (Backup & Restore)
    - 📤 공유 하기 (Share)
- **Design Strategy**: 
  - **Concept**: Elegant, warm, "Flow of Time".
  - **Colors**: Soft, warm pastel gradients.
  - **Typography**: Noto Serif KR & Noto Sans KR.

## UX Scenarios
- **Greeting**: "안녕하세요, 미래의 당신은 어떤 모습인가요?"
- **Intelligent Context**: 
  - *Sundays*: "월요병 방지 및 주간 설계" phrases.
  - *1st of Month*: "새로운 시작과 계절감" phrases.
- **Side Menu**: Quick access to secondary features without cluttering the main goal-writing experience.

## Firebase Implementation Plan (Future)
- **Firestore**: Create a `Capsules` (or `Letters`) collection.
- **FCM**: Implement Push Notifications to alert users when a capsule unlocks.

## Current Plan
1. Apply the new visual identity (Google Fonts: Noto Serif KR, Noto Sans KR, pastel gradient).
2. Build the main Web Component representing the capsule creation form using the new UX scenarios.
3. Commit and push the new UI foundation to GitHub.