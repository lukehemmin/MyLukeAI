# 관리자 설정 API 세부 Contract 문서 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 관리자 설정 API 세부 Contract 문서
- **버전**: v0.1
- **목적**: 관리자 설정 API의 요청/응답 구조, 필드 규칙, secret 처리, validation/test/save 흐름을 더 구체적으로 정의한다.
- **관련 문서**: `docs/admin-settings-data-model-v0.1.md`, `docs/admin-panel-spec-v0.1.md`, `docs/admin-screen-definition-v0.1.md`, `docs/admin-audit-log-policy-v0.1.md`, `docs/storage-architecture-v0.1.md`

---

## 2. 문서 목적

이 문서는 `docs/admin-settings-data-model-v0.1.md`를 API contract 수준으로 더 세밀하게 풀어쓴 문서다. 특히 관리자 UI가 안정적으로 동작하려면 카테고리 조회, dirty state, secret 처리, validation/test/save, diff preview, snapshot restore 흐름이 일관되어야 한다.

---

## 3. 공통 응답 규약

### 3.1 Base Response

```json
{
  "status": "ok",
  "data": {},
  "meta": {
    "requestId": "req_123",
    "timestamp": "2026-03-08T12:00:00Z"
  }
}
```

이후 예시는 핵심 필드에 집중하기 위해 `meta`를 생략할 수 있다.

### 3.2 Error Response

```json
{
  "status": "error",
  "error": {
    "code": "validation_failed",
    "message": "One or more fields are invalid.",
    "details": {
      "fields": [
        {
          "key": "interface.help_center_url",
          "message": "Invalid URL format"
        }
      ]
    }
  },
  "meta": {
    "requestId": "req_123",
    "timestamp": "2026-03-08T12:00:00Z"
  }
}
```

---

## 4. 공통 파라미터 규칙

### 4.1 Scope Object

```json
{
  "scope": {
    "type": "global",
    "id": "global"
  }
}
```

### 4.2 Allowed Scope Types

- `global`
- `plan`
- `group`
- `team`
- `project`
- `provider`
- `model`

### 4.3 Versioning

설정 저장 시 optimistic locking을 위해 `version`을 사용할 수 있다.

```json
{
  "version": 12
}
```

---

## 5. 카테고리 목록 API Contract

