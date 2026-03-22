# 화면별 API 매핑서 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 화면별 API 매핑서
- **버전**: v0.1
- **목적**: 주요 사용자 화면과 관리자 화면이 어떤 API를 필요로 하는지 연결하여, 프론트엔드와 백엔드가 같은 구현 단위를 기준으로 작업할 수 있게 한다.
- **관련 문서**: `docs/screen-list-definition-v0.2.md`, `docs/admin-screen-definition-v0.1.md`, `docs/execution-infra-api-definition-v0.1.md`, `docs/core-api-priority-v0.1.md`, `docs/file-attachment-api-definition-v0.1.md`

---

## 2. 문서 목적

이 문서는 `화면 정의`와 `API 정의` 사이의 간극을 메우기 위한 문서다.

핵심 목표는 다음과 같다.

- 각 화면이 필요한 API를 식별한다.
- 화면별 `초기 로드`, `사용자 액션`, `실시간 업데이트`를 분리한다.
- MVP 구현 시 어떤 화면이 어떤 API 묶음에 의존하는지 빠르게 파악하게 한다.

---

## 3. 매핑 원칙

- 하나의 화면은 보통 `초기 조회 API + 액션 API + 스트림 API`로 구성된다.
- 화면의 주 가치가 어디에 있는지에 따라 API 우선순위도 달라진다.
- 채팅 화면은 메시지 API만이 아니라, 세션 생성 API와도 연결된다.
- 관리자 화면은 조회 API보다 `저장 + 검증 + 테스트` API가 중요하다.
- 엔터프라이즈 대응 화면은 API 응답에서 `적용 범위`, `승인 상태`, `보존 정책`, `유효 제한`을 읽어 UI에 노출할 수 있어야 한다.

---

## 4. 매핑 표기 규칙

| 컬럼 | 의미 |
|---|---|
| `Load APIs` | 화면 최초 진입 시 필요한 API |
| `Action APIs` | 버튼/폼 제출/상호작용 시 필요한 API |
| `Stream APIs` | 실시간 상태 동기화가 필요한 API |
| `Priority` | `P0`, `P1`, `P2` |

---

## 5. Public / Auth 화면 매핑

| 화면 | Load APIs | Action APIs | Stream APIs | Priority |
|---|---|---|---|---|
| `PUB-01 랜딩` | 선택적 `GET /api/public/plans`, 선택적 `GET /api/public/status` | 없음 | 없음 | P2 |
| `AUTH-01 로그인/회원가입` | 없음 | `POST /api/auth/login`, `POST /api/auth/register` | 없음 | P0 |
| `AUTH-02 비밀번호 재설정/초대 수락` | `GET /api/auth/password/reset/{token}`, `GET /api/auth/invitations/{token}` | `POST /api/auth/password/forgot`, `POST /api/auth/password/reset`, `POST /api/auth/invitations/{token}/accept`, `POST /api/auth/invitations/{token}/decline` | 없음 | P1 |

---

## 6. Workspace 핵심 화면 매핑

### 6.1 WS-01 홈 / 실행 대시보드

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/me`, `GET /api/workspaces`, `GET /api/dashboard/home`(recent sessions/documents aggregate 포함), `GET /api/projects?recent=true`, `GET /api/chat/threads?recent=true`, `GET /api/documents?recent=true`, `GET /api/agent-runs?recent=true`, `GET /api/usage/me` |
| `Action APIs` | `POST /api/projects`, `POST /api/chat/threads`, `POST /api/projects/{projectId}/sessions` |
| `Stream APIs` | `GET /api/projects/{projectId}/runtime-stream` 또는 `GET /api/dashboard/home/stream` |
| `Priority` | `P1` |

### 6.2 CHAT-01 AI 채팅 메인

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/models`, `GET /api/chat/threads/{threadId}`, `GET /api/projects`, `GET /api/documents?recent=true` |
| `Action APIs` | `POST /api/chat/threads`, `POST /api/chat/threads/{threadId}/messages`, `POST /api/agent-runs`, `POST /api/projects/{projectId}/sessions`, `POST /api/files/upload-intents`, `POST /api/files/{fileId}/complete` |
| `Stream APIs` | `GET /api/chat/threads/{threadId}/stream`, 선택적 `GET /api/agent-runs/{agentRunId}/stream` |
| `Priority` | `P0` |

