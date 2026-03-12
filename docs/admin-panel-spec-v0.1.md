# 관리자 패널 정의서 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 관리자 패널 정의서
- **버전**: v0.1
- **목적**: OpenWebUI 수준의 세밀한 관리자 설정을 우리 플랫폼 구조에 맞게 재정의하고, 모든 운영 설정을 관리자 UI 중심으로 제어할 수 있는 기준을 만든다.
- **관련 문서**: `docs/product-vision-v0.1.md`, `docs/screen-list-definition-v0.2.md`, `docs/permission-plan-matrix-v0.1.md`, `docs/computer-browser-agent-lifecycle-v0.1.md`

---

## 2. 핵심 방향

우리 시스템의 관리자 설정은 `env 파일을 수정하는 방식`이 아니라, **OpenWebUI처럼 관리자 UI에서 세세하게 제어하는 방식**을 기본 원칙으로 하되, primary DB/Redis 같은 부팅 필수값만 예외적으로 deployment bootstrap 계층에 둘 수 있다.

즉, 운영자가 다음과 같은 항목을 직접 관리자 화면에서 설정할 수 있어야 한다.

- 모델 공급자 연결
- 인증 및 가입 정책
- 권한, 그룹, 기본 역할
- 문서/RAG/검색/코드 실행 관련 정책
- 오디오, 이미지, 인터페이스, 함수, 파이프라인 설정
- Computer, 브라우저, 에이전트, 실행 인프라 정책
- 플랜, 사용량, 좌석, 청구 확장 정책

이 제품에서 `환경변수`는 제품 기능을 제어하는 주 수단이 아니며, **배포 초기화와 내부 인프라 부팅에만 제한적으로 사용**한다. 운영자가 바꾸고 싶어하는 실제 서비스 설정은 모두 관리자 UI에서 조회/수정 가능해야 한다.

---

## 3. 관리자 설정 철학

### 3.1 UI-First Configuration

- 운영 설정은 기본적으로 관리자 UI에서 구성한다.
- 사용자가 체감하는 기능 설정은 env 전용 옵션으로 두지 않는다.
- 관리자는 변경 사항을 즉시 확인하고 저장할 수 있어야 한다.

### 3.2 Database-Backed Configuration

- 설정값은 DB 또는 전용 설정 저장소에 저장한다.
- 설정은 API로 조회/수정 가능해야 한다.
- 재시작 없이 반영 가능한 항목은 즉시 반영한다.

### 3.3 Secret-Safe Configuration

- API Key, Access Token, OAuth Secret 같은 민감값도 관리자 UI에서 등록 가능해야 한다.
- 민감값은 평문 노출 없이 마스킹, 권한 제한, 감사 로그와 함께 관리한다.

### 3.4 Auditable Configuration

- 누가 어떤 설정을 언제 바꿨는지 기록해야 한다.
- 중요 설정은 변경 이력과 이전 값 복원 가능성을 고려해야 한다.

### 3.5 Scoped Configuration

- 설정 범위를 `전역`, `플랜`, `팀`, `프로젝트`, `모델`, `공급자`, `사용자 그룹` 단위로 확장 가능하게 설계한다.
- 기본은 전역 설정이지만, 점차 세분화 가능한 구조여야 한다.

### 3.6 Enterprise-Ready Governance UX

- 감사 로그, SSO, 권한, 데이터 보존, 정책 적용 범위, 승인 흐름은 별도 문서를 찾아가야만 이해되는 정보가 아니라 화면 안에서 읽혀야 한다.
- 관리자 UI는 단순히 값을 수정하는 폼이 아니라 `현재 유효 정책`, `적용 범위`, `override source`, `보존 영향`, `승인 영향`, `감사 이력`을 함께 보여주는 운영 콘솔이어야 한다.
- 개발자가 아닌 엔터프라이즈 운영자도 화면만 보고 위험도와 영향 범위를 이해할 수 있어야 한다.

---

## 4. 설정 저장 구조 원칙

