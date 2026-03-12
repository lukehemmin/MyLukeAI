# 핵심 API 우선순위 문서 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 핵심 API 우선순위 문서
- **버전**: v0.1
- **목적**: MVP 구현 시 어떤 API를 먼저 만들고, 어떤 API를 뒤로 미뤄도 되는지 우선순위를 정의한다.
- **관련 문서**: `docs/domain-model-erd-v0.1.md`, `docs/execution-infra-api-definition-v0.1.md`, `docs/admin-settings-data-model-v0.1.md`, `docs/permission-plan-matrix-v0.1.md`, `docs/file-attachment-api-definition-v0.1.md`

---

## 2. 문서 목적

이 문서는 `문서상 필요한 API`와 `지금 당장 만들어야 하는 API`를 구분하기 위한 문서다.

핵심 목표는 다음과 같다.

- MVP를 위해 꼭 필요한 API를 식별한다.
- 실행형 플랫폼의 `최소 작동 vertical slice`를 정의한다.
- 백엔드, 프론트엔드, 실행 인프라 팀이 같은 우선순위를 공유할 수 있게 한다.

---

## 3. 우선순위 기준

API 우선순위는 다음 기준으로 판단한다.

- 사용자가 실제 가치를 체감하는가
- 다른 많은 기능의 선행 조건인가
- 실행형 플랫폼의 차별점과 직접 연결되는가
- 관리자 없이도 기본 운용이 가능한 최소 구조를 만드는가
- 엔터프라이즈에서 요구하는 감사, 승인, 권한, 보존 가시성을 너무 늦게 밀어두지 않는가

### 우선순위 레벨

| 레벨 | 의미 |
|---|---|
| `P0` | 없으면 MVP가 성립하지 않음 |
| `P1` | MVP 경험을 완성하는 핵심 보강 API |
| `P2` | 운영 효율/상용화/고도화에 중요하지만 초기 출시 필수는 아님 |

---

## 4. MVP Vertical Slice 정의

가장 먼저 성립해야 할 최소 사용자 흐름은 아래다.

1. 로그인
2. 개인 워크스페이스 진입
3. 프로젝트 생성
4. 모델 선택 후 채팅 시작
5. Computer + Browser 세션 생성
6. AI 또는 사용자 요청으로 작업 실행
7. 로그/브라우저/결과 확인
8. 결과를 프로젝트/문서에 저장

이 흐름에 필요한 API는 대부분 `P0` 또는 `P1`로 본다.

---

## 5. API 도메인별 우선순위

| 도메인 | 우선순위 | 이유 |
|---|---|---|
| 인증/세션 | P0 | 서비스 진입의 선행 조건 |
| 워크스페이스/프로젝트 | P0 | 자산 소유와 작업 중심 구조의 핵심 |
| 모델/연결 | P0 | 채팅과 에이전트 실행의 필수 조건 |
| 채팅/메시지 | P0 | 제품 입구 |
| Computer 세션 | P0 | 제품 차별점 핵심 |
| Browser 세션 | P0 | 브라우저 검증이 MVP 핵심 흐름에 직접 포함됨 |
| Agent 실행 | P1 | 실행 자동화 핵심 |
| Documents | P1 | 결과 저장과 협업 가치 강화 |
| Usage/Plan enforcement | P1 | 사용량 제어와 상용화 준비 |
| Admin settings core | P1 | 부팅 필수 infra secret 외 운영 설정을 UI 중심으로 관리하기 위한 최소 조건 |
| Audit log | P1 | 관리자 운영과 변경 추적의 기본 신뢰성 축 |
| Evaluations | P2 | 제품 품질 고도화 영역 |
| Functions/Pipelines | P2 | 확장성은 크지만 MVP 필수는 아님 |

---

## 6. P0 API 목록

### 6.1 인증 / 사용자

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/me`

#### 이유

- 기본 진입 경로 확보
- 워크스페이스/프로젝트 권한 계산의 출발점

### 6.2 워크스페이스 / 프로젝트

- `GET /api/workspaces`
- `POST /api/workspaces`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/{projectId}`
- `PATCH /api/projects/{projectId}`

