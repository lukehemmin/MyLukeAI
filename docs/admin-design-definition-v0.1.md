# 관리자 디자인정의서 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 관리자 디자인정의서
- **버전**: v0.1
- **목적**: 관리자 콘솔의 시각 방향, 레이아웃 원칙, 컴포넌트 패턴, 상태 표현, 반응형 전략을 정의하여 디자인 AI 또는 실제 디자이너가 일관된 운영 콘솔을 설계할 수 있도록 한다.
- **관련 문서**: `docs/admin-panel-spec-v0.1.md`, `docs/admin-screen-definition-v0.1.md`, `docs/admin-settings-data-model-v0.1.md`, `docs/admin-audit-log-policy-v0.1.md`

---

## 2. 디자인 목표

관리자 콘솔은 단순한 `설정 페이지`가 아니라, 실행형 AI 개발 플랫폼 전체를 조작하는 **운영 콘솔**처럼 보여야 한다.

디자인 목표는 다음과 같다.

- 복잡한 설정이 많아도 읽기 쉽게 구조화한다.
- OpenWebUI처럼 세세한 옵션을 다룰 수 있는 밀도를 제공한다.
- 일반 B2B 대시보드처럼 밋밋하지 않되, 운영 도구답게 신뢰감을 준다.
- `Computer`, `Browser`, `Agent`, `Billing`, `Security` 같은 고위험 영역을 시각적으로 분명히 구분한다.
- 관리자에게 `지금 무엇이 중요하고`, `무엇이 위험하며`, `무엇이 아직 저장되지 않았는지`를 즉시 알려준다.
- 엔터프라이즈 운영자가 감사, SSO, 권한, 데이터 보존, 정책 적용 범위, 승인 흐름을 화면만 보고 이해할 수 있어야 한다.

---

## 3. 디자인 키워드

- Operational
- Precise
- Dense but Calm
- Technical
- Search-First
- Auditable
- Controlled

### 피해야 할 인상

- 너무 마케팅 사이트 같은 느낌
- 지나치게 화려한 SaaS 랜딩 스타일
- 평면적이고 무기질적인 표 중심 UI
- 보안/위험도를 읽기 어렵게 만드는 과도한 미니멀리즘

---

## 4. 비주얼 방향

### 4.1 톤앤매너

- 기본 톤은 차분하고 기술적인 운영 환경
- 일반 사용자용 제품 화면보다 더 높은 정보 밀도
- 브라우저/세션/로그/정책 같은 개념이 자연스럽게 어울리는 느낌
- 설정 화면이 많더라도 `체계적인 제어판`처럼 느껴져야 함

### 4.2 컬러 방향

보라색 위주의 전형적인 SaaS 톤은 피한다. 추천 방향은 다음과 같다.

- 기본 배경: 옅은 `stone`, `fog`, `graphite tint`
- 기본 텍스트: 짙은 `ink`, `charcoal`
- 성공 상태: `teal` 또는 `emerald`
- 경고 상태: `amber`
- 위험 상태: `crimson` 또는 `red oxide`
- 정보 강조: `steel blue`

#### 권장 CSS 변수 예시

```css
:root {
  --bg-page: #f4f2ed;
  --bg-surface: #fbfaf7;
  --bg-panel: #f0ede6;
  --fg-primary: #16181b;
  --fg-secondary: #4f575f;
  --line-soft: #ddd7cc;
  --line-strong: #b8b09f;
  --accent-info: #3d6c7a;
  --accent-success: #2f7461;
  --accent-warning: #b7791f;
  --accent-danger: #9f3c32;
}
```

### 4.3 타이포그래피

운영 콘솔은 기본 사용자 화면보다 더 기술적인 인상을 가져도 된다.

- 기본 본문: `IBM Plex Sans` 또는 `Public Sans`
- 숫자/로그/키/ID/코드: `IBM Plex Mono` 또는 `JetBrains Mono`
- 섹션 타이틀은 너무 둥글거나 캐주얼하지 않게 유지

#### 원칙

- 제목은 명확하고 짧게
- 설명 텍스트는 보조 정보로 계층을 낮춤
- 긴 폼에서는 라벨과 설명, 현재값과 기본값의 위계가 분명해야 함

---

## 5. 레이아웃 시스템

### 5.1 데스크톱 기본 구조

관리자 콘솔은 데스크톱 우선 구조로 설계한다.