비고:

- `GET /api/models` 응답은 모델 선택기에서 `reasoning` capability/role badge와 `disabledReason`를 바로 렌더링할 수 있어야 한다.

### 6.3 CHAT-02 대화 히스토리 / 검색

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/chat/threads`, `GET /api/chat/threads?query=...`, `GET /api/chat/threads?projectId=...` |
| `Action APIs` | `PATCH /api/chat/threads/{threadId}`, `DELETE /api/chat/threads/{threadId}` |
| `Stream APIs` | 없음 | 
| `Priority` | `P1` |

### 6.4 PRJ-01 프로젝트 목록

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/projects`, `GET /api/workspaces` |
| `Action APIs` | `POST /api/projects`, `PATCH /api/projects/{projectId}`, `POST /api/projects/{projectId}/archive` |
| `Stream APIs` | 없음 |
| `Priority` | `P0` |

### 6.5 PRJ-02 프로젝트 상세

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/projects/{projectId}`, `GET /api/projects/{projectId}/sessions`, `GET /api/documents?projectId={projectId}`, `GET /api/agent-runs?projectId={projectId}`, `GET /api/chat/threads?projectId={projectId}`, 선택적 `GET /api/files?projectId={projectId}` |
| `Action APIs` | `PATCH /api/projects/{projectId}`, `POST /api/projects/{projectId}/sessions`, `POST /api/agent-runs`, `POST /api/documents`, `POST /api/files/upload-intents`, `POST /api/files/{fileId}/complete`, `POST /api/attachments` |
| `Stream APIs` | `GET /api/projects/{projectId}/runtime-stream` |
| `Priority` | `P0` |

### 6.6 PRJ-03 Computer + Browser 세션

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/sessions/{sessionId}`, `GET /api/sessions/{sessionId}/events`, `GET /api/sessions/{sessionId}/browser`, `GET /api/sessions/{sessionId}/browser/actions`, `GET /api/sessions/{sessionId}/ports`, `GET /api/sessions/{sessionId}/artifacts`, `GET /api/sessions/{sessionId}/logs`, 선택적 `GET /api/projects/{projectId}/approvals` |
| `Action APIs` | `POST /api/sessions/{sessionId}/resume`, `POST /api/sessions/{sessionId}/stop`, `POST /api/sessions/{sessionId}/terminate`, `POST /api/sessions/{sessionId}/browser/live-view-token`, `POST /api/sessions/{sessionId}/browser/restart`, `POST /api/sessions/{sessionId}/artifacts/{artifactId}/download-url`, `POST /api/sessions/{sessionId}/artifacts/{artifactId}/save-as-file`, `POST /api/approvals/{approvalId}` |
| `Stream APIs` | `GET /api/sessions/{sessionId}/stream` |
| `Priority` | `P0` |

비고:

- 세션/이벤트/artifact payload는 UI가 승인 대기, 정책 제한, 결과물 보존 상태를 함께 표시할 수 있도록 메타데이터를 포함하는 것이 바람직하다.

### 6.7 DOC-01 문서 목록

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/documents`, `GET /api/documents?projectId=...`, `GET /api/documents?query=...`, 선택적 `GET /api/files?resourceType=document` |
| `Action APIs` | `POST /api/documents`, `PATCH /api/documents/{documentId}`, `PUT /api/documents/{documentId}/sharing`, `DELETE /api/documents/{documentId}` |
| `Stream APIs` | 없음 |
| `Priority` | `P1` |

### 6.8 DOC-02 문서 편집기

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/documents/{documentId}`, `GET /api/documents/{documentId}/versions`, `GET /api/comments?documentId=...`, 선택적 `GET /api/files?resourceType=document&resourceId={documentId}` |
| `Action APIs` | `PATCH /api/documents/{documentId}`, `PUT /api/documents/{documentId}/sharing`, `POST /api/documents/{documentId}/versions`, `POST /api/comments`, `POST /api/files/upload-intents`, `POST /api/files/{fileId}/complete`, `POST /api/attachments`, `DELETE /api/attachments/{attachmentId}`, `POST /api/files/{fileId}/download-url` |
| `Stream APIs` | 없음 |
| `Priority` | `P1` |

