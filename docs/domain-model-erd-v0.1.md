# 도메인 모델 및 ERD 초안 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 도메인 모델 및 ERD 초안
- **버전**: v0.1
- **목적**: 제품 전반의 핵심 엔터티와 관계를 정리하고, 구현 전 데이터 설계의 기준 축을 만든다.
- **관련 문서**: `docs/product-vision-v0.1.md`, `docs/permission-plan-matrix-v0.1.md`, `docs/computer-browser-agent-lifecycle-v0.1.md`, `docs/execution-infra-data-model-v0.1.md`, `docs/admin-settings-data-model-v0.1.md`, `docs/storage-architecture-v0.1.md`

---

## 2. 문서 목적

이 문서는 제품 전체를 관통하는 핵심 도메인 관계를 정리하기 위한 문서다. 기능 문서가 많아질수록 `워크스페이스`, `팀`, `그룹`, `프로젝트`, `문서`, `채팅`, `에이전트`, `세션`, `플랜`, `관리자 설정`이 서로 어떻게 연결되는지 기준점이 필요하다.

이 초안의 목적은 다음과 같다.

- 제품의 bounded context를 나눈다.
- 핵심 엔터티의 책임을 분리한다.
- Team과 Group, Workspace의 차이를 명확히 한다.
- 이후 실제 DB 설계와 API 설계를 위한 상위 개념 ERD를 제공한다.

---

## 3. 설계 원칙

- **Workspace First**: 대부분의 사용자 자산은 워크스페이스 범위 안에서 관리한다.
- **Project-Centric Execution**: 실행형 작업은 프로젝트 중심으로 연결한다.
- **Team != Group**: Team은 협업 단위, Group은 권한/정책 단위다.
- **Billing-Separated**: 플랜/과금/사용량은 협업 자산과 분리된 도메인으로 둔다.
- **Settings-As-Domain**: 관리자 설정은 단순 환경변수가 아니라 독립된 도메인으로 본다.
- **Metadata-Binary Separation**: 구조화 데이터는 DB에, 대용량 바이너리는 object storage에 둔다.
- **Execution as First-Class Domain**: Computer/Browser/Agent 실행은 제품 핵심 도메인이다.

---

## 4. Bounded Context 개요

| Context | 설명 |
|---|---|
| Identity & Access | 사용자, 인증, 역할, 그룹, 권한 |
| Workspace & Collaboration | 워크스페이스, 팀, 멤버십, 프로젝트, 문서, 채팅 |
| AI & Model Layer | 모델 공급자, 모델 레지스트리, 프롬프트, 에이전트 |
| Execution & Runtime | Computer 세션, Browser 세션, 작업, 산출물 |
| Billing & Usage | 플랜, 구독, entitlement, usage |
| Administration & Configuration | 관리자 설정, 감사 로그, 스냅샷 |

---

## 5. 핵심 엔터티 목록

### 5.1 Identity & Access

| 엔터티 | 역할 |
|---|---|
| `user` | 플랫폼 사용자 |
| `auth_identity` | 로그인 방식별 식별자 |
| `api_key` | 사용자/API 접근 키 |
| `group` | 권한/정책 묶음 |
| `group_membership` | 사용자와 그룹의 연결 |
| `role_assignment` | 전역 또는 범위별 역할 할당 |

### 5.2 Workspace & Collaboration

| 엔터티 | 역할 |
|---|---|
| `workspace` | 자산의 기본 소유 범위 |
| `workspace_membership` | 워크스페이스 참여자 및 역할 |
| `team` | 협업 단위 메타데이터 |
| `project` | 실행/문서/채팅의 중심 작업 단위 |
| `project_member` | 프로젝트 수준 세분 권한이 필요할 경우 사용 |
| `document` | 기획/정리/지식 자산 |
| `document_version` | 문서 버전 이력 |
| `comment` | 문서/프로젝트 코멘트 |
| `chat_thread` | 대화 세션 |
| `chat_message` | 대화 메시지 |
| `file_asset` | object storage 기반 파일 메타데이터 |
| `attachment` | 메시지/문서/프로젝트와 파일을 연결하는 첨부 관계 |
| `prompt_template` | 재사용 가능한 프롬프트 |

