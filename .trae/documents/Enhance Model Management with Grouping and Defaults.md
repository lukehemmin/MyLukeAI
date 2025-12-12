# Model Management Improvements

I understand your request. You want to:
1.  **Default Visibility**: When a model is synced/registered, its `isPublic` status should default to `false`.
2.  **Grouping by API Key Name**: In the Model Management UI (`/admin/models`), models should be grouped by their associated API Key Name (which acts as a "Group").

## Implementation Plan

### 1. Update Default Visibility
-   **File**: `src/lib/actions/admin-models.ts`
-   **Action**: Modify the `syncModels` function.
-   **Change**: Set `isPublic: false` (instead of `true`) when creating a new model record during sync.

### 2. Group Models by API Key Name in Admin UI
-   **File**: `src/components/admin/AdminModelsClient.tsx`
-   **Action**: Refactor the rendering logic to group models.
-   **Logic**:
    -   The `models` data already contains `apiKeyId` (we need to ensure it also brings the `apiKey.name`).
    -   I will group the `filteredModels` by `apiKeyId` (or `apiKey.name`).
    -   If a model has no API key (e.g. legacy or static), put it in a "Default" or "No Group" section.
    -   Render a section header for each group (API Key Name) and list the models belonging to that key under it.

### 3. Data Fetching Update
-   **File**: `src/app/admin/models/page.tsx` (or wherever `initialModels` comes from)
-   **Action**: Ensure the Prisma query includes the `apiKey` relation so we have the key name available in the client component.
    -   `include: { apiKey: { select: { name: true } } }`

## Step-by-Step Execution
1.  **Backend**: Update `syncModels` default value.
2.  **Data**: Update the data fetching in `src/app/admin/models/page.tsx` to include API key names.
3.  **Frontend**: Update `AdminModelsClient.tsx` to implement grouping logic and UI.
