# 스토리지 아키텍처 정의서 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 스토리지 아키텍처 정의서
- **버전**: v0.1
- **목적**: 제품의 기본 저장소 전략을 Postgres, Redis, Object Storage 기준으로 정리하고, Vercel 친화적인 초기 선택안을 확정한다.
- **관련 문서**: `docs/product-vision-v0.1.md`, `docs/domain-model-erd-v0.1.md`, `docs/execution-infra-data-model-v0.1.md`, `docs/db-table-migration-order-v0.1.md`, `docs/file-attachment-api-definition-v0.1.md`

---

## 2. 핵심 결론

이 제품은 하나의 저장소로 모든 데이터를 처리하는 구조보다, 데이터 성격에 따라 저장소 역할을 분리하는 구조가 맞다.

- `Admin UI`는 운영 설정의 canonical control surface / write path다.
- `PostgreSQL`은 persisted canonical data / source of truth다.
- `Redis`는 빠른 임시 상태와 캐시 계층이다.
- `Blob/Object Storage`는 이미지, 파일, artifact 저장소다.
- `Edge Config`는 전역 read-mostly 설정의 선택적 보조/캐시 계층이다.

즉, 기본 구조는 다음과 같다.

```text
Structured metadata / transactional data -> PostgreSQL
Ephemeral cache / counters / locks / hot state -> Redis
Images / uploads / generated files / recordings -> Blob or Object Storage
Read-mostly global flags cache -> Edge Config (optional)
```

---

## 3. Vercel 기준 추천 기본 조합

### 3.1 추천안

| 영역 | 추천 서비스 | 이유 |
|---|---|---|
| 기본 관계형 DB | `Neon Postgres` | Vercel 친화적이고 serverless Postgres로 출발하기 좋음 |
| 기본 Redis | `Upstash Redis` | Vercel 연동이 쉽고 캐시/rate limit/presence 용도에 적합 |
| 파일/이미지 저장 | `Vercel Blob` | 업로드/다운로드 UX가 단순하고 초기 세팅이 빠름 |
| 전역 read-mostly 값 | `Edge Config` | persisted source of truth가 아니라 feature flag/배너/공개 설정 캐시 보조 계층으로 적합 |

### 3.2 장기 실행형 워크로드 확장안

실행 노드, 큐, 스트림, 워커 orchestration 비중이 커지면 다음 조합이 더 안정적일 수 있다.

| 영역 | 확장 추천 | 이유 |
|---|---|---|
| 관계형 DB | `Neon Postgres` 유지 | 제품 핵심 메타데이터와 트랜잭션 처리 기준 유지 |
| Redis | `Redis Cloud` 또는 표준 managed Redis | job queue, streams, 고빈도 pub/sub에 더 유리할 수 있음 |
| 파일/artifact 저장 | `Vercel Blob` 또는 S3 호환 object storage | 녹화, 대용량 artifact, 장기 보존 확장 대응 |

---

## 4. 저장소별 역할 정의

### 4.1 PostgreSQL

반드시 Postgres에 두는 데이터:

- 사용자, 팀, 워크스페이스, 프로젝트
- 채팅 스레드, 메시지, 문서 메타데이터
- 첨부파일 메타데이터와 접근 제어 정보
- 에이전트 실행, 승인, 감사 로그, 플랜, 사용량
- 세션, 브라우저, artifact 메타데이터
- 관리자 설정의 persisted canonical 값
- RAG용 문서 chunk, embedding metadata, `pgvector` 인덱스

Postgres에는 파일 본문 자체를 넣지 않고, 파일의 메타데이터와 참조만 저장한다.

### 4.2 Redis

Redis에 두는 데이터:

- rate limit 카운터
- 로그인/인증 보조 상태
- 세션 hot state
- presence, typing, live viewer 상태
- 짧은 TTL 캐시
- 분산 lock
- 실시간 이벤트 fan-out 보조 상태

Redis는 source of truth가 아니라 보조 계층이다.

### 4.3 Blob / Object Storage

Object storage에 두는 데이터:

- 채팅 첨부 이미지
- 업로드 파일
- 생성된 이미지/리포트/ZIP 결과물
- 문서 원본 파일
- 세션 스크린샷, 녹화본, 테스트 리포트
- export/import 산출물
- session snapshot binary