### 5.3 AI & Model Layer

| 엔터티 | 역할 |
|---|---|
| `provider_connection` | 외부 모델/서비스 연결 |
| `model_registry` | 모델 메타데이터와 정책 |
| `agent_template` | 에이전트 템플릿 |
| `agent_run` | 실제 에이전트 실행 |
| `approval_request` | 사용자 또는 관리자 승인이 필요한 작업 요청 |
| `orchestration_definition` | 멀티에이전트 조합 정의 |
| `orchestration_run` | 멀티에이전트 조합 실행 기록 |
| `workflow_definition` | 자동화 정의 |
| `workflow_run` | 자동화 실행 기록 |
| `evaluation_feedback` | 평가/피드백 데이터 |

### 5.4 Execution & Runtime

| 엔터티 | 역할 |
|---|---|
| `runtime_image` | 세션 생성용 베이스 이미지 |
| `execution_template` | 실행 템플릿 |
| `browser_backend` | 브라우저 실행 백엔드 정보 |
| `project_runtime_profile` | 프로젝트별 실행 기본값 |
| `execution_queue_item` | 세션/작업 스케줄링 대기열 |
| `computer_session` | Linux 기반 작업 세션 |
| `browser_session` | Chrome/브라우저 세션 |
| `execution_job` | 세션 내부 작업 단위 |
| `session_secret_mount` | 세션에 주입된 secret 메타데이터 |
| `session_event` | 세션 이벤트 스트림 |
| `session_artifact` | 로그/스크린샷/리포트 |
| `session_restore_point` | 세션 재개를 위한 복원 기준점 |
| `session_port` | 프리뷰 포트 |
| `session_log_chunk` | 세션 로그 청크 |
| `runtime_usage_record` | 실행 사용량 |
| `runtime_policy_binding` | 세션 생성 시 적용된 정책 스냅샷 |

### 5.5 Billing & Usage

| 엔터티 | 역할 |
|---|---|
| `billing_account` | 과금 주체 |
| `subscription` | 플랜 구독 상태 |
| `plan_definition` | 플랜 정의 |
| `plan_entitlement` | 플랜 허용량 및 기능 |
| `usage_record` | 토큰/세션/스토리지 사용량 |
| `seat_allocation` | 팀 좌석 할당 정보 |

### 5.6 Administration & Configuration

| 엔터티 | 역할 |
|---|---|
| `setting_category` | 관리자 설정 카테고리 |
| `setting_definition` | 설정 필드 스키마 |
| `setting_value` | 실제 설정값 |
| `setting_secret` | 민감 설정값 |
| `setting_change_log` | 설정 변경 이력 |
| `setting_change_request` | 승인 대기 중인 설정 변경 요청 (approval queue) |
| `setting_snapshot` | 설정 스냅샷 |
| `setting_validation_run` | 설정 검증 실행 기록 |
| `setting_test_run` | 설정 테스트 실행 기록 |
| `browser_policy_profile` | 브라우저 실행 정책 묶음 |
| `group_policy` | 그룹별 권한/기능 정책 |
| `integration_connection` | 외부 시스템 연동 객체 |
| `function_definition` | 관리자 관리형 실행 확장/함수 메타데이터 (v1 범위) |
| `audit_log` | 감사 로그 |

---

## 6. 핵심 관계 원칙

### 6.1 Workspace

- 모든 자산은 기본적으로 하나의 `workspace`에 소속된다.
- `workspace_type`은 `personal`, `team`, `enterprise`를 가질 수 있다.
- 개인 자산과 팀 자산은 같은 추상 모델을 공유하되, ownership과 membership 규칙이 다르다.

### 6.2 Team

- `team`은 협업 운영의 메타 엔터티다.
- 일반적으로 팀은 하나의 `team workspace`와 1:1 또는 강한 연관을 가진다.
- 팀 플랜, 좌석, 팀 정책, 팀 멤버십은 팀 단위로 관리한다.

