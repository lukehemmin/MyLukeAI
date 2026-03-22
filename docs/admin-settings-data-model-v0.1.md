# 관리자 설정 데이터 모델 및 API 정의서 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 관리자 설정 데이터 모델 및 API 정의서
- **버전**: v0.1
- **목적**: 관리자 UI 중심 설정 시스템을 구현하기 위한 데이터 구조, 스코프 체계, 비밀값 처리 방식, 변경 이력 구조, Admin API 규격을 정의한다.
- **관련 문서**: `docs/admin-panel-spec-v0.1.md`, `docs/admin-screen-definition-v0.1.md`, `docs/permission-plan-matrix-v0.1.md`, `docs/computer-browser-agent-lifecycle-v0.1.md`, `docs/storage-architecture-v0.1.md`, `docs/deployment-architecture-environment-separation-v0.1.md`

---

## 2. 문서 목적

이 문서는 `OpenWebUI처럼 세세한 설정을 관리자 UI에서 관리하고 싶다`는 제품 방향을 실제 구현 가능한 구조로 바꾸기 위한 명세다.

핵심 목표는 다음과 같다.

- 설정을 `.env`가 아니라 DB 기반으로 저장한다.
- 관리자 UI가 모든 운영 설정의 canonical control surface / write path가 된다.
- 민감값, 테스트, 유효성 검사, 반영 범위, 감사 로그를 함께 설계한다.
- 단순 key-value 설정과 복잡한 리소스형 설정을 구분한다.
- OpenWebUI 수준의 세세함을 지원하면서도, 우리 플랫폼의 `Computer`, `Browser`, `Agent`, `Billing` 확장을 감당할 수 있어야 한다.

---

## 3. 설계 원칙

### 3.1 UI-First Configuration

- 운영자가 바꾸고 싶어하는 제품 설정은 반드시 관리자 UI에서 수정 가능해야 한다.
- env는 인프라 부팅용 최소값만 담당한다.

### 3.2 DB-Backed Canonical State

- 관리자 UI는 운영 설정의 canonical control surface이고, PostgreSQL 기반 DB는 persisted canonical state다.
- 런타임은 DB 기반 설정을 읽고 캐시할 수 있지만, 원본은 DB다.

### 3.3 Schema-Driven Admin UI

- 설정은 단순 텍스트 블롭이 아니라, 타입, 검증 규칙, 반영 방식, 권한을 가진 구조화된 스키마를 가져야 한다.
- 관리자 UI는 이 스키마를 기반으로 폼을 렌더링할 수 있어야 한다.

### 3.4 Secrets as First-Class Citizens

- API Key, token, password, OAuth secret은 일반 설정과 분리 저장한다.
- 조회 시 마스킹하고, 권한과 감사 로그를 분리 관리한다.

### 3.5 Scoped Overrides

- 초기에는 전역 설정이 중심이지만, 구조는 `전역 -> 플랜 -> 그룹 -> 팀 -> 프로젝트` override를 지원해야 한다.

### 3.6 Auditable Changes

- 모든 관리자 설정 변경은 누가, 언제, 무엇을, 왜 바꿨는지 기록해야 한다.

### 3.7 Runtime Awareness

- 각 설정은 적용 시점을 명시해야 한다.
  - 즉시 반영
  - 새 세션부터 반영
  - 새 작업부터 반영
  - 재시작 필요

### 3.8 Bootstrap-Minimal Infra Boundary

- 운영 정책은 관리자 UI에서 관리하되, primary DB/Redis처럼 앱 부팅 이전에 필요한 연결값은 bootstrap secret으로 둔다.
- 대신 upload/download 정책, artifact retention, signed URL TTL, export policy 같은 운영값은 관리자 UI가 canonical control surface가 되고 DB에 persisted value가 남는다.

---

## 4. 설정 시스템의 두 가지 축

관리자 설정은 하나의 방식으로만 저장하면 안 된다. 크게 두 가지 축으로 나눈다.

### 4.1 Generic Config

작은 단위의 운영 설정이다.

- 토글
- 숫자 한도
- 문자열
- JSON 설정
- 프롬프트 템플릿
- 기본값

예시:

- `access_identity.enable_signups`
- `interface.autocomplete.enabled`
- `computer_browser.idle_timeout_minutes`
- `web_search.search_result_count`
- `database_data_ops.upload.max_file_size_mb`
- `database_data_ops.download.signed_url_ttl_seconds`

### 4.2 Managed Resources

단순 key-value로 표현하기 어려운 복합 설정 객체다.

- Provider Connection
- Model
- Browser Policy Profile
- Group Policy
- Plan
- Pipeline
- Function
- Execution Template
- Integration Connection

