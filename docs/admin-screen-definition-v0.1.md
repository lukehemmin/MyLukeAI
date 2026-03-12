# 관리자 IA 및 화면 정의서 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 관리자 IA 및 화면 정의서
- **버전**: v0.1
- **목적**: 관리자 콘솔의 정보구조와 화면별 목적, 기능, 상태, 주요 컴포넌트를 정의하여 기능정의서와 디자인정의서의 기준 문서로 사용한다.
- **관련 문서**: `docs/admin-panel-spec-v0.1.md`, `docs/screen-list-definition-v0.2.md`, `docs/permission-plan-matrix-v0.1.md`, `docs/computer-browser-agent-lifecycle-v0.1.md`

---

## 2. 관리자 콘솔 정의

관리자 콘솔은 단순한 설정 페이지가 아니라, 플랫폼 전체를 운영하는 **운영 콘솔**이다.

이 콘솔은 다음 역할을 동시에 수행해야 한다.

- 사용자, 팀, 그룹, 플랜 운영
- 모델 및 연결 공급자 운영
- 문서/RAG/웹 검색/오디오/이미지 운영
- Computer, Browser, Agent, Pipeline, 실행 인프라 운영
- 보안, 감사, 데이터 내보내기, 장애 대응

운영 설정은 원칙적으로 `.env`가 아니라 관리자 UI에서 조회/수정 가능해야 하며, 부팅 필수 인프라 값만 예외적으로 deployment bootstrap 계층에 둘 수 있다.

---

## 3. 관리자 경험 원칙

- **UI-first**: 운영자가 바꾸고 싶은 설정은 관리자 UI에 있어야 한다.
- **Search-first**: 설정이 많아도 검색으로 바로 찾을 수 있어야 한다.
- **Safe-by-default**: 민감 설정은 마스킹, 검증, 확인 절차를 기본 제공해야 한다.
- **Execution-aware**: 일반 채팅 SaaS가 아니라 실행형 AI 플랫폼에 맞는 상태와 정책을 보여줘야 한다.
- **Audit-ready**: 누가 무엇을 바꿨는지 추적 가능해야 한다.
- **Scope-aware**: 현재 값이 어느 범위의 정책인지, override인지, 어디에 적용되는지 보여줘야 한다.
- **Approval-centered**: 고위험 변경과 실행은 승인 기준, 승인자, 대기 상태가 UI에서 읽혀야 한다.
- **Retention-visible**: 로그, artifact, export, snapshot의 보존 정책과 만료 영향이 숨지지 않아야 한다.
- **OpenWebUI parity**: OpenWebUI 수준의 세밀한 설정 경험을 제공해야 한다.
- **Platform-specific extension**: Computer, Browser, Agent, Billing, Security는 우리 플랫폼에 맞게 더 확장해야 한다.
- **Enterprise-readable**: 개발자가 아닌 엔터프라이즈 운영자도 감사, SSO, 권한, 정책 구조를 이해할 수 있어야 한다.

---

## 4. 관리자 정보구조(IA)