Blob에는 바이너리와 대용량 파일을 저장하고, DB에는 `storage_provider`, `storage_key`, `mime_type`, `size_bytes` 같은 메타데이터만 둔다.

`storage_key`는 보통 `deployment/bootstrap 계층의 environment root prefix + 관리자 정책의 logical sub-prefix + 리소스별 key` 구조를 따른다.

실행 중 생성된 artifact가 프로젝트 장기 자산으로 승격될 때는 binary를 꼭 다시 복사할 필요는 없지만, 최소한 아래 메타데이터 변화는 분리해 관리해야 한다.

- `session_artifact`와 `file_asset` 또는 동등한 장기 자산 엔터티 사이의 relink/reference
- 보존 정책을 `session retention`에서 `project/document retention`으로 재평가
- 접근 범위를 `session scope`에서 `project/document/share scope`로 재계산
- 감사 로그에서 `artifact_promoted` 또는 동등 이벤트를 남겨 승격 이력을 추적

### 4.4 Edge Config

Edge Config는 선택적으로만 사용한다.

적합한 용도:

- 배포 직후 즉시 반영할 feature flag
- 공지 배너
- read-mostly public config cache
- edge region에서 자주 읽는 간단한 설정

부적합한 용도:

- 사용자 데이터
- 채팅/문서/프로젝트 데이터
- 관리자 UI/DB 기반 persisted 운영 설정
- 감사 대상이 되는 민감 설정

---

## 5. Vercel Marketplace 후보 평가

### 5.1 Postgres 후보

### `Neon`

- 가장 추천하는 기본안
- Vercel 배포와 잘 맞고, 초기 serverless 구조에 부담이 적다.
- 우리 제품처럼 Postgres를 핵심 canonical DB로 쓰려는 경우 가장 무난하다.

### `Supabase`

- 좋은 대안
- Postgres 자체는 훌륭하고 Storage/Auth/Realtime를 함께 가져갈 수 있다.
- 다만 우리 제품은 관리자 설정, 권한, 실행 평면을 직접 설계하는 비중이 크므로, 초기 기본안으로는 `Neon + 별도 Blob/Redis`가 더 단순하다.

### `Prisma Postgres`

- Prisma 중심 개발 경험은 좋을 수 있다.
- 다만 인프라 기준 canonical DB 선택으로는 일반적인 serverless Postgres provider를 직접 택하는 편이 더 명확하다.

### 비추천 축

- `Turso`: 경량 SQL에는 좋지만 이 제품의 중심 DB로는 맞지 않다.
- `MongoDB Atlas`: 문서형 DB가 핵심 이점이 되지 않는다.
- `MotherDuck`: 분석용 보조 계층에 가깝다.
- `Convex`: reactive app에는 좋지만 본 제품의 관계형 중심 모델과는 결이 다르다.

### 5.2 Redis 후보

### `Upstash`

- 가장 쉬운 기본안
- 캐시, rate limit, presence, 가벼운 hot state에 적합하다.
- Vercel 친화성이 높다.

### `Redis` 계열 managed provider

- 실행 노드와 워커가 무거워질수록 검토 가치가 높다.
- BullMQ, Redis Streams, 고빈도 작업 분배가 핵심이 되면 더 적합할 수 있다.

### 5.3 파일 저장 후보

### `Vercel Blob`

- MVP 기본안으로 가장 적합하다.
- 채팅 이미지, 파일 업로드, 결과물 저장, 간단한 artifact 보관에 충분하다.

### `Supabase Storage`

- `Supabase`를 기본 Postgres로 택할 경우 함께 검토 가능하다.
- 다만 현재 방향은 Vercel 친화적 조합이므로 기본 추천은 아니다.

### S3 호환 object storage

- 녹화본, 대형 artifact, 장기 보존이 커지면 더 유리할 수 있다.
- v1 이후 비용/보존 정책 최적화 단계에서 검토한다.

---

## 6. 데이터 배치 원칙

