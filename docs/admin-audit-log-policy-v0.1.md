# 설정 변경 이력 및 감사 로그 정책서 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 설정 변경 이력 및 감사 로그 정책서
- **버전**: v0.1
- **목적**: 관리자 설정 변경, 보안 관련 액션, 실행형 기능의 민감한 조작 이력을 어떤 기준으로 기록하고 조회할지 정의한다.
- **관련 문서**: `docs/admin-panel-spec-v0.1.md`, `docs/admin-screen-definition-v0.1.md`, `docs/admin-design-definition-v0.1.md`, `docs/admin-settings-data-model-v0.1.md`, `docs/computer-browser-agent-lifecycle-v0.1.md`

---

## 2. 문서 목적

이 문서는 관리자 UI 중심 설정 시스템이 `누가 무엇을 왜 바꿨는지`, 그리고 실행형 플랫폼에서 `누가 어떤 민감한 작업을 승인/실행했는지` 추적 가능하도록 만드는 기준 문서다.

이 정책이 필요한 이유는 다음과 같다.

- 운영 설정이 `.env`가 아니라 관리자 UI에서 바뀌기 때문
- API Key, 모델 연결, 브라우저 정책, Computer 정책 같은 민감 설정이 많기 때문
- 실행형 AI 플랫폼 특성상 브라우저 제어, 파일 변경, 세션 복원 같은 고위험 액션이 존재하기 때문
- 향후 엔터프라이즈/보안 요구사항을 만족하려면 감사 가능성이 필수이기 때문

---

## 3. 핵심 원칙

- **Immutable by Default**: 감사 로그는 일반 관리자 UI에서 수정/삭제할 수 없어야 한다.
- **Actor-Centric**: 누가 실행했는지가 항상 기록되어야 한다.
- **Context-Rich**: 무엇을 바꿨는지뿐 아니라 어떤 범위와 이유로 바꿨는지도 기록해야 한다.
- **Secret-Safe**: 민감값 원문은 로그에 남기지 않는다.
- **Execution-Aware**: 설정 변경뿐 아니라 Computer/Browser/Agent 관련 승인과 고위험 실행도 감사 대상이다.
- **Queryable**: 관리자 UI에서 검색/필터/추적이 가능해야 한다.
- **Retention-Aware**: 보존 기간과 보관 비용을 정책적으로 관리해야 한다.

---

## 4. 감사 대상 범위

### 4.1 제품 전체 기준 반드시 감사해야 하는 이벤트

- 관리자 설정 생성/수정/삭제/복원
- 설정 validation 실패 및 test 실행
- 민감값(secret) 생성/교체/삭제
- 모델/공급자 연결 생성/수정/비활성화
- 플랜/entitlement 수정
- 그룹 권한 변경
- 사용자 역할 변경
- 사용자/팀 정지 또는 복구
- 브라우저 자동화 승인
- 고위험 에이전트 실행 승인
- 설정 스냅샷 생성 및 복원

위 항목은 최종 제품 기준 mandatory audit 대상이며, 실제 구현 시점은 해당 기능이 노출되는 phase와 함께 가져간다.

### 4.2 선택적으로 감사할 이벤트

- 일반 조회 이벤트
- 비민감한 설정 검색 이벤트
- 읽기 전용 대시보드 접근

### 4.3 제품 특화 감사 이벤트

- Computer 정책 변경
- Browser 허용/금지 도메인 정책 변경
- 외부 로그인 허용 정책 변경
- Function/Pipeline 설치 및 활성화
- 에이전트 자동 승인 수준 변경
- 브라우저 녹화/스크린샷 보존 정책 변경

---

## 5. 감사 로그 분류 체계

### 5.1 이벤트 카테고리

| category | 설명 |
|---|---|
| `settings` | 일반 설정 변경 |
| `secrets` | 비밀값 관련 이벤트 |
| `access_control` | 역할, 그룹, 권한 변경 |
| `billing` | 플랜, entitlement, 좌석, 청구 관련 변경 |
| `providers` | 모델/검색/외부 연결 설정 |
| `models` | 모델 공개/비공개/활성화/정책 변경 |
| `execution` | Computer/Browser/Code Execution 정책 및 민감 액션 |
| `agents` | 에이전트/오케스트레이션 정책 변경 및 승인 이벤트 |
| `functions` | Function 설치/활성화/삭제 |
| `pipelines` | Pipeline 설치/활성화/삭제 |
| `integrations` | 외부 연동 연결 변경 |
| `security` | 감사, SSO, 접근제어, 데이터 보존 변경 |
| `data_ops` | export/import/backup/restore 이벤트 |

