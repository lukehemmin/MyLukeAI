# 실행 인프라 데이터 모델 초안 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 실행 인프라 데이터 모델 초안
- **버전**: v0.1
- **목적**: 독립된 실행 서버에서 Computer, Browser, Agent 작업을 수행하기 위한 인프라 데이터 모델과 핵심 관계를 정의한다.
- **관련 문서**: `docs/computer-browser-agent-lifecycle-v0.1.md`, `docs/admin-settings-data-model-v0.1.md`, `docs/permission-plan-matrix-v0.1.md`, `docs/domain-model-erd-v0.1.md`, `docs/storage-architecture-v0.1.md`

---

## 2. 문서 목적

우리 플랫폼은 웹 앱 서버와 별도로 독립된 실행 인프라를 가지고, 그 위에서 프로젝트별 컨테이너와 브라우저 세션을 생성한다. 이 문서는 그 실행 평면(execution plane)을 구성하는 핵심 엔터티와 관계를 정리한 문서다.

핵심 목표는 다음과 같다.

- 앱 서버와 실행 인프라를 분리 설계한다.
- Computer, Browser, Agent, Artifact, Usage를 서로 연결한다.
- 세션 생성, 복원, 재개, 종료, 실패 복구를 데이터 모델 수준에서 표현한다.
- 추후 멀티에이전트, 녹화, 스냅샷, 팀 관전까지 확장 가능한 구조를 만든다.
- 메타데이터 저장소, 임시 상태 저장소, 바이너리 저장소를 분리 가능한 구조로 설계한다.

---

## 3. 실행 인프라 개념 구조

```text
App Control Plane
- user request
- project metadata
- settings / billing / policy
- canonical metadata in Postgres
- ephemeral cache / locks / fan-out in Redis

Execution Plane
- node pool
- execution nodes
- containers
- browser backends
- queues

Storage Plane
- project files
- session artifacts
- logs
- recordings
- snapshots
- Blob / Object Storage
```

---

## 4. 설계 원칙

- **Project-Centric**: 실행 세션은 항상 프로젝트 또는 작업 컨텍스트와 연결된다.
- **Isolated Runtime**: 각 세션은 격리된 실행 환경을 가진다.
- **Recoverable State**: 종료 후에도 프로젝트 파일과 핵심 산출물은 복원 가능해야 한다.
- **Observable Execution**: 세션, 브라우저, 작업 단위, 로그, 포트, artifact를 모두 추적 가능해야 한다.
- **Policy-Aware**: 플랜, 그룹, 팀, 브라우저 정책이 세션 생성과 실행에 영향을 준다.
- **Metered by Default**: Computer 및 Browser usage는 계량 가능해야 한다.
- **Separated Storage Planes**: 실행 메타데이터는 Postgres, ephemeral state는 Redis, 바이너리 artifact는 object storage에 둔다.

---

## 5. 핵심 엔터티 개요

| 엔터티 | 역할 |
|---|---|
| `execution_cluster` | 실행 서버 풀의 상위 묶음 |
| `execution_node_pool` | 용도별 노드 그룹 |
| `execution_node` | 실제 작업을 수행하는 서버 |
| `node_capacity_snapshot` | 노드 자원 스냅샷 |
| `runtime_image` | 세션 생성에 사용하는 베이스 이미지 |
| `execution_template` | 프로젝트 유형별 실행 템플릿 |
| `agent_template` | 에이전트 실행 기본 템플릿 |
| `browser_backend` | 브라우저 실행 백엔드 정보 |
| `project_runtime_profile` | 프로젝트와 실행 템플릿 연결 |
| `execution_queue_item` | 세션/작업 스케줄링 대기열 |
| `computer_session` | 실제 Linux 기반 작업 세션 |
| `browser_session` | Computer 세션에 연결된 브라우저 세션 |
| `execution_job` | 세션 내부에서 실행되는 개별 작업 단위 |
| `session_port` | 앱 프리뷰를 위한 포트 노출 정보 |
| `session_secret_mount` | 세션에 주입되는 시크릿 정보 |
| `session_artifact` | 로그, 스크린샷, 결과물 등 산출물 |
| `session_restore_point` | 세션 재개를 위한 복원 기준점 |
| `session_event` | 세션 단위 이벤트 스트림 |
| `session_log_chunk` | 터미널/런타임 로그 청크 저장 단위 |
| `runtime_usage_record` | 실행 관련 사용량 레코드 |
| `runtime_policy_binding` | 세션 생성 시 적용된 정책 스냅샷 |

