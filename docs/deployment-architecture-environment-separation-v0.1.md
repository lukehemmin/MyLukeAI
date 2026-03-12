# 배포 아키텍처 및 환경 분리 문서 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 배포 아키텍처 및 환경 분리 문서
- **버전**: v0.1
- **목적**: 제품의 control plane, execution plane, storage plane을 어떤 방식으로 배포하고 환경별로 어떻게 분리할지 정의한다.
- **관련 문서**: `docs/product-vision-v0.1.md`, `docs/storage-architecture-v0.1.md`, `docs/execution-infra-data-model-v0.1.md`, `docs/mvp-implementation-order-v0.1.md`, `docs/file-attachment-api-definition-v0.1.md`

---

## 2. 문서 목적

이 문서는 `Vercel에서도 쉽게 시작할 수 있으면서`, 동시에 `Computer + Browser + Agent` 실행형 구조를 감당할 수 있는 현실적인 배포 구조를 확정하기 위한 문서다.

핵심 목표는 다음과 같다.

- 웹앱과 실행 인프라를 분리한다.
- local / dev / staging / production 환경을 명확히 분리한다.
- Postgres, Redis, Blob/Object Storage의 역할을 환경별로 일관되게 유지한다.
- 운영자가 자주 바꾸는 설정은 관리자 UI에 두고, 부팅 필수값만 최소한의 bootstrap config로 남긴다.

---

## 3. 핵심 배포 원칙

- **Control Plane on Vercel**: 사용자 웹앱, 관리자 콘솔, BFF/API는 Vercel에 올리는 것을 기본안으로 한다.
- **Execution Plane Separate**: Browser, session runtime, long-running worker는 별도 인프라에 둔다.
- **UI-First Operations**: 운영 정책의 canonical control surface / write path는 관리자 UI다.
- **Postgres as Persisted Truth**: 운영 정책과 제품 메타데이터의 persisted canonical data는 Postgres에 남는다.
- **Bootstrap-Minimal Infra Config**: 앱이 뜨기 위해 반드시 필요한 연결값만 deployment-level bootstrap input으로 둔다.
- **Storage Separation**: Postgres, Redis, Blob/Object Storage를 역할별로 분리한다.
- **Environment Isolation**: staging과 production은 데이터, 시크릿, object storage prefix를 분리한다.

---

## 4. 권장 기본 배포 구조

```text
Users
  |
  v
Vercel Control Plane
- Web App
- Admin Console
- BFF / API Routes
- Auth Callbacks
- Signed URL Issuer

Shared Data Services
- Neon Postgres
- Upstash Redis
- Vercel Blob

Separate Execution Plane
- Scheduler
- Session Workers
- Browser Workers
- Runtime Nodes
- Stream Relay / Event Fan-out
```

---

## 5. 권장 기본 서비스 선택

| 계층 | 기본 추천 | 이유 |
|---|---|---|
| 웹앱 / 관리자 / BFF | `Vercel` | 배포 속도, preview 환경, 운영 편의성 |
| 관계형 DB | `Neon Postgres` | Vercel 친화적이고 canonical relational DB로 적합 |
| 캐시 / hot state | `Upstash Redis` | 연동이 쉽고 초기 운영 부담이 낮음 |
| 파일 / 이미지 / artifact | `Vercel Blob` | 업로드와 다운로드 흐름이 단순함 |
| Edge read-mostly config | `Edge Config` 선택적 사용 | feature flag / 공지 배너 용도 |

초기 기본 조합은 `Vercel + Neon Postgres + Upstash Redis + Vercel Blob`이다.

---

## 6. 왜 Vercel만으로 끝내지 않는가

이 제품은 일반 SaaS보다 실행 특성이 훨씬 무겁다.

- 브라우저 세션은 장시간 실행될 수 있다.
- Computer 세션은 프로세스, 포트, 파일시스템, 로그 스트림을 동반한다.
- 에이전트 작업은 빌드, 테스트, 재시도, 승인 대기를 포함할 수 있다.
- 녹화, 스크린샷, 로그, artifact 적재가 지속적으로 발생한다.

