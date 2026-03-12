# MVP 구현 순서 문서 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 MVP 구현 순서 문서
- **버전**: v0.1
- **목적**: 제품, 실행 인프라, 관리자 콘솔을 어떤 순서로 구현해야 가장 빠르게 가치 있는 MVP를 만들 수 있는지 정의한다.
- **관련 문서**: `docs/core-api-priority-v0.1.md`, `docs/domain-model-erd-v0.1.md`, `docs/execution-infra-api-definition-v0.1.md`, `docs/service-design-definition-v0.1.md`, `docs/storage-architecture-v0.1.md`, `docs/deployment-architecture-environment-separation-v0.1.md`, `docs/file-attachment-api-definition-v0.1.md`

---

## 2. 문서 목적

이 문서는 `기능이 많기 때문에 무엇부터 만들지 흔들리는 상황`을 막기 위한 구현 순서 문서다.

핵심 목표는 다음과 같다.

- 가장 작은 노력으로 가장 강한 제품 차별점을 만드는 순서를 정한다.
- 채팅 SaaS로 빠지지 않고 실행형 AI 플랫폼으로 가도록 구현 순서를 통제한다.
- 관리자/과금/협업 기능의 상세 고도화는 뒤로 미루더라도, 운영의 canonical 경로와 데이터 구조는 초기에 고정한다.

---

## 3. 구현 우선 원칙

- **Vertical Slice First**: 얇아도 끝까지 이어지는 흐름을 먼저 만든다.
- **Execution Before Polish**: 예쁜 채팅 화면보다 실제 세션 실행 흐름이 우선이다.
- **Project Before Complexity**: 프로젝트 중심 구조를 먼저 세운다.
- **Admin UI Before env Dependence**: 운영 핵심 설정은 초기부터 관리자 UI 기반으로 간다.
- **Governance Visible Early**: 권한, 보존, 정책 적용 범위, 승인 요구는 제품/관리자 화면에 이른 단계부터 드러나야 한다.
- **Meter Early**: 사용량 계량 포인트는 초기에 심어둔다.

---

## 4. 가장 먼저 성립해야 하는 MVP 경험

아래 흐름이 돌아가면 제품의 핵심 가치가 처음으로 드러난다.

1. 사용자가 로그인한다.
2. 프로젝트를 만든다.
3. 모델을 선택하고 채팅에서 개발 요청을 보낸다.
4. Computer 세션이 생성된다.
5. 브라우저 세션이 붙는다.
6. AI가 작업하고 로그와 브라우저 화면이 보인다.
7. 결과를 확인하고 프로젝트에 남긴다.

이 흐름이 구현 우선순위의 기준선이다.

---

## 5. 권장 구현 단계

### Phase 0. 기초 골격

### 목표

- 전체 제품 구조를 지탱할 최소 골격 확보

### 구현 항목

- 모노레포/서비스 구조 결정
- DB 스키마 기본 골격
- 인증 기반 마련
- 기본 관리자 계정 생성 구조
- 설정 시스템 기본 테이블 생성
- bootstrap secret과 관리자 UI 설정의 경계 확정
- `Connections`, `Models`, `Computer & Browser` 최소 카테고리 조회/저장 골격 확보
- Postgres / Redis / object storage 기본 연결 구조 확정
- 로그/에러 추적 기본 체계 연결
- Admin UI = canonical operational write path, Postgres = persisted canonical data 원칙 확정

### 완료 기준

- 개발자가 로컬에서 앱 서버와 기본 DB를 띄울 수 있다.
- 개발 또는 스테이징 환경에서 Postgres, Redis, object storage를 모두 연결할 수 있다.
- 관리자 UI 기반 설정 시스템의 골격이 있다.
- 부팅 필수값 외의 운영 정책을 `.env` 없이 관리자 UI/DB에서 관리할 수 있는 최소 경로가 있다.

---

### Phase 1. 워크스페이스 / 프로젝트 / 모델 카탈로그

### 목표

- 제품의 자산 구조를 먼저 고정

### 구현 항목

- 사용자 프로필
- personal workspace
- team workspace 골격
- 프로젝트 생성/조회/수정
- 관리자 UI에서 provider connection 최소 등록/조회/test 가능
- 관리자 UI에서 모델 카탈로그 최소 등록/조회 가능
- 제품 앱에서는 admin-managed 모델 카탈로그를 읽기 시작
- 프로젝트/모델 선택 UI에 scope badge와 기본 policy notice 반영

