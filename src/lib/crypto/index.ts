import crypto from 'crypto'

function getMasterKey(): Buffer {
  const key = process.env.API_KEY_ENCRYPTION_KEY
  if (!key) {
    throw new Error('API_KEY_ENCRYPTION_KEY 환경 변수가 필요합니다.')
  }
  const master = Buffer.from(key, 'base64')
  if (master.length !== 32) {
    throw new Error('API_KEY_ENCRYPTION_KEY는 32바이트 길이여야 합니다.')
  }
  return master
}

export interface EncryptedData {
  encrypted: string
  iv: string
  authTag: string
}

export function encryptApiKey(plainText: string): EncryptedData {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', getMasterKey(), iv)
  let encrypted = cipher.update(plainText, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  const authTag = cipher.getAuthTag()
  return {
    encrypted,
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  }
}

export function decryptApiKey(encryptedData: EncryptedData): string {
  try {
    const iv = Buffer.from(encryptedData.iv, 'base64')
    const authTag = Buffer.from(encryptedData.authTag, 'base64')
    const decipher = crypto.createDecipheriv('aes-256-gcm', getMasterKey(), iv)
    decipher.setAuthTag(authTag)
    let decrypted = decipher.update(encryptedData.encrypted, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (error) {
    throw new Error('API 키 복호화 실패: ' + (error as Error).message)
  }
}

export function hashApiKey(plainText: string): string {
  return crypto.createHash('sha256').update(plainText).digest('hex')
}

export function serializeEncryptedData(encryptedData: EncryptedData): string {
  return JSON.stringify(encryptedData)
}

export function deserializeEncryptedData(serialized: string): EncryptedData {
  try {
    const parsed = JSON.parse(serialized)
    if (!parsed.encrypted || !parsed.iv || !parsed.authTag) {
      throw new Error('잘못된 암호화 데이터 형식입니다.')
    }
    return parsed as EncryptedData
  } catch (error) {
    throw new Error('암호화 데이터 역직렬화 실패: ' + (error as Error).message)
  }
}
