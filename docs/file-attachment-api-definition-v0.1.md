# 파일 첨부 / 업로드 API 정의서 v0.1

## 1. 문서 개요

- **문서명**: 실행형 AI 개발 플랫폼 파일 첨부 / 업로드 API 정의서
- **버전**: v0.1
- **목적**: 채팅 이미지, 파일 업로드, 문서 첨부, 세션 결과물 연결을 위한 파일 업로드/완료/조회/다운로드 API 계약을 정의한다.
- **관련 문서**: `docs/domain-model-erd-v0.1.md`, `docs/storage-architecture-v0.1.md`, `docs/deployment-architecture-environment-separation-v0.1.md`, `docs/execution-infra-api-definition-v0.1.md`

---

## 2. 문서 목적

이 문서는 채팅과 문서, 프로젝트, 실행 산출물에서 공통으로 사용할 파일 계층을 정의하기 위한 문서다.

핵심 목표는 다음과 같다.

- 바이너리 파일은 object storage로 direct upload한다.
- 앱 서버는 권한 검증과 메타데이터 확정만 담당한다.
- `file_asset`와 `attachment`를 통해 채팅, 문서, 프로젝트 자산에 파일을 연결한다.
- signed URL 기반 다운로드 정책을 일관되게 정의한다.

---

## 3. 핵심 원칙

- **Direct Upload First**: 파일 본문은 앱 서버를 거치지 않고 object storage로 직접 업로드한다.
- **Metadata in Postgres**: 파일 메타데이터와 권한 정보는 Postgres에 저장한다.
- **Attachment as Relation**: 파일과 메시지/문서/프로젝트 연결은 `attachment`로 표현한다.
- **Short-Lived Access**: 다운로드는 short-lived signed URL 또는 gated token으로 처리한다.
- **Policy-Aware Upload**: MIME, 크기, 개수, 보존 기간은 관리자 정책을 따른다.

---

## 4. 핵심 엔터티

## 4.1 file_asset

- object storage에 저장된 파일 메타데이터
- 업로드 주체, 크기, MIME, checksum, storage key를 가진다.

## 4.2 attachment

- `chat_message`, `document`, `project`, `comment` 등과 `file_asset`을 연결한다.
- visibility, sort order, attachment role을 표현할 수 있다.

## 4.3 session_artifact와의 관계

- 사용자 업로드 파일은 주로 `file_asset`
- 실행 중 생성된 결과물은 주로 `session_artifact`
- 필요 시 결과물을 사용자 자산으로 승격할 때 `file_asset`로 저장해 재사용할 수 있다.

---

## 5. 지원 파일 유형

MVP에서 우선 지원:

- 채팅 이미지 첨부
- 채팅 일반 파일 첨부
- 문서 참고 파일 첨부
- 프로젝트 결과물 업로드

v1 이후 확장:

- 대용량 ZIP 업로드
- 드래그 앤 드롭 다중 업로드 고도화
- resumable / multipart upload
- 바이러스 검사 파이프라인

---

## 6. 표준 업로드 플로우

```text
1. Client -> upload intent 요청
2. API -> 권한, 용량, MIME 정책 검증
3. API -> file_asset 초안 생성 + signed URL 발급
4. Client -> object storage direct upload
5. Client -> upload complete 호출
6. API -> 업로드 결과 검증 후 file_asset 확정
7. Client -> 문서/프로젝트는 attachment 생성, 채팅 메시지는 `fileIds` 전달 후 서버가 attachment 바인딩
```

---

## 7. Public API 목록

## 7.1 업로드 intent 생성

`POST /api/files/upload-intents`

### 목적

- 업로드 권한 검증
- storage key 예약
- signed URL 발급

### 요청 예시

```json
{
  "workspaceId": "ws_123",
  "projectId": "prj_123",
  "filename": "landing-page.png",
  "mimeType": "image/png",
  "sizeBytes": 428391,
  "purpose": "chat_attachment"
}
```

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "file": {
      "id": "file_123",
      "status": "pending_upload",
      "storageProvider": "vercel_blob",
      "storageKey": "ws_123/chat/2026/03/file_123.png"
    },
    "upload": {
      "method": "PUT",
      "url": "https://blob.example/upload-token",
      "headers": {
        "content-type": "image/png"
      },
      "expiresAt": "2026-03-08T12:10:00Z"
    }
  }
}
```

## 7.2 업로드 완료 확정

`POST /api/files/{fileId}/complete`

### 요청 예시

```json
{
  "etag": "etag_abc123",
  "checksumSha256": "sha256:abcd1234",
  "sizeBytes": 428391
}
```

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "file": {
      "id": "file_123",
      "status": "ready",
      "mimeType": "image/png",
      "sizeBytes": 428391,
      "previewUrl": null
    }
  }
}
```

## 7.3 파일 목록 조회

`GET /api/files?projectId=prj_123`

### 지원 필터 예시

- `projectId`
- `resourceType`
- `resourceId`
- `purpose`
- `mimePrefix=image/`

### 응답 포함 정보

- file list
- attachment summary
- pagination cursor

## 7.4 파일 메타데이터 조회

`GET /api/files/{fileId}`

### 응답 포함 정보

- 파일 식별자
- 파일명
- MIME 타입
- 크기
- 업로더
- 상태
- visibility scope
- 사용 중인 attachment 요약

## 7.5 다운로드 URL 발급

`POST /api/files/{fileId}/download-url`

### 목적