### 6.9 AGT-01 에이전트 센터

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/agent-templates`, `GET /api/agent-runs?recent=true`, `GET /api/projects`, `GET /api/models` |
| `Action APIs` | `POST /api/agent-runs` |
| `Stream APIs` | 선택적 `GET /api/agent-runs/{agentRunId}/stream` |
| `Priority` | `P1` |

### 6.10 AGT-02 에이전트 실행 상세

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/agent-runs/{agentRunId}`, `GET /api/agent-runs/{agentRunId}/artifacts`, `GET /api/sessions/{sessionId}`, `GET /api/sessions/{sessionId}/events`, `GET /api/sessions/{sessionId}/logs`, `GET /api/sessions/{sessionId}/browser`, `GET /api/sessions/{sessionId}/browser/actions`, 선택적 `GET /api/projects/{projectId}/approvals` |
| `Action APIs` | `POST /api/agent-runs/{agentRunId}/cancel`, `POST /api/agent-runs/{agentRunId}/artifacts/{artifactId}/download-url`, `POST /api/agent-runs/{agentRunId}/artifacts/{artifactId}/save-as-file`, 선택적 `POST /api/sessions/{sessionId}/browser/live-view-token`, `POST /api/approvals/{approvalId}` |
| `Stream APIs` | `GET /api/agent-runs/{agentRunId}/stream`, 선택적 `GET /api/sessions/{sessionId}/stream` |
| `Priority` | `P1` |

비고:

- 실행 상세 payload는 승인 상태, 승인 사유, 관련 세션 범위, 결과물 보존/저장 상태를 함께 표현할 수 있어야 한다.

---

## 7. Team 화면 매핑

### 비고

- Team 화면에서는 협업 리소스는 주로 `teamId`, 사용량/플랜/좌석 리소스는 연결된 `workspaceId`를 사용한다.
- 즉 `teamId`와 `workspaceId`는 같은 개념이 아니라, 협업 단위와 자산/과금 단위를 각각 가리키는 연관 식별자다.
- 팀 프로젝트/문서는 별도 전용 API가 아니라 기존 프로젝트/문서 API를 team workspace scope로 호출한다.

### 7.1 TEAM-01 팀 개요

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/teams/{teamId}`, `GET /api/teams/{teamId}/members`, `GET /api/projects?workspaceId=...`, `GET /api/documents?workspaceId=...`, `GET /api/chat/threads?workspaceId=...&recent=true`, `GET /api/agent-runs?workspaceId=...&recent=true`, `GET /api/usage/workspaces/{workspaceId}` |
| `Action APIs` | `PATCH /api/teams/{teamId}` |
| `Stream APIs` | 선택적 `GET /api/projects/{projectId}/runtime-stream` |
| `Priority` | `P1` |

### 7.2 TEAM-02 팀 멤버 / 권한 관리

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/teams/{teamId}/members`, `GET /api/teams/{teamId}/invites`, `GET /api/teams/{teamId}/roles`, `GET /api/seats/workspaces/{workspaceId}` |
| `Action APIs` | `POST /api/teams/{teamId}/invites`, `PATCH /api/teams/{teamId}/members/{memberId}`, `DELETE /api/teams/{teamId}/members/{memberId}` |
| `Stream APIs` | 없음 |
| `Priority` | `P1` |

비고:

- 조회는 Team Member 이상, 초대/역할 변경/제거 mutation은 Team Admin 이상 권한이 필요하다.