### 6.3 Group

- `group`은 팀과 별개로, 사용자에게 권한/정책을 부여하는 관리자 단위다.
- 같은 사용자가 하나 이상의 그룹에 속할 수 있다.
- 그룹은 기본 모델, 기능 접근, 공유 정책, 업로드 정책 등에 영향을 줄 수 있다.

### 6.4 Project

- `project`는 실행형 작업의 중심 단위다.
- 문서, 채팅, 에이전트 실행, Computer 세션, 브라우저 테스트는 프로젝트와 연결될 수 있어야 한다.
- 일부 자산은 프로젝트 없이 워크스페이스에만 존재할 수 있다.

### 6.5 Chat / Document

- `chat_thread`는 워크스페이스에 속하며, 필요 시 프로젝트와 연결된다.
- `document`도 워크스페이스에 속하며, 필요 시 프로젝트와 연결된다.
- 문서와 채팅은 실행형 작업의 보조 자산이지만, 프로젝트와 연계될 때 가치가 커진다.
- 첨부 이미지와 파일 본문은 object storage에 두고, DB에는 `file_asset`와 `attachment` 메타데이터만 저장한다.

### 6.6 Agent / Execution

- `agent_run`은 채팅, 프로젝트, 세션 중 하나 이상과 연결될 수 있다.
- `approval_request`는 에이전트 실행, 브라우저 액션, 파일 변경, 배포 액션 등과 연결될 수 있다.
- `computer_session`과 `browser_session`은 주로 프로젝트 중심으로 생성된다.
- 세션에서 생성된 artifact는 워크스페이스 및 프로젝트 범위를 상속한다.
- 실행 요청, 세션, 에이전트 실행은 모두 canonical `execution_mode`를 가져 `conversation`, `research`, `development`, `test`를 일관되게 표현한다.

### 6.7 Billing

- `billing_account`는 개인, 팀, 엔터프라이즈 조직이 될 수 있다.
- `subscription`은 `billing_account`에 연결된다.
- `usage_record`는 사용자/워크스페이스/팀/프로젝트 차원으로 집계될 수 있어야 한다.

---

## 7. 권장 핵심 엔터티 구조

### 7.1 user

| 필드 | 설명 |
|---|---|
| `id` | 사용자 ID |
| `email` | 이메일 |
| `name` | 표시 이름 |
| `status` | `active`, `pending`, `suspended` |
| `global_role` | 기본 전역 역할 |
| `created_at` | 생성 시각 |

### 7.2 workspace

| 필드 | 설명 |
|---|---|
| `id` | 워크스페이스 ID |
| `workspace_type` | `personal`, `team`, `enterprise` |
| `name` | 이름 |
| `owner_user_id` | personal일 때 주 소유자 |
| `team_id` | team/enterprise일 때 연결 팀 |
| `billing_account_id` | 과금 계정 |
| `created_at` | 생성 시각 |

### 7.3 workspace_membership

| 필드 | 설명 |
|---|---|
| `workspace_id` | 워크스페이스 |
| `user_id` | 사용자 |
| `role` | `member`, `admin`, `owner` 등 |
| `joined_at` | 참여 시각 |

### 7.3a team

> 협업 운영의 핵심 단위. `workspace`, `billing_account`와 강하게 연결되며, 좌석/플랜/정책을 팀 단위로 관리한다.