| 항목 | 원칙 |
|---|---|
| 저장 위치 | PostgreSQL 기반 DB |
| 접근 방식 | 관리자 UI + 내부 Admin API |
| 민감정보 | 암호화 저장 + 마스킹 표시 |
| 이력 관리 | 변경 로그 저장 |
| 반영 방식 | 즉시 반영 / 다음 세션 반영 / 다음 작업 반영 / 재시작 필요 상태 명시 |
| 검증 | 저장 전 유효성 검사 |
| 검색 | 설정 검색 가능 |
| 권한 | Super Admin / Platform Admin / 제한된 관리자 권한 분리 가능 |

---

## 5. 환경변수 사용 원칙

### 5.1 허용 범위

env는 아래처럼 **제품 기능 설정이 아닌 부팅/배포용 내부 값**에 한정한다.

- DB 연결 문자열
- 객체 스토리지 접근 정보
- 내부 서비스 간 인증 비밀값
- 배포 환경 식별값
- 인프라 레벨 포트/호스트 설정

### 5.2 금지 또는 최소화 대상

아래 항목은 env 전용으로 두지 않고 반드시 관리자 UI에서 제어 가능해야 한다.

- 모델 연결 정보
- OpenAI/Ollama/Anthropic/Google 관련 운영 설정
- 가입 정책, 기본 역할, 그룹 정책
- 문서/RAG/웹 검색/코드 실행 옵션
- Web UI 인터페이스 옵션
- 함수/파이프라인/에이전트 정책
- 브라우저/Computer 실행 정책
- 플랜/사용량/좌석 정책

### 5.3 제품 원칙 문장

> 운영자가 바꾸고 싶어하는 설정은 관리자 UI에 있어야 하며, env는 배포 엔지니어링을 위한 내부 채널이지 제품 운영 채널이 아니다.

---

## 6. 관리자 패널 최상위 IA

```text
Admin
- Dashboard
- Users & Groups
- Analytics
- Evaluations
- Functions
- Settings
  - General
  - Access & Identity
  - Connections
  - Models
  - Documents & Retrieval
  - Web Search
  - Computer & Browser
  - Code Execution
  - Agents & Orchestration
  - Integrations
  - Interface
  - Audio
  - Images
  - Pipelines
  - Billing & Plans
  - Security & Audit
  - Database & Data Ops
```

---

## 7. OpenWebUI 호환 기준

우리 관리자 패널은 OpenWebUI의 관리자 설정 경험을 최대한 흡수하되, 실행형 AI 개발 플랫폼에 맞게 확장한다.

### 7.1 반드시 포함할 OpenWebUI 계열 축

- `Users`
- `Analytics`
- `Evaluations`
- `Functions`
- `Settings`

### 7.2 Settings 안에서 OpenWebUI 수준으로 맞춰야 하는 카테고리

- `General`
- `Connections`
- `Models`
- `Integrations`
- `Documents & Retrieval`
- `Web Search`
- `Code Execution`
- `Interface`
- `Audio`
- `Images`
- `Pipelines`
- `Database & Data Ops`

### 7.3 우리 플랫폼에서 추가해야 하는 카테고리

- `Computer & Browser`
- `Agents & Orchestration`
- `Billing & Plans`
- `Security & Audit`
- `Access & Identity`

---

## 8. 관리자 대시보드

### 목적

- 운영 상태를 한눈에 파악
- 즉시 대응이 필요한 문제를 빠르게 식별
- 실행형 플랫폼 특성상 세션/브라우저/에이전트 상태를 우선 노출

### 주요 지표

- 전체 사용자 수
- 활성 사용자 수
- 팀 수
- 활성 Computer 세션 수
- 활성 Browser 세션 수
- 에이전트 실행 수
- 실패율
- 실행 대기열 길이
- 스토리지 사용량
- 모델별 호출량
- 토큰 사용량

### 경고/알림 항목

- 특정 모델 공급자 연결 실패
- Browser 세션 생성 실패 급증
- Computer 노드 포화 상태
- 사용량 급증
- 외부 검색 API quota 초과
- 파이프라인/함수 오류

---

## 9. Users & Groups

OpenWebUI의 사용자/그룹 관리 기능은 우리 시스템에서도 핵심 축이다.

### 사용자 관리