---

## 6. 인프라 레벨 엔터티

### 6.1 execution_cluster

여러 노드 풀을 묶는 상위 논리 단위다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `key` | string | 클러스터 식별자 |
| `name` | string | 표시명 |
| `region` | string | 지역 |
| `purpose` | enum | `shared`, `team_dedicated`, `enterprise_dedicated` |
| `is_active` | boolean | 활성 여부 |

### 6.2 execution_node_pool

용도와 정책이 같은 노드 집합.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `cluster_id` | uuid | `execution_cluster` FK |
| `key` | string | 노드 풀 키 |
| `name` | string | 표시명 |
| `workload_type` | enum | `general`, `browser_heavy`, `build_heavy`, `gpu` |
| `scheduling_policy_json` | jsonb | 할당 정책 |
| `default_browser_backend_id` | uuid nullable | 기본 브라우저 백엔드 |
| `is_active` | boolean | 활성 여부 |

### 6.3 execution_node

실제 실행 서버.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `node_pool_id` | uuid | 노드 풀 참조 |
| `hostname` | string | 호스트명 |
| `provider` | string | 인프라 공급자 |
| `status` | enum | `ready`, `busy`, `degraded`, `offline`, `draining` |
| `cpu_cores` | int | 총 CPU |
| `memory_mb` | int | 총 메모리 |
| `storage_gb` | int | 총 스토리지 |
| `labels_json` | jsonb | `browser`, `gpu`, `large-memory` 등 |
| `last_heartbeat_at` | datetime | 마지막 heartbeat |

### 6.4 node_capacity_snapshot

노드 상태의 시점별 리소스 스냅샷.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `node_id` | uuid | 노드 참조 |
| `cpu_used_pct` | float | CPU 사용률 |
| `memory_used_pct` | float | 메모리 사용률 |
| `storage_used_pct` | float | 스토리지 사용률 |
| `active_sessions` | int | 현재 세션 수 |
| `recorded_at` | datetime | 기록 시각 |

---

## 7. 런타임 정의 엔터티

### 7.1 runtime_image

세션 생성에 사용하는 베이스 이미지.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `image_ref` | string | 컨테이너 이미지 참조 |
| `runtime_family` | enum | `node`, `python`, `java`, `custom` |
| `version_tag` | string | 버전 |
| `supports_browser` | boolean | 브라우저 지원 여부 |
| `supports_gpu` | boolean | GPU 지원 여부 |
| `metadata_json` | jsonb | 추가 메타데이터 |

### 7.2 execution_template

프로젝트 유형별 실행 템플릿.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `key` | string | 예: `fullstack-node`, `python-api`, `java-spring` |
| `name` | string | 표시명 |
| `runtime_image_id` | uuid | 베이스 이미지 |
| `bootstrap_commands_json` | jsonb | 기본 설치/부트스트랩 명령 |
| `default_ports_json` | jsonb | 기본 노출 포트 |
| `resource_profile_json` | jsonb | cpu/memory/storage 요청값 |
| `browser_policy_profile_id` | uuid nullable | 기본 브라우저 정책(admin settings domain 참조) |
| `is_active` | boolean | 활성 여부 |

### 7.3 browser_backend

브라우저 실행 방식을 정의한다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `backend_type` | enum | `embedded_chrome`, `playwright_remote`, `headless_browser_service` |
| `name` | string | 표시명 |
| `endpoint` | string nullable | 원격 엔드포인트 |
| `auth_secret_ref_id` | uuid nullable | 인증 정보 |
| `capabilities_json` | jsonb | screenshot, video, console, network 등 |
| `health_status` | enum | `unknown`, `healthy`, `degraded`, `failed` |
| `is_active` | boolean | 활성 여부 |

### 7.4 project_runtime_profile

프로젝트별 기본 실행 설정.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `project_id` | uuid | 프로젝트 참조 |
| `default_execution_template_id` | uuid | 기본 템플릿 |
| `preferred_node_pool_id` | uuid nullable | 선호 노드 풀 |
| `env_policy_ref` | string nullable | 환경 정책 참조 |
| `startup_command` | string nullable | 기본 실행 명령 |
| `preview_port` | int nullable | 기본 프리뷰 포트 |
| `is_default` | boolean | 기본 프로필 여부 |