### 완료 기준

- 로그인 후 프로젝트를 만들고 프로젝트 상세에 진입 가능
- 사용 가능한 모델 목록을 볼 수 있음
- 초기 연결과 모델 노출 정책을 관리자 UI에서 제어할 수 있음

---

### Phase 2. 채팅 코어

### 목표

- 사용자가 제품에 진입하는 기본 UX 완성

### 구현 항목

- 채팅 스레드 생성
- 메시지 저장
- 이미지/파일 첨부 업로드 기초
- 모델 선택
- 스트리밍 응답
- 프로젝트 연결 대화
- 문서/첨부/공유 UI에 retention badge와 sharing scope 표시 반영

### 완료 기준

- 프로젝트에서 대화를 만들고 모델과 기본 대화를 할 수 있음

### 주의

- 여기서 멈추면 그냥 채팅 서비스가 되므로, 다음 Phase를 바로 이어가야 함

---

### Phase 3. Computer 세션 MVP

### 목표

- 실행형 플랫폼의 첫 차별점 구현

### 구현 항목

- 세션 생성/큐/상태 관리
- 실행 템플릿 최소 1~2종 제공
- Computer 정책 기본값을 관리자 UI에서 제어
- 세션 로그 수집
- preview port 노출
- 세션 중지/재개 기초
- 세션 화면에 execution mode, browser requested state, retention/policy notice 기본 가시성 반영

### 완료 기준

- 프로젝트에서 세션을 띄우고 서버를 실행하며 로그를 볼 수 있음
- 운영자가 템플릿과 세션 기본 정책을 UI에서 조정 가능

---

### Phase 4. Browser 세션 MVP

### 목표

- 브라우저 기반 가시성과 검증 경험 구현

### 구현 항목

- 브라우저 세션 생성
- live view 제공
- 기본 브라우저 액션 로그
- console/network 오류 기초 수집
- 브라우저 재시작
- Browser 정책 기본값과 recording/capture 정책을 관리자 UI에서 제어
- 브라우저/실행 화면에 approval required, scope badge, recording retention notice 노출

### 완료 기준

- 세션 안에서 실행 중인 앱을 브라우저로 실제 확인 가능
- 사용자가 AI 작업 과정을 브라우저로 볼 수 있음
- 브라우저 운영 정책이 `.env`가 아니라 관리자 UI 기준으로 반영됨

---

### Phase 5. Agent 실행 MVP

### 목표

- 채팅 명령이 실제 작업으로 이어지게 함

### 구현 항목

- 단일 에이전트 실행
- 세션 reuse/create 전략
- 에이전트 실행 상세
- artifact 저장
- 기본 승인 흐름
- artifact -> project/document asset 승격과 관련된 상태/감사 이벤트 노출

### 완료 기준

- 사용자가 채팅 또는 프로젝트에서 에이전트를 실행하고 결과/로그/브라우저 행동을 볼 수 있음

---

### Phase 6. 문서 / 결과 축적 / 팀 기초

### 목표

- 결과가 사라지지 않고 프로젝트 자산으로 남도록 함

### 구현 항목

- 문서 생성/편집 기초
- 파일 업로드 / 첨부 메타데이터 기초
- 프로젝트와 문서 연결
- 팀 워크스페이스 기초
- 팀 멤버 초대 기초
- 공유 프로젝트/문서 기초
- 팀 scope, document share scope, promoted asset retention 상태 표시

### 완료 기준

- 팀이 하나의 프로젝트와 문서를 같이 볼 수 있음
- 작업 결과를 문서화할 수 있음

---

### Phase 7. 관리자 콘솔 확장 MVP

### 목표

- 초기 Phase에 들어간 운영 surface를 검색/권한/이력 중심의 관리자 콘솔로 완성

### 구현 항목

- 관리자 대시보드
- Users & Groups 기본
- 관리자 설정 허브 / 검색
- Connections 기본
- Models 기본
- Documents & Retrieval / Web Search 기본 설정
- Computer & Browser 정책 기본
- Code Execution / Interface 기본 설정
- Billing & Plans 기본 구조
- Database & Data Ops 기본
- 승인 큐, audit log 조회, scope/retention/policy visibility 허브 완성

### 완료 기준

- 운영자가 UI에서 주요 설정을 바꾸고 테스트할 수 있음
- 모델 연결과 실행 정책을 관리자 UI에서 제어 가능
- 운영자가 approval queue, audit trail, scope-specific policy 영향을 UI에서 확인 가능