```text
Top Bar
┌──────────────────────────────────────────────────────────────┐
│ Admin Title | Global Search | Alerts | Role Badge | Profile │
└──────────────────────────────────────────────────────────────┘

Main Layout
┌──────────────┬────────────────────────────────┬──────────────┐
│ Primary Nav  │ Main Content                   │ Context Rail │
│              │                                │              │
│ Dashboard    │ Settings cards / tables /      │ change log   │
│ Users & Groups │ charts / editors / forms     │ apply mode   │
│ Analytics    │                                │ test status  │
│ Evaluations  │                                │ docs links   │
│ Functions    │                                │ defaults     │
│ Settings     │                                │              │
└──────────────┴────────────────────────────────┴──────────────┘
```

### 5.2 Settings 상세 구조

Settings 상세는 3단 레이아웃을 기본으로 한다.

- 좌측: 카테고리/섹션 내비게이션
- 중앙: 실제 설정 폼/표/카드
- 우측: 현재 적용 범위, 반영 방식, 변경 이력, 테스트 상태

### 5.3 저장 바

- 화면 하단 또는 우측 하단에 `sticky save bar`를 둔다.
- Dirty 상태일 때만 활성화
- `Save`, `Save & Test`, `Reset`, `View Diff` 액션이 모여 있어야 한다.

---

## 6. 정보 밀도 전략

운영 콘솔은 정보량이 많기 때문에 `단순히 여백을 넓히는 방식`으로 해결하면 안 된다.

### 원칙

- 정보 밀도는 높게, 가독성은 더 높게
- 시각적 그룹을 강하게 나눈다.
- 긴 폼은 카드, 섹션, 접이식 그룹으로 분해한다.
- 라벨과 값, 설명과 경고, 위험한 액션을 확실히 구분한다.

### 권장 패턴

- 한 화면에 4~8개의 주요 설정 카드
- 카드 내부는 2열 또는 3열 폼 가능
- 매우 긴 설명은 tooltip/expand 처리
- 긴 JSON/Prompt/Workflow는 전용 에디터 패널 사용

### 엔터프라이즈 UX 원칙

- `effective scope`와 `override source`를 숨기지 않는다.
- 승인, 보존, 민감값, 위험한 변경은 별도 시각 계층으로 올린다.
- 정책은 값만 보여주지 말고 `어디에 적용되는지`, `언제 반영되는지`, `누가 변경했는지`까지 함께 보여준다.
- 운영자가 테이블/폼/로그를 오가며 추론하지 않도록 화면 내 연결을 충분히 제공한다.

---

## 7. 핵심 컴포넌트 패턴

### 7.1 Navigation

- 좌측 1차 내비게이션은 강한 섹션 구분 사용
- Settings 내부 2차 내비는 세밀한 카테고리 탐색용
- 현재 위치는 `section + subsection` 이중 표시

### 7.2 Settings Card

- 카드 상단: 제목, 설명, 위험도 배지
- 카드 본문: 필드 그룹
- 카드 우측 또는 하단: test/status/apply mode

### 7.3 Secret Field

- 마스킹된 preview 표시
- `Update`, `Rotate`, `Clear` 액션 분리
- 최근 수정 시점 표시 가능

### 7.4 Validation Summary

- 저장 실패 시 폼 위 상단에 요약 박스 제공
- 어느 필드가 실패했는지 링크 이동 가능해야 함

### 7.5 Test Result Panel

- `Test Connection` 또는 `Save & Test` 이후 결과를 별도 패널로 제공
- 성공/실패뿐 아니라 latency, endpoint, error summary를 보여줌

### 7.6 Danger Zone

- 일반 섹션과 완전히 분리
- 배경색, 아이콘, 설명, 확인 액션을 강하게 구분
- 예: `Reset Vector Storage`, `Restore Snapshot`, `Delete Provider`

### 7.7 Diff Preview

- 설정 변경 전/후 값을 비교해 보여주는 UI
- 특히 JSON, policy, entitlement, provider config 변경에 중요

### 7.8 Audit Drawer

- 설정 상세 화면 우측에서 최근 변경 이력과 관련 감사 로그를 바로 확인 가능해야 함

### 7.9 Scope Path / Effective Policy Summary

- `global > plan > group > team > project`와 `global > provider`, `global > model` 같은 적용 경로를 시각적으로 표현
- 현재값이 기본값인지 override인지, 어느 범위에서 덮였는지 즉시 보여줌

### 7.10 Retention / Lifecycle Card

- 로그, artifact, export, snapshot, recording의 보존 기간과 만료 정책을 표/카드로 설명
- 보존 정책 변경이 비용/감사에 미치는 영향을 함께 보여줄 수 있어야 함

### 7.11 Approval Queue / Review Drawer

