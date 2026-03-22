# DB 테이블 초안 및 마이그레이션 순서 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 DB 테이블 초안 및 마이그레이션 순서 문서
- **버전**: v0.1
- **목적**: 실제 구현 시 어떤 테이블을 어떤 순서로 생성해야 안정적으로 제품을 확장할 수 있는지 정의한다.
- **관련 문서**: `docs/domain-model-erd-v0.1.md`, `docs/execution-infra-data-model-v0.1.md`, `docs/admin-settings-data-model-v0.1.md`, `docs/mvp-implementation-order-v0.1.md`, `docs/storage-architecture-v0.1.md`

---

## 2. 문서 목적

도메인 문서가 있어도 실제 구현에서는 마이그레이션 순서가 잘못되면 개발이 꼬이기 쉽다. 이 문서는 `무엇을 먼저 테이블로 만들고`, `무엇은 나중에 붙여도 되는지`를 정리한 문서다.

핵심 목표는 다음과 같다.

- MVP 구현 순서와 맞는 DB 생성 순서를 제시한다.
- 테이블 의존성을 기준으로 마이그레이션 묶음을 나눈다.
- 관리자 설정과 실행 인프라처럼 뒤늦게 붙기 어려운 영역을 조기에 위한 골격으로 포함시킨다.

---

## 3. 전반 원칙

- **Create Backbone First**: 인증, 워크스페이스, 프로젝트가 가장 먼저 와야 한다.
- **Execution Hooks Early**: 세션/사용량/정책 연결 포인트는 초기에 심는다.
- **Config Early, Complexity Later**: 설정 시스템의 골격은 초기에 만들고, 카테고리 세부값은 나중에 채운다.
- **Additive Migrations**: 초기에는 파괴적 변경보다 확장형 마이그레이션을 선호한다.
- **Auditability from Start**: 감사 로그 테이블은 너무 늦게 만들지 않는다.

---

## 4. 마이그레이션 배치 개요

```text
Batch 0  Foundation
Batch 1  Identity & Access
Batch 2  Workspace & Collaboration Core
Batch 3  Chat & Documents
Batch 4  Model / Provider Core
Batch 5  Execution Runtime Core
Batch 6  Agent / Workflow Core
Batch 7  Billing / Usage Core
Batch 8  Admin Settings Core
Batch 9  Audit / Snapshot / Data Ops
Batch 10 Extensions & Optimization
```

---

## 5. Batch 0 Foundation

### 목적

- 공통적으로 참조되는 기반 구조 생성

### 권장 테이블

- `schema_version` 또는 migration metadata
- 공통 timestamp / soft-delete convention 준비
- 공통 enum 또는 lookup 구조(선택)

### 비고

- 실제 애플리케이션 테이블은 거의 없지만, 추후 마이그레이션 운영 안정성을 위해 필요할 수 있다.

---

## 6. Batch 1 Identity & Access

### 목적

- 인증과 권한의 최소 단위 확정

### 권장 테이블

- `user`
- `auth_identity`
- `api_key`
- `group`
- `group_membership`
- `role_assignment`

### 이유

- 이후 모든 자산과 관리자 기능이 user/group/role을 참조한다.

---

## 7. Batch 2 Workspace & Collaboration Core

### 목적

- 자산 소유 구조와 협업 단위 확정

### 권장 테이블

- `team`
- `billing_account` (골격)
- `workspace`
- `workspace_membership`
- `project`
- `project_member` (선택적 골격)

### 이유

- 프로젝트가 실행형 작업의 중심이므로 이 단계에서 반드시 들어가야 한다.

---

## 8. Batch 3 Chat & Documents

### 목적

- 사용자 가치가 바로 보이는 자산 계층 추가

### 권장 테이블

- `chat_thread`
- `chat_message`
- `file_asset`
- `attachment`
- `document`
- `document_version`
- `comment`
- `prompt_template`

### 이유

- 채팅은 제품 입구고, 문서는 결과 축적의 핵심이므로 비교적 이른 시점에 필요
- 첨부파일 본문은 object storage에 두더라도, 메타데이터 테이블은 초기에 함께 설계해야 함