### 5.2 심각도 수준

| severity | 설명 |
|---|---|
| `info` | 일반 운영 정보 |
| `warning` | 주의가 필요한 변경 |
| `critical` | 보안/권한/복원/전역정책과 관련된 고위험 변경 |

예시:

- `access_identity.enable_signups` 변경 -> `warning`
- `secret_ref` 교체 -> `critical`
- `user.role`을 admin으로 변경 -> `critical`
- `browser.allow_external_login` 활성화 -> `critical`

---

## 6. 감사 로그 엔터티 모델

### 6.1 audit_log

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `category` | enum | 이벤트 카테고리 |
| `event_type` | string | 예: `settings.update`, `users.role_change` |
| `severity` | enum | `info`, `warning`, `critical` |
| `actor_type` | enum | `user`, `system`, `service_account`, `agent` |
| `actor_id` | uuid/string | 실행 주체 |
| `actor_display` | string | 표시명 |
| `scope_type` | enum nullable | `global`, `team`, `group`, `project`, `plan` 등 |
| `scope_id` | uuid/string nullable | 범위 대상 |
| `resource_type` | string | 예: `setting_value`, `provider_connection`, `team`, `user` |
| `resource_id` | uuid/string nullable | 대상 ID |
| `action` | enum | `create`, `update`, `delete`, `enable`, `disable`, `approve`, `reject`, `validate`, `test`, `reset`, `restore`, `export`, `import` |
| `summary` | text | 한 줄 요약 |
| `reason` | text nullable | 변경 사유 |
| `old_value_json` | jsonb nullable | 이전 값 |
| `new_value_json` | jsonb nullable | 새 값 |
| `masked_fields_json` | jsonb nullable | 마스킹 처리된 필드 목록 |
| `request_context_json` | jsonb | IP, UA, request id 등 |
| `correlation_id` | string nullable | 관련 작업 묶음 ID |
| `status` | enum | `success`, `failed`, `partial` |
| `created_at` | datetime | 생성 시각 |

### 6.2 audit_attachment

감사 로그에 보조 증거를 연결한다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `audit_log_id` | uuid | 감사 로그 참조 |
| `attachment_type` | enum | `screenshot`, `diff`, `report`, `json_snapshot` |
| `storage_key` | string | 저장소 참조 |
| `metadata_json` | jsonb | 메타데이터 |

---

## 7. Actor 정의

| actor_type | 설명 |
|---|---|
| `user` | 관리자 또는 일반 사용자 |
| `system` | 백엔드 시스템 자체 이벤트 |
| `service_account` | 내부 작업자/워커 |
| `agent` | 에이전트가 수행한 작업 또는 요청한 승인 액션 |

### actor 관련 원칙

- 관리자 설정 변경은 기본적으로 `user` actor여야 한다.
- 자동 복구나 마이그레이션은 `system` 또는 `service_account`로 기록한다.
- 에이전트가 직접 액션을 제안하고 사용자가 승인했다면, `initiated_by=agent`, `approved_by=user` 관계를 request context 또는 correlation metadata로 남겨야 한다.

---

## 8. 이벤트 타입 예시

### 8.1 Settings

- `settings.create`
- `settings.update`
- `settings.reset`
- `settings.restore`
- `settings.validate_failed`
- `settings.test`

### 8.2 Secrets

- `secrets.create`
- `secrets.rotate`
- `secrets.clear`
- `secrets.access_denied`

### 8.3 Access Control

- `users.role_change`
- `users.suspend`
- `users.reactivate`
- `groups.create`
- `groups.permissions_update`

### 8.4 Providers / Models

- `provider_connection.create`
- `provider_connection.update`
- `provider_connection.test`
- `model.enable`
- `model.disable`
- `model.visibility_update`

### 8.5 Execution / Agents

- `computer.policy_update`
- `browser.policy_update`
- `browser.action_approved`
- `browser.action_rejected`
- `agent.policy_update`
- `agent.high_risk_run_approved`