#### 이유

- 실행형 작업은 프로젝트가 중심이므로 초기부터 필요

### 6.3 모델 / 연결

- `GET /api/models`
- `GET /api/models/{id}`
- `GET /api/model-providers/health`

#### 이유

- 대화와 실행의 시작점
- `GET /api/models` 계열 응답에 reasoning capability와 disabled reason이 빠지면 채팅/에이전트 UI에서 추론 지원 여부가 계속 해제된 것처럼 보일 수 있다.

### 6.4 채팅 / 메시지

- `GET /api/chat/threads`
- `POST /api/chat/threads`
- `GET /api/chat/threads/{threadId}`
- `POST /api/chat/threads/{threadId}/messages`
- `GET /api/chat/threads/{threadId}/stream`

#### 이유

- 사용자 입구이자 세션 생성 트리거 역할

### 6.5 실행 세션

- `POST /api/projects/{projectId}/sessions`
- `GET /api/projects/{projectId}/sessions`
- `GET /api/sessions/{sessionId}`
- `POST /api/sessions/{sessionId}/resume`
- `POST /api/sessions/{sessionId}/stop`
- `POST /api/sessions/{sessionId}/terminate`
- `GET /api/sessions/{sessionId}/events`
- `GET /api/sessions/{sessionId}/logs`
- `GET /api/sessions/{sessionId}/artifacts`
- `GET /api/sessions/{sessionId}/ports`
- `GET /api/sessions/{sessionId}/stream`

#### 이유

- 제품 차별점의 핵심 vertical slice

### 6.6 Browser

- `GET /api/sessions/{sessionId}/browser`
- `POST /api/sessions/{sessionId}/browser/live-view-token`
- `GET /api/sessions/{sessionId}/browser/actions`
- `POST /api/sessions/{sessionId}/browser/restart`

#### 이유

- 브라우저 기반 검증은 MVP 핵심 경험이므로 P0에 포함

---

## 7. P1 API 목록

### 7.1 Auth Recovery / Invitation

- `GET /api/auth/password/reset/{token}`
- `GET /api/auth/invitations/{token}`
- `POST /api/auth/invitations/{token}/accept`
- `POST /api/auth/invitations/{token}/decline`
- `POST /api/auth/password/forgot`
- `POST /api/auth/password/reset`

### 7.2 Home Dashboard

- `GET /api/dashboard/home`
- `GET /api/dashboard/home/stream`

### 7.3 Agent

- `GET /api/agent-templates`
- `GET /api/agent-runs`
- `POST /api/agent-runs`
- `GET /api/agent-runs/{agentRunId}`
- `GET /api/agent-runs/{agentRunId}/stream`
- `POST /api/agent-runs/{agentRunId}/cancel`
- `GET /api/agent-runs/{agentRunId}/artifacts`

### 7.4 Documents

- `GET /api/documents`
- `POST /api/documents`
- `GET /api/documents/{documentId}`
- `PATCH /api/documents/{documentId}`
- `PUT /api/documents/{documentId}/sharing`
- `POST /api/documents/{documentId}/versions`
- `GET /api/documents/{documentId}/versions`
- `GET /api/comments`
- `POST /api/comments`

### 7.5 Approvals

- `GET /api/projects/{projectId}/approvals`
- `POST /api/approvals/{approvalId}`

### 7.6 Runtime Aggregation

- `GET /api/projects/{projectId}/runtime-stream`

### 7.7 Usage / Plan

- `GET /api/usage/me`
- `GET /api/usage/workspaces/{workspaceId}`
- `GET /api/plans/me`
- `GET /api/plans/workspaces/{workspaceId}`
- `GET /api/seats/workspaces/{workspaceId}`

### 7.8 Team Collaboration

- `GET /api/teams/{teamId}`
- `PATCH /api/teams/{teamId}`
- `GET /api/teams/{teamId}/members`
- `GET /api/teams/{teamId}/invites`
- `GET /api/teams/{teamId}/roles`
- `POST /api/teams/{teamId}/invites`
- `PATCH /api/teams/{teamId}/members/{memberId}`
- `DELETE /api/teams/{teamId}/members/{memberId}`