---

## 9. Batch 4 Model / Provider Core

### 목적

- 멀티모델 플랫폼의 기반을 형성

### 권장 테이블

- `provider_connection`
- `model_registry`
- 선택적 `model_policy_binding`

### 이유

- 채팅, 에이전트, 브라우저 리서치 모두 모델과 공급자 구조에 의존

---

## 10. Batch 5 Execution Runtime Core

### 목적

- 실행형 플랫폼의 핵심 테이블 추가

### 권장 테이블

- `execution_cluster`
- `execution_node_pool`
- `execution_node`
- `node_capacity_snapshot`
- `runtime_image`
- `browser_policy_profile`
- `execution_template`
- `browser_backend`
- `project_runtime_profile`
- `execution_queue_item`
- `computer_session`
- `browser_session`
- `execution_job`
- `session_port`
- `session_log_chunk`
- `session_artifact`
- `session_restore_point`
- `session_event`
- `runtime_usage_record`
- `runtime_policy_binding`

### 이유

- 이 배치가 들어가야 세션 생성/브라우저/로그/미리보기 기능 구현 가능

---

## 11. Batch 6 Agent / Workflow Core

### 목적

- 실행 자동화 계층 추가

### 권장 테이블

- `agent_template`
- `agent_run`
- `approval_request`
- `orchestration_definition`
- `orchestration_run` (선택)
- `workflow_definition`
- `workflow_run`
- `evaluation_feedback`

### 이유

- 사용자 자동화와 에이전트 중심 작업을 위해 필요하지만, 세션 코어 다음에 와도 된다.

---

## 12. Batch 7 Billing / Usage Core

### 목적

- 플랜과 사용량 제한 구조를 실체화

### 권장 테이블

- `plan_definition`
- `plan_entitlement`
- `subscription`
- `usage_record`
- `seat_allocation`

### 이유

- 초기 결제가 없어도, 제한 적용과 수동 플랜 운영을 위해 필요

---

## 13. Batch 8 Admin Settings Core

### 목적

- `.env`가 아닌 관리자 UI 기반 운영 구조를 확정

### 권장 테이블

- `setting_category`
- `setting_definition`
- `setting_value`
- `setting_secret`
- `setting_change_request`
- `setting_validation_run`
- `setting_test_run`
- `session_secret_mount`
- `group_policy`
- `integration_connection`

### 이유

- 관리자 콘솔과 운영 구조의 기반
- `setting_change_request`는 고위험 설정 변경의 approval queue 엔터티다. approval queue API(P1)가 실제로 저장 가능한 구조가 되려면 이 배치에서 persistence를 확보해야 한다.
- `session_secret_mount`가 `setting_secret`를 직접 참조하는 경우 이 배치에서 함께 잡는 편이 FK/운영 경계에 더 안전하다.

---

## 14. Batch 9 Audit / Snapshot / Data Ops

### 목적

- 감사와 복원 가능성 확보

### 권장 테이블

- `audit_log`
- `audit_attachment`
- `setting_change_log`
- `setting_snapshot`
- 선택적 `data_export_job`
- 선택적 `data_import_job`

### 이유

- 운영 안정성은 후반부에 붙여도 되지만, 너무 늦으면 데이터가 비어버린다.

---

## 15. Batch 10 Extensions & Optimization

### 예시 (v1/P2 단계 추가 후보)

- `function_definition` — Functions(v1/P2) 구현 시 이 배치에 추가되는 대표 canonical 테이블. admin-managed 실행 확장/함수 메타데이터를 저장한다.
- 검색 인덱스용 보조 테이블
- analytics aggregation 테이블
- recommendation / cache materialization
- session recording index
- advanced collaboration presence

---

## 16. 최소 MVP 테이블 세트

정말 빠르게 MVP를 띄우기 위한 최소 세트는 아래다.

이 섹션은 `full MVP target`이 아니라, 가장 빠른 vertical slice를 위한 `minimum MVP` 기준이다.