---

## 8. 세션 및 작업 엔터티

### 8.1 execution_queue_item

세션 또는 작업이 자원을 기다리는 대기열 엔터티.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `queue_type` | enum | `session_create`, `browser_attach`, `job_run` |
| `workspace_id` | uuid | 워크스페이스 |
| `project_id` | uuid nullable | 관련 프로젝트 |
| `requested_by_user_id` | uuid nullable | 요청자 |
| `requested_execution_mode` | enum nullable | `conversation`, `research`, `development`, `test` |
| `priority` | int | 우선순위 |
| `status` | enum | `queued`, `assigned`, `cancelled`, `expired` |
| `payload_json` | jsonb | 스케줄링 정보 |
| `created_at` | datetime | 생성 시각 |

### 8.2 computer_session

실제 격리 실행 환경.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `workspace_id` | uuid | 워크스페이스 |
| `project_id` | uuid | 프로젝트 |
| `agent_run_id` | uuid nullable | 연관 에이전트 실행 |
| `created_by_user_id` | uuid | 생성자 |
| `execution_template_id` | uuid | 실행 템플릿 |
| `execution_mode` | enum | `conversation`, `research`, `development`, `test` |
| `browser_requested` | boolean | 요청 시점 브라우저 필요 여부 |
| `execution_node_id` | uuid nullable | 할당 노드 |
| `status` | enum | `requested`, `queued`, `provisioning`, `restoring`, `ready`, `running`, `paused`, `warm`, `stopping`, `completed`, `terminated`, `failed`, `expired` |
| `container_ref` | string nullable | 컨테이너 식별자 |
| `working_dir` | string nullable | 작업 디렉터리 |
| `idle_timeout_minutes` | int | idle timeout |
| `warm_until` | datetime nullable | warm 유지 종료 시각 |
| `started_at` | datetime nullable | 실행 시작 |
| `ended_at` | datetime nullable | 종료 시각 |
| `failure_reason` | text nullable | 실패 요약 |
| `metadata_json` | jsonb | 추가 메타데이터 |

### 8.3 browser_session

Computer 세션에 연결된 브라우저 실행 단위.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `computer_session_id` | uuid | 연결된 Computer 세션 |
| `browser_backend_id` | uuid | 브라우저 백엔드 |
| `status` | enum | `launching`, `ready`, `navigating`, `interacting`, `validating`, `crashed`, `closed` |
| `live_view_url` | string nullable | 사용자용 스트림/뷰 URL |
| `last_url` | string nullable | 마지막 URL |
| `recording_policy` | enum | `none`, `screenshots`, `session_recording` |
| `console_capture_enabled` | boolean | 콘솔 캡처 여부 |
| `network_capture_enabled` | boolean | 네트워크 캡처 여부 |
| `started_at` | datetime nullable | 시작 시각 |
| `ended_at` | datetime nullable | 종료 시각 |

### 8.4 execution_job

세션 내부에서 수행되는 개별 작업.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `computer_session_id` | uuid | 세션 참조 |
| `browser_session_id` | uuid nullable | 브라우저 세션 참조 |
| `agent_run_id` | uuid nullable | 관련 에이전트 실행 |
| `job_type` | enum | `bootstrap`, `install`, `run_server`, `test`, `browser_task`, `cleanup` |
| `status` | enum | `pending`, `running`, `retrying`, `completed`, `failed`, `cancelled` |
| `command_or_action` | text | 명령 또는 액션 설명 |
| `input_json` | jsonb | 작업 입력 |
| `result_json` | jsonb | 결과 요약 |
| `started_at` | datetime nullable | 시작 시각 |
| `ended_at` | datetime nullable | 종료 시각 |

### 8.5 session_port

세션 내부 서비스의 외부 프리뷰 정보.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `computer_session_id` | uuid | 세션 참조 |
| `internal_port` | int | 내부 포트 |
| `protocol` | enum | `http`, `https`, `tcp` |
| `public_url` | string nullable | 프리뷰 URL |
| `visibility` | enum | `private`, `workspace`, `team` |
| `status` | enum | `pending`, `active`, `closed` |

### 8.6 session_secret_mount

