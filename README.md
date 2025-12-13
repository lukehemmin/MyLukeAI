# MyLukeAI

AI 채팅 플랫폼 - Open WebUI 스타일의 모던 AI 채팅 인터페이스

## 기능

- 🤖 실시간 AI 채팅 with 스트리밍
- 🔐 GitHub OAuth 인증
- 💬 대화 히스토리 관리
- 🎨 다크/라이트 모드 지원
- 📱 반응형 디자인
- 🔄 응답 재생성 기능
- 📊 토큰 사용량 표시
- 🎯 예시 프롬프트

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Database**: PostgreSQL + Prisma
- **Authentication**: NextAuth.js (GitHub OAuth)
- **AI SDK**: Vercel AI SDK

## 시작하기

### 필수 요구사항

- Node.js 18+
- PostgreSQL 데이터베이스
- GitHub OAuth 앱
- OpenAI API 키

### 설치

1. 저장소 클론
```bash
git clone <repository-url>
cd mylukeai
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 편집하여 다음 값들을 설정:
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `GITHUB_CLIENT_ID`: GitHub OAuth 클라이언트 ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth 클라이언트 시크릿
- `OPENAI_API_KEY`: OpenAI API 키
- `NEXTAUTH_SECRET`: NextAuth 시크릿 (openssl rand -base64 32)

4. 데이터베이스 설정
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### Docker로 실행

```bash
docker-compose up -d
npm install
npm run dev
```

## 배포

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### 기타 플랫폼

1. 빌드
```bash
npm run build
```

2. 시작
```bash
npm start
```

## API 문서

### 채팅 API

`POST /api/chat`

AI와 실시간 채팅을 위한 스트리밍 API

### 대화 API

- `GET /api/conversations` - 대화 목록 조회
- `POST /api/conversations` - 새 대화 생성
- `GET /api/conversations/[id]` - 특정 대화 조회
- `PATCH /api/conversations/[id]` - 대화 업데이트
- `DELETE /api/conversations/[id]` - 대화 삭제

## 개발

### 코드 스타일

Biome을 사용한 린팅 및 포맷팅:
```bash
npm run lint
```

### 데이터베이스 마이그레이션

```bash
npx prisma migrate dev --name <migration-name>
```

### Prisma Studio

```bash
npx prisma studio
```

## 보안 점검

- 저장소 내에 실제 API 키, 토큰, 인증서 등의 비밀값은 포함되어 있지 않습니다.
- `.env*` 파일은 `.gitignore`로 제외되어 있으며, 예제/테스트 키는 mock 값(`sk-test...`)만 사용합니다.
- 마이그레이션 및 설정 파일에도 실사용 자격 증명이나 민감한 데이터가 포함되어 있지 않음을 확인했습니다.

## 라이선스

MIT License