- 승인 대기 액션, 위험도, 요청자, 대상 범위, 관련 정책, 증적 링크를 함께 보여줌
- 승인/반려 결과와 그 사유가 이후 감사 로그와 연결되어야 함

### 7.12 Identity / SSO Trust Panel

- 로그인 방식, 도메인 신뢰, SSO 활성 상태, 기본 역할/그룹 할당 정책을 한 패널에서 요약
- 엔터프라이즈 운영자가 인증 구조를 빠르게 파악할 수 있어야 함

---

## 8. 화면별 디자인 방향

### 8.1 관리자 대시보드

#### 핵심 목표

- 운영 상황을 5초 안에 파악

#### 우선 노출 정보

- 활성 Computer/Browser 세션
- 모델 공급자 상태
- 에이전트 실행 실패율
- 실행 큐 적체
- 경고 이벤트

#### 시각 패턴

- KPI 카드 + 상태 배지
- 운영 알림 패널
- 런타임 상태 스트립
- 짧은 기간 트렌드 차트

#### 디자인 포인트

- 마케팅 대시보드가 아니라 `mission control` 같은 인상
- 위험 상태는 위쪽으로 끌어올려야 함

### 8.2 Users & Groups

#### 핵심 목표

- 표 중심이지만 차갑지 않게 설계

#### 시각 패턴

- 강한 검색/필터 바
- Dense table + detail side panel
- 역할/상태/플랜은 badge 기반

#### 디자인 포인트

- `User`, `Team`, `Group`이 헷갈리지 않게 시각 구분
- 그룹 권한 매트릭스는 단순 표보다 섹션화된 permission board가 좋음

### 8.3 Settings Hub / Search

#### 핵심 목표

- 방대한 설정을 빠르게 탐색

#### 시각 패턴

- 카테고리 카드 그리드
- 검색 중심 진입
- 최근 편집, 위험 카테고리, 추천 카테고리 구분

#### 디자인 포인트

- `OpenWebUI처럼 옵션은 많지만`, 더 구조화되어 보여야 함

### 8.4 Settings Detail

#### 핵심 목표

- 긴 설정 폼도 안정적이고 이해 가능하게

#### 시각 패턴

- 좌측 카테고리 레일
- 중앙 설정 카드
- 우측 메타/감사/적용 패널
- 하단 sticky save bar

#### 디자인 포인트

- 한 화면 안에서 `설정`, `테스트`, `적용 범위`, `감사`, `복원`이 모두 보여야 함
- Secret, JSON, connection, workflow, prompt 템플릿은 서로 다른 UI treatment 필요
- 민감 설정일수록 `effective value`, `scope`, `retention`, `approval impact`가 더 분명하게 드러나야 함

### 8.5 Analytics

#### 핵심 목표

- 숫자와 차트가 많아도 운영 우선순위를 잃지 않게

#### 시각 패턴

- 기간 필터 탭
- KPI + 차트 + 테이블 조합
- Model/Runtime/Team usage 탭 가능

#### 디자인 포인트

- 색을 남발하지 않고, 한두 가지 강조색으로 상태를 보여줌

### 8.6 Evaluations

#### 핵심 목표

- 모델 비교와 피드백 흐름을 운영적으로 읽기 쉽게 시각화

#### 시각 패턴

- leaderboard, feedback table, arena model 관리 패널 조합
- 모델 역할/상태/평가 결과를 badge와 score로 분리 표시

#### 디자인 포인트

- 연구 도구처럼 보여야 하지만, 운영 의사결정 화면이라는 성격을 잃지 않아야 함

### 8.7 Functions

#### 핵심 목표

- 확장 가능성과 위험성을 동시에 보여줌

#### 시각 패턴

- 카드/리스트 혼합
- 출처, 작성자, 활성 상태, 위험도 배지
- import/export/create 액션 강조

#### 디자인 포인트

- arbitrary code execution 경고는 시각적으로 확실히 드러나야 함

### 8.8 Settings Detail Variants

#### 핵심 목표

- `Security & Audit`, `Billing & Plans`, `Database & Data Ops`, `Pipelines`처럼 성격이 강한 Settings 하위 화면의 시각 패턴을 정리

#### 시각 패턴

- 표 + diff drawer + export controls
- severity 색상 체계 명확화
- critical 이벤트는 더 높은 강조
- Data Ops는 health summary와 export/import job 상태를 함께 보여줌
- approval queue, retention matrix, scope-aware filter를 자연스럽게 수용해야 함

#### 디자인 포인트

- 무겁지만 읽기 쉬워야 함
- 위험도를 과장하지 않되 절대 희석하지 말아야 함
- 최상위 독립 화면처럼 보이기보다 Settings Detail의 고위험 변형으로 읽혀야 함

