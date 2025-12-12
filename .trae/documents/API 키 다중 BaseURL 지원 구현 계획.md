# API 키 및 BaseURL 관리 기능 확장 계획

사용자 요청에 따라 여러 개의 OpenAI API 키와 서로 다른 BaseURL(예: Local LLM, Azure OpenAI 등)을 지원하도록 시스템을 개선하겠습니다.

## 1. 데이터베이스 스키마 수정 (`prisma/schema.prisma`)
- `ApiKey` 모델에 `baseUrl` 필드(String, Optional)를 추가합니다.
- 이를 통해 각 API 키별로 고유한 API 엔드포인트를 설정할 수 있습니다.

## 2. 백엔드 로직 업데이트
- **`src/lib/api-key-manager.ts`**: `getActiveApiKey` 함수가 `baseUrl` 정보를 포함하여 반환하도록 수정합니다.
- **API 라우트 (`src/app/api/admin/keys/...`)**: API 키 생성 및 수정 시 `baseUrl`을 저장하고 불러오도록 업데이트합니다.

## 3. 관리자 UI 개선 (`src/components/admin/api-key-manager.tsx`)
- API 키 추가/수정 폼에 `Base URL` 입력 필드를 추가합니다.
- '제공자(Provider)' 필드를 더 유연하게 입력할 수 있도록 하여, `openai` 외에도 사용자 정의 제공자(예: `local-llm`, `azure-gpt`)를 구분할 수 있게 합니다.

## 4. 채팅 API 연동 (`src/app/api/chat/route.ts`)
- 채팅 요청 처리 시, 선택된 모델/제공자에 맞는 API 키와 `baseUrl`을 사용하여 OpenAI 클라이언트를 초기화하도록 로직을 변경합니다.
- `baseUrl`이 설정된 경우, 표준 OpenAI URL 대신 해당 URL을 사용하게 됩니다.

이 변경을 통해 공식 OpenAI 키뿐만 아니라, OpenAI 인터페이스를 호환하는 다양한 로컬/외부 모델 서버를 자유롭게 등록하고 사용할 수 있게 됩니다.