### 8.6 Data Ops

- `snapshot.create`
- `snapshot.restore`
- `data.export`
- `data.import`

---

## 9. 로그에 남겨야 하는 최소 필드

모든 감사 이벤트는 최소한 아래 정보를 가져야 한다.

- 누가 했는지
- 언제 했는지
- 무엇을 바꿨는지 또는 실행했는지
- 어떤 범위에 영향을 주는지
- 성공/실패 여부
- 변경 전/후 값 또는 그 요약
- 요청 출처(IP, user agent, request id)

---

## 10. 민감값 마스킹 정책

### 10.1 원문 금지 필드 예시

- API Key
- Access Token
- Password
- OAuth Secret
- Webhook Secret
- KMS Key Material

### 10.2 기록 방식

- `old_value_json`와 `new_value_json`에는 원문을 저장하지 않는다.
- 예: `{"apiKey": "[MASKED]"}`
- `masked_fields_json`에 어떤 필드가 마스킹되었는지 남긴다.

### 10.3 부분 노출 허용 예시

- `sk-****abcd`
- `https://api.openai.com` 같은 base URL은 비밀값이 아니므로 저장 가능

---

## 11. 변경 diff 정책

### 11.1 일반 설정

- before / after를 JSON diff로 남긴다.

### 11.2 대형 JSON 설정

- 전체 저장 + 요약 diff를 같이 남긴다.
- 예: ComfyUI workflow, pipeline valves, provider config

### 11.3 리소스 객체

- row-level snapshot을 before / after로 남긴다.
- 예: provider connection, plan entitlement, group policy

---

## 12. Computer / Browser / Agent 감사 정책

실행형 플랫폼 특성상 아래 항목은 일반 SaaS보다 더 중요하게 감사해야 한다.

### 12.1 Computer 관련

- 세션 정책 변경
- idle timeout 변경
- 포트 노출 정책 변경
- 파일시스템 쓰기 정책 변경
- 네트워크 접근 정책 변경

### 12.2 Browser 관련

- 허용 도메인/금지 도메인 변경
- 외부 로그인 허용 여부 변경
- 브라우저 녹화 정책 변경
- 스크린샷 저장 정책 변경
- 브라우저 자동화 액션 승인/거절

### 12.3 Agent 관련

- 고위험 작업 승인
- 파일 삭제 승인
- 대규모 수정 승인
- 멀티에이전트 정책 변경
- 자동 승인 레벨 변경

---

## 13. 읽기 이벤트 감사 정책

기본적으로 모든 읽기 이벤트를 다 저장할 필요는 없다. 하지만 아래 읽기 이벤트는 감사 대상이 될 수 있다.

- secret 관리 화면 접근
- 감사 로그 export
- 사용자 전체 데이터 export
- 설정 스냅샷 다운로드
- 브라우저 세션 기록 열람

### 권장 원칙

- 일반 조회는 선택적
- 민감 조회는 기록 권장
- export/download는 반드시 기록

---

## 14. 보존 정책

| 로그 유형 | 권장 보존 기간 |
|---|---|
| 일반 운영 설정 변경 | 1년 이상 |
| 민감 설정 변경 | 2년 이상 |
| 보안/SSO/권한 변경 | 2년 이상 |
| 스냅샷 복원/데이터 export | 2년 이상 |
| 테스트/validation 실패 기록 | 운영 정책에 따라 단기 보관 가능 |

### 보존 원칙

- Enterprise 환경은 더 긴 보존 기간을 지원할 수 있어야 한다.
- 삭제되더라도 최소 메타 이력은 남기는 정책을 고려한다.

---

## 15. 관리자 UI 요구사항

### 15.1 감사 로그 화면 기능

- 기간 필터
- actor 필터
- category 필터
- severity 필터
- resource type 필터
- action 필터
- 성공/실패 필터
- correlation id 검색
- CSV/JSON export

### 15.2 상세 보기 기능

- 이벤트 요약
- actor 정보
- 변경 전/후 diff
- 마스킹 필드 표시
- 관련 attachment 보기
- 관련 작업 링크 이동

### 15.3 보호 기능

- 일반 관리자는 일부 감사 로그만 열람 가능
- export는 더 높은 권한 필요
- 민감 로그는 Security Admin 이상만 접근 가능하도록 분리 가능