### 7.3 TEAM-03 팀 사용량 / 좌석 / 플랜

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/usage/workspaces/{workspaceId}`, `GET /api/plans/workspaces/{workspaceId}`, `GET /api/seats/workspaces/{workspaceId}` |
| `Action APIs` | MVP에서는 제한적, 향후 `POST /api/billing/workspaces/{workspaceId}/upgrade-request` |
| `Stream APIs` | 없음 |
| `Priority` | `P1` |

### 7.4 PLAN-01 플랜 / 사용량

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/plans/me`, `GET /api/usage/me`, 선택적 `GET /api/usage/workspaces/{workspaceId}`, 선택적 `GET /api/plans/workspaces/{workspaceId}`, 선택적 `GET /api/seats/workspaces/{workspaceId}` |
| `Action APIs` | 향후 `POST /api/billing/upgrade-request` |
| `Stream APIs` | 없음 |
| `Priority` | `P1` |

---

## 8. 관리자 화면 매핑

### 비고

- `ADMIN-02`, `ADMIN-05`, `ADMIN-07`은 상위 부모 화면 ID다.
- 세부 관리자 서브스크린 ID는 `docs/admin-screen-definition-v0.1.md`의 `ADMIN-02-01`, `ADMIN-05-01`, `ADMIN-07-01` 같은 하위 ID 체계를 따른다.

### 8.1 ADMIN-01 관리자 대시보드

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/admin/dashboard`, `GET /api/admin/provider-connections/health`, `GET /api/admin/runtime/overview` |
| `Action APIs` | 제한적, 관리자 drill-down 중심 |
| `Stream APIs` | 선택적 `GET /api/admin/runtime/stream` |
| `Priority` | `P1` |

### 8.2 ADMIN-02 Users & Groups

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/admin/users`, `GET /api/admin/teams`, `GET /api/admin/groups` |
| `Action APIs` | `POST /api/admin/users`, `PATCH /api/admin/users/{userId}`, `PATCH /api/admin/users/{userId}/role`, `POST /api/admin/users/{userId}/suspend`, `POST /api/admin/users/{userId}/reactivate`, `PATCH /api/admin/teams/{teamId}`, `POST /api/admin/users/{userId}/assign-plan`, `POST /api/admin/teams/{teamId}/assign-plan`, `POST /api/admin/groups`, `PATCH /api/admin/groups/{groupId}`, `DELETE /api/admin/groups/{groupId}` |
| `Stream APIs` | 없음 |
| `Priority` | `P1` |

#### ADMIN-02 하위 서브스크린 예시

- `ADMIN-02-01 Users Overview` -> `GET /api/admin/users`, `POST /api/admin/users`, `PATCH /api/admin/users/{userId}/role`, `POST /api/admin/users/{userId}/suspend`, `POST /api/admin/users/{userId}/reactivate`
- `ADMIN-02-02 User Detail` -> `GET /api/admin/users`(selected user summary/card data + auth/API key/SSO/activity snippets 포함), `PATCH /api/admin/users/{userId}`, `POST /api/admin/users/{userId}/assign-plan`, `GET /api/usage/workspaces/{workspaceId}`, 선택적 `GET /api/admin/audit-logs` 조합으로 사용자 상태/권한/플랜/감사 진입 패널 구성
- `ADMIN-02-03 Teams Overview` -> `GET /api/admin/teams`, `PATCH /api/admin/teams/{teamId}`, `POST /api/admin/teams/{teamId}/assign-plan` 조합으로 팀 상태/플랜/소유 운영 패널 구성
- `ADMIN-02-04 Groups Overview` -> `GET /api/admin/groups`, `POST /api/admin/groups`, `PATCH /api/admin/groups/{groupId}`, `DELETE /api/admin/groups/{groupId}`
- `ADMIN-02-05 Group Detail / Permissions` -> group detail은 그룹 리소스 API와 `GET /api/admin/groups/{groupId}/policy`, `PUT /api/admin/groups/{groupId}/policy`, `POST /api/admin/groups/{groupId}/policy/validate`, 선택적 `GET /api/admin/audit-logs` 조합으로 정책 패널을 구성

### 8.3 ADMIN-03 Analytics

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/admin/analytics/overview`, `GET /api/admin/analytics/model-usage`, `GET /api/admin/analytics/user-activity`, `GET /api/admin/analytics/runtime-usage` |
| `Action APIs` | 없음 |
| `Stream APIs` | 없음 |
| `Priority` | `P2` |

### 8.4 ADMIN-04 Evaluations

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/admin/evaluations/feedback`, `GET /api/admin/evaluations/leaderboard`, `GET /api/admin/evaluations/arena-models` |
| `Action APIs` | `POST /api/admin/evaluations/arena-models`, `PATCH /api/admin/evaluations/arena-models/{id}` |
| `Stream APIs` | 없음 |
| `Priority` | `P2` |