- 사용자 목록
- 사용자 추가
- 사용자 편집
- 사용자 삭제/비활성화
- 역할 변경
- 마지막 활동 시점 확인
- 사용자별 채팅/실행 기록 확인

### 그룹 관리

- 그룹 생성/수정/삭제
- 그룹 기본 모델 설정
- 그룹별 권한 매트릭스 설정
- 그룹별 공유 권한 설정
- 그룹별 도구/검색/이미지/코드 실행 권한 설정

### 그룹 권한 예시

- 모델 접근
- 모델 import/export
- 프롬프트/문서/도구/스킬 접근
- 공유 및 public sharing
- 파일 업로드 / 웹 업로드
- STT / TTS / 코드 실행 / 이미지 생성 / Web Search
- 임시 채팅 허용 여부
- API Key 허용 여부

---

## 10. Analytics

### 목적

- 운영 및 제품 사용 패턴 분석
- 모델, 사용자, 팀, 실행형 기능의 사용량 가시화

### OpenWebUI 계열 분석 항목

- 메시지 수
- 토큰 수
- 채팅 수
- 사용자 수
- 모델 사용량
- 사용자 활동
- 기간 필터(24h, 7d, 30d, 90d, all time)

### 우리 플랫폼 확장 항목

- Computer runtime
- Browser runtime
- 프로젝트별 실행 횟수
- 에이전트 실행 성공률
- 브라우저 테스트 성공률
- 플랜별 사용량 및 업그레이드 가능성
- 팀별 사용량

---

## 11. Evaluations

### 목적

- 모델 성능과 사용자 피드백을 운영 차원에서 관리

### 기본 기능

- Feedback 관리
- Leaderboard 관리
- Arena model 설정
- 평가 데이터 조회

### 확장 기능

- 작업 모드별 평가(대화/리서치/개발/테스트)
- 모델별 테스트 성공률 비교
- 브라우저 기반 task completion 평가

---

## 12. Functions

OpenWebUI의 Functions는 우리 시스템에서 매우 중요하다. 다만 우리 플랫폼에서는 함수가 단순 툴 확장이 아니라 에이전트 실행 능력과 맞물린다.

### 기본 기능

- Function 생성/수정/삭제
- Import / Export
- Clone
- Enable / Disable
- Global on/off
- Valves / Manifest 설정

### 보안 요구사항

- 함수는 arbitrary code execution 가능성이 있으므로 강한 경고 필요
- 설치 출처 검증 필요
- 함수별 권한 범위 표시 필요
- 함수 사용 이력 및 실패 로그 확인 가능해야 함

---

## 13. Settings 상세 정의

### 13.1 General

#### OpenWebUI 호환 항목

- 버전 및 업데이트 확인
- 라이선스 활성화
- 관리자 연락 이메일
- Pending overlay 설정
- API endpoint 제한
- 커뮤니티 공유
- 메시지 평가
- 폴더, 노트, 채널, 메모리, 사용자 웹훅, 사용자 상태
- 응답 워터마크
- WebUI URL
- Webhook URL
- 배너 설정

#### 우리 시스템 확장 항목

- 서비스 브랜드명 / 로고 / 조직명
- 기본 워크스페이스 생성 정책
- 팀 생성 허용 정책
- 기본 프로젝트 템플릿 정책
- 기본 Computer 템플릿 정책

---

### 13.2 Access & Identity

이 카테고리는 OpenWebUI의 General/Users/Groups 관련 기능을 더 명시적으로 확장한 영역이다.

#### 주요 항목

- 로컬 로그인 정책
- 소셜 로그인 정책
- SSO 활성화 정책
- 허용 도메인 정책
- SSO 기반 기본 역할/기본 그룹 매핑
- 기본 사용자 역할
- 기본 그룹
- 신규 가입 허용
- 신규 가입 승인 정책
- API Key 허용 여부
- JWT 만료 시간
- LDAP 설정
- 기본 권한 프리셋
- 그룹 기반 접근 제어
- 팀 생성 권한
- 관리자 권한 위임 정책

---

### 13.3 Connections

#### OpenWebUI 호환 항목

- OpenAI API connections 관리
- Ollama API connections 관리
- Direct Connections
- Base model list cache 설정

#### 우리 시스템 확장 항목