### 비고

- Phase 0에서 설정 시스템 골격은 이미 시작되어야 한다.
- 이 Phase는 `관리자 콘솔의 UX 완성` 단계다.
- 다만 운영 canonical 경로 자체는 Phase 0~4에서 이미 살아 있어야 한다.
- 공개 MVP 릴리스 전에는 최소한 Phase 7과 Phase 8의 baseline까지 완료되어야 한다.

---

### Phase 8. 사용량 / 플랜 / 제한 적용 MVP

### 목표

- 상용화 준비 구조 확보

### 구현 항목

- usage record 집계
- 플랜별 entitlement 적용
- 좌석/세션/리소스 제한 적용
- 개인/팀 사용량 화면
- 관리자 수동 플랜 할당 및 기본 차단 정책 적용
- 플랜/권한/정책 제한이 제품 화면의 badge/notice로도 읽힘

### 완료 기준

- 세션 생성과 브라우저 사용량이 실제로 계량됨
- 플랜별 제한이 동작함
- 공개 MVP에서 플랜/권한/사용량 구조가 실제 운영 가능 상태다.

---

### Phase 9. 확장 기능

### 구현 후보

- 멀티에이전트 오케스트레이션
- 워크플로우 자동화
- Functions / Pipelines
- Evaluations
- 감사 로그 UI 고도화
- 실제 결제 연동

---

## 6. 구현 순서 요약

```text
0. 기초 골격
1. 워크스페이스 / 프로젝트 / 모델
2. 채팅 코어
3. Computer 세션
4. Browser 세션
5. Agent 실행
6. 문서 / 팀 기초
7. 관리자 콘솔
8. 사용량 / 플랜 제한
9. 확장 기능
```

---

## 7. 병렬 개발 권장 구조

### Track A. Product App

- 로그인
- 프로젝트
- 채팅
- 문서

### Track B. Execution Plane

- 세션 생성
- 노드 스케줄링
- 브라우저 backend
- logs/artifacts

### Track C. Admin / Ops

- settings core
- provider connection
- model registry
- usage / plan base

### 원칙

- Track A와 B는 병렬 가능
- Track C는 최소 운영 surface를 Phase 0~4에 먼저 심고, 상세 콘솔 UX는 뒤따라와도 됨

---

## 8. MVP에서 의도적으로 늦춰도 되는 것

- 완성도 높은 멀티에이전트 오케스트레이션
- 고급 협업 문서 편집
- 고급 분석 대시보드
- 엔터프라이즈 보안 풀세트
- 마켓플레이스형 Functions/Pipelines 생태계

---

## 9. 가장 중요한 경계선

이 제품은 아래 상태를 넘어서야 한다.

### 아직 안 됨

- 채팅은 되지만 실행은 안 됨
- 실행은 되지만 브라우저 검증이 안 됨
- 브라우저는 보이지만 프로젝트와 연결되지 않음
- 운영 핵심 정책이 여전히 `.env`나 수동 DB 편집에 묶여 있음

### MVP 기준 통과

- 프로젝트 안에서 채팅 -> 실행 -> 브라우저 검증 -> 결과 저장 흐름이 된다.
- 부팅 필수 infra secret 외 운영 정책은 관리자 UI가 canonical control surface이고 Postgres가 persisted source of truth다.
- 사용량 계량과 기본 플랜 제한이 실제로 동작한다.

---

## 10. Phase 종료 판단 기준

각 Phase는 아래 질문에 `예`라고 답할 수 있어야 넘어간다.

- 사용자 가치가 실제로 늘어났는가?
- 다음 Phase가 시작 가능한 구조가 되었는가?
- 임시방편 env나 수동 운영에 과도하게 의존하지 않는가?
- 관리자나 사용량 구조를 나중에 붙일 수 있도록 확장성이 남아 있는가?

---

## 11. 구현 우선순위 확정 문장

우리는 `채팅 SaaS를 고도화하는 방식`으로 만들지 않고, **프로젝트 중심 실행형 AI 플랫폼을 먼저 성립시키고, 그 위에 협업과 운영 기능을 얹는 방식**으로 MVP를 구현한다.

---

## 12. 다음 문서 추천

1. `테스트 전략 문서`
2. `프론트엔드 상태관리 구조서`
3. `백엔드 서비스 경계 정의서`