```text
Admin
- Dashboard
- Users & Groups
  - Users Overview
  - User Detail
  - Teams Overview
  - Groups Overview
  - Group Detail / Permissions
- Analytics
  - Overview
  - Model Usage
  - User Activity
  - Team Usage
  - Runtime Usage
- Evaluations
  - Feedback
  - Leaderboard
  - Arena Models
- Functions
  - Functions Overview
  - Function Create/Edit
- Settings
  - Settings Hub / Search
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

## 5. 전역 레이아웃 원칙

### 5.1 상단 바

- 관리자 섹션 제목
- 전역 검색
- 최근 변경 알림
- 현재 관리자 권한 표시
- 워크스페이스/운영 범위 전환 가능성 확보

### 5.2 좌측 1차 내비게이션

- Dashboard
- Users & Groups
- Analytics
- Evaluations
- Functions
- Settings

### 5.3 Settings 내부 2차 내비게이션

- 카테고리 목록
- 검색 결과 필터
- 최근 편집 카테고리
- 즐겨찾기 또는 고정 카테고리

### 5.4 본문 영역

- 화면 목적 설명
- 설정 섹션 카드 또는 폼 그룹
- 저장/검증/테스트 액션
- 위험한 작업은 분리된 Danger Zone

### 5.5 우측 보조 패널

- 변경 이력
- 관련 문서 링크
- 현재 값 vs 기본값 비교
- 적용 범위
- effective source / override 여부
- 승인 영향 요약
- 보존 기간 요약
- 반영 방식 안내
  - 즉시 반영
  - 새 세션부터 반영
  - 새 작업부터 반영
  - 재시작 필요

---

## 6. 공통 상호작용 패턴

### 6.1 공통 액션

- Save
- Save & Test
- Reset to Default
- Cancel Changes
- Duplicate Config
- Export Config
- View Audit Trail
- Compare Effective Policy

### 6.2 공통 필드 타입

- Toggle
- Secret Input
- Number Limit Input
- Key-Value List
- JSON Editor
- Model Selector
- Provider Selector
- Scope Selector
- Allowlist/Denylist Textarea
- Danger Action Card
- Retention Policy Editor
- Approval Matrix Editor

### 6.3 공통 상태

- 로딩
- 저장 중
- 저장 완료
- 유효성 오류
- 연결 테스트 성공/실패
- 권한 없음
- 변경사항 있음(Dirty State)
- 재시작 필요
- Scope Override Active
- Approval Required
- Retention Warning

---

## 7. 관리자 화면 목록 요약

| ID | 화면명 | 목적 |
|---|---|---|
| ADMIN-01 | Dashboard | 운영 상태를 한눈에 파악 |
| ADMIN-02-01 | Users Overview | 사용자 목록 및 상태 관리 |
| ADMIN-02-02 | User Detail | 개별 사용자 상세 조회/수정 |
| ADMIN-02-03 | Teams Overview | 팀 상태, 소유권, 플랜 적용 상태 관리 |
| ADMIN-02-04 | Groups Overview | 그룹/권한 단위 관리 |
| ADMIN-02-05 | Group Detail / Permissions | 그룹별 권한과 기본 정책 설정 |
| ADMIN-03 | Analytics Overview | 전체 사용량/활동 분석 |
| ADMIN-04 | Evaluations | 피드백/리더보드/아레나 모델 관리 |
| ADMIN-05-01 | Functions Overview | 함수 목록, 상태, 배포 관리 |
| ADMIN-05-02 | Function Editor | 함수 생성/수정/복제/배포 |
| ADMIN-06 | Settings Hub / Search | 전체 설정 카테고리 진입 허브 |
| ADMIN-07-01 | General | 전반적인 서비스 운영 기본값 |
| ADMIN-07-02 | Access & Identity | 인증, 가입, 권한, 그룹 정책 |
| ADMIN-07-03 | Connections | 외부 모델/엔진 공급자 연결 |
| ADMIN-07-04 | Models | 모델 공개/비공개/기본값/정책 |
| ADMIN-07-05 | Documents & Retrieval | 문서 처리, 임베딩, 검색, RAG 정책 |
| ADMIN-07-06 | Web Search | 검색 엔진 및 웹 로더 정책 |
| ADMIN-07-07 | Computer & Browser | Computer 세션/브라우저 실행 정책 |
| ADMIN-07-08 | Code Execution | 코드 실행 및 인터프리터 정책 |
| ADMIN-07-09 | Agents & Orchestration | 에이전트/멀티에이전트 정책 |
| ADMIN-07-10 | Integrations | 외부 툴/터미널/플랫폼 연동 |
| ADMIN-07-11 | Interface | UI/프롬프트/생성 UX 정책 |
| ADMIN-07-12 | Audio | STT/TTS 정책 |
| ADMIN-07-13 | Images | 이미지 생성/편집 정책 |
| ADMIN-07-14 | Pipelines | 파이프라인/워크플로우 설치 및 정책 |
| ADMIN-07-15 | Billing & Plans | 플랜, entitlement, 좌석, 사용량 정책 |
| ADMIN-07-16 | Security & Audit | 보안, 감사, 민감설정 보호 |
| ADMIN-07-17 | Database & Data Ops | 설정/데이터 export/import 및 복구 |

---

## 8. 화면 상세 정의

### ADMIN-01 Dashboard

#### 목적

- 플랫폼 운영 상태를 빠르게 파악
- 장애, 포화, 오류, 사용량 급증을 조기에 발견
- 실행형 AI 플랫폼답게 세션/브라우저/에이전트 지표를 우선 노출

#### 핵심 기능

- KPI 요약
- 경고 이벤트 노출
- 활성 세션 현황
- 모델 공급자 상태 확인
- 실행 큐 상태 확인

#### 주요 컴포넌트

- KPI 카드
- 오류/경고 배너
- Computer/Browser 세션 위젯
- 모델 공급자 상태 카드
- 최근 운영 이벤트 테이블

#### 상태

- 정상
- 일부 공급자 장애
- 실행 큐 포화
- 스토리지 임계치 근접
- 브라우저 세션 장애 급증

---

### ADMIN-02-01 Users Overview

#### 목적

- 전체 사용자 상태를 운영 차원에서 관리

#### 핵심 기능

- 사용자 검색
- 필터링(역할, 상태, 플랜, 최근 활동)
- 사용자 추가
- 역할 변경
- 비활성화/정지
- 사용자 채팅/실행 기록 진입

#### 주요 컴포넌트

- 검색 바
- 필터 바
- 사용자 테이블
- 일괄 액션 메뉴
- Add User 모달 진입 버튼

#### 상태

- 사용자 없음
- 검색 결과 없음
- 정지된 사용자 포함
- 다중 선택 액션 중

---

### ADMIN-02-02 User Detail

#### 목적

- 개별 사용자의 상태, 권한, 사용량, 작업 이력을 상세 조회/수정

#### 핵심 기능

- 프로필/역할 수정
- 플랜 확인
- API Key 상태 확인
- 인증/초대/SSO 상태 확인
- 최근 채팅/프로젝트/세션 보기
- 계정 정지/복구

#### 주요 컴포넌트

- 사용자 요약 카드
- 권한 카드
- 인증 상태 카드
- 사용량 카드
- 최근 활동 탭
- 위험 작업 영역
- 관련 감사 로그 진입

#### 상태

- 활성 사용자
- 대기 사용자
- 정지 사용자
- 삭제 예정 사용자

---

### ADMIN-02-03 Teams Overview

#### 목적

- 팀 상태, 소유권, 플랜 적용 상태를 운영 차원에서 관리

#### 핵심 기능

- 팀 검색
- 상태 변경
- 소유자 확인
- 좌석/플랜 상태 확인
- 팀 단위 사용량/최근 활동 진입

#### 주요 컴포넌트

- 팀 테이블
- 상태 배지
- 소유자/플랜 컬럼
- 제한/정지 액션 메뉴

#### 상태

- 활성 팀
- 좌석 부족 팀
- 정지 팀
- 소유자 미정 팀

---

### ADMIN-02-04 Groups Overview

#### 목적

- 그룹 단위 권한 및 기본 정책을 관리

#### 핵심 기능

- 그룹 목록 조회
- 그룹 생성/수정/삭제
- 기본 그룹 지정
- 그룹별 사용자 수 확인
- 그룹별 권한 상세 진입

#### 주요 컴포넌트

- 그룹 테이블
- 그룹 생성 버튼
- 기본 그룹 배지
- 권한 요약 컬럼

---

### ADMIN-02-05 Group Detail / Permissions

#### 목적

- 그룹별 접근 권한과 기본 모델/기능 정책을 세밀하게 설정

#### 핵심 기능

- 기본 모델 설정
- 모델 접근 제어
- 공유 권한 제어
- 파일 업로드/Web 업로드 권한
- Web Search/Image/Code Interpreter/STT/TTS 권한
- 임시 채팅/API Key 허용 여부 설정
- 상속 정책과 override 상태 확인

#### 주요 컴포넌트

- 권한 매트릭스
- 모델 선택기
- 기능 토글 리스트
- 기본 정책 카드
- effective policy 요약 패널

#### 상태

- 시스템 기본 그룹
- 커스텀 그룹
- 읽기 전용 정책 그룹

---

### ADMIN-03 Analytics Overview

#### 목적

- 플랫폼 사용 패턴과 비용 요인을 분석

#### 핵심 기능

- 기간 필터
- 메시지/토큰/채팅/사용자 지표
- 모델 사용량 분석
- 사용자 활동 분석
- 팀/프로젝트/런타임 분석

#### 주요 컴포넌트

- 기간 세그먼트 컨트롤
- 라인/바 차트
- 모델 사용량 테이블
- 사용자 활동 테이블
- 실행형 기능 usage 카드

#### 상태

- 데이터 없음
- 지연 로딩
- 샘플링 안내

---

### ADMIN-04 Evaluations

#### 목적

- 모델 평가와 사용자 피드백 데이터를 운영 관점에서 관리

#### 핵심 기능

- Feedback 조회
- Leaderboard 확인
- Arena model 설정
- 평가 대상 모델 포함/제외 설정

#### 주요 컴포넌트

- 탭 전환(Feedback/Leaderboard/Arena)
- 평가 테이블
- Arena model 관리 모달

---

### ADMIN-05-01 Functions Overview

#### 목적

- 함수/툴 확장 기능을 운영 차원에서 관리

#### 핵심 기능

- 함수 검색/필터
- Import / Export
- Enable / Disable
- Global on/off
- 함수 상태와 소유자 확인
- 함수 생성 진입

#### 주요 컴포넌트

- 검색 바
- 필터 칩
- 함수 목록 카드/테이블
- 상태 스위치
- Import/Export 버튼

#### 상태

- 함수 없음
- 검색 결과 없음
- 비활성 함수 다수
- 위험 함수 경고

---

### ADMIN-05-02 Function Editor

#### 목적

- 함수 생성, 수정, 복제, 설정 검증

#### 핵심 기능

- 코드 편집
- Manifest 편집
- Valves 설정
- 테스트 실행
- 함수 삭제

#### 주요 컴포넌트

- 코드 에디터
- 메타데이터 폼
- Manifest 패널
- Valves 모달
- 저장/테스트 바

#### 상태

- 신규 생성
- 수정 중
- 저장되지 않음
- 테스트 실패

---

### ADMIN-06 Settings Hub / Search

#### 목적

- 방대한 설정 카테고리의 허브 역할 수행

#### 핵심 기능

- 카테고리 탐색
- 설정 검색
- 최근 편집 항목 표시
- 위험 카테고리 강조
- 보안/감사/승인 영향이 큰 카테고리 우선 노출

#### 주요 컴포넌트

- 검색 입력
- 카테고리 카드
- 최근 변경 목록
- 추천/즐겨찾기 섹션
- 위험/엔터프라이즈 카테고리 강조 영역

---

## 9. Settings 공통 화면 구조

모든 Settings 하위 화면은 동일한 구조를 따른다.

### 공통 구조

- 상단: 제목, 설명, 검색, 저장 상태
- 본문: 섹션별 카드
- 하단 또는 우측 고정 바: Save / Test / Reset
- 보조 패널: 적용 범위, 반영 방식, 변경 이력, 보존/승인 요약

### 공통 UX 요소

- Secret field 마스킹
- Test Connection 버튼
- JSON 유효성 검사
- 기본값 복원
- 변경 diff 미리보기
- Danger Zone 분리
- effective source / override 표시
- retention badge 또는 lifecycle 설명
- approval impact hint

---

## 10. Settings 카테고리 상세 정의

### ADMIN-07-01 General

#### 목적

- 서비스 운영의 전반적인 기본값과 공개 동작을 관리

#### 핵심 기능

- 버전/업데이트 확인
- 라이선스 활성화
- 관리자 연락 이메일 설정
- Pending overlay 제목/내용 설정
- 커뮤니티 공유/메시지 평가/폴더/노트/채널/메모리/웹훅/유저 상태 설정
- Response watermark
- WebUI URL / Webhook URL
- Banner 관리

#### 주요 컴포넌트

- 서비스 메타 카드
- 브랜드/기본값 카드
- 공개 동작 카드
- 배너 관리 섹션
- Feature 토글 리스트

---

### ADMIN-07-02 Access & Identity

#### 목적

- 인증 및 권한 체계를 명확히 운영

#### 핵심 기능

- 로그인 방식 제어
- 소셜 로그인 제어
- SSO 정책 설정
- 허용 도메인 및 조직 로그인 정책 설정
- SSO 기반 기본 역할/기본 그룹 매핑
- 기본 사용자 역할 설정
- 기본 그룹 설정
- 신규 가입 허용 여부 설정
- 신규 가입 승인 정책
- API Key 허용/제한 설정
- JWT 만료 설정
- LDAP 연결 설정
- 기본 권한 프리셋 지정
- 관리자 권한 위임 정책
- 팀 생성 권한 제어

#### 주요 컴포넌트

- 인증 방식 토글 그룹
- 가입 정책 카드
- API / Token 정책 카드
- LDAP / SSO 설정 카드
- 도메인/역할 매핑 섹션
- 권한 위임 섹션
- 팀 생성 정책 섹션

---

### ADMIN-07-03 Connections

#### 목적

- 외부 모델 공급자 및 엔진 연결을 운영

#### 핵심 기능

- OpenAI API 연결 관리
- Ollama API 연결 관리
- Anthropic 연결 관리
- Gemini 연결 관리
- OpenRouter 및 OpenAI-compatible 연결 관리
- Direct Connections 설정
- Base model list cache 설정
- 연결 상태 테스트

#### 주요 컴포넌트

- 공급자 목록 카드
- 연결 상세 폼
- Secret 입력 필드
- Health check 상태 배지
- Test Connection 버튼

#### 상태

- 연결 정상
- 자격 증명 오류
- 네트워크 오류
- 부분 연결 상태

---

### ADMIN-07-04 Models

#### 목적

- 모델 가시성, 기본값, 정책, 작업 역할을 관리

#### 핵심 기능

- 모델 검색/필터
- Import / Export
- Enable / Disable
- Show / Hide
- Public / Private
- 기본 모델 설정
- Selected/Pinned Models 설정
- Prompt Suggestions 관리
- Model capabilities / parameters 설정
- 모델 순서 재배치
- Ollama pull/delete/create
- GGUF 업로드
- 전체 모델 리셋

#### 우리 플랫폼 추가 기능

- 대화/추론/리서치/개발/테스트 기본 모델 분리
- Reasoning model 지정
- Browser Agent model 지정
- Evaluation model 지정
- reasoning effort / provider support / disabled reason 표시
- 플랜별 허용 모델 연결

#### 주요 컴포넌트

- 모델 데이터 테이블
- 관리 모달
- 역할 배지
- 정책 패널
- 기본값 섹션

---

### ADMIN-07-05 Documents & Retrieval

#### 목적

- 문서 처리, OCR, 임베딩, 검색, RAG 정책을 관리

#### 핵심 기능

- Content extraction engine 선택
- PDF OCR / Loader mode 설정
- External/Tika/Docling/Document Intelligence/Mistral OCR/MinerU 설정
- Text splitter 및 chunk 정책 설정
- Embedding engine/model/batch/async/concurrent 설정
- Retrieval / Hybrid / Reranking / Threshold / Top K 설정
- 업로드 확장자/크기/개수 제한
- Google Drive / OneDrive 연동
- 업로드/벡터 저장소 재설정 및 재인덱싱

#### 주요 컴포넌트

- 처리 엔진 카드
- OCR 파라미터 폼
- Embedding 설정 그룹
- Retrieval 설정 그룹
- 파일 업로드 정책 그룹
- Danger Zone

---

### ADMIN-07-06 Web Search

#### 목적

- 검색 엔진, 웹 로더, 브라우저 기반 검색 정책을 제어

#### 핵심 기능

- Web Search engine 선택
- 공급자별 API Key/URL/엔진 설정
- Result count / concurrent request 설정
- Domain filter list 설정
- Full context / bypass 옵션 설정
- Web loader engine 선택
- SSL / proxy / Playwright 설정
- External loader 설정
- YouTube / proxy 관련 설정

#### 우리 플랫폼 추가 기능

- 허용/금지 도메인 정책
- 브라우저 리서치 예산 정책
- 테스트 모드와 검색 모드 분리 정책

#### 주요 컴포넌트

- 엔진 선택 카드
- 공급자별 접이식 설정 폼
- allowlist / denylist 텍스트에어리어
- Playwright 정책 카드

---

### ADMIN-07-07 Computer & Browser

#### 목적

- Computer 세션과 브라우저 세션의 생성, 복원, 제어 정책을 운영

#### 핵심 기능

- Computer 세션 활성화
- 세션 템플릿 관리
- 동시 세션 수 제한
- idle timeout / warm 유지 시간 설정
- 세션 재개 정책
- 포트 노출 정책
- Browser 세션 활성화
- 브라우저 백엔드 선택
- 브라우저 녹화/스크린샷 보존 정책
- 브라우저 제어 승인 정책
- 외부 로그인 허용 정책
- 업로드/다운로드 허용 정책
- policy scope / override 상태 확인

#### 주요 컴포넌트

- 세션 정책 카드
- 템플릿 리스트
- 브라우저 정책 토글 그룹
- 보존 정책 카드
- 승인 정책 섹션
- effective policy / scope 요약 패널

#### 상태

- 즉시 반영 가능
- 새 세션부터 반영
- 인프라 재배포 필요

---

### ADMIN-07-08 Code Execution

#### 목적

- 코드 실행과 인터프리터 정책을 제어

#### 핵심 기능

- Code execution 활성화
- 엔진 선택
- Jupyter URL 및 인증 설정
- timeout 설정
- Code Interpreter 활성화
- Code Interpreter 엔진 및 prompt template 설정
- 패키지 설치 허용 정책
- 네트워크 접근 정책
- 파일시스템 쓰기 정책

#### 주요 컴포넌트

- 실행 엔진 카드
- Jupyter 연결 폼
- timeout 입력
- 인터프리터 템플릿 에디터
- Sandbox 정책 카드

---

### ADMIN-07-09 Agents & Orchestration

#### 목적

- 에이전트와 멀티에이전트 오케스트레이션 정책을 운영

#### 핵심 기능

- 단일 에이전트 활성화
- 멀티에이전트 활성화
- 역할 템플릿 관리
- 작업 승인 정책
- 브라우저 제어 허용 수준
- 파일 변경 자동 허용 수준
- 에이전트 로그 보존 정책
- 재시도 정책
- 정책 적용 범위와 승인 영향 확인

#### 주요 컴포넌트

- 역할 템플릿 테이블
- 승인 정책 매트릭스
- 자동화 수준 세그먼트
- 로그 보존 카드
- scope / override 요약 패널

---

### ADMIN-07-10 Integrations

#### 목적

- 외부 툴, 서버, 개발 플랫폼 연동을 운영

#### 핵심 기능

- OpenAPI compatible tool server 관리
- Terminal server 관리
- GitHub / GitLab / Bitbucket 연동
- Jira / Linear / Notion / Slack 연동
- Webhook 및 CI/CD 연동

#### 주요 컴포넌트

- 연결 목록 카드
- Add Connection 모달
- 인증 방식 폼
- 상태 배지

---

### ADMIN-07-11 Interface

#### 목적

- 제품의 인터페이스 동작과 생성 UX를 제어

#### 핵심 기능

- Task model 설정
- Title/Follow-up/Tags/Query/Image prompt 설정
- Voice mode prompt 설정
- Autocomplete generation on/off 및 길이 제한 설정
- Tools function calling prompt 설정
- 실행형 워크스페이스 기본 레이아웃 설정
- Browser/Terminal/Logs 기본 패널 배치 설정

#### 주요 컴포넌트

- Prompt template 에디터
- 모델 선택기
- 토글/숫자 설정 카드
- 레이아웃 프리셋 선택기

---

### ADMIN-07-12 Audio

#### 목적

- STT/TTS 공급자와 음성 입력/출력 정책을 관리

#### 핵심 기능

- STT engine 선택
- STT model / API key / URL 설정
- Azure region / locale / endpoint / max speakers 설정
- TTS engine / voice / model 설정
- output format / split 정책 설정
- 추가 파라미터 JSON 설정

#### 주요 컴포넌트

- STT 설정 카드
- TTS 설정 카드
- 고급 파라미터 JSON 에디터
- 샘플 테스트 영역

---

### ADMIN-07-13 Images

#### 목적

- 이미지 생성/편집 기능과 공급자 연결을 운영

#### 핵심 기능

- Create/Edit image 정책 설정
- 기본 이미지 모델 설정
- image size / steps 기본값 설정
- OpenAI/ComfyUI/AUTOMATIC1111/Gemini 엔진 설정
- workflow / node mapping 설정
- 추가 파라미터 JSON 설정

#### 주요 컴포넌트

- 엔진 선택 카드
- 워크플로우 에디터
- 노드 매핑 테이블
- 파라미터 폼

---

### ADMIN-07-14 Pipelines

#### 목적

- 파이프라인/워크플로우 설치와 실행 정책을 운영

#### 핵심 기능

- 파일 업로드 설치
- GitHub Raw URL 설치
- Enable / Disable
- Valve 설정
- 위험 경고 표시
- 파이프라인 로그 확인
- 워크플로우 자동화 템플릿 관리

#### 주요 컴포넌트

- 업로드 영역
- URL 설치 폼
- Pipeline 리스트
- Valve 설정 패널
- Danger 경고 배너

---

### ADMIN-07-15 Billing & Plans

#### 목적

- 플랜, entitlement, 사용량 제한, 좌석 정책을 운영

#### 핵심 기능

- 플랜 생성/수정
- 플랜별 기능 on/off
- 모델 접근 정책 설정
- Computer/Browser/Agent 한도 설정
- 좌석 정책 설정
- 스토리지/동시 세션 한도 설정
- 수동 플랜 할당
- 향후 결제 연동 상태 확인
- 플랜별 정책 적용 범위와 제한 사유 확인

#### 주요 컴포넌트

- 플랜 카드 리스트
- entitlement 매트릭스
- usage policy 폼
- 팀/사용자 할당 패널
- effective entitlement 요약 패널

---

### ADMIN-07-16 Security & Audit

#### 목적

- 보안 정책과 감사 로그를 운영

#### 핵심 기능

- 관리자 액션 감사 로그 확인
- 설정 변경 이력 확인
- 민감값 접근 이력 확인
- 브라우저 자동화 승인 로그 확인
- IP/도메인 제한 정책 설정
- 데이터 보존 기간 설정
- 시크릿 접근 정책 설정
- correlation id 기준 추적
- 정책 적용 범위별 필터링
- 승인 체인 확인

#### 주요 컴포넌트

- 감사 로그 테이블
- 필터 바
- 보존 정책 카드
- 접근 제어 정책 카드
- 승인 추적 패널
- 범위/actor/correlation 메타 패널

---

### ADMIN-07-17 Database & Data Ops

#### 목적

- 설정과 주요 데이터를 백업/이관/복구 가능하게 운영

#### 핵심 기능

- Config import/export
- DB 상태/health summary 확인
- Redis 상태/health summary 확인
- object storage 상태/기본 provider/보존 정책 summary 확인
- 전체 채팅 export
- 사용자 export
- 프로젝트 export
- 문서 export
- 에이전트 로그 export
- 브라우저 artifact export
- 설정 스냅샷 목록/복원은 v1 또는 운영 고도화 단계에서 노출
- 업로드 최대 크기 / signed URL TTL 설정
- artifact 보존 기간 / export prefix 정책 설정
- 데이터 유형별 lifecycle / retention 확인

#### 주요 컴포넌트

- export 액션 카드
- import 드롭존
- storage policy 카드
- infra health 패널
- 백업 이력 리스트
- 복원 확인 모달
- retention / lifecycle 요약 테이블

---

## 11. 관리자 화면별 공통 상태 정의

### 기본 상태

- Empty
- Loading
- Error
- Forbidden
- Dirty
- Save Success
- Save Failed

### 설정 화면 추가 상태

- Validation Error
- Secret Hidden
- Secret Updated
- Test Connection Success
- Test Connection Failed
- Restart Required

### 실행형 플랫폼 특화 상태

- Provider Degraded
- Browser Backend Unavailable
- Execution Queue Saturated
- Runtime Policy Conflict
- Plan Restriction Applied
- Approval Required
- Scope Override Active
- Retention Window Changed

---

## 12. 디자인정의서로 넘길 핵심 포인트

- 설정이 많아도 복잡해 보이기만 해서는 안 되며, `검색 가능하고 구조화된 콘솔`처럼 보여야 한다.
- 민감 설정은 항상 일반 설정과 구분된 시각 계층을 가져야 한다.
- Danger Zone은 충분히 분리하고 경고 강도를 높여야 한다.
- 실행형 플랫폼 특성상 `Computer`, `Browser`, `Agent` 관련 설정은 일반 SaaS 설정보다 더 중요한 영역으로 보여야 한다.
- OpenWebUI 같은 세세함은 유지하되, 더 읽기 쉬운 그룹화와 적용 범위 안내가 필요하다.
- 저장 버튼만 있는 단순 폼이 아니라, `테스트`, `검증`, `반영 방식`, `감사`, `복원` 개념이 함께 보여야 한다.

---

## 13. 비고

- 본 문서는 관리자 화면 기준의 초안이며, 실제 필드 단위 명세는 `docs/admin-settings-data-model-v0.1.md`, `docs/admin-settings-api-contract-v0.1.md`에서 더 세분화한다.
- OpenWebUI 호환을 목표로 하되, 우리 플랫폼은 실행형 AI 개발 플랫폼이므로 `Computer`, `Browser`, `Agent`, `Billing`, `Security` 축이 더 중요하다.
- 관리자 설정은 env보다 우선하는 운영 채널로 설계해야 한다.

---

## 14. 다음 문서 추천

1. `운영 플레이북`
2. `권한 체크 규칙 세부서`
3. `프론트엔드 상태관리 구조서`