| 데이터 유형 | 주 저장소 | 보조 저장소 | 비고 |
|---|---|---|---|
| 사용자/팀/프로젝트 | Postgres | Redis cache | canonical relational data |
| 채팅 메시지/문서 본문 | Postgres | Redis cache | 검색/정렬/감사 기준 데이터 |
| 채팅 첨부 이미지/파일 | Blob | Postgres metadata | 파일 본문은 Blob |
| 세션 artifact | Blob | Postgres metadata | screenshot/report/recording 등 |
| session snapshot | Blob | Postgres metadata | restore metadata는 DB |
| rate limit / presence | Redis | 없음 | TTL 기반 운영 |
| 사용량 집계 원본 | Postgres | Redis temp counter | 최종 정산 기준은 DB |
| 임베딩/chunk | Postgres | 없음 | 초기에는 `pgvector` 권장 |
| feature flag | Postgres | Edge Config / edge cache | canonical은 Postgres, Edge Config는 선택적 배포 캐시 |

---

## 7. 제품 구조 관점의 중요한 판단

### 7.1 Vercel은 Control Plane에 적합

Vercel은 아래 계층에 잘 맞는다.

- 사용자 웹앱
- 관리자 콘솔
- BFF/API gateway 성격의 서버 계층
- 인증 콜백, 업로드 토큰 발급, signed URL 처리

### 7.2 실행 노드는 별도 Execution Plane이 맞다

이 제품의 핵심인 `Computer + Browser + Agent` 실행은 장시간 작업, 브라우저 제어, 컨테이너 운영, 로그 스트림이 필요하므로 Vercel 함수 계층만으로 해결하기 어렵다.

따라서 구조는 아래가 적합하다.

```text
Vercel
- web app
- admin console
- API/BFF

Separate execution infrastructure
- session workers
- browser workers
- build/runtime nodes
- queue consumers
```

### 7.3 연결 방식 원칙

- Postgres는 pooled connection 기준으로 사용한다.
- 파일 업로드는 서버 경유 업로드보다 signed URL 기반을 우선한다.
- 대용량 artifact 다운로드는 object storage direct access를 우선한다.

---

## 8. 데이터 모델 반영 포인트

다음 엔터티는 초기 설계에 반영하는 것이 좋다.

- `file_asset`: object storage에 저장된 파일 메타데이터
- `attachment`: 메시지/문서/프로젝트와 `file_asset`을 연결하는 관계 엔터티
- `session_artifact.storage_provider`: artifact의 실제 저장소 구분
- `session_restore_point.storage_provider`: 스냅샷 저장 위치 구분

권장 필드는 아래와 같다.

- `storage_provider`
- `storage_key`
- `original_filename`
- `mime_type`
- `size_bytes`
- `checksum_sha256`
- `visibility_scope`
- `promotion_state`
- `promoted_from_artifact_id`
- `retention_policy`

`storage_key` 설계 시에는 환경 격리를 위한 root prefix와 기능별 logical sub-prefix를 분리해 두는 것이 좋다.

단, `session_artifact`는 별도 `visibility_scope`를 두기보다 workspace/project/session 범위를 상속하는 방식도 가능하다.

---

## 9. 초기 권장안

지금 단계에서 가장 현실적인 기본 선택은 다음과 같다.

- `Neon Postgres`
- `Upstash Redis`
- `Vercel Blob`

단, 아래 조건이면 Redis는 더 강한 managed Redis로 올리는 것을 권장한다.

- day 1부터 heavy job queue가 핵심인 경우
- 브라우저/에이전트 워커가 Redis Streams에 강하게 의존하는 경우
- 실시간 fan-out 트래픽이 매우 높은 경우

---

## 10. 결론

이 제품은 채팅 SaaS가 아니라 실행형 AI 개발 플랫폼이므로, 저장소도 단순히 DB 하나로 끝내면 안 된다.

따라서 다음 원칙을 확정한다.

- 구조화 데이터는 `PostgreSQL`
- 임시 상태와 캐시는 `Redis`
- 이미지/파일/결과물은 `Blob/Object Storage`
- Vercel은 control plane에, 실행 노드는 별도 execution plane에 둔다.

초기 기본 조합은 `Neon Postgres + Upstash Redis + Vercel Blob`으로 잡는 것이 가장 무난하다.

---

## 11. 다음 문서 추천

1. `배포 아키텍처 및 환경 분리 문서`
2. `파일 첨부 / 업로드 API 정의서`
3. `실행 인프라 데이터 모델 초안`
