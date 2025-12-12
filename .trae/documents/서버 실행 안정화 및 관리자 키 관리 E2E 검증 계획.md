## 목표
- 개발 서버 500 오류 제거 및 안정 실행
- 관리자 키 관리(E2E): DB 암호화 저장, UI/API, 채팅 연동, 감사/사용 로그 검증
- 배포/운영 안정화(Prisma v7 구성 고정, postinstall, 헬스체크)

## 진단/검증
- 오류 재현: 로컬에서 `npm run dev` 후 홈(`/`) 접속, 서버 콘솔 에러 수집
- 구성 점검: `prisma/schema.prisma` 제너레이터(provider), `prisma.config.ts` datasource URL, `src/lib/prisma/client.ts` 임포트 방식 점검
- NextAuth 초기화 확인: `src/lib/auth/index.ts`에서 GitHub env 누락 시 오류 없이 동작하도록 확인, `/login` 경로 테스트

## 헬스 체크 추가
- `GET /api/health`: DB 연결 테스트(`prisma.$queryRaw('SELECT 1')`)와 세션 상태 반환
- Dev/Prod 공통으로 상태 코드 200/500 명확화

## Prisma/Client 구성 고정
- `generator client`를 `prisma-client-js`로 유지
- `prisma.config.ts`에 `datasource.url = env('DATABASE_URL')` 유지
- `src/lib/prisma/client.ts`는 `@prisma/client` 사용(단일 인스턴스 캐싱)
- `postinstall`: `prisma generate` 추가

## RBAC/관리자 계정
- 최소 한 계정의 `User.role = 'admin'`로 시딩(서버 액션 또는 간단 스크립트)
- `withAdmin/requireAdmin` 경로 보호 확인

## 관리자 키 관리 E2E
- UI: `/admin/keys` 페이지에서 키 생성/수정/삭제, 활성/만료 표시, 목록/통계 페이지 연결
- API: `POST/GET /api/admin/keys`, `GET/PATCH/DELETE /api/admin/keys/[id]`, `GET /api/admin/keys/stats`, `GET /api/admin/audit-logs` 정상 동작 확인
- 암호화: `encryptApiKey`(AES‑256‑GCM)로 `encryptedKeyJson` 저장, 해시(`keyHash`) 생성, 복호화 테스트
- 감사/사용 로그: 키 CRUD 액션 기록, `/api/chat` 호출 시 `ApiKeyUsage` 적재

## 채팅 API 연동
- 모델→제공자 매핑은 현재 OpenAI 중심으로 유지
- `streamText`에서 `createOpenAI({ apiKey })`로 동작, 응답 스트리밍/토큰 사용량 기록
- 에러 핸들링(401/429/413/네트워크) 유지

## UI 안정화
- `ChatBubble`, `ErrorMessage`, `LoadingSkeleton`, `ThemeToggle` 렌더 확인
- `Sidebar` 대화 목록의 `updatedAt` 타입(Date) 일치 검증

## 테스트/품질
- ESLint 전체 실행(무오류 유지)
- 타입 검사/빌드 확인(`npm run build`)
- 통합 테스트(간단 시나리오): 로그인→관리자 키 등록→채팅 메시지 전송→스트리밍 정상 동작 및 사용 로그 기록

## 보안/운영
- `.env.local`: `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `API_KEY_ENCRYPTION_KEY`만 사용
- 키 로테이션 가이드(선택): 교체 시 재암호화 절차 문서화
- 로그 민감정보 노출 금지 점검

## 인도물
- 수정된 코드 및 설정
- 확인 로그/스크린샷(필요 시)
- 간단 운영 가이드: 초기 관리자 설정, 키 등록, 헬스 체크, 배포 시 유의사항

위 계획에 따라 바로 구현 및 검증을 진행하겠습니다. 승인해 주세요.