- Anthropic 연결 관리
- Google Gemini 연결 관리
- OpenRouter 연결 관리
- 커스텀 OpenAI-compatible provider 연결 관리
- 공급자별 health check / latency / quota 상태 표시

---

### 13.4 Models

#### OpenWebUI 호환 항목

- 모델 검색
- Import / Export
- Enable / Disable
- Show / Hide
- Public / Private
- 모델 기본값 설정
- Selected Models / Pinned Models
- Prompt Suggestions
- Model Capabilities
- Model Parameters
- 모델 재정렬
- 전체 모델 리셋
- Ollama 모델 Pull / Delete / Create
- GGUF 업로드

#### 우리 시스템 확장 항목

- 모델 역할 분류
  - Chat Model
  - Coding Model
  - Reasoning Model
  - Task Model
  - Browser Agent Model
  - Evaluation Model
- 작업 모드별 기본 모델 설정
  - 대화 기본 모델
  - 추론 기본 모델
  - 리서치 기본 모델
  - 개발 기본 모델
  - 테스트 기본 모델
- reasoning effort / budget / provider support 같은 추론 파라미터 정책
- 모델별 최대 컨텍스트 / 비용 추적 / 허용 플랜 연결
- 팀별 허용 모델 범위

---

### 13.5 Documents & Retrieval

#### OpenWebUI 호환 항목

- Content extraction engine
- OCR / PDF loader mode
- External/Tika/Docling/Document Intelligence/Mistral OCR/MinerU 설정
- Text splitter
- Chunk size / overlap / minimum target
- Embedding engine / model / batch / async / concurrent
- Retrieval / Hybrid Search / Reranking / Top K / Threshold / BM25
- RAG template
- 업로드 확장자 / 최대 크기 / 최대 개수
- Google Drive / OneDrive 연동
- 업로드 디렉터리 리셋
- 벡터 스토리지 초기화 / 재인덱싱

#### 우리 시스템 확장 항목

- 프로젝트별 지식베이스 정책
- 팀 공용 지식베이스 정책
- 문서와 프로젝트 연결 규칙
- 브라우저 리서치 결과 자동 문서화 정책

---

### 13.6 Web Search

#### OpenWebUI 호환 항목

- Web Search engine 선택
- 각 공급자별 API key / URL / engine / timeout / context 설정
- Search result count
- Concurrent requests
- Domain filter list
- Full context mode
- Bypass embedding / retrieval
- Bypass web loader
- SSL verify
- Proxy trust
- Playwright WebSocket URL / timeout
- External web loader URL / key
- YouTube language / proxy

#### 우리 시스템 확장 항목

- 브라우저 리서치 허용 도메인 정책
- 금지 도메인/허용 도메인 정책
- Browser search budget 정책
- 브라우저 자동화 단계 제한
- 리서치 모드와 테스트 모드의 검색 정책 분리

---

### 13.7 Computer & Browser

이 카테고리는 OpenWebUI의 Code Execution보다 더 넓은, 우리 플랫폼 핵심 설정 영역이다.

#### 주요 항목

- Computer 세션 기본 활성화 여부
- 세션 템플릿 목록 관리
  - Node.js
  - Python
  - Java
  - Full-stack Web
- 세션 생성 정책
- 동시 세션 수 제한
- warm session 유지 시간
- 세션 idle timeout
- 세션 재개 정책
- 스토리지 마운트 정책
- 포트 공개 정책
- 브라우저 세션 기본 활성화 여부
- Chrome / Playwright / Remote Browser backend 선택
- 브라우저 녹화/스크린샷 저장 정책
- 콘솔/네트워크 로그 수집 정책
- 브라우저 제어 승인 정책
- 외부 로그인 허용 정책
- 다운로드/업로드 허용 정책
- 정책 적용 범위와 override 상태 표시

#### 상태 반영 정책

- 즉시 반영 가능한 항목
- 새 세션부터 반영되는 항목
- 인프라 재배포가 필요한 항목 구분 필요

---

### 13.8 Code Execution

#### OpenWebUI 호환 항목