따라서 `Vercel = control plane`, `별도 실행 인프라 = execution plane` 구조가 기본 전제다.

---

## 7. 환경별 배포 원칙

### 7.1 Local

목적:

- 개발자가 전체 흐름을 빠르게 재현

권장 구성:

- 앱 서버: local dev server
- Postgres: local Docker 또는 dev Neon branch
- Redis: local Redis 또는 dev Upstash DB
- Object Storage: 로컬 mock 또는 dev Blob bucket/prefix
- 실행 노드: 로컬 단일 worker 또는 shared dev worker

### 7.2 Development

목적:

- 팀 공용 개발 통합 환경

권장 구성:

- Vercel preview / development deployment
- dev Neon project 또는 dev branch
- dev Upstash Redis
- dev Blob prefix
- 소규모 shared execution workers

### 7.3 Staging

목적:

- production 직전 실제 배포 흐름과 운영 정책 검증

권장 구성:

- Vercel staging project
- staging Neon database
- staging Redis
- staging Blob storage prefix 또는 별도 bucket
- production과 유사한 execution plane

### 7.4 Production

목적:

- 실제 고객 운영

권장 구성:

- Vercel production deployment
- production Neon database
- production Redis
- production Blob storage prefix 또는 별도 bucket
- autoscaling execution plane
- 별도 보안/감사/보존 정책

---

## 8. 환경 분리 매트릭스

| 항목 | local | dev | staging | production |
|---|---|---|---|---|
| Vercel project | 선택 | 공유 또는 preview | 별도 | 별도 |
| Postgres DB | 분리 권장 | 분리 | 완전 분리 | 완전 분리 |
| Redis namespace/DB | 분리 권장 | 분리 | 완전 분리 | 완전 분리 |
| Blob bucket/prefix | 분리 권장 | 분리 | 완전 분리 | 완전 분리 |
| 실행 노드 | local/shared | shared | staging 전용 | prod 전용 |
| 시크릿 | local only | dev secret set | staging secret set | prod secret set |
| 도메인 | localhost | preview/dev | staging domain | production domain |

---

## 9. Bootstrap Config와 Admin UI의 경계

사용자 요청을 반영해도, 현실적으로 완전히 `no bootstrap config`로는 갈 수 없다. 앱이 DB에 붙기 전에는 DB 안의 설정을 읽을 수 없기 때문이다.

따라서 다음 원칙으로 정리한다.

### 9.1 Deployment-Level Bootstrap Input

아래 값은 부팅 필수값이므로 deployment-level secret 또는 infra config로 둔다.

- primary Postgres connection string
- primary Redis connection string
- object storage access credential 또는 service identity
- session signing key / encryption root key
- internal service auth seed values

### 9.2 Admin UI Canonical Settings

아래 값은 운영자가 자주 바꾸므로 관리자 UI가 canonical control surface가 되고, 최종 persisted value는 Postgres에 기록된다.

- 업로드 최대 용량
- signed URL TTL
- artifact retention period
- attachment 허용 MIME 정책
- browser recording retention policy
- export/import policy
- environment root prefix 아래의 export logical sub-prefix
- feature flags
- execution/browser/agent policy

즉, `부팅 필수 인프라 값`만 bootstrap input이고, `운영 정책`은 관리자 UI 중심으로 간다.

여기서 `bucket 자체`나 `환경 분리용 root prefix`는 bootstrap/deployment 계층이고, `exports/` 같은 기능별 logical sub-prefix는 관리자 UI 정책으로 둘 수 있다.

---

## 10. 네트워크 및 접근 구조

### 10.1 사용자 트래픽

- 사용자는 Vercel 웹앱에 접속한다.
- 인증 완료 후 BFF/API가 Postgres, Redis, execution control plane과 통신한다.

### 10.2 파일 업로드

- 클라이언트는 업로드 intent API를 먼저 호출한다.
- BFF는 권한과 정책을 확인한 뒤 signed URL 또는 upload token을 발급한다.
- 실제 파일 본문은 object storage로 direct upload한다.
- 업로드 완료 후 앱 서버에 completion API를 호출해 메타데이터를 확정한다.

