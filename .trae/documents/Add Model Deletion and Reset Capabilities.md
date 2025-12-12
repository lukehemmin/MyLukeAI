# Implement Model Deletion and Reset Features

I understand your request. You want to add functionality to:
1.  **Delete individual models**: Remove a specific model from the database.
2.  **Reset all models**: Delete all models from the database (so you can re-sync from scratch).
3.  **UI Updates**: Add buttons for these actions in the Model Management page (`/admin/models`).

## Implementation Plan

### 1. Server Actions (`src/lib/actions/admin-models.ts`)
I will implement two new server actions:
-   `deleteModel(id: string)`: Deletes a single model by its ID.
-   `resetAllModels()`: Deletes all records from the `Model` table.

### 2. UI Updates (`src/components/admin/AdminModelsClient.tsx`)
I will update the client component to include:
-   **Delete Button**: A trash icon button for each model row (in the "Actions" column).
-   **Reset Button**: A "Reset All Models" (or "Delete All") button, likely next to the "Sync Models" button at the top.
-   **Confirmation**: Add simple `confirm()` dialogs before executing these destructive actions to prevent accidental deletions.

## Step-by-Step Execution
1.  **Backend**: Add `deleteModel` and `resetAllModels` functions to `src/lib/actions/admin-models.ts`.
2.  **Frontend**: Update `src/components/admin/AdminModelsClient.tsx` to add the buttons and connect them to the server actions.
3.  **Verification**: Verify the changes (I will use type checking as a proxy for verification since I cannot interact with the UI directly).