| 필드 | 설명 |
|---|---|
| `id` | 팀 UUID |
| `name` | 팀 표시 이름 |
| `slug` | URL 친화적 식별자 (초대 링크, 팀 URL에 사용) |
| `description` | 팀 설명 nullable |
| `avatar_url` | 팀 로고/아바타 nullable |
| `team_type` | `team`, `enterprise` |
| `status` | `active`, `suspended`, `pending_setup`, `deleted` |
| `owner_user_id` | 최초 생성 소유자 (Team Owner) |
| `primary_workspace_id` | 연결된 팀 워크스페이스 nullable (설정 전 null) |
| `billing_account_id` | 과금 계정 |
| `seat_limit` | 최대 좌석 수 (플랜/계약에 따라 결정) |
| `default_group_id` | 가입 시 자동 배정 그룹 nullable |
| `invite_policy` | `admin_only`, `any_member` |
| `email_domain_restriction` | 허용 이메일 도메인 (Enterprise SSO 도메인 매칭용) nullable |
| `sso_enabled` | SSO 활성화 여부 |
| `created_at` | 생성 시각 |
| `updated_at` | 수정 시각 |
| `deleted_at` | 삭제 시각 (soft delete) nullable |

### 7.4 project

| 필드 | 설명 |
|---|---|
| `id` | 프로젝트 ID |
| `workspace_id` | 소속 워크스페이스 |
| `name` | 프로젝트명 |
| `description` | 설명 |
| `status` | 상태 |
| `created_by_user_id` | 생성자 |
| `archived_at` | 아카이브 시각 |

### 7.5 document

| 필드 | 설명 |
|---|---|
| `id` | 문서 ID |
| `workspace_id` | 워크스페이스 |
| `project_id` | 연결 프로젝트 nullable |
| `title` | 제목 |
| `visibility` | `private`, `workspace`, `team` |
| `created_by_user_id` | 생성자 |

### 7.6 chat_thread

| 필드 | 설명 |
|---|---|
| `id` | 스레드 ID |
| `workspace_id` | 워크스페이스 |
| `project_id` | 연결 프로젝트 nullable |
| `title` | 대화명 |
| `model_id` | 기본 모델 |
| `created_by_user_id` | 생성자 |

### 7.7 agent_run

| 필드 | 설명 |
|---|---|
| `id` | 실행 ID |
| `workspace_id` | 워크스페이스 |
| `project_id` | 프로젝트 nullable |
| `chat_thread_id` | 연결 대화 nullable |
| `agent_template_id` | 템플릿 |
| `execution_mode` | `conversation`, `research`, `development`, `test` |
| `status` | `pending`, `waiting_for_resources`, `waiting_for_approval`, `running`, `retrying`, `completed`, `failed`, `cancelled` |
| `triggered_by_user_id` | 트리거한 사용자 |

### 7.8 approval_request

이 엔터티는 관리자 설정 변경 승인용 `setting_change_request`와 별개다. `approval_request`는 실행 도메인에서 사용자 또는 운영자의 명시적 승인이 필요한 액션을 표현하고, 설정 저장 승인 큐는 admin settings domain에서 별도로 관리한다.

| 필드 | 설명 |
|---|---|
| `id` | 승인 요청 ID |
| `workspace_id` | 워크스페이스 |
| `project_id` | 프로젝트 nullable |
| `agent_run_id` | 관련 에이전트 실행 nullable |
| `computer_session_id` | 관련 세션 nullable |
| `approval_type` | `file_delete`, `bulk_change`, `external_login`, `deploy`, `browser_sensitive_action` 등 |
| `status` | `pending`, `approved`, `rejected`, `expired` |
| `requested_by_actor_type` | `agent`, `system`, `user` |
| `requested_by_actor_ref` | 요청 주체 참조 |
| `resolved_by_user_id` | 승인/거절한 사용자 nullable |
| `reason` | 승인 요청 사유 |
| `resolved_reason` | 승인/거절 사유 |

### 7.9 computer_session

| 필드 | 설명 |
|---|---|
| `id` | 세션 ID |
| `workspace_id` | 워크스페이스 |
| `project_id` | 프로젝트 |
| `agent_run_id` | 연관 에이전트 실행 nullable |
| `execution_mode` | `conversation`, `research`, `development`, `test` |
| `browser_requested` | 요청 시점 브라우저 필요 여부 |
| `status` | `requested`, `queued`, `provisioning`, `restoring`, `ready`, `running`, `paused`, `warm`, `stopping`, `completed`, `terminated`, `failed`, `expired` |
| `execution_template_id` | 템플릿 |
| `created_by_user_id` | 생성자 |