`GET /api/admin/settings/categories`

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "items": [
      {
        "key": "general",
        "title": "General",
        "description": "Global product defaults",
        "sortOrder": 10,
        "isActive": true,
        "icon": "settings",
        "dangerLevel": "none"
      },
      {
        "key": "security_audit",
        "title": "Security & Audit",
        "description": "Security, retention, and audit controls",
        "sortOrder": 160,
        "isActive": true,
        "icon": "shield",
        "dangerLevel": "high"
      }
    ]
  }
}
```

---

## 6. 카테고리 상세 조회 API Contract

`GET /api/admin/settings/{categoryKey}?scopeType=global&scopeId=global`

### 응답 구조

```json
{
  "status": "ok",
  "data": {
    "category": {
      "key": "computer_browser",
      "title": "Computer & Browser",
      "description": "Execution runtime policies"
    },
    "scope": {
      "type": "global",
      "id": "global"
    },
    "version": 12,
    "sections": [
      {
        "key": "session_policies",
        "title": "Session Policies",
        "fields": [
          {
            "key": "computer_browser.idle_timeout_minutes",
            "label": "Idle Timeout Minutes",
            "description": "Minutes before an idle session is stopped.",
            "valueType": "int",
            "uiComponent": "number_input",
            "resolvedValue": 45,
            "rawOverride": 45,
            "defaultValue": 30,
            "placeholder": "45",
            "applyMode": "new_session",
            "required": true,
            "dirty": false,
            "dangerLevel": "none",
            "validation": {
              "min": 5,
              "max": 720
            }
          }
        ]
      }
    ]
  }
}
```

### 필드 계약 설명

| 필드 | 설명 |
|---|---|
| `resolvedValue` | override 적용 후 실제 값 |
| `rawOverride` | 현재 scope에서만 저장된 값 |
| `defaultValue` | 시스템 기본값 |
| `applyMode` | 반영 시점 |
| `dirty` | 서버 기준 변경 여부 |
| `dangerLevel` | `none`, `warning`, `high` |

---

## 7. Secret Field Contract

민감값은 일반 필드와 계약이 다르다.

### 7.1 조회 응답 예시

```json
{
  "key": "security_audit.audit_export_signing_secret",
  "label": "Audit Export Signing Secret",
  "valueType": "secret",
  "uiComponent": "secret_input",
  "resolvedValue": null,
  "rawOverride": null,
  "secret": {
    "isSet": true,
    "maskedPreview": "sk-****abcd",
    "updatedAt": "2026-03-08T11:00:00Z"
  },
  "applyMode": "immediate"
}
```

### 7.2 저장 요청 예시

```json
{
  "scope": {
    "type": "global",
    "id": "global"
  },
  "reason": "Rotate audit export signing secret",
  "values": {
    "security_audit.audit_export_signing_secret": {
      "operation": "set",
      "value": "sk-live-xxxx"
    }
  }
}
```

### 7.3 Secret operation 종류

| operation | 의미 |
|---|---|
| `set` | 새 값 저장 또는 교체 |
| `keep` | 현재 값 유지 |
| `clear` | 값 삭제 |

---

## 8. 저장 API Contract

`PUT /api/admin/settings/{categoryKey}`

### 요청 예시

```json
{
  "scope": {
    "type": "global",
    "id": "global"
  },
  "version": 12,
  "reason": "Increase idle timeout for QA workspace",
  "values": {
    "computer_browser.idle_timeout_minutes": 45
  }
}
```

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "saved": true,
    "newVersion": 13,
    "applyModeSummary": {
      "immediate": [],
      "new_session": [
        "computer_browser.idle_timeout_minutes"
      ],
      "restart_required": []
    },
    "changeLogIds": ["chg_101", "chg_102"]
  }
}
```

### 저장 계약 원칙

- 카테고리 저장은 partial update를 허용한다.
- 서버는 변경된 필드만 change log에 기록한다.
- version mismatch 시 `409 conflict`를 반환할 수 있다.

---

## 9. 필드 단위 PATCH Contract

`PATCH /api/admin/settings/{categoryKey}/{fieldKey}`

### 요청 예시

```json
{
  "scope": {
    "type": "global",
    "id": "global"
  },
  "version": 13,
  "reason": "Disable public signups",
  "value": false
}
```

### 사용 목적

- Toggle 하나만 빠르게 변경
- inline settings UX
- 작은 필드의 즉시 저장 UX

---

## 10. Validation API Contract

`POST /api/admin/settings/{categoryKey}/validate`

### 요청 예시

```json
{
  "scope": {
    "type": "global",
    "id": "global"
  },
  "values": {
    "web_search.concurrent_requests": 1000,
    "web_search.search_result_count": 50
  }
}
```

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "result": "failed",
    "errors": [
      {
        "key": "web_search.concurrent_requests",
        "code": "max_exceeded",
        "message": "Maximum allowed value is 20"
      }
    ],
    "warnings": []
  }
}
```

### 계약 원칙

- validation은 저장하지 않는다.
- validation 결과는 UI에서 field-level highlight에 바로 쓸 수 있어야 한다.

---

## 11. Test API Contract

`POST /api/admin/settings/{categoryKey}/test`

### 주요 용도

- provider connection test
- browser backend test
- jupyter connection test
- search provider test
- external loader test
- object storage upload/download smoke test
- Redis connectivity test

### 요청 예시

```json
{
  "scope": {
    "type": "global",
    "id": "global"
  },
  "testType": "web_search",
  "values": {
    "web_search.search_result_count": 10,
    "web_search.concurrent_requests": 3
  }
}
```

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "result": "passed",
    "summary": "Web search configuration verified successfully",
    "details": {
      "latencyMs": 342,
      "engine": "tavily"
    },
    "testRunId": "testrun_123"
  }
}
```

