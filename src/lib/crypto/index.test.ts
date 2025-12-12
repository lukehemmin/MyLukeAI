import { describe, it, expect, beforeAll } from 'vitest'
import { encryptApiKey, decryptApiKey, hashApiKey, serializeEncryptedData, deserializeEncryptedData } from './index'

// 테스트용 환경 변수 설정
beforeAll(() => {
  // 32바이트 Base64 인코딩된 키
  process.env.API_KEY_ENCRYPTION_KEY = 'dGVzdEVuY3J5cHRpb25LZXlGb3JUZXN0aW5nMTIzNDU2Nzg='
})

describe('Crypto Utils', () => {
  const testApiKey = 'sk-test123456789abcdef'

  describe('encryptApiKey and decryptApiKey', () => {
    it('should encrypt and decrypt API key correctly', () => {
      // 암호화
      const encryptedData = encryptApiKey(testApiKey)
      
      // 암호화된 데이터 구조 확인
      expect(encryptedData).toHaveProperty('encrypted')
      expect(encryptedData).toHaveProperty('iv')
      expect(encryptedData).toHaveProperty('authTag')
      expect(typeof encryptedData.encrypted).toBe('string')
      expect(typeof encryptedData.iv).toBe('string')
      expect(typeof encryptedData.authTag).toBe('string')
      
      // 암호화된 데이터가 원본과 다름
      expect(encryptedData.encrypted).not.toBe(testApiKey)
      
      // 복호화
      const decryptedKey = decryptApiKey(encryptedData)
      expect(decryptedKey).toBe(testApiKey)
    })

    it('should produce different encrypted results for the same input', () => {
      // 같은 입력에 대해 다른 암호화 결과 생성 (IV 때문)
      const encrypted1 = encryptApiKey(testApiKey)
      const encrypted2 = encryptApiKey(testApiKey)
      
      expect(encrypted1.encrypted).not.toBe(encrypted2.encrypted)
      expect(encrypted1.iv).not.toBe(encrypted2.iv)
      expect(encrypted1.authTag).not.toBe(encrypted2.authTag)
    })

    it('should throw error for invalid encrypted data', () => {
      const invalidData = {
        encrypted: 'invalid',
        iv: 'invalid',
        authTag: 'invalid'
      }
      
      expect(() => decryptApiKey(invalidData)).toThrow('API 키 복호화 실패')
    })
  })

  describe('hashApiKey', () => {
    it('should generate consistent hash for the same input', () => {
      const hash1 = hashApiKey(testApiKey)
      const hash2 = hashApiKey(testApiKey)
      
      expect(hash1).toBe(hash2)
      expect(typeof hash1).toBe('string')
      expect(hash1).toHaveLength(64) // SHA-256 hex length
    })

    it('should generate different hash for different inputs', () => {
      const hash1 = hashApiKey(testApiKey)
      const hash2 = hashApiKey('different-key')
      
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('serializeEncryptedData and deserializeEncryptedData', () => {
    it('should serialize and deserialize encrypted data correctly', () => {
      const encryptedData = encryptApiKey(testApiKey)
      const serialized = serializeEncryptedData(encryptedData)
      const deserialized = deserializeEncryptedData(serialized)
      
      expect(deserialized).toEqual(encryptedData)
      expect(typeof serialized).toBe('string')
    })

    it('should throw error for invalid serialized data', () => {
      expect(() => deserializeEncryptedData('invalid-json')).toThrow('암호화 데이터 역직렬화 실패')
    })

    it('should throw error for incomplete encrypted data', () => {
      const incompleteData = JSON.stringify({
        encrypted: 'data',
        iv: 'iv'
        // authTag missing
      })
      
      expect(() => deserializeEncryptedData(incompleteData)).toThrow('잘못된 암호화 데이터 형식입니다.')
    })
  })

  describe('end-to-end encryption flow', () => {
    it('should handle complete encryption and decryption flow', () => {
      // 1. API 키 암호화
      const encryptedData = encryptApiKey(testApiKey)
      
      // 2. 암호화된 데이터 직렬화 (DB 저장용)
      const serializedData = serializeEncryptedData(encryptedData)
      
      // 3. 직렬화된 데이터 역직렬화 (DB 로드)
      const deserializedData = deserializeEncryptedData(serializedData)
      
      // 4. 복호화
      const decryptedKey = decryptApiKey(deserializedData)
      
      expect(decryptedKey).toBe(testApiKey)
    })
  })
})