> **Note**: `Function`은 `function_definition`을 canonical 엔터티로 사용하며 persistence 구조는 10.8절에 정의한다. `Pipeline`은 별도 리소스(`/api/admin/pipelines/...`)로 유지되며, persistence 상세는 추후 별도 정리한다.

예시:

- OpenAI provider connection 3개
- Ollama cluster connection 여러 개
- 모델별 capability 설정
- 팀 플랜 entitlement 세트

---

## 5. 스코프 체계

### 5.1 지원 스코프

| scope_type | 설명 |
|---|---|
| `global` | 플랫폼 전체 기본 설정 |
| `plan` | 플랜별 override |
| `group` | 그룹별 override |
| `team` | 팀 워크스페이스별 override |
| `project` | 프로젝트별 override |
| `provider` | 특정 연결 공급자별 override |
| `model` | 특정 모델별 override |

### 5.2 우선순위

scope resolution 규칙은 다음과 같다.

**기본 ownership chain (낮은 번호가 낮은 우선순위):**

```text
system default
-> global
-> plan
-> group
-> team
-> project
```

**resource-targeted override (provider / model):**

- `provider`와 `model` scope는 ownership chain 안에 끼워 넣지 않고, 특정 리소스를 해석할 때 ownership chain 결과 위에 추가 적용되는 override다.
- `provider` override: 특정 provider를 경유하는 설정을 해석할 때 적용된다.
- `model` override: 특정 model을 사용할 때 적용된다. `provider`와 `model` override가 동시에 있으면 `model`-specific override가 `provider`-specific override보다 우선한다.

**runtime/session override:**

- 최종 우선이며, 모든 persistence 기반 override 위에 적용된다.

**최종 우선순위 요약:**

```text
system default
-> global -> plan -> group -> team -> project
-> provider override (해당 provider 컨텍스트에서)
-> model override (해당 model 컨텍스트에서, provider override보다 우선)
-> runtime/session override (최종 우선)
```

### 5.3 적용 원칙

- 현재 MVP는 `global` 중심으로 구현 가능하다.
- 하지만 데이터 모델은 `plan`, `group`, `team`, `project`까지 수용 가능해야 한다.
- `provider`와 `model` scope는 특수 resource-targeted override로, 해당 리소스가 활성화되는 시점에 추가 적용된다.
- 설정 조회 API는 항상 `resolved value`와 `rawOverride`를 모두 제공할 수 있어야 한다.

---

## 6. 핵심 엔터티 개요

| 엔터티 | 역할 |
|---|---|
| `setting_category` | 관리자 설정 카테고리 메타데이터 |
| `setting_definition` | 개별 설정 필드의 스키마 정의 |
| `setting_value` | 실제 저장된 설정값 |
| `setting_secret` | 암호화 저장되는 민감값 |
| `setting_change_log` | 설정 변경 이력 |
| `setting_change_request` | 승인 대기 중인 설정 변경 요청 |
| `setting_snapshot` | 시점별 설정 스냅샷 |
| `setting_validation_run` | 유효성 검사 기록 |
| `setting_test_run` | 연결 테스트/실행 테스트 기록 |
| `provider_connection` | 외부 모델/서비스 연결 객체 |
| `model_registry` | 모델 메타데이터 및 정책 |
| `execution_template` | Computer 세션 템플릿 |
| `browser_policy_profile` | 브라우저 정책 묶음 |
| `group_policy` | 그룹별 권한/기능 정책 |
| `plan_definition` | 플랜 구조 |
| `plan_entitlement` | 플랜별 한도/기능 권한 |
| `integration_connection` | 외부 시스템 연동 객체 |

---

## 7. Generic Config 데이터 모델

### 7.1 setting_category

설정 카테고리의 메타데이터를 정의한다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `key` | string | 예: `general`, `models`, `computer_browser` |
| `title` | string | 관리자 UI 표시명 |
| `description` | text | 카테고리 설명 |
| `sort_order` | int | 정렬 순서 |
| `is_active` | boolean | 활성 여부 |
| `created_at` | datetime | 생성 시각 |
| `updated_at` | datetime | 수정 시각 |

### 7.2 setting_definition

개별 설정 필드의 스키마를 정의한다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `category_id` | uuid | `setting_category.id` FK |
| `key` | string | 예: `access_identity.enable_signups` |
| `label` | string | UI 라벨 |
| `description` | text | 도움말 |
| `value_type` | enum | `boolean`, `string`, `int`, `float`, `json`, `array`, `secret`, `prompt` |
| `ui_component` | enum | `toggle`, `input`, `number_input`, `textarea`, `secret_input`, `json_editor`, `select`, `multi_select` |
| `default_value_json` | jsonb | 기본값 |
| `validation_schema_json` | jsonb | 입력 검증 규칙 |
| `allowed_scope_types` | jsonb | 허용 스코프 목록 |
| `apply_mode` | enum | `immediate`, `new_session`, `new_job`, `restart_required` |
| `requires_secret_ref` | boolean | 민감값 여부 |
| `is_restart_sensitive` | boolean | 재시작 민감 여부 |
| `is_dangerous` | boolean | 위험 작업 여부 |
| `is_searchable` | boolean | 검색 대상 여부 |
| `sort_order` | int | 표시 순서 |
| `is_active` | boolean | 활성 여부 |