### 비고

- primary Postgres / Redis endpoint 자체를 관리자 UI에서 hot swap하는 것이 아니라, health check와 운영 정책 검증 중심으로 사용하는 것을 기본으로 한다.

### Database & Data Ops 테스트 예시

```json
{
  "scope": {
    "type": "global",
    "id": "global"
  },
  "testType": "object_storage",
  "values": {
    "database_data_ops.download.signed_url_ttl_seconds": 300,
    "database_data_ops.export.default_storage_prefix": "exports/default/"
  }
}
```

---

## 12. Reset Contract

`POST /api/admin/settings/{categoryKey}/reset`

### 요청 예시

```json
{
  "scope": {
    "type": "global",
    "id": "global"
  },
  "reason": "Restore category defaults"
}
```

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "reset": true,
    "changeLogIds": ["chg_220"]
  }
}
```

---

## 13. Search Contract

`GET /api/admin/settings/search?q=browser`

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "items": [
      {
        "categoryKey": "computer_browser",
        "sectionKey": "session_policies",
        "fieldKey": "computer_browser.idle_timeout_minutes",
        "label": "Idle Timeout Minutes",
        "description": "Minutes before an idle session is stopped"
      }
    ]
  }
}
```

---

## 13.1 Recent Settings Contract

`GET /api/admin/settings/recent`

### 목적

- 최근 편집한 카테고리나 최근 접근한 설정을 설정 허브에서 바로 보여주기 위함

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "items": [
      {
        "categoryKey": "computer_browser",
        "title": "Computer & Browser",
        "lastEditedAt": "2026-03-08T12:00:00Z",
        "lastEditedBy": {
          "id": "usr_admin_1",
          "name": "Admin User"
        }
      }
    ]
  }
}
```

---

## 14. History Contract

`GET /api/admin/settings/history?category=computer_browser&limit=20`

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "items": [
      {
        "id": "chg_123",
        "changeType": "update",
        "fieldKey": "computer_browser.idle_timeout_minutes",
        "actor": {
          "id": "usr_1",
          "name": "Admin User"
        },
        "summary": "Updated idle timeout from 30 to 45 minutes",
        "reason": "Increase idle timeout for QA workspace",
        "createdAt": "2026-03-08T12:00:00Z"
      }
    ]
  }
}
```

---

## 14.1 Approval Queue Contract

고위험 변경은 즉시 저장 대신 approval queue를 거친다.

### 목록 조회

`GET /api/admin/settings/approval-requests?status=pending&categoryKey=security_audit`

### 생성

`POST /api/admin/settings/approval-requests`

```json
{
  "categoryKey": "security_audit",
  "scope": {
    "type": "global",
    "id": "global"
  },
  "reason": "Shorten audit export TTL",
  "values": {
    "security_audit.audit_export_ttl_hours": 24
  }
}
```

### 승인

`POST /api/admin/settings/approval-requests/{requestId}/approve`

### 반려

`POST /api/admin/settings/approval-requests/{requestId}/reject`

계약 원칙:

- 승인 완료 시 실제 `setting_change_log`와 audit event를 함께 생성한다.
- 반려 시 persisted value는 바뀌지 않는다.

---

## 15. Snapshot Contract

스냅샷 API contract는 미리 고정하지만, 실제 UI 노출은 `v1 또는 운영 고도화` 단계로 둔다.

## 15.1 생성

`POST /api/admin/settings/snapshots`

```json
{
  "scope": {
    "type": "global",
    "id": "global"
  },
  "name": "Pre-browser-policy-update",
  "reason": "Backup before security change"
}
```

## 15.2 목록 조회