세션에 주입된 secret 메타데이터.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `computer_session_id` | uuid | 세션 참조 |
| `secret_ref_id` | uuid | 관리자 secret 참조 |
| `mount_type` | enum | `env_var`, `file`, `runtime_token` |
| `target_key` | string | 환경변수명 또는 파일 경로 |
| `scope_type` | enum | secret의 소속 범위 |

### 8.7 session_restore_point

세션 복원을 위한 기준점.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `computer_session_id` | uuid | 세션 참조 |
| `restore_type` | enum | `file_state`, `snapshot`, `metadata_only` |
| `storage_provider` | enum nullable | `vercel_blob`, `s3`, `r2`, `gcs`, `local` |
| `storage_key` | string nullable | 스냅샷 저장 위치 |
| `summary` | text | 복원 정보 |
| `created_at` | datetime | 생성 시각 |

### 8.8 session_event

세션 이벤트 스트림.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `computer_session_id` | uuid | 세션 참조 |
| `browser_session_id` | uuid nullable | 브라우저 세션 참조 |
| `event_type` | string | 예: `session.ready`, `browser.crashed` |
| `event_level` | enum | `info`, `warning`, `error` |
| `payload_json` | jsonb | 상세 내용 |
| `created_at` | datetime | 생성 시각 |

### 8.9 session_artifact

실행 산출물.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `workspace_id` | uuid | 워크스페이스 |
| `project_id` | uuid | 프로젝트 |
| `computer_session_id` | uuid | 세션 참조 |
| `browser_session_id` | uuid nullable | 브라우저 세션 참조 |
| `execution_job_id` | uuid nullable | 작업 참조 |
| `artifact_type` | enum | `timeline`, `log`, `browser_action_log`, `console_network_log`, `file_change_list`, `screenshot`, `recording`, `test_report`, `diff`, `preview_snapshot`, `summary` |
| `storage_provider` | enum | `vercel_blob`, `s3`, `r2`, `gcs`, `local` |
| `storage_key` | string | 저장 위치 |
| `mime_type` | string nullable | MIME 타입 |
| `size_bytes` | bigint nullable | 크기 |
| `checksum_sha256` | string nullable | 무결성 검증값 |
| `retention_policy` | string nullable | 보존 정책 키 또는 등급 |
| `promotion_state` | enum nullable | `ephemeral`, `promoted`, `copied_to_asset`, `expired` |
| `promoted_file_asset_id` | uuid nullable | 승격된 장기 자산 참조 |
| `metadata_json` | jsonb | 추가 정보 |
| `created_at` | datetime | 생성 시각 |

### 8.10 session_log_chunk

`GET /logs`와 노드의 chunk upload를 뒷받침하는 로그 저장 단위.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `computer_session_id` | uuid | 세션 참조 |
| `execution_job_id` | uuid nullable | 작업 참조 |
| `stream_type` | enum | `stdout`, `stderr`, `system` |
| `chunk_index` | bigint | 세션 내 정렬 순번 |
| `offset_start` | bigint nullable | 원본 스트림 offset |
| `content_text` | text | 로그 본문 |
| `created_at` | datetime | 생성 시각 |

---

## 9. 사용량 및 정책 엔터티

### 9.1 runtime_usage_record

실행 평면의 사용량 계량 레코드.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `workspace_id` | uuid | 워크스페이스 |
| `project_id` | uuid nullable | 프로젝트 |
| `user_id` | uuid nullable | 사용자 |
| `team_id` | uuid nullable | 팀 |
| `computer_session_id` | uuid nullable | 세션 |
| `browser_session_id` | uuid nullable | 브라우저 세션 |
| `usage_type` | enum | `computer_minutes`, `browser_minutes`, `storage_bytes`, `artifact_bytes`, `concurrent_session_peak` |
| `quantity` | decimal | 사용량 |
| `recorded_at` | datetime | 기록 시각 |

### 9.2 runtime_policy_binding

세션 생성 시 적용된 정책 스냅샷.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `computer_session_id` | uuid | 세션 |
| `policy_source_type` | enum | `global`, `plan`, `group`, `team`, `project`, `provider`, `model` |
| `policy_source_id` | uuid/string | 정책 출처 |
| `resolved_policy_json` | jsonb | 세션에 적용된 최종 정책 |