### 7.3 setting_value

실제 설정값을 저장한다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `definition_id` | uuid | `setting_definition.id` FK |
| `scope_type` | enum | `global`, `plan`, `group`, `team`, `project`, `provider`, `model` |
| `scope_id` | uuid/string | scope 대상 ID |
| `value_json` | jsonb | 실제 값 |
| `secret_ref_id` | uuid nullable | 민감값이면 `setting_secret.id` 참조 |
| `is_enabled` | boolean | override 활성 여부 |
| `version` | int | optimistic locking |
| `created_by` | uuid | 생성자 |
| `updated_by` | uuid | 수정자 |
| `created_at` | datetime | 생성 시각 |
| `updated_at` | datetime | 수정 시각 |

### 저장 원칙

- 일반 값은 `value_json`에 저장한다.
- 민감값은 `value_json`에 직접 저장하지 않고 `secret_ref_id`만 둔다.
- 값이 기본값과 동일하면 굳이 row를 만들지 않는 전략도 가능하다.

### 7.4 setting_secret

민감값을 암호화 저장한다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `ciphertext` | text | 암호화된 값 |
| `kms_key_id` | string nullable | 외부 KMS 사용 시 키 ID |
| `masked_preview` | string | 예: `sk-****abcd` |
| `created_by` | uuid | 생성자 |
| `updated_by` | uuid | 수정자 |
| `created_at` | datetime | 생성 시각 |
| `updated_at` | datetime | 수정 시각 |

---

## 8. 변경 이력 및 스냅샷 모델

### 8.1 setting_change_log

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `definition_id` | uuid nullable | 설정 변경이면 연결 |
| `resource_type` | string nullable | 리소스형 변경이면 예: `provider_connection` |
| `resource_id` | uuid/string nullable | 리소스 ID |
| `scope_type` | enum nullable | 적용 스코프 |
| `scope_id` | uuid/string nullable | 적용 대상 |
| `change_type` | enum | `create`, `update`, `delete`, `reset`, `restore` |
| `old_value_json` | jsonb nullable | 이전 값 |
| `new_value_json` | jsonb nullable | 새 값 |
| `reason` | text nullable | 변경 사유 |
| `setting_change_request_id` | uuid nullable | 연동된 admin settings 변경 요청 (`setting_change_request.id` FK, 실행 도메인 `approval_request`와 무관) |
| `applied_by` | uuid | 변경 관리자 |
| `applied_at` | datetime | 변경 시각 |
| `apply_mode` | enum | 반영 방식 |
| `status` | enum | `pending`, `applied`, `failed`, `rolled_back` |

### 8.2 setting_change_request

고위험 설정 저장 시 바로 적용하지 않고 승인 큐로 보내는 엔터티다.

이 엔터티는 실행 도메인의 `approval_request`와 다르다. `setting_change_request`는 관리자 설정 변경 거버넌스를 위한 승인 큐이고, `approval_request`는 브라우저 액션, 파일 변경, 배포 같은 실행/사용자 액션 승인을 위한 엔터티다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `category_key` | string | 대상 카테고리 |
| `scope_type` | enum | 적용 스코프 |
| `scope_id` | uuid/string | 적용 대상 |
| `change_summary` | text | 한 줄 요약 |
| `payload_json` | jsonb | 승인 전 적용 예정 payload |
| `requested_by` | uuid | 요청 관리자 |
| `approval_policy_key` | string nullable | 적용 승인 정책 |
| `status` | enum | `pending`, `approved`, `rejected`, `expired`, `cancelled` |
| `resolved_by` | uuid nullable | 승인/반려 관리자 |
| `resolved_reason` | text nullable | 결정 사유 |
| `created_at` | datetime | 생성 시각 |
| `resolved_at` | datetime nullable | 결정 시각 |

### setting_change_request ↔ setting_change_log 관계

- `setting_change_request`와 `setting_change_log`는 1:1이 아니다.
- 하나의 `setting_change_request`는 `payload_json` 안에 여러 필드 변경을 포함할 수 있으므로, 승인 시 field 단위로 `setting_change_log`를 여러 개 생성한다.
- 반려(`rejected`) 또는 만료(`expired`) 된 요청은 `setting_change_log`를 만들지 않는다.
- `setting_change_log.setting_change_request_id`는 admin settings domain 전용 FK이며, 실행 도메인의 `approval_request`와 혼용하지 않는다.