artifact가 프로젝트 또는 문서 자산으로 승격될 때는 control plane이 기존 object key를 재참조하거나 정책상 필요 시 새 prefix로 재배치하고, Postgres 메타데이터의 scope/retention/audit linkage를 다시 확정한다.

### 10.3 실행 노드 통신

- execution worker는 control plane에 service-to-service auth로 접속한다.
- worker는 artifact 업로드 후 object storage key만 control plane에 보고한다.
- browser live view는 short-lived token 또는 signed URL 기반으로 노출한다.

---

## 11. 데이터 계층 배치 원칙

### 11.1 Postgres

- 사용자, 프로젝트, 채팅, 문서, 플랜, 사용량, 관리자 설정
- `file_asset`, `attachment`, `session_artifact` 메타데이터
- RAG chunk / embedding metadata / `pgvector`

Postgres는 canonical persisted state를 유지하고, 관리자 UI는 그 상태를 변경하는 주요 운영 entry point가 된다.

### 11.2 Redis

- rate limit
- hot session state
- short-lived cache
- presence
- lock / queue 보조 상태

### 11.3 Blob / Object Storage

- 이미지 첨부
- 파일 업로드
- 세션 artifact
- 녹화본
- export/import 결과물
- restore snapshot binary

환경 root prefix는 bootstrap/deployment 계층에서 고정하고, 그 아래 logical sub-prefix와 retention/promotion 정책은 관리자 UI 정책으로 제어한다.

---

## 12. 실행 인프라 배포 원칙

### 12.1 MVP

- 단일 shared scheduler
- 소수의 session worker
- 소수의 browser worker
- 작은 node pool

### 12.2 Scale-up 방향

- browser-heavy pool 분리
- build-heavy pool 분리
- team / enterprise dedicated pool 분리
- queue/stream 처리 강화
- artifact lifecycle와 cold storage 정책 추가

---

## 13. 보안 및 운영 원칙

- staging과 production의 DB/Redis/Object Storage는 논리적으로라도 반드시 분리한다.
- Blob key는 추측 가능한 단순 경로 대신 UUID/prefix 기반으로 생성한다.
- 다운로드는 public URL보다 signed URL 또는 gated API를 우선한다.
- execution plane이 object storage에 쓰는 권한은 최소 prefix 범위로 제한한다.
- bootstrap secrets는 관리자 UI 원문 노출 대상이 아니다.
- 관리자 UI는 정책과 상태를 제어하지만, root infra credential은 secret manager에 두는 것을 원칙으로 한다.
- 운영 화면과 사용자 화면 모두 현재 scope, 보존, 승인 요구, 정책 적용 범위가 읽히도록 badge/notice/audit entry를 노출한다.

---

## 14. 운영 관점 권장안

현재 단계의 현실적인 시작안은 다음과 같다.

1. control plane은 `Vercel`
2. canonical DB는 `Neon Postgres`
3. cache/hot state는 `Upstash Redis`
4. 파일 저장은 `Vercel Blob`
5. execution plane은 별도 worker/node 인프라

이후 아래 조건이면 확장한다.

- Redis 기반 queue/stream 부하가 커지면 더 강한 managed Redis로 전환
- Blob 비용/보존 요구가 커지면 S3 호환 object storage 확장 검토
- enterprise 격리가 필요하면 dedicated execution cluster 추가

---

## 15. 결론

이 제품은 `Vercel에 올린 웹앱 하나`로 끝나는 제품이 아니라, `Vercel control plane + separate execution plane + shared data services` 구조를 가져야 한다.

따라서 다음 원칙을 확정한다.

- 웹과 운영 콘솔은 Vercel 친화적으로 간다.
- 실행 세션과 브라우저는 별도 인프라에 둔다.
- Postgres, Redis, Blob은 역할별로 분리한다.
- 부팅 필수값만 bootstrap input으로 두고, 운영 정책은 관리자 UI가 canonical control surface, Postgres가 persisted source of truth가 된다.

---

## 16. 다음 문서 추천

1. `스토리지 아키텍처 정의서`
2. `실행 인프라 API 정의서`
3. `MVP 구현 순서 문서`