### 15.4 UI 표현 원칙

- 감사 로그 테이블은 최소한 `actor`, `action`, `resource`, `scope`, `severity`, `status`, `created_at`를 한눈에 읽을 수 있어야 한다.
- 상세 보기에서는 `reason`, `before/after diff`, `masked fields`, `correlation id`, 관련 승인/복원/export 흐름을 함께 추적 가능해야 한다.
- 보존 정책과 연결되는 이벤트는 자산 유형별 retention 정보나 만료 영향을 같이 보여주는 것이 좋다.
- 승인 기반 이벤트는 `요청자`, `승인자`, `승인 사유`, `대상 범위`, `관련 세션/에이전트/설정`을 같은 흐름으로 읽을 수 있어야 한다.

---

## 16. 권한 모델 초안

| 액션 | Platform Admin | Support Admin | Billing Admin | Security Admin | Super Admin |
|---|---|---|---|---|---|
| 일반 감사 로그 조회 | O | 제한 | 제한 | O | O |
| 민감 보안 감사 로그 조회 | 제한 | - | - | O | O |
| 감사 로그 export | 제한 | - | 제한 | O | O |
| 설정 변경 이력 조회 | O | 제한 | 제한 | O | O |
| 스냅샷 복원 이력 조회 | 제한 | - | - | O | O |

---

## 17. 실패 이벤트 정책

- 저장 실패도 감사 이벤트로 남길 수 있어야 한다.
- 권한 부족으로 거부된 액션도 `failed` 상태로 기록할 수 있어야 한다.
- 연결 테스트 실패, secret 교체 실패, 스냅샷 복원 실패는 특히 중요하다.

예:

- `provider_connection.test` + `failed`
- `settings.update` + `failed`
- `snapshot.restore` + `failed`

---

## 18. 상관관계 추적(Correlation)

하나의 운영 작업이 여러 이벤트를 발생시킬 수 있으므로 correlation id가 필요하다.

예:

- 플랜 수정 -> entitlement 변경 여러 건
- provider connection 수정 -> test 실행 -> cache 무효화
- browser policy 수정 -> 새 세션 반영 이벤트 생성

### 원칙

- 하나의 UI 저장 액션은 하나의 `correlation_id`를 가진다.
- 연쇄 이벤트는 같은 `correlation_id`로 묶는다.

---

## 19. 시스템 이벤트와 사용자 이벤트 구분

- 사용자가 직접 변경한 이벤트와 시스템 자동 조정 이벤트를 구분해야 한다.
- 예를 들어 캐시 무효화, health status 갱신은 시스템 이벤트로 별도 표기한다.
- UI에서는 기본적으로 사용자 이벤트를 우선 보여주고, 시스템 이벤트는 확장 보기로 제공할 수 있다.

---

## 20. MVP 우선 범위

### MVP에 반드시 포함

- 설정 변경 감사 로그
- validation 실패 감사 로그
- secret 생성/교체/삭제 감사 로그
- 사용자 역할 변경 감사 로그
- provider connection test 결과 기록
- 감사 로그 조회 화면 기본 필터

### v1 고도화

- snapshot 기능이 노출되는 시점의 생성/복원 감사 로그
- 브라우저 자동화 기능이 노출되는 시점의 승인 감사 로그
- agent 고위험 액션 기능이 노출되는 시점의 승인 감사 로그
- 첨부 파일(screenshot/diff/report) 연결
- 민감 조회 이벤트 감사
- SIEM/외부 보안 시스템 연동
- 감사 로그 export UI와 고급 보존 관리

---

## 21. 결론

우리 플랫폼에서 감사 로그는 보조 기능이 아니라, 관리자 UI 중심 운영 구조를 안전하게 만드는 핵심 장치다.

따라서 다음 원칙을 확정한다.

- 설정 변경은 항상 감사 가능해야 한다.
- 민감값은 절대 원문으로 로그에 남기지 않는다.
- 실행형 플랫폼 특성상 Browser/Computer/Agent 승인 로그를 중요하게 다룬다.
- 감사 로그는 수정 불가, 검색 가능, 권한 기반 접근 구조를 가져야 한다.

---

## 22. 다음 문서 추천

1. `운영 플레이북`
2. `실행 노드 보안 정책서`
3. `권한 체크 규칙 세부서`