`policy_source_type`에는 필요 시 `provider`, `model`도 포함해 specialized scope override를 표현할 수 있다.

---

## 10. 권장 관계 구조

```text
execution_cluster 1--n execution_node_pool
execution_node_pool 1--n execution_node
execution_node 1--n computer_session

runtime_image 1--n execution_template
execution_template 1--n computer_session
agent_template 1--n agent_run
browser_backend 1--n browser_session

project 1--n project_runtime_profile
project 1--n computer_session
agent_run 1--n computer_session
computer_session 1--0..1 browser_session
computer_session 1--n execution_job
computer_session 1--n session_port
computer_session 1--n session_artifact
computer_session 1--n session_event
computer_session 1--n session_log_chunk
computer_session 1--n runtime_usage_record

browser_session 1--n session_artifact
browser_session 1--n execution_job
agent_run 1--n execution_job
execution_job 1--n session_artifact
execution_job 1--n session_log_chunk
```

---

## 11. 상태 모델 요약

### execution_node.status

- `ready`
- `busy`
- `degraded`
- `offline`
- `draining`

### computer_session.status

- `requested`
- `queued`
- `provisioning`
- `restoring`
- `ready`
- `running`
- `paused`
- `warm`
- `stopping`
- `completed`
- `terminated`
- `failed`
- `expired`

### browser_session.status

- `launching`
- `ready`
- `navigating`
- `interacting`
- `validating`
- `crashed`
- `closed`

### execution_job.status

- `pending`
- `running`
- `retrying`
- `completed`
- `failed`
- `cancelled`

---

## 12. 스케줄링 원칙

- 세션은 `queue -> node assignment -> provisioning` 순으로 진행한다.
- 노드 선택 시 필요한 런타임, 브라우저 지원 여부, 플랜 정책, 자원 상태를 함께 본다.
- 브라우저가 필요한 작업은 브라우저 지원 노드 또는 브라우저 백엔드 연동 노드에 배치한다.
- Team/Enterprise 전용 리소스는 분리된 node pool에 할당할 수 있어야 한다.

---

## 13. 복원 및 보존 원칙

### 복원

- 최소 기준은 프로젝트 파일 복원
- 세션 메타데이터, 포트, 마지막 URL, 마지막 실행 명령은 가능하면 복구
- 프로세스 메모리 자체는 MVP에서 복원 대상이 아님
- 브라우저 요청 의도와 execution mode도 함께 복구해 `요청 안 함`과 `아직 준비 안 됨`을 구분한다.

### 보존

- 로그, 스크린샷, 테스트 리포트는 artifact로 저장
- 대용량 로그 원문은 `session_log_chunk`로 저장하고, 요약/압축본은 필요 시 `session_artifact`로 승격한다.
- artifact의 바이너리 본문은 object storage에 저장하고, Postgres에는 메타데이터와 참조만 남긴다.
- 녹화는 정책적으로 저장 여부가 달라질 수 있음
- 스냅샷은 비용이 크므로 MVP에서는 제한적으로 지원 가능

---

## 14. MVP 우선 범위

### MVP 포함

- execution_node_pool
- execution_node
- runtime_image
- execution_template
- agent_template
- computer_session
- browser_session
- execution_job
- session_port
- session_event
- session_log_chunk
- session_artifact
- runtime_usage_record

### v1 이후

- session_restore_point 고도화
- session recording 메타데이터 고도화
- team dedicated cluster
- multi-browser parallel sessions
- advanced queue priority rules

---

## 15. 결론

실행 인프라 데이터 모델은 단순한 컨테이너 실행 정보가 아니라, **프로젝트 중심 실행 경험을 Computer, Browser, Agent, Artifact, Usage까지 연결하는 기반 모델**이어야 한다.

따라서 다음 원칙을 확정한다.

- 앱 서버와 실행 평면은 논리적으로 분리한다.
- 세션과 브라우저는 프로젝트와 강하게 연결된다.
- 로그/스크린샷/테스트 결과는 모두 1급 산출물로 저장한다.
- 정책, 사용량, 복원 가능성을 데이터 모델에서부터 고려한다.
- object storage와의 분리를 전제로 artifact/snapshot 메타데이터를 관리한다.

---

## 16. 다음 문서 추천

1. `실행 노드 보안 정책서`
2. `백엔드 서비스 경계 정의서`
3. `테스트 전략 문서`
