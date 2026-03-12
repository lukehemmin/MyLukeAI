# 실행 인프라 API 정의서 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 실행 인프라 API 정의서
- **버전**: v0.1
- **목적**: 앱 서버, 실행 컨트롤 플레인, 노드 에이전트, 브라우저 백엔드 사이에서 필요한 핵심 API를 정의한다.
- **관련 문서**: `docs/execution-infra-data-model-v0.1.md`, `docs/computer-browser-agent-lifecycle-v0.1.md`, `docs/admin-settings-data-model-v0.1.md`, `docs/domain-model-erd-v0.1.md`, `docs/storage-architecture-v0.1.md`

---

## 2. 문서 목적

이 문서는 사용자가 프로젝트에서 Computer 세션을 생성하고, 브라우저를 열고, 에이전트를 실행하고, 로그와 artifact를 확인하는 전체 흐름을 API 관점에서 정리한 문서다.

핵심 목표는 다음과 같다.

- 사용자용 제품 API와 내부 실행 제어 API를 구분한다.
- 실행 인프라의 상태 전환, 승인, 로그, artifact, 사용량 보고를 API로 표현한다.
- MVP에서 반드시 필요한 세션/브라우저/작업 API를 우선 정의한다.

---

## 3. API 계층 구조

실행 인프라 API는 크게 네 층으로 나눈다.

### 3.1 Public App API

프론트엔드가 호출하는 사용자용 API.

- 프로젝트에서 세션 생성
- 세션 상태 조회
- 브라우저 라이브 뷰 확인
- 로그/artifact 조회
- 승인 응답

### 3.2 Control Plane API

앱 서버와 실행 스케줄러/실행 서비스 사이의 내부 API.

- 세션 생성 요청 전달
- 스케줄링 지시
- 정책 해석 결과 전달
- 실행 이벤트 수집

### 3.3 Node Agent API

실행 노드 에이전트가 Control Plane과 통신하는 API.

- 노드 등록
- heartbeat
- 세션 상태 보고
- 로그, artifact, usage 업로드

### 3.4 Event Stream API

실시간 상태 동기화를 위한 스트리밍 API.

- 세션 상태 변경
- 브라우저 이벤트
- 작업 진행률
- 승인 대기 상태

### 3.5 응답 규약

- Public App API는 기본적으로 `status`, `data`, `meta` envelope를 사용한다.
- Control Plane / Node Agent API는 내부 서비스 간 호출 성격에 따라 더 단순한 payload를 사용할 수 있다.
- 아래 Public API 예시는 특별한 언급이 없으면 envelope 기준으로 본다.

---

## 4. 설계 원칙

- **Session-Centric**: 핵심 자원은 `computer_session`이다.
- **Project-Bound**: 대부분의 사용자 실행 API는 `project` 경로 아래에서 시작한다.
- **Policy-Resolved**: 세션 생성 전 플랜/권한/그룹/팀 정책이 해석되어야 한다.
- **Observable by Default**: 모든 세션은 상태, 이벤트, 로그, artifact를 조회 가능해야 한다.
- **Separated Trust Boundaries**: 사용자 API와 내부 노드 API는 인증 체계가 다르다.
- **Resumable**: 세션 재개와 복원 API를 기본 고려한다.

---

## 5. 인증 및 권한 원칙

### 5.1 Public App API

- 사용자 access token 또는 session cookie 사용
- 프로젝트/워크스페이스 권한 확인 필요
- 팀 범위 세션은 팀 역할과 플랜 한도 확인 필요

### 5.2 Control Plane API

- 내부 service-to-service 인증 사용
- 일반 사용자 토큰으로 직접 호출 불가

### 5.3 Node Agent API

- 노드 등록 토큰 또는 mTLS 권장
- 노드별 고정 identity 필요

### 5.4 브라우저 라이브 뷰

- 직접 URL 노출보다 signed URL 또는 short-lived token 사용 권장

---

## 6. Public App API

## 6.1 프로젝트 세션 생성

`POST /api/projects/{projectId}/sessions`

### 설명

- 특정 프로젝트에 대해 Computer 세션 생성 요청
- 필요 시 브라우저 세션도 함께 요청 가능

### 요청 예시

