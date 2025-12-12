# Separate Models by API Key and Enable Dynamic Selection

To solve the issue of model ID collisions between different API keys and to distinguish them in the UI, I will implement the following changes:

## 1. Database Schema Update
- Modify `Model` table in `prisma/schema.prisma`:
  - Add `apiKeyId` field (nullable, linked to `ApiKey`).
  - Update unique constraint to `[provider, apiModelId, apiKeyId]`.
  - This allows multiple "gpt-4o" entries if they come from different API keys.

## 2. Update Sync Logic
- Modify `src/lib/actions/admin-models.ts`:
  - When syncing, save the `apiKeyId`.
  - Set the default model name to `"{Model ID} ({Key Name})"` (e.g., "gpt-4o (My Work Key)") to easily distinguish them in the UI.

## 3. Dynamic Model Fetching
- Create `src/lib/data/models.ts` to fetch enabled models from the database.
- Update the Frontend (`HomePage`, `ChatArea`, `ModelSelector`) to use this dynamic list instead of the hardcoded `AVAILABLE_MODELS` constant.

## 4. Update Chat API
- Modify `src/app/api/chat/route.ts` to:
  - Look up the model configuration from the database using the provided `model` ID.
  - If the model is linked to a specific `apiKeyId`, use that specific API key for the request.
  - Fix the `ChatStore` to correctly send the selected `model` ID to the API.

This ensures that if you have two keys providing "gpt-4o", you will see two distinct options in the dropdown, and the chat will use the correct key for each.
