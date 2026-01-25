# 잡도리 타임 (JABDORI TIME)

할 일을 미룬 변명을 입력하면, 5명의 친구들이 각자의 스타일로 잡도리(잔소리)해주는 web app.

- 개발기간: 2026.01.23 - 2026.01.25
- 개발 보조: Claude AI
   - 프로젝트 초기 셋팅
   - 리팩토링
   - 스타일

## 기능

- 미룬 할 일과 변명을 입력
- 5명의 AI 친구가 순차적으로 타이핑 애니메이션과 함께 메시지 전송
- 친구 프로필 클릭 시 상세 모달 표시
- 매운맛 / 순한맛 강도 선택 가능

## 기술 스택

- Next.js 16 (App Router)
- TypeScript
- styled-components
- Zod (폼 검증)

## 시작하기

```bash
npm install
npm run dev
```

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 홈
│   ├── confession/           # 자백 페이지
│   │   ├── page.tsx
│   │   └── _components/      # 컴포넌트들
│   └── api/                  # API 라우트
├── constants/friends.ts      # 친구 데이터
├── hooks/                    # 커스텀 훅
├── lib/                      # 유틸리티
├── styles/                   # 테마, 애니메이션
└── types/                    # 타입 정의
```