- `user`
- `workspace`
- `workspace_membership`
- `project`
- `chat_thread`
- `chat_message`
- `file_asset`
- `attachment`
- `provider_connection`
- `model_registry`
- `runtime_image`
- `setting_secret`
- `agent_template`
- `execution_template`
- `browser_policy_profile`
- `browser_backend`
- `computer_session`
- `browser_session`
- `execution_job`
- `session_port`
- `session_event`
- `session_log_chunk`
- `session_artifact`
- `agent_run`
- `approval_request`
- `runtime_usage_record`
- `setting_category`
- `setting_definition`
- `setting_value`

### 설명

- 이 세트만 있어도 `로그인 -> 프로젝트 -> 채팅 -> 세션 -> 브라우저 -> 로그/이벤트 -> 결과 확인` 흐름의 골격은 만들 수 있다.

---

## 17. 외래키 설계 원칙

- 핵심 자산은 가능하면 `workspace_id`를 직접 가진다.
- 실행 관련 자산은 가능하면 `project_id` 또는 `computer_session_id`를 직접 가진다.
- 감사 로그는 지나치게 강한 FK보다 유연한 `resource_type + resource_id` 조합이 유리할 수 있다.
- 아주 큰 이벤트/로그 테이블은 FK 강제보다 검색성과 적재 성능을 우선 고려할 수 있다.
- 바이너리 본문은 DB에 직접 저장하지 않고 object storage로 분리하며, 테이블에는 메타데이터와 참조만 둔다.

---

## 18. 마이그레이션 위험 지점

### 18.1 enum 남발

- 상태값이 자주 바뀌는 테이블에 DB enum을 너무 강하게 쓰면 마이그레이션 비용이 커질 수 있다.

### 18.2 settings 구조 고정화

- `setting_value.value_json` 없이 너무 세밀하게 컬럼을 나누면 확장성이 떨어진다.

### 18.3 execution 로그 테이블 폭발

- `session_event`, `runtime_usage_record`, `audit_log`는 빠르게 커질 수 있으므로 partitioning 또는 retention 전략을 고려해야 한다.

### 18.4 project / workspace ownership 혼동

- project, document, chat_thread에 workspace_id를 두지 않으면 나중에 ownership이 흔들릴 수 있다.

### 18.5 대용량 바이너리 DB 적재

- 이미지, 업로드 파일, 녹화본을 DB에 직접 적재하면 백업/성능/비용 문제가 커진다.
- `file_asset`, `session_artifact` 같은 메타데이터 테이블과 object storage를 분리하는 것이 기본 전략이다.

---

## 19. 시드 데이터 권장 항목

초기 개발/운영을 위해 아래 시드를 권장한다.

- 기본 관리자 계정
- 기본 workspace type 정의
- 기본 plan (`free`, `pro`, `team`, `enterprise`)
- 기본 setting category
- 기본 execution template (`fullstack-node`, `python-api`)
- 기본 browser backend

---

## 20. 권장 마이그레이션 구현 순서

### 실제 개발 순서 추천

1. Identity & Access
2. Workspace & Project
3. Model / Provider
4. Chat
5. Execution Runtime Core
6. Documents
7. Agent Core
8. Billing / Usage
9. Admin Settings
10. Audit / Snapshot

### 이유

- 사용자가 가치 체감하는 흐름을 먼저 만들고
- 운영 안정성을 뒤따라 붙이는 방식이 가장 현실적

---

## 21. 결론

테이블은 기능 목록 순서가 아니라, **소유 구조 -> 작업 구조 -> 실행 구조 -> 운영 구조** 순으로 설계하는 것이 맞다.

따라서 구현 시 다음 순서를 따른다.

- 인증과 워크스페이스
- 프로젝트와 모델
- 채팅과 실행 세션
- 브라우저와 에이전트
- 플랜과 관리자 설정
- 감사와 복원

---

## 22. 다음 문서 추천

1. `백엔드 서비스 경계 정의서`
2. `테스트 전략 문서`
3. `운영 플레이북`