### 7.10 billing_account

| 필드 | 설명 |
|---|---|
| `id` | 과금 계정 |
| `account_type` | `user`, `team`, `enterprise` |
| `owner_ref` | 실제 소유 주체 |
| `status` | 상태 |

### 7.11 file_asset

| 필드 | 설명 |
|---|---|
| `id` | 파일 자산 ID |
| `workspace_id` | 워크스페이스 |
| `project_id` | 연결 프로젝트 nullable |
| `purpose` | `chat_attachment`, `document_attachment`, `project_asset`, `export_file` 등 |
| `status` | `pending_upload`, `uploaded`, `ready`, `scan_pending`, `blocked`, `deleted`, `expired` |
| `storage_provider` | `vercel_blob`, `s3`, `r2`, `gcs`, `local` |
| `storage_key` | 저장소 내부 키 |
| `original_filename` | 업로드 당시 파일명 |
| `mime_type` | MIME 타입 |
| `size_bytes` | 파일 크기 |
| `checksum_sha256` | 무결성 검증값 |
| `visibility_scope` | `private`, `workspace`, `team` |
| `retention_policy` | 보존 정책 키 또는 등급 |
| `created_by_user_id` | 업로더 |
| `created_at` | 생성 시각 |

### 7.12 session_artifact

| 필드 | 설명 |
|---|---|
| `id` | 산출물 ID |
| `workspace_id` | 워크스페이스 |
| `project_id` | 프로젝트 |
| `computer_session_id` | 세션 |
| `browser_session_id` | 브라우저 세션 nullable |
| `execution_job_id` | 작업 nullable |
| `artifact_type` | `timeline`, `log`, `browser_action_log`, `console_network_log`, `file_change_list`, `screenshot`, `recording`, `test_report`, `diff`, `preview_snapshot`, `summary` 등 |
| `storage_provider` | `vercel_blob`, `s3`, `r2`, `gcs`, `local` |
| `storage_key` | 저장소 내부 키 |
| `mime_type` | MIME 타입 |
| `size_bytes` | 파일 크기 |
| `checksum_sha256` | 무결성 검증값 |
| `retention_policy` | 보존 정책 키 또는 등급 |
| `promotion_state` | `ephemeral`, `promoted`, `copied_to_asset`, `expired` |
| `promoted_file_asset_id` | 승격된 장기 자산 nullable |
| `created_at` | 생성 시각 |

### 7.13 execution_queue_item

| 필드 | 설명 |
|---|---|
| `id` | 대기열 ID |
| `workspace_id` | 워크스페이스 |
| `project_id` | 프로젝트 nullable |
| `requested_execution_mode` | `conversation`, `research`, `development`, `test` |
| `status` | `queued`, `assigned`, `cancelled`, `expired` |

### 7.14 session_log_chunk

| 필드 | 설명 |
|---|---|
| `id` | 로그 청크 ID |
| `computer_session_id` | 세션 |
| `execution_job_id` | 작업 nullable |
| `stream_type` | `stdout`, `stderr`, `system` |
| `chunk_index` | 정렬 순번 |
| `content_text` | 로그 본문 |
| `created_at` | 생성 시각 |

### 7.15 attachment

| 필드 | 설명 |
|---|---|
| `id` | 첨부 관계 ID |
| `file_asset_id` | 연결된 파일 자산 |
| `resource_type` | `chat_message`, `document`, `project`, `comment` |
| `resource_id` | 연결 대상 ID |
| `attachment_role` | `reference`, `input`, `result`, `export` 등 |
| `visibility_scope` | `private`, `workspace`, `team` |
| `sort_order` | 노출 순서 |
| `created_by_user_id` | 첨부 생성자 |
| `created_at` | 생성 시각 |

### 7.16 browser_policy_profile