`GET /api/admin/settings/snapshots`

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "items": [
      {
        "id": "snap_123",
        "name": "Pre-browser-policy-update",
        "createdAt": "2026-03-08T11:30:00Z",
        "createdBy": {
          "id": "usr_admin_1",
          "name": "Admin User"
        }
      }
    ]
  }
}
```

## 15.3 복원

`POST /api/admin/settings/snapshots/{snapshotId}/restore`

```json
{
  "reason": "Rollback after failed browser rollout"
}
```

### 복원 계약 원칙

- 고권한 필요
- 감사 로그 강제 생성
- secret 복원은 정책적으로 별도 제어 가능

---

## 16. Resource API Contract 요약

카테고리형 설정과 별도로 복합 리소스는 전용 API를 가진다.

### provider connections

- `GET /api/admin/provider-connections`
- `POST /api/admin/provider-connections`
- `GET /api/admin/provider-connections/{id}`
- `PATCH /api/admin/provider-connections/{id}`
- `POST /api/admin/provider-connections/{id}/test`
- `POST /api/admin/provider-connections/{id}/enable`
- `POST /api/admin/provider-connections/{id}/disable`
- `GET /api/admin/provider-connections/health`

### models

- `GET /api/admin/models`
- `POST /api/admin/models/import`
- `POST /api/admin/models/export`
- `PATCH /api/admin/models/{id}`
- `POST /api/admin/models/{id}/enable`
- `POST /api/admin/models/{id}/disable`
- `POST /api/admin/models/{id}/show`
- `POST /api/admin/models/{id}/hide`

모델 목록/상세 응답은 최소한 `capabilities.reasoning`, `roleTags.reasoning`, `providerSupport.reasoning`, `disabledReason`를 포함해 UI가 `추론 가능`, `플랜 제한`, `정책 제한`, `provider 미지원`을 구분해 보여줄 수 있어야 한다.

### execution templates

- `GET /api/admin/execution-templates`
- `POST /api/admin/execution-templates`
- `PATCH /api/admin/execution-templates/{id}`
- `POST /api/admin/execution-templates/{id}/clone`
- `POST /api/admin/execution-templates/{id}/validate`

### browser policy profiles

- `GET /api/admin/browser-policy-profiles`
- `POST /api/admin/browser-policy-profiles`
- `PATCH /api/admin/browser-policy-profiles/{id}`
- `POST /api/admin/browser-policy-profiles/{id}/validate`

### group policies

- `GET /api/admin/groups/{groupId}/policy`
- `PUT /api/admin/groups/{groupId}/policy`
- `POST /api/admin/groups/{groupId}/policy/validate`

### integrations

- `GET /api/admin/integrations`
- `POST /api/admin/integrations`
- `PATCH /api/admin/integrations/{id}`
- `POST /api/admin/integrations/{id}/test`

### functions

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

### pipelines

- `GET /api/admin/pipelines`
- `POST /api/admin/pipelines/upload`
- `POST /api/admin/pipelines/install-from-url`
- `PATCH /api/admin/pipelines/{id}`
- `POST /api/admin/pipelines/{id}/enable`
- `POST /api/admin/pipelines/{id}/disable`
- `GET /api/admin/pipelines/{id}/logs`

업로드 설치는 파일 binary 또는 multipart form을, URL 설치는 `sourceUrl`, `displayName`, `reason`을 받는 JSON contract를 기본으로 한다.

### plans

- `GET /api/admin/plans`
- `POST /api/admin/plans`
- `PATCH /api/admin/plans/{id}`
- `GET /api/admin/plans/{id}/entitlements`
- `PUT /api/admin/plans/{id}/entitlements`
- `POST /api/admin/users/{userId}/assign-plan`
- `POST /api/admin/teams/{teamId}/assign-plan`

### settings approvals

- `GET /api/admin/settings/approval-requests`
- `POST /api/admin/settings/approval-requests`
- `GET /api/admin/settings/approval-requests/{requestId}`
- `POST /api/admin/settings/approval-requests/{requestId}/approve`
- `POST /api/admin/settings/approval-requests/{requestId}/reject`

### security audit

- `GET /api/admin/audit-logs`
- `GET /api/admin/audit-logs/{auditLogId}`
- `POST /api/admin/audit-logs/export`

### data export / import jobs

- `POST /api/admin/settings/export`
- `POST /api/admin/settings/import`
- `GET /api/admin/data-exports`
- `POST /api/admin/data-exports`
- `POST /api/admin/data-imports`

---

## 16.1 Audit Log Contract

### 목록 조회

`GET /api/admin/audit-logs?category=security&severity=critical&limit=50`

### 상세 조회

`GET /api/admin/audit-logs/{auditLogId}`

### Export

`POST /api/admin/audit-logs/export`

```json
{
  "filters": {
    "category": ["security", "access_control"],
    "severity": ["critical"],
    "from": "2026-03-01T00:00:00Z",
    "to": "2026-03-08T23:59:59Z"
  },
  "format": "csv",
  "reason": "Quarterly security review"
}
```

계약 원칙:

- export는 별도 고권한과 audit event가 필요하다.
- 상세 응답은 `reason`, `correlationId`, `maskedFields`, `attachments`, `approvalContext`를 포함할 수 있어야 한다.

---

## 17. 에러 코드 표준

| code | 의미 |
|---|---|
| `validation_failed` | 입력값 검증 실패 |
| `conflict_version_mismatch` | 다른 관리자가 먼저 수정함 |
| `secret_operation_invalid` | secret operation 형식 오류 |
| `scope_not_supported` | 해당 필드가 지원하지 않는 scope |
| `test_execution_failed` | 연결 테스트 실패 |
| `permission_denied` | 권한 부족 |
| `approval_required` | 승인 큐 등록 필요 |
| `snapshot_restore_forbidden` | 복원 권한 부족 |
| `danger_confirmation_required` | 고위험 액션에 추가 확인 필요 |

---

## 18. 감사 로그 연계 원칙

- `PUT`, `PATCH`, `RESET`, `RESTORE`, `TEST`는 모두 audit 대상이다.
- `VALIDATE` 실패와 `SNAPSHOT CREATE`도 audit 대상이다.
- read-only 조회는 정책에 따라 일부만 감사 대상이다.
- `reason` 필드는 가능하면 UI에서 수집한다.
- secret 변경 시 원문이 아니라 `maskedFields` 정보만 로그에 남긴다.
- 고위험 저장은 즉시 적용 대신 approval request를 생성하고, 승인/반려 결정 자체도 별도 audit event로 남긴다.

---

## 19. 프론트엔드 구현 주의사항

- dirty state는 서버 응답의 `version`과 초기 payload 기준으로 계산한다.
- validation과 save는 분리할 수 있어야 한다.
- secret field는 일반 input처럼 처리하면 안 된다.
- apply mode summary를 저장 후 바로 사용자에게 보여줘야 한다.
- test 결과는 임시 입력값 기준 테스트인지, 저장 후 상태 기준 테스트인지 구분해서 보여줘야 한다.

---

## 20. MVP 우선 범위

### MVP에 반드시 포함

- categories list
- category detail
- category save
- field patch
- validate
- test
- search
- history list
- audit log list/detail
- pipeline upload or URL install contract

### v1 이후

- settings diff preview API
- per-field granular permissions metadata
- snapshot restore dry-run
- live collaborative admin editing 방지 고도화
- snapshot create/list/restore UI 노출

---

## 21. 결론

관리자 설정 API는 단순 CRUD가 아니라, **입력 스키마, secret 처리, 검증, 테스트, 감사, 반영 방식**을 모두 포함하는 운영 계약 계층이어야 한다.

따라서 다음 원칙을 확정한다.

- 카테고리형 설정은 schema-driven contract를 따른다.
- 민감값은 일반 필드와 다른 계약을 가진다.
- validation/test/save/history/snapshot은 별도 명시적 API로 분리한다.

---

## 22. 다음 문서 추천

1. `권한 체크 규칙 세부서`
2. `운영 플레이북`
3. `백엔드 서비스 경계 정의서`