### 8.3 setting_snapshot

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `name` | string | 스냅샷 이름 |
| `scope_type` | enum | 스냅샷 범위 |
| `scope_id` | uuid/string | 범위 대상 |
| `payload_json` | jsonb | 전체 설정 덤프 |
| `created_by` | uuid | 생성자 |
| `created_at` | datetime | 생성 시각 |

### 스냅샷 용도

- 배포 전 백업
- 대규모 설정 변경 전 체크포인트
- 문제 발생 시 복원

스냅샷은 API contract를 미리 예약해 두되, 실제 사용자 노출은 `v1 또는 운영 고도화` 단계로 둔다.

---

## 9. 검증 및 테스트 모델

### 9.1 setting_validation_run

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `category_key` | string | 검증한 카테고리 |
| `scope_type` | enum | 스코프 |
| `scope_id` | uuid/string | 대상 |
| `input_json` | jsonb | 검증 대상 값 |
| `result` | enum | `passed`, `failed` |
| `errors_json` | jsonb | 필드별 오류 |
| `validated_by` | uuid | 실행 관리자 |
| `validated_at` | datetime | 실행 시각 |

### 9.2 setting_test_run

연결 테스트, 세션 테스트, 검색 테스트 등 실제 동작 검증 결과를 저장한다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `category_key` | string | 테스트 카테고리 |
| `test_type` | enum | `provider_connection`, `web_search`, `browser_backend`, `jupyter`, `integration`, `object_storage`, `database_connection`, `redis_cache`, `external_loader` |
| `target_type` | string | 대상 종류 |
| `target_id` | uuid/string | 대상 ID |
| `request_json` | jsonb | 테스트 입력 |
| `result` | enum | `passed`, `failed`, `partial` |
| `response_summary` | text | 요약 메시지 |
| `details_json` | jsonb | 상세 결과 |
| `tested_by` | uuid | 실행 관리자 |
| `tested_at` | datetime | 실행 시각 |

---

## 10. Managed Resources 데이터 모델

복잡한 운영 대상은 generic config가 아니라 전용 테이블을 둔다.

## 10.1 provider_connection

외부 모델/서비스 연결 설정.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `provider_type` | enum | `openai`, `ollama`, `anthropic`, `gemini`, `openrouter`, `custom_openai_compatible`, `tavily`, `firecrawl` 등 |
| `name` | string | 관리자 표시 이름 |
| `base_url` | string nullable | API base URL |
| `auth_type` | enum | `api_key`, `bearer`, `oauth`, `none` |
| `secret_ref_id` | uuid nullable | 인증 민감값 |
| `config_json` | jsonb | provider-specific 설정 |
| `health_status` | enum | `unknown`, `healthy`, `degraded`, `failed` |
| `last_checked_at` | datetime nullable | 마지막 확인 시각 |
| `is_active` | boolean | 활성 여부 |
| `scope_type` | enum | 보통 `global` |
| `scope_id` | uuid/string | 대상 |

## 10.2 model_registry

플랫폼에서 노출되는 모델 메타데이터.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `provider_connection_id` | uuid | 연결 대상 |
| `model_key` | string | 내부 모델 식별자 |
| `display_name` | string | 표시명 |
| `is_enabled` | boolean | 활성 여부 |
| `is_visible` | boolean | UI 표시 여부 |
| `visibility_scope` | enum | `private`, `public`, `team_only`, `admin_only` |
| `capabilities_json` | jsonb | chat, code, image, reasoning, tool calling 등 |
| `parameters_schema_json` | jsonb | 허용 파라미터 |
| `role_tags_json` | jsonb | `chat`, `coding`, `reasoning`, `research`, `browser_agent`, `evaluation` |
| `sort_order` | int | 정렬 |

`parameters_schema_json`에는 provider가 지원하는 경우 `reasoning effort`, `reasoning budget`, `verbosity` 같은 추론 관련 파라미터 정책도 포함할 수 있다.

## 10.3 execution_template

Computer 세션 템플릿.

> canonical definition은 `docs/execution-infra-data-model-v0.1.md`와 동일한 구조를 따른다. 관리자 설정 도메인에서는 이 리소스를 운영/편집 대상으로 다룬다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `key` | string | 예: `fullstack-node`, `python-api`, `java-spring` |
| `name` | string | 표시명 |
| `runtime_image_id` | uuid | 베이스 런타임 이미지 |
| `bootstrap_commands_json` | jsonb | 초기 설치 명령 |
| `default_ports_json` | jsonb | 기본 포트 |
| `resource_profile_json` | jsonb | cpu/memory/storage 요청값 |
| `browser_policy_profile_id` | uuid nullable | 기본 브라우저 정책 |
| `is_active` | boolean | 활성 여부 |