### 8.5 ADMIN-05 Functions

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/admin/functions` |
| `Action APIs` | `POST /api/admin/functions`, `PATCH /api/admin/functions/{id}`, `DELETE /api/admin/functions/{id}`, `POST /api/admin/functions/{id}/clone`, `POST /api/admin/functions/{id}/test`, `POST /api/admin/functions/{id}/enable`, `POST /api/admin/functions/{id}/disable`, `POST /api/admin/functions/import`, `POST /api/admin/functions/export` |
| `Stream APIs` | 없음 |
| `Priority` | `P2` |

#### ADMIN-05 하위 서브스크린 예시

- `ADMIN-05-01 Functions Overview` -> `GET /api/admin/functions`, `POST /api/admin/functions/import`, `POST /api/admin/functions/export`, `POST /api/admin/functions/{id}/enable`, `POST /api/admin/functions/{id}/disable`
- `ADMIN-05-02 Function Editor` -> `POST /api/admin/functions`, `PATCH /api/admin/functions/{id}`, `POST /api/admin/functions/{id}/clone`, `POST /api/admin/functions/{id}/test`, `DELETE /api/admin/functions/{id}`

### 8.6 ADMIN-06 관리자 설정 허브

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/admin/settings/categories`, `GET /api/admin/settings/search?q=...`, `GET /api/admin/settings/recent` |
| `Action APIs` | 없음 |
| `Stream APIs` | 없음 |
| `Priority` | `P1` |

### 8.7 ADMIN-07 관리자 설정 상세

| 유형 | API |
|---|---|
| `Load APIs` | `GET /api/admin/settings/{categoryKey}?scopeType=global&scopeId=global` |
| `Action APIs` | `PUT /api/admin/settings/{categoryKey}`, `PATCH /api/admin/settings/{categoryKey}/{fieldKey}`, `POST /api/admin/settings/{categoryKey}/validate`, `POST /api/admin/settings/{categoryKey}/test`, `POST /api/admin/settings/{categoryKey}/reset` |
| `Stream APIs` | 없음 |
| `Priority` | `P1` |

#### ADMIN-07 하위 서브스크린 예시