### 7.9 Admin Users / Groups

- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/{userId}`
- `PATCH /api/admin/users/{userId}/role`
- `POST /api/admin/users/{userId}/suspend`
- `POST /api/admin/users/{userId}/reactivate`
- `GET /api/admin/teams`
- `PATCH /api/admin/teams/{teamId}`
- `GET /api/admin/groups`
- `POST /api/admin/groups`
- `PATCH /api/admin/groups/{groupId}`
- `DELETE /api/admin/groups/{groupId}`
- `GET /api/admin/groups/{groupId}/policy`
- `PUT /api/admin/groups/{groupId}/policy`
- `POST /api/admin/groups/{groupId}/policy/validate`

### 7.10 Admin Dashboard / Runtime

- `GET /api/admin/dashboard`
- `GET /api/admin/provider-connections/health`
- `GET /api/admin/runtime/overview`
- 선택적 `GET /api/admin/runtime/stream`

### 7.11 관리자 최소 설정 / 리소스

- `GET /api/admin/settings/categories`
- `GET /api/admin/settings/recent`
- `GET /api/admin/settings/history`
- `GET /api/admin/settings/search?q=...`
- `GET /api/admin/settings/{categoryKey}?scopeType=global&scopeId=global`
- `PUT /api/admin/settings/{categoryKey}`
- `PATCH /api/admin/settings/{categoryKey}/{fieldKey}`
- `POST /api/admin/settings/{categoryKey}/validate`
- `POST /api/admin/settings/{categoryKey}/test`
- `POST /api/admin/settings/{categoryKey}/reset`
- `GET /api/admin/settings/approval-requests`
- `POST /api/admin/settings/approval-requests/{requestId}/approve`
- `POST /api/admin/settings/approval-requests/{requestId}/reject`
- `GET /api/admin/provider-connections`
- `POST /api/admin/provider-connections`
- `PATCH /api/admin/provider-connections/{id}`
- `POST /api/admin/provider-connections/{id}/test`
- `GET /api/admin/models`
- `POST /api/admin/models/import`
- `POST /api/admin/models/export`
- `PATCH /api/admin/models/{id}`
- `POST /api/admin/models/{id}/enable`
- `POST /api/admin/models/{id}/disable`
- `POST /api/admin/models/{id}/show`
- `POST /api/admin/models/{id}/hide`
- `GET /api/admin/execution-templates`
- `POST /api/admin/execution-templates`
- `PATCH /api/admin/execution-templates/{id}`
- `POST /api/admin/execution-templates/{id}/validate`
- `GET /api/admin/browser-policy-profiles`
- `POST /api/admin/browser-policy-profiles`
- `PATCH /api/admin/browser-policy-profiles/{id}`
- `POST /api/admin/browser-policy-profiles/{id}/validate`

### 7.12 Admin Audit

- `GET /api/admin/audit-logs`
- `GET /api/admin/audit-logs/{auditLogId}`
- `POST /api/admin/audit-logs/export`

### 7.13 Admin Billing / Manual Plan Ops

- `GET /api/admin/plans`
- `POST /api/admin/plans`
- `PATCH /api/admin/plans/{id}`
- `GET /api/admin/plans/{id}/entitlements`
- `PUT /api/admin/plans/{id}/entitlements`
- `POST /api/admin/users/{userId}/assign-plan`
- `POST /api/admin/teams/{teamId}/assign-plan`

### 7.14 Files / Attachments

- `GET /api/files`
- `POST /api/files/upload-intents`
- `POST /api/files/{fileId}/complete`
- `GET /api/files/{fileId}`
- `POST /api/files/{fileId}/download-url`
- `POST /api/attachments`
- `DELETE /api/attachments/{attachmentId}`
- `POST /api/sessions/{sessionId}/artifacts/{artifactId}/download-url`
- `POST /api/sessions/{sessionId}/artifacts/{artifactId}/save-as-file`
- `POST /api/agent-runs/{agentRunId}/artifacts/{artifactId}/download-url`
- `POST /api/agent-runs/{agentRunId}/artifacts/{artifactId}/save-as-file`

비고:

- `save-as-file`는 execution flow에서 호출되지만 결과적으로 `file_asset`과 `attachment`를 생성/갱신하는 file domain 승격 API로 본다.

---

## 8. P2 API 목록

### 8.1 Admin Analytics

- `GET /api/admin/analytics/overview`
- `GET /api/admin/analytics/model-usage`
- `GET /api/admin/analytics/user-activity`
- `GET /api/admin/analytics/runtime-usage`

### 8.2 Admin Evaluations

- `GET /api/admin/evaluations/feedback`
- `GET /api/admin/evaluations/leaderboard`
- `GET /api/admin/evaluations/arena-models`
- `POST /api/admin/evaluations/arena-models`
- `PATCH /api/admin/evaluations/arena-models/{id}`

### 8.3 Settings History / Snapshot / Data Ops

- `GET /api/admin/settings/snapshots`
- `POST /api/admin/settings/snapshots`
- `POST /api/admin/settings/snapshots/{snapshotId}/restore`
- `POST /api/admin/settings/export`
- `POST /api/admin/settings/import`
- `GET /api/admin/data-exports`
- `POST /api/admin/data-exports`
- `POST /api/admin/data-imports`

### 8.4 확장성 기능

- `GET /api/admin/functions`
- `POST /api/admin/functions`
- `PATCH /api/admin/functions/{id}`
- `DELETE /api/admin/functions/{id}`
- `POST /api/admin/functions/{id}/clone`
- `POST /api/admin/functions/{id}/test`
- `POST /api/admin/functions/{id}/enable`
- `POST /api/admin/functions/{id}/disable`
- `POST /api/admin/functions/import`
- `POST /api/admin/functions/export`
- `GET /api/admin/pipelines`
- `POST /api/admin/pipelines/upload`
- `POST /api/admin/pipelines/install-from-url`
- `PATCH /api/admin/pipelines/{id}`
- `POST /api/admin/pipelines/{id}/enable`
- `POST /api/admin/pipelines/{id}/disable`
- `GET /api/admin/pipelines/{id}/logs`

---

## 9. 가장 먼저 구현할 API 배치

실제로는 아래 순서가 가장 좋다.

### Batch 1

- auth
- me
- workspaces
- projects

### Batch 2

- models
- chat threads/messages/stream

### Batch 3

- project sessions
- session detail/events/logs/ports

### Batch 4

- browser
- agent runs
- approvals

### Batch 5

- documents
- usage/plans
- admin settings core

---

## 10. 늦춰도 되는 것

아래는 중요하지만 MVP 직전까지 미뤄도 된다.

- advanced analytics
- evaluations
- functions marketplace 성격 기능
- full pipeline 관리 UI API
- settings snapshot restore 고도화
- multi-agent orchestration control API

---

## 11. 팀별 병렬 개발 추천

### Backend Core

- auth
- workspaces
- projects
- chat

### Execution Team

- sessions
- browser
- logs
- artifacts

### Admin / Ops Team

- provider connections
- admin settings core
- usage / plans

### Frontend Team

- project + chat + session vertical slice 우선

---

## 12. 우선순위 확정 문장

MVP에서 가장 중요한 것은 `채팅이 된다`가 아니라, **프로젝트를 만들고, 세션을 띄우고, 브라우저에서 테스트하고, 결과를 확인하는 흐름이 실제로 돌아가는 것**이다.

따라서 API 우선순위도 다음 순서를 따른다.

- 인증과 프로젝트
- 모델과 채팅
- 세션과 브라우저
- 에이전트와 승인
- 사용량과 관리자 설정

---

## 13. 다음 문서 추천

1. `백엔드 서비스 경계 정의서`
2. `프론트엔드 상태관리 구조서`
3. `테스트 전략 문서`