| 필드 | 설명 |
|---|---|
| `id` | 브라우저 정책 ID |
| `name` | 정책 이름 |
| `allow_external_login` | 외부 로그인 허용 여부 |
| `allow_uploads` | 업로드 허용 여부 |
| `allow_downloads` | 다운로드 허용 여부 |
| `recording_policy` | `none`, `screenshots`, `session_recording` |

### 7.17 group_policy

| 필드 | 설명 |
|---|---|
| `id` | 그룹 정책 ID |
| `group_id` | 그룹 |
| `default_model_id` | 기본 모델 nullable |
| `permissions_json` | 권한 매트릭스 |
| `feature_flags_json` | 기능 on/off |

### 7.18 integration_connection

| 필드 | 설명 |
|---|---|
| `id` | 연동 ID |
| `integration_type` | `github`, `gitlab`, `jira`, `linear`, `slack`, `notion`, `terminal` |
| `name` | 표시명 |
| `secret_ref_id` | 민감값 nullable |
| `health_status` | 연결 상태 |

### 7.19 setting_validation_run

| 필드 | 설명 |
|---|---|
| `id` | 검증 실행 ID |
| `category_key` | 검증 카테고리 |
| `scope_type` | 스코프 |
| `result` | `passed`, `failed` |
| `validated_at` | 검증 시각 |

### 7.20 setting_test_run

| 필드 | 설명 |
|---|---|
| `id` | 테스트 실행 ID |
| `category_key` | 테스트 카테고리 |
| `test_type` | `provider_connection`, `web_search`, `browser_backend`, `object_storage` 등 |
| `target_type` | 대상 종류 |
| `result` | `passed`, `failed`, `partial` |
| `tested_at` | 실행 시각 |

---

## 8. 텍스트 ERD

```text
user 1--n auth_identity
user 1--n api_key
user n--m group (through group_membership)
user 1--n role_assignment
workspace 1--n role_assignment
project 0..1--n role_assignment

user 1--1 personal workspace
team 1--1 team workspace
workspace 1--n workspace_membership

workspace 1--n project
workspace 1--n document
workspace 1--n chat_thread
workspace 1--n file_asset
workspace 1--n session_artifact
workspace 1--n execution_queue_item
workspace 1--n prompt_template
workspace 1--n agent_run
workspace 1--n computer_session

project 1--n document
project 1--n chat_thread
project 1--n attachment
project 1--n agent_run
project 1--n approval_request
project 1--n execution_queue_item
project 1--n computer_session
project 1--n session_artifact
project 1--n workflow_run

provider_connection 1--n model_registry
runtime_image 1--n execution_template
agent_template 1--n agent_run

chat_thread 1--n chat_message
document 1--n document_version
chat_message 1--n attachment
document 1--n attachment
comment 1--n attachment
attachment n--1 file_asset
orchestration_definition 1--n orchestration_run
agent_run 1--n execution_job
agent_run 1--n approval_request

browser_backend 1--n browser_session
computer_session 1--0..1 browser_session
computer_session 1--n approval_request
computer_session 1--n session_secret_mount
computer_session 1--n session_artifact
computer_session 1--n session_restore_point
computer_session 1--n session_event
computer_session 1--n session_log_chunk
computer_session 1--n runtime_usage_record
computer_session 1--n runtime_policy_binding
execution_job 1--n session_artifact
execution_job 1--n session_log_chunk

billing_account 1--n subscription
subscription n--1 plan_definition
plan_definition 1--n plan_entitlement

workspace n--1 billing_account

group 1--0..1 group_policy
browser_policy_profile 1--n execution_template
setting_secret 1--n provider_connection
setting_secret 1--n integration_connection

setting_category 1--n setting_definition
setting_category 1--n setting_validation_run
setting_category 1--n setting_test_run
setting_definition 1--n setting_value
setting_definition 1--n setting_change_log
setting_value 0..1--1 setting_secret
setting_change_request n--1 user (requested_by)
setting_change_request 1--0..n setting_change_log (승인 시 field 수만큼 생성, 반려/만료 시 0개)
audit_log n--1 user (actor)
```