- Code execution 활성화
- 실행 엔진 선택
- Jupyter URL
- Jupyter 인증 방식
- timeout
- Code Interpreter 활성화
- Code Interpreter 엔진
- Code Interpreter prompt template

#### 우리 시스템 확장 항목

- Sandbox engine 선택
- 언어별 런타임 정책
- 패키지 설치 허용 정책
- 네트워크 제한 정책
- 파일시스템 쓰기 제한 정책
- 명령 실행 승인 정책

---

### 13.9 Agents & Orchestration

OpenWebUI에는 직접적인 상위 카테고리로 강하게 드러나지 않지만, 우리 시스템에서는 반드시 독립 축이어야 한다.

#### 주요 항목

- 단일 에이전트 활성화
- 멀티에이전트 오케스트레이션 활성화
- 역할 템플릿 관리
  - Planner
  - Researcher
  - Frontend
  - Backend
  - Reviewer
  - DevOps
- 작업 승인 정책
- 브라우저 제어 허용 수준
- 파일 수정 자동 허용 수준
- 에이전트 요약 생성 정책
- 에이전트 로그 보존 기간
- 실패 후 자동 재시도 정책

---

### 13.10 Integrations

#### OpenWebUI 호환 항목

- OpenAPI compatible tool server 관리
- Terminal 서버 연결 관리
- 외부 툴 연결 관리

#### 우리 시스템 확장 항목

- GitHub / GitLab / Bitbucket 연동
- Jira / Linear / Notion / Slack 연동
- CI/CD webhook 연동
- 외부 secrets manager 연동

---

### 13.11 Interface

#### OpenWebUI 호환 항목

- Task model
- Title generation prompt
- Voice mode prompt
- Follow-up generation prompt
- Tags generation prompt
- Retrieval query generation prompt
- Web search query generation prompt
- Autocomplete generation
- Autocomplete max input length
- Image prompt generation prompt
- Tools function calling prompt
- 배너 UI

#### 우리 시스템 확장 항목

- 실행형 워크스페이스 기본 레이아웃
- 홈 화면 우선 노출 영역
- Browser/Terminal/Logs 패널 기본 배치
- 프로젝트 중심/채팅 중심 UI 모드

---

### 13.12 Audio

#### OpenWebUI 호환 항목

- STT engine
- STT model / base URL / API key
- Azure region / locale / endpoint / max speakers
- TTS engine
- TTS voice / model
- output format
- additional parameters
- response splitting

#### 우리 시스템 확장 항목

- 음성 명령 기반 agent start 정책
- voice mode와 browser session 연결 정책

---

### 13.13 Images

#### OpenWebUI 호환 항목

- Create / Edit image 활성화
- 기본 이미지 모델
- image size / steps
- 엔진 선택(OpenAI, ComfyUI, Automatic1111, Gemini)
- API URL / key / version
- additional parameters
- ComfyUI workflow / edit workflow / node mapping
- AUTOMATIC1111 auth
- Gemini endpoint method

#### 우리 시스템 확장 항목

- 프로젝트 내 이미지 자산 생성 정책
- 브라우저 테스트용 이미지 fixture 관리

---

### 13.14 Pipelines

#### OpenWebUI 호환 항목

- Pipeline 업로드
- GitHub Raw URL 설치
- Enable / Disable
- Valve 설정
- arbitrary code execution 경고

#### 우리 시스템 확장 항목

- 워크플로우 자동화 템플릿 관리
- 승인 기반 실행 흐름
- 파이프라인 실행 로그
- 파이프라인별 사용량 집계

---

### 13.15 Billing & Plans

이 카테고리는 우리 플랫폼에서 필수다.

#### 주요 항목

- 플랜 생성/수정
- 플랜별 entitlement 설정
- 좌석 수 정책
- 모델 접근 정책
- Computer/Browser 사용량 정책
- 동시 세션 한도
- 스토리지 한도
- 멀티에이전트 사용 허용 정책
- 수동 플랜 할당
- 향후 결제 연동 상태 표시
- 개인/팀/조직 범위별 entitlement 해석과 제한 사유 표시

---

### 13.16 Security & Audit

#### 주요 항목