```json
{
  "mode": "development",
  "executionTemplateKey": "fullstack-node",
  "browserEnabled": true,
  "agentRunId": null,
  "startupCommand": "npm run dev",
  "reason": "full-stack MVP build"
}
```

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "sessionId": "sess_123",
    "status": "queued",
    "browserRequested": true,
    "queuePosition": 2,
    "applyPolicy": {
      "idleTimeoutMinutes": 45,
      "maxRuntimeMinutes": 180
    }
  },
  "meta": {
    "requestId": "req_sess_123",
    "timestamp": "2026-03-08T12:00:00Z"
  }
}
```

## 6.2 프로젝트 세션 목록 조회

`GET /api/projects/{projectId}/sessions`

### 목적

- 최근 세션, 진행 중 세션, 실패 세션 목록 제공

## 6.3 세션 상세 조회

`GET /api/sessions/{sessionId}`

### 응답 포함 정보

- 세션 상태 (`requested`, `queued`, `provisioning`, `restoring`, `ready`, `running`, `paused`, `warm`, `stopping`, `completed`, `terminated`, `failed`, `expired`)
- 실행 모드 (`conversation`, `research`, `development`, `test`)
- `browserRequested` 값과 실제 브라우저 준비 상태 구분
- 브라우저 상태 (`launching`, `ready`, `navigating`, `interacting`, `validating`, `crashed`, `closed`) 또는 browser not requested인 경우 `null`
- 현재 노드 정보 요약
- 최근 작업
- preview port
- artifact 요약
- 사용량 요약

## 6.4 세션 재개

`POST /api/sessions/{sessionId}/resume`

### 설명

- warm 상태 또는 복원 가능한 세션 재개 요청

## 6.5 세션 중지

`POST /api/sessions/{sessionId}/stop`

### 설명

- 정상 종료 요청

## 6.6 세션 강제 종료

`POST /api/sessions/{sessionId}/terminate`

### 설명

- 사용자 또는 관리자에 의한 강제 종료
- 감사 로그 대상

## 6.7 세션 이벤트 조회

`GET /api/sessions/{sessionId}/events`

### 설명

- 상태 변경, 브라우저 이벤트, 정책 경고, 오류 이벤트 제공

## 6.8 세션 포트 조회

`GET /api/sessions/{sessionId}/ports`

### 설명

- preview 가능한 포트 목록과 상태 제공

## 6.9 세션 artifact 조회

`GET /api/sessions/{sessionId}/artifacts`

### 설명

- 로그, 스크린샷, 테스트 리포트, diff 등 조회

## 6.10 세션 artifact 다운로드 URL 발급

`POST /api/sessions/{sessionId}/artifacts/{artifactId}/download-url`

### 설명

- 권한 검증 후 artifact 다운로드용 short-lived URL 발급

## 6.11 세션 artifact를 사용자 파일로 저장

`POST /api/sessions/{sessionId}/artifacts/{artifactId}/save-as-file`

### 설명

- 실행 산출물을 `file_asset`으로 승격하고, 필요 시 chat/document/project attachment로 연결해 재사용 가능하게 저장
- 호출 경로는 execution API지만, 결과 ownership은 file/attachment domain으로 귀결되는 승격 API다.

### 요청 예시

```json
{
  "target": {
    "resourceType": "project",
    "resourceId": "prj_123"
  },
  "filename": "qa-report.json",
  "attachmentRole": "result"
}
```

### 요청 규칙

- `target`은 optional이다.
- `target`이 있으면 `file_asset` 생성 후 지정한 리소스에 attachment까지 함께 생성한다.
- `target`이 없으면 `file_asset`만 생성하고 attachment는 만들지 않는다.

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "fileId": "file_301",
    "attachmentId": "att_301",
    "savedTo": {
      "resourceType": "project",
      "resourceId": "prj_123"
    }
  }
}
```

### 응답 규칙

- attachment를 만들지 않은 경우 `attachmentId`, `savedTo`는 `null`일 수 있다.

## 6.12 세션 로그 조회

`GET /api/sessions/{sessionId}/logs`

### 파라미터 예시

- `cursor`
- `limit`
- `jobId`
- `stream=false`

### 응답 원칙

- 로그 원문은 `session_log_chunk` 기반 cursor pagination으로 반환한다.
- 장기 보존용 압축 로그나 내보내기 파일은 `session_artifact`에서 별도로 조회한다.

---

## 7. Browser 관련 Public API

## 7.1 브라우저 세션 조회

`GET /api/sessions/{sessionId}/browser`

### 응답 포함 정보

- 브라우저 상태
- 마지막 URL
- live view token 또는 signed URL
- recording policy
- console/network capture 여부

### 비고

- 브라우저를 요청하지 않은 세션이면 `status: ok`와 `data: null` 형태로 응답한다.
- 이 경우 클라이언트는 `browserRequested=false` 또는 `null payload`를 기준으로 브라우저 패널을 숨길 수 있어야 한다.

## 7.2 브라우저 라이브 뷰 토큰 발급

`POST /api/sessions/{sessionId}/browser/live-view-token`

### 설명

- 단기 토큰 또는 signed URL 발급