## 10.4 browser_policy_profile

브라우저 실행 정책 묶음.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `name` | string | 정책 이름 |
| `allow_external_login` | boolean | 외부 로그인 허용 여부 |
| `allow_uploads` | boolean | 파일 업로드 허용 여부 |
| `allow_downloads` | boolean | 파일 다운로드 허용 여부 |
| `allow_domain_list_json` | jsonb | 허용 도메인 |
| `deny_domain_list_json` | jsonb | 금지 도메인 |
| `recording_policy` | enum | `none`, `screenshots`, `session_recording` |
| `console_capture_enabled` | boolean | 콘솔 수집 여부 |
| `network_capture_enabled` | boolean | 네트워크 수집 여부 |

## 10.5 group_policy

그룹별 권한 묶음.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `group_id` | uuid | 그룹 ID |
| `default_model_id` | uuid nullable | 기본 모델 |
| `permissions_json` | jsonb | 권한 매트릭스 |
| `feature_flags_json` | jsonb | Web Search, Image, Code Interpreter 등 |
| `sharing_policy_json` | jsonb | 공유 정책 |

## 10.6 plan_definition / plan_entitlement

플랜 구조와 허용량.

| 필드 | 타입 | 설명 |
|---|---|---|
| `plan_definition.id` | uuid | 플랜 PK |
| `plan_definition.key` | string | `free`, `pro`, `team`, `enterprise` |
| `plan_definition.name` | string | 표시명 |
| `plan_definition.is_active` | boolean | 활성 여부 |
| `plan_entitlement.id` | uuid | PK |
| `plan_entitlement.plan_id` | uuid | 플랜 참조 |
| `plan_entitlement.entitlement_key` | string | 예: `computer.runtime.minutes` |
| `plan_entitlement.value_json` | jsonb | 값 |
| `plan_entitlement.enforcement_mode` | enum | `hard_limit`, `soft_limit`, `warning_only` |

## 10.7 integration_connection

외부 툴/플랫폼 연동.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `integration_type` | enum | `github`, `gitlab`, `jira`, `linear`, `slack`, `notion`, `terminal` |
| `name` | string | 표시명 |
| `config_json` | jsonb | 일반 설정 |
| `secret_ref_id` | uuid nullable | 민감값 |
| `health_status` | enum | 상태 |
| `is_enabled` | boolean | 활성 여부 |

## 10.8 function_definition

관리자 관리형 실행 확장/함수 메타데이터. SQL reserved word를 피하기 위해 `function_definition`을 canonical 엔터티명으로 사용한다.

> **출시 범위**: v1/P2. `function_definition`은 Functions 전용 canonical 엔터티다. canonical persistence 구조를 먼저 정의해 두되, 실제 UI 노출과 API 활성화는 Functions 확장 기능 단계(Phase 9)에서 한다. Pipelines는 `function_definition`에 포함되지 않으며, 별도 리소스(`/api/admin/pipelines/...`)로 유지된다. Pipelines persistence 상세 구조는 추후 별도 정리한다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `name` | string | 표시명 |
| `description` | text nullable | 기능 설명 |
| `function_type` | enum | `filter`, `action` 등 Functions 전용 확장 유형 (`pipe` 제외 — Pipelines는 별도 리소스) |
| `content` | text | 함수 코드 또는 정의 본문 |
| `meta_json` | jsonb | 버전, 의존성, 파라미터 스키마 등 메타데이터 |
| `is_enabled` | boolean | 활성 여부 |
| `is_global` | boolean | 전체 사용자 노출 여부 |
| `created_by` | uuid | 생성 관리자 |
| `created_at` | datetime | 생성 시각 |
| `updated_at` | datetime | 수정 시각 |

---

## 11. 카테고리별 데이터 설계 원칙

## 11.1 General / Interface / Access

- 주로 `setting_definition + setting_value` 조합으로 관리한다.
- 예: 가입 허용 여부, JWT 만료, title generation prompt, autocomplete limit

## 11.2 Connections / Integrations

- `provider_connection`, `integration_connection` 같은 전용 리소스 테이블을 사용한다.
- 단순 default connection key 같은 값은 generic config로 둔다.

## 11.3 Models

- 모델 자체는 `model_registry`에서 관리한다.
- 기본 모델 선택, pinned model 정책, 플랜별 접근 제어는 별도 config 또는 relation table로 관리한다.

## 11.4 Documents / Web Search / Audio / Images

- 엔진 선택과 기본 동작은 generic config
- 외부 공급자 연결은 resource table
- workflow/node mapping 같은 복합 구조는 JSON 필드 허용

## 11.5 Computer / Browser / Agents