- 권한 검증 후 short-lived download URL 반환

### 응답 예시

```json
{
  "status": "ok",
  "data": {
    "downloadUrl": "https://blob.example/signed-download",
    "expiresAt": "2026-03-08T12:05:00Z"
  }
}
```

## 7.6 첨부 관계 생성

`POST /api/attachments`

### 요청 예시

```json
{
  "fileId": "file_123",
  "resourceType": "document",
  "resourceId": "doc_123",
  "attachmentRole": "reference"
}
```

## 7.7 첨부 제거

`DELETE /api/attachments/{attachmentId}`

### 목적

- 연결 관계만 제거하거나, 정책상 원본 파일도 정리할 수 있다.

---

## 8. 기존 도메인 API와의 연결 방식

## 8.1 Chat Message 생성

`POST /api/chat/threads/{threadId}/messages`

메시지 생성 요청은 `fileIds`를 함께 받을 수 있고, 서버는 메시지 생성 이후 해당 파일들을 `chat_message` attachment로 바인딩한다.

```json
{
  "role": "user",
  "content": "이 이미지를 보고 랜딩페이지 개선안을 정리해줘.",
  "fileIds": ["file_101", "file_102"]
}
```

## 8.2 Document 저장

문서 API는 본문과 별도로 attachment 연결/해제를 지원할 수 있다.

- `POST /api/attachments`
- `DELETE /api/attachments/{attachmentId}`

또는 문서 PATCH에 `attachmentIds` diff를 포함하는 방식도 가능하다.

## 8.3 Project 결과물 저장

프로젝트 수준 결과물은 `resourceType=project` attachment로 연결할 수 있다.

## 8.4 세션 artifact와의 연결

실행 산출물은 먼저 execution API에서 관리한다.

- `POST /api/sessions/{sessionId}/artifacts/{artifactId}/download-url`
- `POST /api/sessions/{sessionId}/artifacts/{artifactId}/save-as-file`
- `POST /api/agent-runs/{agentRunId}/artifacts/{artifactId}/download-url`
- `POST /api/agent-runs/{agentRunId}/artifacts/{artifactId}/save-as-file`

즉, `session_artifact`는 실행 도메인의 산출물이고, 사용자가 장기 보관하거나 문서/채팅/프로젝트 자산으로 재사용하려면 `save-as-file`을 통해 `file_asset` 계층으로 승격하는 구조를 기본으로 한다.

---

## 9. 파일 상태 모델

- `pending_upload`
- `uploaded`
- `ready`
- `scan_pending`
- `blocked`
- `deleted`
- `expired`

MVP에서는 `pending_upload -> ready -> deleted`를 기본 경로로 단순화하고, `uploaded`, `scan_pending`, `blocked`는 v1 또는 선택 보안 기능으로 둬도 된다.

---

## 10. 권한 및 정책 규칙

## 10.1 업로드 권한

- 사용자는 해당 workspace 또는 project에 접근 권한이 있어야 한다.
- 플랜/정책에 따라 최대 파일 수, 최대 크기, 허용 MIME이 달라질 수 있다.

## 10.2 다운로드 권한

- 원본 파일은 public URL로 고정 노출하지 않는다.
- 다운로드는 signed URL 또는 gated API를 통해서만 허용한다.

## 10.3 삭제 권한

- attachment 제거 권한과 file 원본 삭제 권한은 분리 가능해야 한다.
- 세션 artifact를 사용자가 저장한 파일로 승격한 경우 소유권 규칙을 다시 계산해야 한다.

---

## 11. 관리자 정책 반영 포인트

관리자 설정에서 최소한 아래 정책을 제어할 수 있어야 한다.

- `database_data_ops.upload.max_file_size_mb`
- `database_data_ops.upload.allowed_mime_types`
- `database_data_ops.upload.max_files_per_message`
- `database_data_ops.download.signed_url_ttl_seconds`
- `database_data_ops.artifact.retention_days`
- `database_data_ops.export.default_storage_prefix`

`default_storage_prefix`는 environment root prefix 자체가 아니라, 이미 분리된 환경 prefix 아래에서 export를 정리하기 위한 logical sub-prefix로 해석한다.

---

## 12. 내부 처리 원칙

- 업로드 intent 발급 시 `file_asset` 초안 row를 만든다.
- completion 시 object storage의 실제 결과와 요청 메타데이터를 검증한다.
- orphan file 정리 job이 필요하다.
- attachment가 모두 제거된 파일의 실제 삭제는 immediate delete보다 GC job이 안전하다.

---

## 13. MVP 우선 범위

### MVP 포함

- single-shot upload intent
- upload complete
- file metadata 조회
- short-lived download URL
- chat/document attachment 연결

### v1 이후

- multipart upload
- malware scan pipeline
- image thumbnail generation
- lifecycle tiering / cold storage
- project folder semantics

---

## 14. 결론

채팅 이미지와 파일, 문서 첨부, 실행 결과물 저장을 모두 감당하려면 파일 계층은 별도 표준 API로 분리하는 것이 맞다.

따라서 다음 원칙을 확정한다.

- 파일 본문은 object storage direct upload
- 파일 메타데이터는 Postgres 저장
- 도메인 연결은 `attachment`로 표현
- 다운로드는 signed URL 또는 short-lived token 기반

---

## 15. 다음 문서 추천

1. `스토리지 아키텍처 정의서`
2. `실행 인프라 API 정의서`
3. `화면별 API 매핑서`
