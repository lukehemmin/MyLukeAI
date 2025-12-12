# Sync OpenAI Models Fix

The issue is that the `syncModels` function is trying to use the encrypted API key data directly without decrypting it first. The error "OPENAI_API_KEY environment variable is missing or empty" occurs because the code extracts `undefined` from the encrypted JSON object and passes it to the OpenAI client.

## Technical Implementation

### 1. Update `src/lib/actions/admin-models.ts`
I will modify the `syncModels` function to correctly decrypt the API key before using it.

**Steps:**
1.  Import decryption utilities:
    ```typescript
    import { decryptApiKey, deserializeEncryptedData } from '@/lib/crypto'
    ```
2.  Update the OpenAI provider logic:
    - Replace the incorrect `JSON.parse` and property access.
    - Use `deserializeEncryptedData` to parse the stored JSON.
    - Use `decryptApiKey` to retrieve the actual plain text API key.
    - Initialize the `OpenAI` client with the decrypted key.

### Verification
1.  After applying the fix, I will verify the changes by creating a test script or asking you to retry the "Sync Models" button in the admin interface.
2.  I will also verify that the error "Failed to sync OpenAI models" is resolved.
