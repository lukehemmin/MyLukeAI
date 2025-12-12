I will fix the issue where "Total Users" is displayed as 0 in the admin dashboard by creating the missing API endpoint that fetches the system statistics.

I have identified that the frontend component `AdminDashboard` attempts to fetch data from `/api/admin/dashboard/stats`, but this API route does not exist. I will create this route and implement the logic to count users, conversations, messages, and API keys from the database.

I will also create the `/api/admin/keys/status` endpoint, which is also missing and required by the dashboard to display API key status.

### Plan:

1.  **Create API Route for System Stats**:
    *   Create file: `src/app/api/admin/dashboard/stats/route.ts`
    *   Implement `GET` handler protected by `withAdmin` middleware.
    *   Use `prisma` to count:
        *   `User` (Total Users)
        *   `Conversation` (Total Conversations)
        *   `Message` (Total Messages)
        *   `ApiKey` (Total and Active API Keys)
    *   Return the data in the format expected by the frontend (`SystemStats` interface).

2.  **Create API Route for API Key Status**:
    *   Create file: `src/app/api/admin/keys/status/route.ts`
    *   Implement `GET` handler protected by `withAdmin` middleware.
    *   Use `prisma` to group `ApiKey` by `provider` and count them.
    *   Return the status for each provider (OpenAI, Anthropic, Gemini, OpenRouter).

3.  **Verify**:
    *   Since I cannot browse the UI, I will rely on the code implementation being correct.
    *   I will ensure the file paths and import paths are correct.
