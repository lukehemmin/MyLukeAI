# Models - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/models

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
  * [Compatibility](#compatibility)
  * [Features](#features)
  * [Query Parameters](#query-parameters)
  * [Authentication](#authentication)
  * [Response Formats](#response-formats)
  * [Basic Response (Default)](#basic-response-default)
  * [Detailed Response](#detailed-response)
  * [Field Descriptions](#field-descriptions)
  * [Basic Fields (Always Present)](#basic-fields-always-present)
  * [Enhanced Fields (Detailed Mode Only)](#enhanced-fields-detailed-mode-only)
  * [Pricing Object Structure](#pricing-object-structure)
  * [Usage Examples](#usage-examples)
  * [Basic Request](#basic-request)
  * [Detailed Request](#detailed-request)
  * [Detailed with Authentication](#detailed-with-authentication)
  * [Alternative API Key Header](#alternative-api-key-header)
  * [Endpoint Variants](#endpoint-variants)
  * [1) GET /api/v1/models (canonical)](#1-get-%2Fapi%2Fv1%2Fmodels-canonical)
  * [2) GET /api/subscription/v1/models (subscription-only)](#2-get-%2Fapi%2Fsubscription%2Fv1%2Fmodels-subscription-only)
  * [3) GET /api/paid/v1/models (paid/extras)](#3-get-%2Fapi%2Fpaid%2Fv1%2Fmodels-paid%2Fextras)
  * [Choosing the Right Endpoint](#choosing-the-right-endpoint)
  * [Errors and Limits](#errors-and-limits)
  * [Backwards Compatibility](#backwards-compatibility)
  * [Related Endpoints](#related-endpoints)
  * [Notes](#notes)



Endpoint Examples

# Models

## 

[​](#overview)

Overview

The `/api/v1/models` endpoint provides a list of available text generation models. It supports optional detailed information including pricing data. The endpoint maintains full backwards compatibility while adding powerful new features. For embedding models, use the dedicated [/api/v1/embedding-models](/api-reference/endpoint/embedding-models) endpoint which provides comprehensive information about all available embedding models.

## 

[​](#compatibility)

Compatibility

Responses mirror OpenAI’s Models API shape. All models endpoints return:

Copy
    
    
    {
      "object": "list",
      "data": [ { /* model */ }, ... ]
    }
    

Each model minimally includes:

Copy
    
    
    {
      "id": "deepseek/deepseek-chat-v3-0324",
      "object": "model",
      "created": 1736966400,
      "owned_by": "deepseek"
    }
    

## 

[​](#features)

Features

  * **Basic Mode** : Standard OpenAI-compatible model listing
  * **Detailed Mode** : Enhanced information with pricing and model descriptions



## 

[​](#query-parameters)

Query Parameters

Parameter| Type| Default| Description  
---|---|---|---  
`detailed`| boolean| `false`| Returns detailed model information including pricing and capabilities  
  
When `detailed=true`, additional human-friendly fields may be included per model:

  * `name` — display name
  * `description` — short model description
  * `context_length` — max input tokens (if known)
  * `capabilities.vision` — whether the model supports native image input
  * `pricing.prompt` and `pricing.completion` — at-cost per-million-token pricing in USD
  * `pricing.unit` — `per_million_tokens`
  * `icon_url` — small icon representing the provider
  * `cost_estimate` — internal rollup used in UI for cost hints



## 

[​](#authentication)

Authentication

Authentication is optional but enables user-specific pricing in detailed mode:

Header| Format| Required| Description  
---|---|---|---  
`Authorization`| `Bearer {api_key}`| Optional| API key for user-specific pricing  
`x-api-key`| `{api_key}`| Optional| Alternative API key header  
  
Notes:

  * Invalid or missing API keys still return a list of models. We simply omit user-specific pricing considerations in `detailed=true` mode.
  * With a valid key, the canonical `/api/v1/models` may apply your account’s subscription visibility preference (see Endpoint Variants).



## 

[​](#response-formats)

Response Formats

### 

[​](#basic-response-default)

Basic Response (Default)

Standard OpenAI-compatible format without pricing information:

Copy
    
    
    {
      "object": "list",
      "data": [
        {
          "id": "gpt-4o-mini",
          "object": "model",
          "created": 1704067200,
          "owned_by": "openai"
        },
        {
          "id": "claude-3-5-sonnet-20241022",
          "object": "model", 
          "created": 1704067200,
          "owned_by": "anthropic"
        }
      ]
    }
    

### 

[​](#detailed-response)

Detailed Response

Enhanced format with model descriptions, context lengths, and pricing:

Copy
    
    
    {
      "object": "list",
      "data": [
        {
          "id": "gpt-4o-mini",
          "object": "model",
          "created": 1704067200,
          "owned_by": "openai",
          "name": "GPT-4o Mini",
          "description": "OpenAI's affordable and intelligent small model for fast, lightweight tasks",
          "context_length": 128000,
          "capabilities": { "vision": true },
          "pricing": {
            "prompt": 0.00015,
            "completion": 0.0006,
            "currency": "USD",
            "unit": "per_million_tokens"
          },
          "icon_url": "/icons/OpenAI.svg",
          "cost_estimate": { "cheap": true }
        },
        {
          "id": "claude-3-5-sonnet-20241022",
          "object": "model",
          "created": 1704067200,
          "owned_by": "anthropic",
          "name": "Claude 3.5 Sonnet",
          "description": "Anthropic's most intelligent model, combining top-tier performance with improved speed",
          "context_length": 200000,
          "capabilities": { "vision": false },
          "pricing": {
            "prompt": 0.003,
            "completion": 0.015,
            "currency": "USD", 
            "unit": "per_million_tokens"
          },
          "icon_url": "/icons/Anthropic.svg"
        }
      ]
    }
    

## 

[​](#field-descriptions)

Field Descriptions

### 

[​](#basic-fields-always-present)

Basic Fields (Always Present)

Field| Type| Description  
---|---|---  
`id`| string| Unique model identifier  
`object`| string| Always “model” for OpenAI compatibility  
`created`| number| Unix timestamp of response creation  
`owned_by`| string| Model provider (openai, anthropic, meta, google, etc.)  
  
### 

[​](#enhanced-fields-detailed-mode-only)

Enhanced Fields (Detailed Mode Only)

Field| Type| Description  
---|---|---  
`name`| string| Human-readable model name  
`description`| string| Detailed model description  
`context_length`| number| Maximum input tokens (null if not available)  
`capabilities`| object| Feature flags (e.g., `vision: boolean`)  
`pricing`| object| Pricing information object  
`icon_url`| string| Path/URL for a small provider icon  
`cost_estimate`| object| Internal hints (e.g., `{ cheap: true }`)  
  
### 

[​](#pricing-object-structure)

Pricing Object Structure

Field| Type| Description  
---|---|---  
`prompt`| number| Cost per million input tokens in USD  
`completion`| number| Cost per million output tokens in USD  
`currency`| string| Always “USD”  
`unit`| string| Always “per_million_tokens”  
  
## 

[​](#usage-examples)

Usage Examples

### 

[​](#basic-request)

Basic Request

Copy
    
    
    curl "https://nano-gpt.com/api/v1/models"
    

### 

[​](#detailed-request)

Detailed Request

Copy
    
    
    curl "https://nano-gpt.com/api/v1/models?detailed=true"
    

### 

[​](#detailed-with-authentication)

Detailed with Authentication

Copy
    
    
    curl "https://nano-gpt.com/api/v1/models?detailed=true" \
      -H "Authorization: Bearer your_api_key_here"
    

### 

[​](#alternative-api-key-header)

Alternative API Key Header

Copy
    
    
    curl "https://nano-gpt.com/api/v1/models?detailed=true" \
      -H "x-api-key: your_api_key_here"
    

## 

[​](#endpoint-variants)

Endpoint Variants

In addition to the canonical `/api/v1/models`, two filtered variants are available:

### 

[​](#1-get-/api/v1/models-canonical)

1) GET /api/v1/models (canonical)

  * Returns all visible text models (excludes internal free/helper selector models except `auto-model*`).
  * If your account has an active subscription and you have not enabled “Also show paid models”, the list is automatically restricted to only subscription-included models.
  * If you enable “Also show paid models” in settings, it returns the full set again.

Examples:

Copy
    
    
    curl -H "Authorization: Bearer $NANOGPT_API_KEY" \
      https://nano-gpt.com/api/v1/models
    

Copy
    
    
    curl -H "Authorization: Bearer $NANOGPT_API_KEY" \
      "https://nano-gpt.com/api/v1/models?detailed=true"
    

### 

[​](#2-get-/api/subscription/v1/models-subscription-only)

2) GET /api/subscription/v1/models (subscription-only)

  * Always returns only models included in the NanoGPT subscription (equivalent to our `isTextEligible(modelId)` filter).
  * Ignores the user’s “Also show paid models” preference; it is always subscription-only.
  * Supports `?detailed=true` and API key–aware, at-cost pricing metadata.

Examples:

Copy
    
    
    curl https://nano-gpt.com/api/subscription/v1/models
    

Copy
    
    
    curl -H "x-api-key: $NANOGPT_API_KEY" \
      "https://nano-gpt.com/api/subscription/v1/models?detailed=true"
    

### 

[​](#3-get-/api/paid/v1/models-paid/extras)

3) GET /api/paid/v1/models (paid/extras)

  * Returns only models that are NOT part of the subscription (paid/premium/extras).
  * Supports `?detailed=true` and API key–aware, at-cost pricing metadata.

Examples:

Copy
    
    
    curl https://nano-gpt.com/api/paid/v1/models
    

Copy
    
    
    curl -H "Authorization: Bearer $NANOGPT_API_KEY" \
      "https://nano-gpt.com/api/paid/v1/models?detailed=true"
    

### 

[​](#choosing-the-right-endpoint)

Choosing the Right Endpoint

  * Use `/api/subscription/v1/models` for curated lists guaranteed to be subscription-included (e.g., sub-only integrations).
  * Use `/api/paid/v1/models` to focus on paid or premium models.
  * Use `/api/v1/models` for the canonical list and let the account’s “Also show paid models” preference decide visibility.



## 

[​](#errors-and-limits)

Errors and Limits

  * These endpoints typically return `200` with a list. If an invalid API key is provided, the list still returns and simply omits user-specific pricing considerations in `detailed=true` mode.
  * Standard CORS and rate limiting apply. In overload scenarios you may receive `429` with:



Copy
    
    
    { "code": "rate_limited", "message": "Rate limit exceeded" }
    

## 

[​](#backwards-compatibility)

Backwards Compatibility

  * Default response format unchanged
  * All existing fields preserved
  * New fields are additive only
  * No breaking changes to existing integrations



## 

[​](#related-endpoints)

Related Endpoints

  * [/api/v1/embedding-models](/api-reference/endpoint/embedding-models) \- List all available embedding models with detailed information
  * [/api/v1/embeddings](/api-reference/endpoint/embeddings) \- Create embeddings using the available models
  * `/api/subscription/v1/models` \- Subscription-included text models
  * `/api/paid/v1/models` \- Paid or premium text models



## 

[​](#notes)

Notes

  * Scope: These endpoints list text-chat models. Image models used in the UI are covered by separate routes and/or the non-OpenAI UI endpoint `GET /api/models`.
  * Fields are subject to change as new capabilities or providers are added. We aim to remain OpenAI-API compatible for basic consumers (`id`/`object`/`created`/`owned_by`).



[Quickstart](/quickstart)[Personalized Models](/api-reference/endpoint/personalized-models)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