- 템플릿, 정책 프로파일, 역할 템플릿은 resource table
- timeout, concurrency, approval defaults 같은 값은 generic config

## 11.6 Billing & Plans

- 플랜, entitlement, usage policy는 전용 테이블 권장
- 단순 기능 on/off만 generic config로 두면 확장성이 떨어진다.

## 11.7 Database & Data Ops

- primary Postgres / Redis 연결값 자체는 deployment bootstrap 계층에서 관리한다.
- 업로드 크기 제한, signed URL TTL, export policy, artifact retention, storage prefix 정책은 generic config로 관리한다.
- 관리자 UI는 DB/Redis/object storage의 health check 결과와 운영 정책을 함께 보여줄 수 있어야 한다.

---

## 12. UI 렌더링을 위한 메타데이터

관리자 UI를 유연하게 만들기 위해 `setting_definition`에는 UI용 메타데이터가 포함되어야 한다.

추가 권장 필드:

| 필드 | 설명 |
|---|---|
| `section_key` | 어떤 섹션에 속하는지 |
| `group_key` | 같은 카드 묶음 식별자 |
| `placeholder` | 입력 placeholder |
| `help_link` | 문서 링크 |
| `testable` | 테스트 버튼 노출 여부 |
| `mask_on_read` | 조회 시 마스킹 여부 |
| `depends_on_json` | 다른 필드 값에 따라 표시 여부 |
| `options_json` | select / radio 옵션 |

이 구조를 가지면:

- 관리자 UI를 빠르게 확장할 수 있고
- OpenWebUI 수준의 세세한 설정 화면을 더 일관되게 렌더링할 수 있다.

---

## 13. Admin API 설계 원칙

- 카테고리 단위 조회와 저장을 지원한다.
- 필드 단위 부분 수정도 지원한다.
- 저장 전에 validation 가능해야 한다.
- 저장 후 test connection 가능해야 한다.
- 모든 응답은 `resolved value`, `rawOverride`, `metadata`, `applyMode`를 함께 줄 수 있어야 한다.
- 민감값은 절대 원문 반환 금지.

---

## 14. 공통 Admin Settings API

## 14.1 카테고리 목록 조회

`GET /api/admin/settings/categories`

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "items": [
      {
        "key": "access_identity",
        "title": "Access & Identity",
        "description": "Authentication and access defaults",
        "sortOrder": 10,
        "isActive": true
      },
      {
        "key": "computer_browser",
        "title": "Computer & Browser",
        "description": "Execution runtime policies",
        "sortOrder": 70,
        "isActive": true
      }
    ]
  },
  "meta": {
    "requestId": "req_cat_123",
    "timestamp": "2026-03-08T12:00:00Z"
  }
}
```

## 14.2 카테고리 설정 조회

`GET /api/admin/settings/{categoryKey}?scopeType=global&scopeId=global`

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "category": {
      "key": "access_identity",
      "title": "Access & Identity"
    },
    "scope": {
      "type": "global",
      "id": "global"
    },
    "version": 12,
    "sections": [
      {
        "key": "identity_access",
        "title": "Access Policies",
        "fields": [
          {
            "key": "access_identity.enable_signups",
            "label": "Enable New Sign Ups",
            "valueType": "boolean",
            "uiComponent": "toggle",
            "resolvedValue": true,
            "rawOverride": true,
            "defaultValue": false,
            "applyMode": "immediate",
            "dirty": false
          }
        ]
      }
    ]
  },
  "meta": {
    "requestId": "req_detail_123",
    "timestamp": "2026-03-08T12:00:00Z"
  }
}
```

## 14.3 카테고리 설정 저장

`PUT /api/admin/settings/{categoryKey}`

### 요청 예시

```json
{
  "scope": {
    "type": "global",
    "id": "global"
  },
  "version": 12,
  "reason": "Open beta sign-up policy update",
  "values": {
    "access_identity.enable_signups": true,
    "access_identity.jwt_expiration": "30d"
  }
}
```

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "newVersion": 13,
    "applyModeSummary": {
      "immediate": ["access_identity.enable_signups"],
      "restart_required": []
    },
    "changeLogIds": ["chg_123", "chg_124"]
  },
  "meta": {
    "requestId": "req_save_123",
    "timestamp": "2026-03-08T12:00:00Z"
  }
}
```

## 14.4 필드 단위 패치

`PATCH /api/admin/settings/{categoryKey}/{fieldKey}`

### 사용 예

- 토글 하나만 즉시 바꾸는 UX
- Secret field 한 개만 업데이트하는 UX

## 14.5 검증 API

`POST /api/admin/settings/{categoryKey}/validate`

### 요청 예시

```json
{
  "scope": {
    "type": "global",
    "id": "global"
  },
  "values": {
    "web_search.search_result_count": 20,
    "web_search.concurrent_requests": 5
  }
}
```

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "result": "passed",
    "errors": [],
    "warnings": []
  },
  "meta": {
    "requestId": "req_validate_123",
    "timestamp": "2026-03-08T12:00:00Z"
  }
}
```