- `ADMIN-07-01 General`, `ADMIN-07-02 Access & Identity`, `ADMIN-07-09 Agents & Orchestration`, `ADMIN-07-11 Interface`, `ADMIN-07-12 Audio`, `ADMIN-07-13 Images`, `ADMIN-07-16 Security & Audit` -> 공통 `GET /api/admin/settings/{categoryKey}?scopeType=global&scopeId=global`, `PUT /api/admin/settings/{categoryKey}`, `PATCH /api/admin/settings/{categoryKey}/{fieldKey}`, `POST /api/admin/settings/{categoryKey}/validate`, `POST /api/admin/settings/{categoryKey}/test`
- `ADMIN-07-03 Connections` -> `GET /api/admin/provider-connections`, `POST /api/admin/provider-connections`, `PATCH /api/admin/provider-connections/{id}`, `POST /api/admin/provider-connections/{id}/test`, `GET /api/admin/provider-connections/health`
- `ADMIN-07-04 Models` -> settings API + `GET /api/admin/models`, `POST /api/admin/models/import`, `POST /api/admin/models/export`, `PATCH /api/admin/models/{id}`, `POST /api/admin/models/{id}/enable`, `POST /api/admin/models/{id}/disable`, `POST /api/admin/models/{id}/show`, `POST /api/admin/models/{id}/hide`
- `ADMIN-07-05 Documents & Retrieval`, `ADMIN-07-06 Web Search`, `ADMIN-07-08 Code Execution` -> category settings load/save/validate/test API를 직접 사용
- `ADMIN-07-07 Computer & Browser` -> settings API + `GET /api/admin/execution-templates`, `POST /api/admin/execution-templates`, `PATCH /api/admin/execution-templates/{id}`, `POST /api/admin/execution-templates/{id}/clone`, `POST /api/admin/execution-templates/{id}/validate`, `GET /api/admin/browser-policy-profiles`, `POST /api/admin/browser-policy-profiles`, `PATCH /api/admin/browser-policy-profiles/{id}`, `POST /api/admin/browser-policy-profiles/{id}/validate`
- `ADMIN-07-10 Integrations` -> category settings API + `GET /api/admin/integrations`, `POST /api/admin/integrations`, `PATCH /api/admin/integrations/{id}`, `POST /api/admin/integrations/{id}/test`
- `ADMIN-07-14 Pipelines` **(v1 예약 범위 — MVP에서 탭 예약 상태만, 실제 API 활성화는 v1 이후)** -> category settings API + `GET /api/admin/pipelines`, `POST /api/admin/pipelines/upload`, `POST /api/admin/pipelines/install-from-url`, `PATCH /api/admin/pipelines/{id}`, `POST /api/admin/pipelines/{id}/enable`, `POST /api/admin/pipelines/{id}/disable`, `GET /api/admin/pipelines/{id}/logs`
- `ADMIN-07-15 Billing & Plans` -> category settings API + `GET /api/admin/plans`, `POST /api/admin/plans`, `PATCH /api/admin/plans/{id}`, `GET /api/admin/plans/{id}/entitlements`, `PUT /api/admin/plans/{id}/entitlements`, `POST /api/admin/users/{userId}/assign-plan`, `POST /api/admin/teams/{teamId}/assign-plan`
- `ADMIN-07-16 Security & Audit` -> category settings API + `GET /api/admin/audit-logs`, `GET /api/admin/audit-logs/{auditLogId}`, `POST /api/admin/audit-logs/export`, `GET /api/admin/settings/history`, `GET /api/admin/settings/approval-requests`로 감사/변경/승인 이력을 함께 로드
- `ADMIN-07-17 Database & Data Ops` -> `GET /api/admin/settings/database_data_ops?scopeType=global&scopeId=global`, `PUT /api/admin/settings/database_data_ops`, `POST /api/admin/settings/database_data_ops/test`, `GET /api/admin/settings/history`, `POST /api/admin/settings/export`, `POST /api/admin/settings/import`, `GET /api/admin/data-exports`, `POST /api/admin/data-exports`, `POST /api/admin/data-imports`, 선택적 v1/p2 `GET /api/admin/settings/snapshots`, `POST /api/admin/settings/snapshots`, `POST /api/admin/settings/snapshots/{snapshotId}/restore`

---

## 9. Settings 세부 카테고리별 API 묶음

### 9.1 Connections / Models

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

### 9.2 Documents / Web Search

- `GET /api/admin/settings/documents_retrieval?scopeType=global&scopeId=global`
- `PUT /api/admin/settings/documents_retrieval`
- `POST /api/admin/settings/documents_retrieval/validate`
- `GET /api/admin/settings/web_search?scopeType=global&scopeId=global`
- `PUT /api/admin/settings/web_search`
- `POST /api/admin/settings/web_search/test`

### 9.3 Computer / Browser / Code Execution

- `GET /api/admin/settings/computer_browser?scopeType=global&scopeId=global`
- `PUT /api/admin/settings/computer_browser`
- `POST /api/admin/settings/computer_browser/test`
- `GET /api/admin/execution-templates`
- `POST /api/admin/execution-templates`
- `PATCH /api/admin/execution-templates/{id}`
- `POST /api/admin/execution-templates/{id}/validate`
- `GET /api/admin/settings/code_execution?scopeType=global&scopeId=global`
- `PUT /api/admin/settings/code_execution`

### 9.4 Integrations / Interface / Audio / Images / Pipelines

