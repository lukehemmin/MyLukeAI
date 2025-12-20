# Teams - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/teams

---

  * [Back to NanoGPT](https://nano-gpt.com)
  * [Discord](https://discord.gg/KaQt8gPG6V)
  * [Blog](https://nano-gpt.com/blog)



##### Get Started

  * [Introduction](/introduction)
  * [Quickstart](/quickstart)



##### Endpoint Examples

  * [GETModels](/api-reference/endpoint/models)
  * [GETPersonalized Models](/api-reference/endpoint/personalized-models)
  * [GETModels (Old)](/api-reference/endpoint/models-old)
  * [POSTChat Completion](/api-reference/endpoint/chat-completion)
  * [POSTCompletions](/api-reference/endpoint/completion)
  * [POSTEmbeddings](/api-reference/endpoint/embeddings)
  * [GETEmbedding Models](/api-reference/endpoint/embedding-models)
  * [POSTImage Generation (OpenAI-Compatible)](/api-reference/endpoint/image-generation-openai)
  * [POSTSpeech-to-Text Transcription](/api-reference/endpoint/transcribe)
  * [POSTSpeech-to-Text Status](/api-reference/endpoint/transcribe-status)
  * [POSTYouTube Transcription](/api-reference/endpoint/youtube-transcribe)
  * [POSTContext Memory (Standalone)](/api-reference/endpoint/memory)
  * [POSTWeb Scraping](/api-reference/endpoint/scrape-urls)
  * [POSTWeb Search](/api-reference/endpoint/web-search)
  * [POSTv1/speech (Synchronous TTS)](/api-reference/endpoint/speech)
  * [POSTText-to-Speech](/api-reference/endpoint/tts)
  * [GETTTS Status](/api-reference/endpoint/tts-status)
  * [GETTEE Attestation](/api-reference/endpoint/tee-attestation)
  * [GETTEE Signature](/api-reference/endpoint/tee-signature)
  * [POSTRetrieve Midjourney Generation Status](/api-reference/endpoint/check-midjourney-status)
  * [POSTVideo Generation](/api-reference/endpoint/video-generation)
  * [GETVideo Status](/api-reference/endpoint/video-status)
  * [POSTTalk to GPT (Legacy)](/api-reference/endpoint/talk-to-gpt)
  * [POSTCheck Balance](/api-reference/endpoint/check-balance)
  * [GETSubscription Usage](/api-reference/endpoint/subscription-usage)
  * [POSTReceive Nano](/api-reference/endpoint/receive-nano)
  * [Crypto Deposits](/api-reference/endpoint/crypto-deposits)



##### API Reference

  * [Text Generation](/api-reference/text-generation)
  * [Embeddings](/api-reference/embeddings)
  * [Image Generation](/api-reference/image-generation)
  * [Video Generation](/api-reference/video-generation)
  * [Speech-to-Text (STT)](/api-reference/speech-to-text)
  * [Text-to-Speech (TTS)](/api-reference/text-to-speech)
  * [TEE Verification](/api-reference/tee-verification)
  * [Teams](/api-reference/teams)



##### Miscellaneous

  * [Rate Limits](/api-reference/miscellaneous/rate-limits)
  * [Pricing and Fees](/api-reference/miscellaneous/pricing)
  * [For Providers](/api-reference/miscellaneous/for-providers)
  * [Auto Recharge](/api-reference/miscellaneous/auto-recharge)
  * [Chrome Extension](/api-reference/miscellaneous/chrome-extension)
  * [JavaScript Library](/api-reference/miscellaneous/javascript)
  * [Context Memory](/api-reference/miscellaneous/context-memory)
  * [TypeScript Library](/api-reference/miscellaneous/typescript)



##### Integrations

  * [Cline](/integrations/cline)
  * [Roo Code](/integrations/roocode)
  * [Kilo Code](/integrations/kilocode)
  * [Cursor](/integrations/cursor)
  * [SillyTavern](/integrations/sillytavern)
  * [OpenWebUI](/integrations/openwebui)
  * [TypingMind](/integrations/typingmind)
  * [LibreChat](/integrations/librechat)
  * [OpenHands](/integrations/openhands)
  * [JanitorAI](/integrations/janitorai)
  * [Droid](/integrations/droid)



On this page

  * [Overview](#overview)
  * [Error Response Format](#error-response-format)
  * [Teams](#teams)
  * [List Teams](#list-teams)
  * [Create Team](#create-team)
  * [Get Team Details](#get-team-details)
  * [Update Team](#update-team)
  * [Delete Team](#delete-team)
  * [Members](#members)
  * [List Members](#list-members)
  * [Update Member Role](#update-member-role)
  * [Update Member Usage Limits](#update-member-usage-limits)
  * [Remove Member](#remove-member)
  * [Get Own Preferences](#get-own-preferences)
  * [Update Own Preferences](#update-own-preferences)
  * [Leave Team](#leave-team)
  * [Invitations](#invitations)
  * [List Pending Invitations](#list-pending-invitations)
  * [Send Invitation](#send-invitation)
  * [Revoke Invitation](#revoke-invitation)
  * [Accept Invitation](#accept-invitation)
  * [Lookup Invitation](#lookup-invitation)
  * [Invite Links](#invite-links)
  * [Get Invite Link Status](#get-invite-link-status)
  * [Enable/Disable Invite Link](#enable%2Fdisable-invite-link)
  * [Send Invite Link via Email](#send-invite-link-via-email)
  * [Join via Invite Link](#join-via-invite-link)
  * [Cancel Join Request](#cancel-join-request)
  * [Join Requests](#join-requests)
  * [List Join Requests](#list-join-requests)
  * [Accept/Reject Join Request](#accept%2Freject-join-request)
  * [Delete Join Request](#delete-join-request)
  * [Usage & Billing](#usage-%26-billing)
  * [Get Team Usage](#get-team-usage)
  * [Settings](#settings)
  * [Update Team Settings](#update-team-settings)
  * [Model Access Control](#model-access-control)
  * [Get Allowed Models](#get-allowed-models)
  * [Update Allowed Models](#update-allowed-models)
  * [Ownership](#ownership)
  * [Transfer Ownership](#transfer-ownership)
  * [Role Reference](#role-reference)
  * [Rate Limits](#rate-limits)
  * [Webhooks (Coming Soon)](#webhooks-coming-soon)



API Reference

# Teams

Complete API reference for the NanoGPT Teams feature

## 

[​](#overview)

Overview

The Teams API enables programmatic management of teams, members, invitations, usage tracking, and access control. **Base URL** : `/api/teams` **Authentication** : All endpoints require session authentication unless otherwise noted. **Team Identifiers** : Endpoints accept either UUID (`550e8400-e29b-xxxx-xxxxx-xxxxx`) or numeric ID (`123`).

* * *

## 

[​](#error-response-format)

Error Response Format

All errors return JSON in this format:

Copy
    
    
    {
      "code": "ERROR_CODE",
      "message": "Human-readable description",
      "details": {},
      "status": 400
    }
    

**Common Error Codes** :

Code| Status| Description  
---|---|---  
`UNAUTHORIZED`| 401| Session required  
`FORBIDDEN`| 403| Insufficient permissions  
`NOT_FOUND`| 404| Resource not found  
`CONFLICT`| 409| Resource conflict (duplicate, wrong state)  
`INVALID_INPUT`| 422| Validation failed  
`RATE_LIMITED`| 429| Too many requests  
`INTERNAL_ERROR`| 500| Server error  
  
* * *

## 

[​](#teams)

Teams

### 

[​](#list-teams)

List Teams

Returns all teams the authenticated user belongs to.

Copy
    
    
    GET /api/teams
    

**Response** :

Copy
    
    
    {
      "teams": [
        {
          "uuid": "550e8400-e29b-xxxx-xxxx-xxxxxxxxxxxx",
          "name": "Engineering",
          "status": "active",
          "role": "owner"
        }
      ]
    }
    

* * *

### 

[​](#create-team)

Create Team

Copy
    
    
    POST /api/teams
    

**Request Body** :

Copy
    
    
    {
      "name": "Engineering"
    }
    

Field| Type| Required| Description  
---|---|---|---  
`name`| string| Yes| 2-50 characters. Letters, numbers, spaces, hyphens, underscores.  
  
**Response** :

Copy
    
    
    {
      "team": {
        "uuid": "550e8400-e29b-xxxx-xxxx-xxxxxxxxxxxx",
        "name": "Engineering",
        "status": "active",
        "role": "owner"
      }
    }
    

**Errors** :

  * `409 CONFLICT`: You already have a team with this name



* * *

### 

[​](#get-team-details)

Get Team Details

Copy
    
    
    GET /api/teams/{teamUuid}
    

**Response** :

Copy
    
    
    {
      "team": {
        "uuid": "550e8400-e29b-xxxx-xxxx-xxxxxxxxxxxx",
        "name": "Engineering",
        "status": "active",
        "paused_at": null,
        "suspended_at": null,
        "invite_link_enabled": true,
        "invite_link_token": "abc123...",
        "default_member_usage_limit_usd": 100,
        "usage_limit_usd": null,
        "usage_limit_enforced": true,
        "balances": {
          "usd_balance": 250.00,
          "nano_balance": 1500.00
        },
        "role": "owner"
      }
    }
    

**Notes** :

  * `balances` shows the team owner’s account balance
  * `role` is the requesting user’s role in this team



* * *

### 

[​](#update-team)

Update Team

Copy
    
    
    PATCH /api/teams/{teamUuid}
    

**Required Role** : Owner or Admin **Request Body** :

Copy
    
    
    {
      "name": "New Team Name",
      "status": "paused"
    }
    

Field| Type| Required| Description  
---|---|---|---  
`name`| string| No| 2-50 characters  
`status`| string| No| `active`, `paused`, or `suspended`  
  
**Response** :

Copy
    
    
    {
      "team": {
        "uuid": "550e8400-e29b-xxxx-xxxx-xxxxxxxxxxxx",
        "name": "New Team Name",
        "status": "paused"
      }
    }
    

* * *

### 

[​](#delete-team)

Delete Team

Copy
    
    
    DELETE /api/teams/{teamUuid}
    

**Required Role** : Owner **Request Body** :

Copy
    
    
    {
      "name": "Engineering"
    }
    

Field| Type| Required| Description  
---|---|---|---  
`name`| string| Yes| Must exactly match team name (confirmation)  
  
**Response** :

Copy
    
    
    {
      "ok": true
    }
    

* * *

## 

[​](#members)

Members

### 

[​](#list-members)

List Members

Copy
    
    
    GET /api/teams/{teamUuid}/members
    

**Query Parameters** :

Parameter| Type| Default| Description  
---|---|---|---  
`page`| number| 1| Page number  
`limit`| number| all| Results per page (max 100)  
  
**Response** (with pagination):

Copy
    
    
    {
      "members": [
        {
          "sessionId": 12345,
          "sessionUUID": "abc-123-def",
          "role": "owner",
          "joinedAt": "2024-01-15T10:30:00Z",
          "member_name": "Alice",
          "displayName": "Alice Smith",
          "email": "[[email protected]](/cdn-cgi/l/email-protection)",
          "usage_limit_usd": 150,
          "usage_limit_enforced": true,
          "usage_usd_monthly": 45.50
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 45,
        "totalPages": 3
      }
    }
    

* * *

### 

[​](#update-member-role)

Update Member Role

Copy
    
    
    PATCH /api/teams/{teamUuid}/members
    

**Required Role** : Owner or Admin **Request Body** :

Copy
    
    
    {
      "sessionId": 12345,
      "role": "admin"
    }
    

Field| Type| Required| Description  
---|---|---|---  
`sessionId`| number| Yes| Target member’s session ID  
`role`| string| Yes| `admin` or `member` (cannot set `owner`)  
  
**Response** :

Copy
    
    
    {
      "ok": true
    }
    

**Errors** :

  * `403 FORBIDDEN`: Cannot change the owner’s role
  * `400 INVALID_INPUT`: Cannot change your own role



* * *

### 

[​](#update-member-usage-limits)

Update Member Usage Limits

Copy
    
    
    PATCH /api/teams/{teamUuid}/members
    

**Required Role** : Owner or Admin **Request Body** :

Copy
    
    
    {
      "sessionId": 12345,
      "usage_limit_usd": 200,
      "usage_limit_enforced": true
    }
    

Field| Type| Required| Description  
---|---|---|---  
`sessionId`| number| Yes| Target member’s session ID  
`usage_limit_usd`| number|null| No| Monthly limit in USD, or `null` to use team default  
`usage_limit_enforced`| boolean| No| Hard-enforce the limit (blocks usage when exceeded)  
  
**Response** :

Copy
    
    
    {
      "ok": true
    }
    

* * *

### 

[​](#remove-member)

Remove Member

Copy
    
    
    DELETE /api/teams/{teamUuid}/members
    

**Required Role** : Owner or Admin **Request Body** :

Copy
    
    
    {
      "sessionId": 12345
    }
    

**Response** :

Copy
    
    
    {
      "ok": true
    }
    

**Errors** :

  * `403 FORBIDDEN`: Cannot remove the team owner
  * `400 INVALID_INPUT`: Cannot remove yourself (use `/leave`)



* * *

### 

[​](#get-own-preferences)

Get Own Preferences

Returns the authenticated user’s preferences for this team.

Copy
    
    
    GET /api/teams/{teamUuid}/members/self
    

**Response** :

Copy
    
    
    {
      "bill_to_team": true,
      "name": "Alice",
      "usage_limit_usd": 150,
      "usage_limit_enforced": true,
      "default_member_usage_limit_usd": 100,
      "default_usage_limit_enforced": true,
      "effective_usage_limit_usd": 150,
      "effective_usage_limit_enforced": true
    }
    

**Notes** :

  * `effective_*` fields show the resolved limit (member override or team default)



* * *

### 

[​](#update-own-preferences)

Update Own Preferences

Copy
    
    
    PATCH /api/teams/{teamUuid}/members/self
    

**Request Body** :

Copy
    
    
    {
      "bill_to_team": true,
      "name": "Alice Smith"
    }
    

Field| Type| Required| Description  
---|---|---|---  
`bill_to_team`| boolean| No| Bill usage to team or personal account  
`name`| string| No| Display name (1-100 characters)  
  
**Response** :

Copy
    
    
    {
      "ok": true,
      "preferences": {
        "bill_to_team": true,
        "name": "Alice Smith",
        "usage_limit_usd": 150,
        "usage_limit_enforced": true
      }
    }
    

* * *

### 

[​](#leave-team)

Leave Team

Copy
    
    
    POST /api/teams/{teamUuid}/leave
    

**Response** :

Copy
    
    
    {
      "ok": true
    }
    

**Errors** :

  * `403 FORBIDDEN`: Owner must transfer ownership before leaving



* * *

## 

[​](#invitations)

Invitations

### 

[​](#list-pending-invitations)

List Pending Invitations

Copy
    
    
    GET /api/teams/{teamUuid}/invitations
    

**Required Role** : Owner or Admin **Response** :

Copy
    
    
    {
      "invitations": [
        {
          "id": "inv-uuid-123",
          "email": "[[email protected]](/cdn-cgi/l/email-protection)",
          "role": "member",
          "status": "pending",
          "token": "abc123...",
          "created_at": "2024-01-15T10:30:00Z",
          "expires_at": "2024-01-22T10:30:00Z"
        }
      ]
    }
    

* * *

### 

[​](#send-invitation)

Send Invitation

Copy
    
    
    POST /api/teams/{teamUuid}/invitations
    

**Required Role** : Owner or Admin **Request Body** :

Copy
    
    
    {
      "email": "[[email protected]](/cdn-cgi/l/email-protection)",
      "role": "member"
    }
    

Field| Type| Required| Description  
---|---|---|---  
`email`| string| Yes| Valid email address  
`role`| string| No| `admin` or `member` (default: `member`)  
  
**Response** :

Copy
    
    
    {
      "invitation": {
        "id": "inv-uuid-123",
        "email": "[[email protected]](/cdn-cgi/l/email-protection)",
        "role": "member",
        "status": "pending",
        "token": "abc123..."
      }
    }
    

* * *

### 

[​](#revoke-invitation)

Revoke Invitation

Copy
    
    
    PATCH /api/teams/{teamUuid}/invitations
    

**Required Role** : Owner or Admin **Request Body** :

Copy
    
    
    {
      "action": "revoke",
      "id": "inv-uuid-123"
    }
    

Field| Type| Required| Description  
---|---|---|---  
`action`| string| No| Must be `revoke` (default)  
`id`| string| No*| Invitation UUID  
`token`| string| No*| Invitation token (min 16 chars)  
  
*Provide either `id` or `token` **Response** :

Copy
    
    
    {
      "ok": true
    }
    

* * *

### 

[​](#accept-invitation)

Accept Invitation

Copy
    
    
    POST /api/teams/invitations/accept
    

**Request Body** :

Copy
    
    
    {
      "token": "abc123def456..."
    }
    

Field| Type| Required| Description  
---|---|---|---  
`token`| string| Yes| Invitation token (min 16 characters)  
  
**Response** :

Copy
    
    
    {
      "ok": true
    }
    

**Errors** :

  * `409 CONFLICT`: Invitation is not pending
  * `409 CONFLICT`: Invitation has expired



* * *

### 

[​](#lookup-invitation)

Lookup Invitation

Public endpoint to check invitation details before accepting.

Copy
    
    
    GET /api/teams/invitations/lookup?token=abc123...
    

**Authentication** : Not required **Response** (email invitation):

Copy
    
    
    {
      "type": "invitation",
      "email": "[[email protected]](/cdn-cgi/l/email-protection)",
      "status": "pending",
      "teamName": "Engineering"
    }
    

**Response** (invite link):

Copy
    
    
    {
      "type": "link",
      "teamName": "Engineering",
      "enabled": true
    }
    

* * *

## 

[​](#invite-links)

Invite Links

### 

[​](#get-invite-link-status)

Get Invite Link Status

Copy
    
    
    GET /api/teams/{teamUuid}/invite-link
    

**Required Role** : Owner or Admin **Response** :

Copy
    
    
    {
      "enabled": true,
      "token": "abc123def456..."
    }
    

* * *

### 

[​](#enable/disable-invite-link)

Enable/Disable Invite Link

Copy
    
    
    POST /api/teams/{teamUuid}/invite-link
    

**Required Role** : Owner or Admin **Request Body** :

Copy
    
    
    {
      "action": "enable"
    }
    

Field| Type| Required| Description  
---|---|---|---  
`action`| string| No| `enable` (default) or `disable`  
  
**Response** :

Copy
    
    
    {
      "enabled": true,
      "token": "abc123def456..."
    }
    

* * *

### 

[​](#send-invite-link-via-email)

Send Invite Link via Email

Copy
    
    
    POST /api/teams/{teamUuid}/invite-link/email
    

**Required Role** : Owner or Admin **Rate Limit** : 5 emails per minute **Request Body** :

Copy
    
    
    {
      "emails": ["[[email protected]](/cdn-cgi/l/email-protection)", "[[email protected]](/cdn-cgi/l/email-protection)"]
    }
    

Field| Type| Required| Description  
---|---|---|---  
`emails`| string[]| Yes| 1-10 valid email addresses  
  
**Response** :

Copy
    
    
    {
      "ok": true
    }
    

**Errors** :

  * `403 FORBIDDEN`: Invite link is disabled
  * `429 RATE_LIMITED`: Too many emails



* * *

### 

[​](#join-via-invite-link)

Join via Invite Link

Copy
    
    
    POST /api/teams/join
    

**Request Body** :

Copy
    
    
    {
      "token": "abc123def456..."
    }
    

**Response** :

Copy
    
    
    {
      "ok": true
    }
    

Or if already a member:

Copy
    
    
    {
      "ok": true,
      "alreadyMember": true
    }
    

* * *

### 

[​](#cancel-join-request)

Cancel Join Request

Copy
    
    
    DELETE /api/teams/join
    

**Request Body** :

Copy
    
    
    {
      "token": "abc123def456..."
    }
    

**Response** :

Copy
    
    
    {
      "ok": true
    }
    

* * *

## 

[​](#join-requests)

Join Requests

### 

[​](#list-join-requests)

List Join Requests

Copy
    
    
    GET /api/teams/{teamUuid}/join-requests
    

**Required Role** : Owner or Admin **Response** :

Copy
    
    
    {
      "requests": [
        {
          "id": "req-uuid-123",
          "user_id": 12345,
          "status": "pending",
          "created_at": "2024-01-15T10:30:00Z",
          "name": "Charlie",
          "email": "[[email protected]](/cdn-cgi/l/email-protection)"
        }
      ]
    }
    

* * *

### 

[​](#accept/reject-join-request)

Accept/Reject Join Request

Copy
    
    
    PATCH /api/teams/{teamUuid}/join-requests
    

**Required Role** : Owner or Admin **Request Body** :

Copy
    
    
    {
      "action": "accept",
      "id": "req-uuid-123"
    }
    

Field| Type| Required| Description  
---|---|---|---  
`action`| string| No| `accept` (default) or `reject`  
`id`| string| Yes| Join request UUID  
  
**Response** :

Copy
    
    
    {
      "ok": true
    }
    

* * *

### 

[​](#delete-join-request)

Delete Join Request

Delete a processed (non-pending) join request.

Copy
    
    
    DELETE /api/teams/{teamUuid}/join-requests
    

**Required Role** : Owner or Admin **Request Body** :

Copy
    
    
    {
      "id": "req-uuid-123"
    }
    

**Response** :

Copy
    
    
    {
      "ok": true
    }
    

**Errors** :

  * `409 CONFLICT`: Cannot delete a pending request (must accept/reject first)



* * *

## 

[​](#usage-&-billing)

Usage & Billing

### 

[​](#get-team-usage)

Get Team Usage

Copy
    
    
    GET /api/teams/{teamUuid}/usage
    

**Query Parameters** :

Parameter| Type| Default| Description  
---|---|---|---  
`from`| string| -| Start date (ISO format)  
`to`| string| -| End date (ISO format)  
  
**Response** :

Copy
    
    
    {
      "byActor": [
        {
          "actorSessionId": 12345,
          "displayName": "Alice Smith",
          "totalAmount": 45.50,
          "currency": "USD"
        },
        {
          "actorSessionId": 12346,
          "displayName": "Bob Jones",
          "totalAmount": 32.25,
          "currency": "USD"
        }
      ],
      "totals": [
        {
          "totalAmount": 77.75,
          "currency": "USD"
        }
      ]
    }
    

* * *

## 

[​](#settings)

Settings

### 

[​](#update-team-settings)

Update Team Settings

Copy
    
    
    PATCH /api/teams/{teamUuid}/settings
    

**Required Role** : Owner or Admin **Request Body** :

Copy
    
    
    {
      "default_member_usage_limit_usd": 100,
      "usage_limit_enforced": true
    }
    

Field| Type| Required| Description  
---|---|---|---  
`default_member_usage_limit_usd`| number|null| No| Default monthly limit for members  
`team_usage_limit_usd`| number|null| No| Team-wide spending limit  
`usage_limit_enforced`| boolean| No| Hard-enforce limits  
  
**Response** :

Copy
    
    
    {
      "ok": true
    }
    

* * *

## 

[​](#model-access-control)

Model Access Control

### 

[​](#get-allowed-models)

Get Allowed Models

Copy
    
    
    GET /api/teams/{teamUuid}/allowed-models
    

**Response** :

Copy
    
    
    {
      "allowed_models": {
        "claude-sonnet-4-5": true,
        "gpt-5-1": true,
        "claude-opus-4-5": false
      },
      "all_allowed": false
    }
    

Or if all models are allowed:

Copy
    
    
    {
      "allowed_models": null,
      "all_allowed": true
    }
    

* * *

### 

[​](#update-allowed-models)

Update Allowed Models

Copy
    
    
    PATCH /api/teams/{teamUuid}/allowed-models
    

**Required Role** : Owner or Admin **Request Body** :

Copy
    
    
    {
      "allowed_models": {
        "claude-sonnet-4-5": true,
        "gpt-5-1": true,
        "claude-opus-4-5": false
      }
    }
    

To allow all models:

Copy
    
    
    {
      "allowed_models": null
    }
    

Field| Type| Required| Description  
---|---|---|---  
`allowed_models`| object|null| Yes| Map of model keys to boolean, or `null` for all  
  
**Response** :

Copy
    
    
    {
      "ok": true,
      "allowed_models": {
        "claude-sonnet-4-5": true,
        "gpt-5-1": true,
        "claude-opus-4-5": false
      },
      "all_allowed": false
    }
    

**Notes** :

  * Models not listed in the map are allowed by default
  * Set a model to `false` to explicitly restrict it
  * Set `allowed_models` to `null` to allow all models



* * *

## 

[​](#ownership)

Ownership

### 

[​](#transfer-ownership)

Transfer Ownership

Copy
    
    
    POST /api/teams/{teamUuid}/owner
    

**Required Role** : Owner **Request Body** :

Copy
    
    
    {
      "sessionId": 12345
    }
    

Field| Type| Required| Description  
---|---|---|---  
`sessionId`| number| Yes| New owner’s session ID  
  
**Response** :

Copy
    
    
    {
      "ok": true
    }
    

**Side Effects** :

  * Current owner becomes admin
  * Target member becomes owner

**Errors** :

  * `409 CONFLICT`: Target is already the owner
  * `400 INVALID_INPUT`: Cannot transfer ownership to yourself



* * *

## 

[​](#role-reference)

Role Reference

Role| Create Team| View Team| Manage Members| Manage Settings| Delete Team  
---|---|---|---|---|---  
Owner| -| Yes| Yes| Yes| Yes  
Admin| -| Yes| Yes| Yes| No  
Member| -| Yes| No| No| No  
  
* * *

## 

[​](#rate-limits)

Rate Limits

Endpoint| Limit  
---|---  
`POST /api/teams/{teamUuid}/invite-link/email`| 5 emails per minute  
  
* * *

## 

[​](#webhooks-coming-soon)

Webhooks (Coming Soon)

Future webhook events:

  * `team.member.joined`
  * `team.member.removed`
  * `team.usage.limit_reached`
  * `team.status.changed`



[TEE Verification](/api-reference/tee-verification)[Rate Limits](/api-reference/miscellaneous/rate-limits)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
