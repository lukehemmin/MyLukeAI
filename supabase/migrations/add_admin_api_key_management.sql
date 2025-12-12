-- AddAdminApiKeyManagement
-- 마이그레이션: 관리자 API 키 관리 시스템 추가

-- 1. User 테이블에 role 컬럼 추가
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';

-- 2. User 테이블 인덱스 추가
CREATE INDEX "User_role_idx" ON "User"("role");

-- 3. ApiKey 테이블 생성
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- 4. ApiKey 테이블 인덱스 추가
CREATE UNIQUE INDEX "ApiKey_keyHash_key" ON "ApiKey"("keyHash");
CREATE INDEX "ApiKey_provider_idx" ON "ApiKey"("provider");
CREATE INDEX "ApiKey_isActive_idx" ON "ApiKey"("isActive");
CREATE INDEX "ApiKey_createdBy_idx" ON "ApiKey"("createdBy");
CREATE INDEX "ApiKey_expiresAt_idx" ON "ApiKey"("expiresAt");

-- 5. ApiKeyUsage 테이블 생성
CREATE TABLE "ApiKeyUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "apiKeyId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "model" TEXT,
    "tokens" INTEGER,
    "cost" DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "responseTime" INTEGER,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. ApiKeyUsage 테이블 인덱스 추가
CREATE INDEX "ApiKeyUsage_apiKeyId_idx" ON "ApiKeyUsage"("apiKeyId");
CREATE INDEX "ApiKeyUsage_createdAt_idx" ON "ApiKeyUsage"("createdAt");
CREATE INDEX "ApiKeyUsage_status_idx" ON "ApiKeyUsage"("status");

-- 7. AdminAuditLog 테이블 생성
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. AdminAuditLog 테이블 인덱스 추가
CREATE INDEX "AdminAuditLog_userId_idx" ON "AdminAuditLog"("userId");
CREATE INDEX "AdminAuditLog_action_idx" ON "AdminAuditLog"("action");
CREATE INDEX "AdminAuditLog_resource_idx" ON "AdminAuditLog"("resource");
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");

-- 9. 외래 키 제약 조건 추가
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ApiKeyUsage" ADD CONSTRAINT "ApiKeyUsage_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdminAuditLog" ADD CONSTRAINT "AdminAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 10. 권한 설정 (Supabase용)
-- anon 역할에 대한 읽기 권한
GRANT SELECT ON "ApiKey" TO anon;
GRANT SELECT ON "ApiKeyUsage" TO anon;
GRANT SELECT ON "AdminAuditLog" TO anon;

-- authenticated 역할에 대한 전체 권한
GRANT ALL ON "ApiKey" TO authenticated;
GRANT ALL ON "ApiKeyUsage" TO authenticated;
GRANT ALL ON "AdminAuditLog" TO authenticated;

-- 시퀀스 권한
GRANT USAGE ON SEQUENCE "ApiKey_id_seq" TO authenticated;
GRANT USAGE ON SEQUENCE "ApiKeyUsage_id_seq" TO authenticated;
GRANT USAGE ON SEQUENCE "AdminAuditLog_id_seq" TO authenticated;