- 관리자 액션 감사 로그
- 설정 변경 이력
- 민감값 접근 로그
- 브라우저 자동화 승인 로그
- 외부 연결 허용 목록
- IP / 도메인 제한 정책
- 세션 녹화 보존 정책
- 데이터 보존 기간
- actor / scope / correlation id / reason 기준 추적
- 승인 체인과 예외 승인 이력 확인

---

### 13.17 Database & Data Ops

#### OpenWebUI 호환 항목

- Config import/export
- 설정/데이터 export job 실행
- 설정/데이터 import job 실행
- DB/Redis/object storage health summary 조회
- 전체 채팅 export
- 사용자 export

#### 우리 시스템 확장 항목

- 프로젝트 export
- 문서 export
- 에이전트 실행 로그 export
- 브라우저 artifact export
- 업로드 최대 크기 / signed URL TTL / artifact retention 정책
- 설정 스냅샷 복원
- 데이터 유형별 lifecycle / retention 설명

---

## 14. 관리자 설정 UX 요구사항

- 모든 설정은 검색 가능해야 한다.
- 설정은 카테고리별로 분류되되, cross-search가 가능해야 한다.
- 민감값은 마스킹된 상태로 표시되어야 한다.
- 저장 전 유효성 검사를 제공해야 한다.
- 변경 후 성공/실패 피드백이 명확해야 한다.
- `즉시 반영`, `새 세션부터 반영`, `새 작업부터 반영`, `재시작 필요` 상태를 명확히 보여줘야 한다.
- OpenWebUI처럼 세세한 옵션을 지원하되, 우리 시스템에서는 더 구조화된 정보 설계를 제공해야 한다.
- 현재값이 어느 범위(`global`, `group`, `team`, `project`)에서 왔는지와 override 여부를 표시해야 한다.
- specialized override인 `plan`, `provider`, `model`도 같은 규칙으로 표시해야 한다.
- 데이터 보존과 만료 영향은 파일, artifact, 로그, snapshot 등 자산 유형별로 이해 가능해야 한다.
- 승인 필요한 정책 또는 액션은 승인 기준, 승인자, 감사 로그 연결점을 함께 보여줘야 한다.

---

## 15. 관리자 권한 레벨 초안

| 권한 레벨 | 설명 |
|---|---|
| Super Admin | bootstrap 계층을 제외한 모든 제품 운영 설정, 보안, 청구 설정 가능 |
| Platform Admin | 대부분의 운영 설정 가능, 최고 보안 항목 일부 제한 가능 |
| Support Admin | 사용자/팀 조회, 일부 수정 가능 |
| Billing Admin | 플랜, 좌석, 청구 설정 담당 |
| Security Admin | SSO, 감사, 접근 제어 담당 |

---

## 16. MVP 우선순위

### MVP에 반드시 포함

- Dashboard
- Users & Groups
- Settings Hub / Search
- Connections
- Models
- Computer & Browser
- Billing & Plans 기본 구조
- Database & Data Ops 기본

### MVP에서 설정 골격 또는 기본 카테고리로 포함

- Documents & Retrieval 기본 설정
- Web Search 기본 설정
- Code Execution
- Interface

### v1에 고도화

- Analytics 전용 화면
- Evaluations
- Functions
- Security & Audit 고도화
- Orchestration 정책 UI
- 세션 정책 상세화
- 고급 usage / billing 대시보드
- 설정 snapshot 생성/복원 UI

---

## 17. 결론

우리 관리자 패널은 단순 설정 페이지가 아니라, **실행형 AI 개발 플랫폼 전체를 운영하는 운영 콘솔**이어야 한다.

따라서 다음 원칙을 확정한다.

- OpenWebUI 수준의 세세한 설정을 지원한다.
- 제품 운영 설정은 env가 아니라 관리자 UI에서 제어한다.
- OpenWebUI 호환 축 위에 `Computer`, `Browser`, `Agent`, `Billing`, `Security`를 추가 확장한다.
- 설정은 DB 기반, 감사 가능, 검색 가능, 권한 기반, 즉시 반영 가능한 구조를 지향한다.

---

## 18. 다음 문서 추천

1. `운영 플레이북`
2. `권한 체크 규칙 세부서`
3. `백엔드 서비스 경계 정의서`