## 7.3 브라우저 액션 로그 조회

`GET /api/sessions/{sessionId}/browser/actions`

### 설명

- AI가 브라우저에서 수행한 탐색/클릭/입력/검증 이벤트 목록

## 7.4 브라우저 재시작 요청

`POST /api/sessions/{sessionId}/browser/restart`

### 설명

- 브라우저만 재기동

---

## 8. 승인 관련 Public API

## 8.1 승인 대기 목록 조회

`GET /api/projects/{projectId}/approvals`

### 설명

- 현재 프로젝트의 승인 대기 항목 제공

## 8.2 승인 응답

`POST /api/approvals/{approvalId}`

### 요청 예시

```json
{
  "decision": "approve",
  "reason": "safe package install"
}
```

### 가능한 승인 대상

- 파일 삭제
- 대량 수정
- 외부 로그인
- 민감한 브라우저 액션
- 배포 관련 액션

---

## 9. Agent 연동 Public API

## 9.1 에이전트 실행 생성

`POST /api/agent-runs`

### 요청 예시

```json
{
  "projectId": "prj_123",
  "mode": "development",
  "templateId": "agent_backend_builder",
  "sessionStrategy": "reuse_or_create",
  "prompt": "Create auth API and test in browser"
}
```

## 9.2 에이전트 실행 조회

`GET /api/agent-runs/{agentRunId}`

### 응답 포함 정보

- 에이전트 실행 상태 (`pending`, `waiting_for_resources`, `waiting_for_approval`, `running`, `retrying`, `completed`, `failed`, `cancelled`)
- 연결 프로젝트 / 채팅 / 세션 요약
- 최근 작업 단계
- 승인 대기 여부
- artifact 요약

## 9.3 에이전트 실행 취소

`POST /api/agent-runs/{agentRunId}/cancel`

## 9.4 에이전트 실행 artifact 조회

`GET /api/agent-runs/{agentRunId}/artifacts`

## 9.5 에이전트 실행 스트림

`GET /api/agent-runs/{agentRunId}/stream`

### 설명

- 실행 상태, 작업 진행률, 승인 대기, artifact 생성 이벤트를 스트리밍한다.

## 9.6 에이전트 실행 artifact 다운로드 URL 발급

`POST /api/agent-runs/{agentRunId}/artifacts/{artifactId}/download-url`

## 9.7 에이전트 실행 artifact를 사용자 파일로 저장

`POST /api/agent-runs/{agentRunId}/artifacts/{artifactId}/save-as-file`

### 계약 원칙

- 세션 artifact의 `save-as-file`과 동일한 request/response contract를 따른다.

---

## 10. Control Plane Internal API

이 API는 앱 서버와 실행 인프라 내부 서비스 간 호출용이다.

## 10.1 세션 생성 요청 전달

`POST /internal/execution/session-requests`

### 목적

- 정책 해석이 끝난 세션 생성 요청을 스케줄러에 전달

### payload 핵심

- project id
- workspace id
- execution mode
- requested template
- resolved policy snapshot
- browser requested 여부
- actor / correlation id

## 10.2 세션 상태 업데이트

`POST /internal/execution/sessions/{sessionId}/status`

### 설명

- 컨트롤 플레인이 상태 전환을 반영

## 10.3 작업 생성

`POST /internal/execution/jobs`

### 예시 job type

- bootstrap
- install
- run_server
- test
- browser_task

## 10.4 artifact 등록

`POST /internal/execution/artifacts`

### 포함 정보

- `artifactType`
- `storageProvider`
- `storageKey`
- `mimeType`
- `sizeBytes`
- `checksumSha256`
- `metadata`

### 비고

- artifact의 바이너리 본문은 object storage에 있고, 이 API는 메타데이터를 control plane에 등록한다.

## 10.5 usage 적재

`POST /internal/execution/usage`

## 10.6 로그 chunk 등록

`POST /internal/execution/logs`

### 목적

- 노드가 업로드한 `session_log_chunk` 메타데이터를 control plane에 적재

### 포함 정보

- `computerSessionId`
- `executionJobId`
- `streamType`
- `chunkIndex`
- `offsetStart`
- `contentText`

## 10.7 정책 해석 조회

`GET /internal/execution/policies/resolved?projectId=...&userId=...`

### 목적

- 세션 생성 직전 최종 정책 계산 결과 조회

---

## 11. Node Agent API

## 11.1 노드 등록

`POST /internal/nodes/register`

### 설명

- 새로운 실행 노드가 control plane에 자신을 등록

## 11.2 heartbeat

`POST /internal/nodes/{nodeId}/heartbeat`

### 포함 정보

- 현재 자원 사용량
- active session 수
- browser backend 상태