---

## 9. 소유권 규칙

### 개인 워크스페이스

- 기본 소유자는 사용자 본인
- 문서, 채팅, 프로젝트, 실행 결과는 기본적으로 비공개

### 팀 워크스페이스

- 기본 소유 주체는 팀
- 개인이 생성했더라도 팀 워크스페이스 안에서 만든 자산은 팀 자산으로 본다.

### 프로젝트 산출물

- 세션 로그, 스크린샷, 테스트 결과는 프로젝트와 워크스페이스 범위를 상속한다.

### 그룹 정책

- 그룹은 소유권을 바꾸지 않지만, 접근과 기능 허용 범위에 영향을 준다.

---

## 10. 설계상 중요한 구분

### 10.1 Team vs Workspace

- 팀은 협업 조직 단위
- 워크스페이스는 자산 소유 단위
- 팀 워크스페이스는 둘이 강하게 연결되지만 개념상 동일하지 않다.

### 10.2 Group vs Team

- Team: 같이 일하는 협업 단위
- Group: 관리자 정책을 적용하기 위한 권한 단위

### 10.3 Chat vs Project

- 채팅은 입구
- 프로젝트는 실행의 중심 단위
- 실행형 플랫폼에서는 프로젝트가 더 중심적이다.

### 10.4 Settings vs Runtime Policy

- 관리자 설정은 설정 도메인에 저장
- 실제 세션에는 `resolved policy snapshot`이 적용되어 실행 중 일관성을 보장

---

## 11. MVP 우선 구현 대상

이 목록은 `minimum MVP`보다 넓은 `full MVP target` 기준이다. 즉, 가장 빠른 vertical slice용 최소 세트는 `docs/db-table-migration-order-v0.1.md`의 최소 MVP 테이블 세트를 따르고, 본 목록은 MVP 기간 내 우선 설계/구현해야 할 확장 대상을 함께 포함한다.

### 반드시 포함

- user
- workspace
- workspace_membership
- project
- document
- document_version
- chat_thread
- chat_message
- file_asset
- attachment
- provider_connection
- model_registry
- agent_run
- approval_request
- execution_queue_item
- computer_session
- browser_session
- runtime_image
- execution_template
- session_port
- session_event
- session_log_chunk
- session_artifact
- billing_account
- subscription
- plan_definition
- plan_entitlement
- setting_definition / setting_value / setting_secret
- audit_log

### v1 이후 강화

- orchestration_definition
- workflow_definition / workflow_run
- project_member 세분 권한
- evaluation_feedback 정교화
- seat_allocation 상세화
- function_definition (admin-managed 실행 확장)

---

## 12. 미결정 항목

- 프로젝트 수준 독립 멤버십이 필요한지 여부
- 팀 워크스페이스와 enterprise 워크스페이스를 하나의 subtype 구조로 처리할지 여부
- prompt_template, knowledge_base, note 엔터티를 분리할지 여부
- workflow_definition과 pipeline_definition을 통합할지 여부
- billing_account와 workspace의 1:1 강결합 여부

---

## 13. 결론

이 제품의 핵심 도메인은 단순한 AI 채팅이 아니라, **워크스페이스-프로젝트-실행세션-브라우저-플랜-관리자 설정**이 서로 강하게 연결된 구조다.

따라서 다음 원칙을 확정한다.

- 워크스페이스는 자산 소유의 기본 축이다.
- 프로젝트는 실행형 작업의 중심 단위다.
- Team과 Group은 서로 다른 책임을 가진다.
- Billing과 Admin Settings는 독립 도메인으로 분리한다.
- 실행 인프라는 제품 핵심 도메인이므로 ERD에서 1급 시민으로 다뤄야 한다.
- 첨부파일과 artifact의 바이너리 본문은 DB 밖 object storage에 두는 것을 기본 원칙으로 한다.

---

## 14. 다음 문서 추천

1. `백엔드 서비스 경계 정의서`
2. `권한 체크 규칙 세부서`
3. `테스트 전략 문서`
