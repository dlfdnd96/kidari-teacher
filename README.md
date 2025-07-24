# 키다리 선생님

전문직 봉사동아리 - 고등학생 진로교육을 위한 전문가 멘토링 동아리

진로, 적성, 전문직의 삶에 대해 전달하여 고등학생들의 진로 선택에 도움을 주기 위한 사회인 봉사 동아리의 공식 웹사이트입니다.

## 📖 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [인증 시스템](#인증-시스템)
- [테스트](#테스트)

## 주요 기능

- 홈페이지
- 로그인/로그아웃
- 봉사활동 관리
  - 활동 등록: 봉사활동 일정, 장소, 모집인원 관리
  - 신청 시스템: 봉사자 신청 및 선발 프로세스
  - 상태 추적: 계획 → 모집 → 선발 → 진행 → 완료 단계별 관리
- 공지사항
- 마이페이지
  - 내 신청 현황: 참여한 봉사활동 신청 내역 조회
  - 프로필 설정: 개인정보 및 전문직 정보 수정

## 기술 스택

### Frontend

- Framework: Next.js (App Router)
- Language: TypeScript
- UI Library: React
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- Icons: Lucide React
- Form: React Hook Form + Zod

### Backend

- API: Next.js API Routes + tRPC
- Database: PostgreSQL + Prisma ORM

### DevOps & Tools

- Runtime: Node.js 22
- Package Manager: npm
- Database: PostgreSQL 16
- Testing: Cypress

## 시작하기

### 사전 요구사항

- Node.js 22.x 이상
- npm
- Docker & Docker Compose (PostgreSQL 데이터베이스용)

### 데이터베이스

```bash
# PostgreSQL 컨테이너 시작
docker-compose up -d postgres

# 데이터베이스 스키마 적용
npx prisma generate
npx prisma db push
```

### 개발 서버 실행

```bash
npm run dev
```

## 인증 시스템

### 지원 로그인 방식

- Google OAuth: Google 계정 연동
- Kakao OAuth: 카카오 계정 연동
- Naver OAuth: 네이버 계정 연동

### 권한 시스템

- USER: 일반 사용자 (봉사활동 신청, 프로필 관리)
- ADMIN: 관리자 (모든 데이터 관리, 사용자 승인 등)

### 보안 기능

- JWT 기반 세션 관리
- 입력값 검증 (Zod 스키마)

## 테스트

### E2E 테스트 (Cypress)

주요 사용자 플로우에 대한 종합적인 테스트:

```bash
# 테스트 실행
npm run test:e2e

# 테스트 GUI 열기
npm run dev:test
npm run cypress:open
```

DB docker 명령어

**주의**

- local, test 환경의 환경변수가 다름

```bash
docker compose --env-file SOME_PATH_ENV_FILE up -d
```