---

## 9. 상태 디자인 원칙

### 9.1 기본 상태

- Empty
- Loading
- Error
- Dirty
- Save Success
- Save Failed

### 9.2 설정 특화 상태

- Validation Error
- Secret Hidden
- Secret Rotated
- Test Running
- Test Success
- Test Failed
- Restart Required
- New Sessions Only

### 9.3 실행형 플랫폼 특화 상태

- Provider Degraded
- Browser Backend Unavailable
- Queue Saturated
- Runtime Policy Conflict
- Approval Required
- Recording Enabled

#### 시각 원칙

- 상태는 단순 색만이 아니라 텍스트, 아이콘, 배지 형태로 중복 전달
- `warning`, `critical`은 설명 텍스트가 함께 나와야 함

---

## 10. 인터랙션 및 모션

운영 콘솔은 과한 마이크로 인터랙션보다 의미 있는 피드백이 중요하다.

### 권장 인터랙션

- 섹션 확장/축소
- 저장 후 짧은 확인 애니메이션
- 테스트 실행 시 상태 전환 피드백
- diff drawer 열기/닫기
- 로그/히스토리 패널 슬라이드 인

### 피해야 할 것

- 과도한 bounce 애니메이션
- 장식용 모션
- Danger 액션을 가볍게 보이게 만드는 playful motion

---

## 11. 반응형 원칙

### 데스크톱

- 운영 콘솔의 기본 환경
- 3단 레이아웃 적극 사용
- Dense table / multi-column form 적극 허용

### 태블릿

- 우측 컨텍스트 패널은 드로어 또는 overlay로 전환
- Settings detail은 2단 구조로 축소 가능

### 모바일

- 조회 중심으로 지원
- 편집 가능하더라도 긴 설정 수정은 단계형 또는 아코디언형 구조 필요
- Danger action, diff preview, large JSON editor는 모바일에서 제약 가능

### 원칙

- 모바일에서도 완전히 깨지면 안 되지만, 관리자 콘솔은 데스크톱 최적화 기준으로 설계한다.

---

## 12. 디자인 시스템 토큰 방향

### spacing

- `4 / 8 / 12 / 16 / 24 / 32`

### radius

- 기본 카드: `16px`
- 작은 badge/input: `10px`
- modal / side panel: `20px`

### border

- 일반 카드: soft line
- 위험 카드: warning/danger tinted border

### shadow

- 운영 도구이므로 깊은 그림자보다는 얕은 레이어 구분 중심

---

## 13. AI 디자이너 전달용 체크리스트

디자인 산출물에는 최소한 아래가 포함되어야 한다.

### MVP 필수 산출물

- 관리자 대시보드 데스크톱 화면
- Users & Groups 화면
- Settings Hub / Search 화면
- Settings Detail 화면
- Access & Identity 설정 화면
- Security & Audit 설정 화면
- Billing & Plans 설정 화면
- Database & Data Ops 설정 화면

### v1 또는 확장 검토용 산출물

- Evaluations 화면
- Functions 관리 화면

### 공통 상태/변형 산출물

- `normal / dirty / validation error / test success / test failed / danger confirm` 상태
- Secret field 마스킹 상태
- Save bar 고정 상태
- Audit drawer 열린 상태
- Effective scope / override source 표시 상태
- Approval queue / review drawer 상태
- Retention / lifecycle policy 표시 상태
- Desktop + Tablet + Mobile 대응 샘플

---

## 14. 금지 패턴

- 과도하게 평평한 흰 배경 + 회색 테이블만으로 구성된 뻔한 관리자 UI
- Purple 계열을 중심으로 한 전형적 SaaS 스타일
- Danger action과 normal action의 시각 구분이 없는 구성
- Search-first가 아닌 긴 메뉴 나열 중심 구조
- Browser/Computer/Agent 중요도를 일반 설정과 동일하게 취급하는 구조

---

## 15. 결론

관리자 콘솔은 `옵션이 많은 설정 페이지`가 아니라, **실행형 AI 개발 플랫폼을 운용하는 미션 컨트롤 센터**처럼 느껴져야 한다.

따라서 디자인은 다음을 동시에 만족해야 한다.

- OpenWebUI 수준의 세세한 설정 밀도
- 운영 도구답게 안정적인 구조
- Search-first 탐색성
- 보안과 위험도 표현의 명확성
- Computer, Browser, Agent 중심 플랫폼 특성 반영

---

## 16. 다음 문서 추천

1. `디자인 시스템 토큰 문서`
2. `운영 플레이북`
3. `프론트엔드 상태관리 구조서`