## 11.3 세션 할당 확인

`POST /internal/nodes/{nodeId}/sessions/{sessionId}/accept`

### 설명

- 노드가 세션 요청을 수락했음을 보고

## 11.4 세션 진행 상태 보고

`POST /internal/nodes/{nodeId}/sessions/{sessionId}/progress`

### 설명

- provisioning, restoring, running, stopping 등 단계 보고

## 11.5 로그 chunk 업로드

`POST /internal/nodes/{nodeId}/sessions/{sessionId}/logs`

### 비고

- 이 API는 `session_log_chunk`를 생성하거나 배치 적재한다.

## 11.6 artifact 업로드 완료 보고

`POST /internal/nodes/{nodeId}/sessions/{sessionId}/artifacts`

### 포함 정보

- `artifactType`
- `storageProvider`
- `storageKey`
- `sizeBytes`
- `checksumSha256`

### 비고

- 노드 또는 브라우저 워커가 object storage 업로드를 끝낸 뒤 최종 참조 정보를 보고한다.

## 11.7 노드 drain 시작/종료

- `POST /internal/nodes/{nodeId}/drain`
- `POST /internal/nodes/{nodeId}/undrain`

---

## 12. Event Stream API

## 12.1 세션 이벤트 스트림

`GET /api/sessions/{sessionId}/stream`

### 방식

- SSE 또는 WebSocket

### 전송 이벤트 예시

- `session.status_changed`
- `browser.status_changed`
- `job.started`
- `job.completed`
- `approval.required`
- `artifact.created`
- `error.occurred`

## 12.2 프로젝트 실행 이벤트 스트림

`GET /api/projects/{projectId}/runtime-stream`

### 목적

- 프로젝트 단위에서 여러 세션/에이전트 상태를 집계 표시

---

## 13. 오류 모델

공통 에러 코드는 사용자 UI와 운영 로그 모두에서 일관되게 쓰는 것이 좋다.

| code | 의미 |
|---|---|
| `policy_denied` | 권한 또는 정책상 허용되지 않음 |
| `plan_limit_exceeded` | 플랜 한도 초과 |
| `queue_saturated` | 대기열 포화 |
| `template_invalid` | 실행 템플릿 오류 |
| `provider_unavailable` | 외부 공급자 장애 |
| `browser_backend_unavailable` | 브라우저 백엔드 장애 |
| `restore_failed` | 세션 복원 실패 |
| `artifact_not_ready` | artifact 준비 전 |
| `session_expired` | 세션 만료 |

### 에러 응답 예시

```json
{
  "status": "error",
  "error": {
    "code": "plan_limit_exceeded",
    "message": "Concurrent browser session limit reached.",
    "retryable": false,
    "action": "upgrade_or_wait"
  },
  "meta": {
    "requestId": "req_err_123",
    "timestamp": "2026-03-08T12:00:00Z"
  }
}
```

---

## 14. 권장 응답 메타데이터

실행 관련 API 응답은 일반 CRUD 응답보다 더 풍부해야 한다.

권장 메타데이터:

- `correlationId`
- `status`
- `applyPolicy`
- `queuePosition`
- `estimatedReadyAt`
- `lastEventAt`
- `retryable`

로그 조회는 `session_log_chunk`, 이벤트 조회는 `session_event`, artifact 조회는 `session_artifact`를 기준 backing model로 삼는다.

---

## 15. MVP 우선 범위

### MVP에 반드시 포함

- 프로젝트 세션 생성/조회/중지/재개 API
- 브라우저 세션 조회 및 live view token API
- 로그/이벤트/artifact 조회 API
- 승인 응답 API
- 내부 세션 요청/상태 보고/usage 적재 API
- 노드 register/heartbeat/progress API

### v1 이후 확장

- 브라우저 세션 병렬 제어 API
- 세션 스냅샷 생성/복원 API
- 세션 관전/공동 제어 API
- 고급 테스트 리포트 API

---

## 16. 결론

실행 인프라 API는 단순히 컨테이너를 켜고 끄는 API가 아니라, **프로젝트 중심 실행 경험을 사용자, 에이전트, 브라우저, 노드, artifact, usage까지 연결하는 핵심 인터페이스 계층**이다.

따라서 다음 원칙을 확정한다.

- 사용자용 API와 내부 제어 API를 분리한다.
- 세션, 브라우저, 작업, 승인, artifact는 모두 1급 API 자원이다.
- 실시간 상태 스트림은 선택이 아니라 핵심 UX 인프라다.

---

## 17. 다음 문서 추천

1. `실행 노드 보안 정책서`
2. `백엔드 서비스 경계 정의서`
3. `테스트 전략 문서`