## 14.6 테스트 실행 API

`POST /api/admin/settings/{categoryKey}/test`

예:

- Search provider 연결 테스트
- Browser backend 연결 테스트
- Jupyter 연결 테스트
- OpenAI provider key 테스트
- object storage signed URL smoke test
- Redis connectivity test

## 14.7 기본값 복원 API

`POST /api/admin/settings/{categoryKey}/reset`

## 14.8 설정 검색 API

`GET /api/admin/settings/search?q=browser`

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "items": [
      {
        "categoryKey": "computer_browser",
        "fieldKey": "computer_browser.idle_timeout_minutes",
        "label": "Idle Timeout Minutes"
      }
    ]
  },
  "meta": {
    "requestId": "req_search_123",
    "timestamp": "2026-03-08T12:00:00Z"
  }
}
```

## 14.9 최근 설정 조회 API

`GET /api/admin/settings/recent`

---

## 15. Resource Management API

복합 설정은 카테고리 API가 아니라 전용 resource API를 사용한다.

## 15.1 Provider Connections

- `GET /api/admin/provider-connections`
- `POST /api/admin/provider-connections`
- `GET /api/admin/provider-connections/{id}`
- `PATCH /api/admin/provider-connections/{id}`
- `POST /api/admin/provider-connections/{id}/test`
- `POST /api/admin/provider-connections/{id}/enable`
- `POST /api/admin/provider-connections/{id}/disable`
- `GET /api/admin/provider-connections/health`

## 15.2 Models

- `GET /api/admin/models`
- `POST /api/admin/models/import`
- `POST /api/admin/models/export`
- `PATCH /api/admin/models/{id}`
- `POST /api/admin/models/{id}/enable`
- `POST /api/admin/models/{id}/disable`
- `POST /api/admin/models/{id}/show`
- `POST /api/admin/models/{id}/hide`

## 15.3 Execution Templates

- `GET /api/admin/execution-templates`
- `POST /api/admin/execution-templates`
- `PATCH /api/admin/execution-templates/{id}`
- `POST /api/admin/execution-templates/{id}/clone`
- `POST /api/admin/execution-templates/{id}/validate`

## 15.4 Browser Policy Profiles

- `GET /api/admin/browser-policy-profiles`
- `POST /api/admin/browser-policy-profiles`
- `PATCH /api/admin/browser-policy-profiles/{id}`
- `POST /api/admin/browser-policy-profiles/{id}/validate`

## 15.5 Group Policies

- `GET /api/admin/groups/{groupId}/policy`
- `PUT /api/admin/groups/{groupId}/policy`
- `POST /api/admin/groups/{groupId}/policy/validate`

## 15.6 Plans & Entitlements

- `GET /api/admin/plans`
- `POST /api/admin/plans`
- `PATCH /api/admin/plans/{id}`
- `GET /api/admin/plans/{id}/entitlements`
- `PUT /api/admin/plans/{id}/entitlements`
- `POST /api/admin/users/{userId}/assign-plan`
- `POST /api/admin/teams/{teamId}/assign-plan`

## 15.7 Integrations

- `GET /api/admin/integrations`
- `POST /api/admin/integrations`
- `PATCH /api/admin/integrations/{id}`
- `POST /api/admin/integrations/{id}/test`

## 15.8 Functions

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

## 15.9 Pipelines

- `GET /api/admin/pipelines`
- `POST /api/admin/pipelines/upload`
- `POST /api/admin/pipelines/install-from-url`
- `PATCH /api/admin/pipelines/{id}`
- `POST /api/admin/pipelines/{id}/enable`
- `POST /api/admin/pipelines/{id}/disable`
- `GET /api/admin/pipelines/{id}/logs`

파이프라인 생성은 두 가지 방식으로 분리된다. `upload`는 파일 binary 또는 multipart form을 받고, `install-from-url`은 `sourceUrl`, `displayName`, `reason`을 받는 JSON payload를 사용한다. payload/validation/audit 포인트가 달라서 단일 generic endpoint가 아닌 분리 계약을 유지한다.

## 15.10 Data Export / Import Jobs

- `POST /api/admin/settings/export`
- `POST /api/admin/settings/import`
- `GET /api/admin/data-exports`
- `POST /api/admin/data-exports`
- `POST /api/admin/data-imports`

---

## 16. 감사 및 이력 API

## 16.1 변경 이력 조회

`GET /api/admin/settings/history?category=access_identity&limit=50`

## 16.2 특정 설정의 변경 이력

`GET /api/admin/settings/history/{fieldKey}`

## 16.3 스냅샷 생성

`POST /api/admin/settings/snapshots`

## 16.4 스냅샷 목록 조회

`GET /api/admin/settings/snapshots`

## 16.5 스냅샷 복원

`POST /api/admin/settings/snapshots/{snapshotId}/restore`

### 복원 정책

- 복원은 기본적으로 확인 다이얼로그와 사유 입력이 필요하다.
- 민감 설정 복원은 더 높은 권한 또는 2차 확인이 필요할 수 있다.

---

## 17. 비밀값 처리 정책

### 17.1 저장

- 비밀값은 `setting_secret` 또는 리소스형 `secret_ref_id`로 저장한다.
- 가능하면 외부 KMS 연동이 가능한 구조로 설계한다.

### 17.2 조회

- API 응답에는 `maskedPreview`만 전달한다.
- 원문 반환 금지.

### 17.3 업데이트

- 빈 문자열은 `유지`인지 `삭제`인지 명시적으로 구분해야 한다.
- secret 갱신은 `set`, `keep`, `clear` 같은 명시적 operation contract를 따른다.

### 17.4 감사

- 누가 secret을 추가/수정/삭제했는지 기록한다.
- 읽기 자체도 필요 시 감사 대상이 될 수 있다.

---

## 18. 반영 및 캐시 정책

### 18.1 반영 방식

| apply_mode | 의미 |
|---|---|
| `immediate` | 저장 즉시 반영 |
| `new_session` | 새 Computer/Browser 세션부터 반영 |
| `new_job` | 새 에이전트/파이프라인 실행부터 반영 |
| `restart_required` | 일부 워커 또는 서비스 재시작 필요 |

### 18.2 캐시 무효화

- 설정 저장 후 관련 카테고리 캐시를 무효화한다.
- 모델/연결/플랜/권한은 이벤트 기반 갱신을 권장한다.
- 실행 중 세션에 영향을 주지 않는 설정은 즉시 반영 가능하다.

### 18.3 설정 변경 이벤트

권장 이벤트 예시:

- `config.updated.general`
- `config.updated.models`
- `config.updated.computer_browser`
- `provider_connection.updated`
- `plan.updated`

---

## 19. 초기화 및 마이그레이션 원칙

### 19.1 최초 부팅

- 최소한의 인프라 정보만 env에서 읽는다.
- 최초 관리자 계정 생성 후, 제품 운영 설정은 관리자 UI에서 세팅한다.

### 19.2 env -> DB 마이그레이션

- 기존 env 기반 설정이 있다면 최초 1회 import 도구를 제공할 수 있다.
- import 후 관리자 UI가 canonical control surface가 되고 DB 설정이 persisted canonical state가 된다.

### 19.3 충돌 정책

- 같은 설정이 env와 DB에 동시에 존재하더라도, 제품 운영 시점에서는 DB가 우선한다.

---

## 20. MVP 우선 구현 범위

### 우선 구현 대상

- `setting_category`
- `setting_definition`
- `setting_value`
- `setting_secret`
- `setting_change_log`
- `setting_change_request` (approval queue persistence; approval queue API는 P1)
- `provider_connection`
- `model_registry`
- `execution_template`
- `browser_policy_profile`
- `group_policy`
- `plan_definition`
- `plan_entitlement`
- 카테고리 조회/저장/검증/검색 API
- provider connection test API
- approval queue CRUD API (`GET`, `POST`, `approve`, `reject`)

### 후속 고도화 대상

- `setting_snapshot`
- 세밀한 스코프 override
- 승인 큐 UI/UX 고도화 (복잡한 approval workflow 규칙, 다단계 승인 체인)
- `function_definition` (v1/P2, Functions 확장 기능 단계)
- 대규모 bulk import/export
- UI 메타데이터 기반 동적 폼 렌더링 100% 자동화
- 외부 KMS 연동

---

## 21. 결론

우리 플랫폼의 관리자 설정 시스템은 단순한 `.env 대체 수단`이 아니라, **제품 운영 그 자체를 담당하는 설정 플랫폼**이어야 한다.

따라서 다음 원칙을 확정한다.

- 관리자 UI는 설정의 canonical control surface다.
- DB는 설정의 persisted canonical state다.
- 단순 설정과 복합 리소스를 분리 설계한다.
- 민감값, 유효성 검사, 테스트, 변경 이력, 반영 방식이 함께 설계되어야 한다.
- OpenWebUI 수준의 세세한 설정 경험을 지원하되, 우리 플랫폼의 실행형 기능 확장을 감당해야 한다.

---

## 22. 다음 문서 추천

1. `권한 체크 규칙 세부서`
2. `운영 플레이북`
3. `백엔드 서비스 경계 정의서`