- `GET /api/admin/integrations`
- `POST /api/admin/integrations`
- `PATCH /api/admin/integrations/{id}`
- `POST /api/admin/integrations/{id}/test`
- `GET /api/admin/settings/interface?scopeType=global&scopeId=global`
- `PUT /api/admin/settings/interface`
- `GET /api/admin/settings/audio?scopeType=global&scopeId=global`
- `PUT /api/admin/settings/audio`
- `GET /api/admin/settings/images?scopeType=global&scopeId=global`
- `PUT /api/admin/settings/images`
- `GET /api/admin/pipelines`
- `POST /api/admin/pipelines/upload`
- `POST /api/admin/pipelines/install-from-url`
- `PATCH /api/admin/pipelines/{id}`
- `POST /api/admin/pipelines/{id}/enable`
- `POST /api/admin/pipelines/{id}/disable`
- `GET /api/admin/pipelines/{id}/logs`

### 9.5 Billing / Plans

- `GET /api/admin/plans`
- `POST /api/admin/plans`
- `PATCH /api/admin/plans/{id}`
- `GET /api/admin/plans/{id}/entitlements`
- `PUT /api/admin/plans/{id}/entitlements`
- `POST /api/admin/users/{userId}/assign-plan`
- `POST /api/admin/teams/{teamId}/assign-plan`

### 9.6 Security / Audit / Data Ops

- `GET /api/admin/settings/history`
- `GET /api/admin/audit-logs`
- `GET /api/admin/audit-logs/{auditLogId}`
- `POST /api/admin/audit-logs/export`
- `GET /api/admin/settings/approval-requests`
- `GET /api/admin/settings/database_data_ops?scopeType=global&scopeId=global`
- `PUT /api/admin/settings/database_data_ops`
- 선택적 v1/p2 `GET /api/admin/settings/snapshots`
- 선택적 v1/p2 `POST /api/admin/settings/snapshots`
- 선택적 v1/p2 `POST /api/admin/settings/snapshots/{snapshotId}/restore`
- `POST /api/admin/settings/database_data_ops/test`
- `POST /api/admin/settings/export`
- `POST /api/admin/settings/import`
- `GET /api/admin/data-exports`
- `POST /api/admin/data-exports`
- `POST /api/admin/data-imports`

---

## 10. 실시간 업데이트가 중요한 화면

아래 화면은 초기 로드보다 스트림 UX가 더 중요하다.

| 화면 | 핵심 스트림 |
|---|---|
| `CHAT-01` | 메시지 스트림 |
| `PRJ-03` | 세션/브라우저/작업/승인 스트림 |
| `AGT-02` | 에이전트 실행 스트림 |
| `WS-01` | 진행 중 작업 요약 스트림 |
| `ADMIN-01` | 런타임 상태 스트림(선택적) |

---

## 11. 화면 구현 순서 기준 추천

### 먼저 붙일 화면-API 묶음

1. `AUTH-01` + 인증 API
2. `PRJ-01` / `PRJ-02` + 프로젝트 API
3. `CHAT-01` + chat/message/model API
4. `PRJ-03` + session/browser/log stream API
5. `AGT-01` / `AGT-02` + agent API
6. `DOC-01` / `DOC-02` + document API
7. `ADMIN-06` / `ADMIN-07` + admin settings API

---

## 12. 화면 구현 시 주의사항

- 한 화면을 너무 많은 API에 의존하게 만들면 프론트 복잡도가 급증하므로, BFF 또는 aggregated response를 고려한다.
- `PRJ-03`는 반드시 이벤트 스트림 중심으로 설계한다.
- 관리자 설정 화면은 save/test/validate API를 동시에 고려해야 한다.
- 팀/플랜 화면은 읽기 API부터 시작해도 되지만, entitlement 구조를 먼저 잡아야 한다.

---

## 13. 결론

화면과 API는 1:1 대응이 아니라 `초기 조회 + 액션 + 스트림`의 조합으로 봐야 한다.

특히 이 제품은 실행형 플랫폼이므로, 아래 화면이 핵심이다.

- `CHAT-01`
- `PRJ-02`
- `PRJ-03`
- `AGT-02`
- `ADMIN-07`

이 다섯 화면이 완성되면 제품의 핵심 가치가 화면과 API 모두에서 선명하게 드러난다.

---

## 14. 다음 문서 추천

1. `프론트엔드 상태관리 구조서`
2. `백엔드 서비스 경계 정의서`
3. `테스트 전략 문서`
