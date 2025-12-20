# Personalized Models - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/personalized-models

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

  * [Personalized Models API](#personalized-models-api)
  * [Compatibility & Response Shape](#compatibility-%26-response-shape)
  * [Authentication](#authentication)
  * [Personalization Rules](#personalization-rules)
  * [Examples](#examples)
  * [Managing Your Visible Models](#managing-your-visible-models)
  * [Notes](#notes)



Endpoint Examples

# Personalized Models

# 

[​](#personalized-models-api)

Personalized Models API

Curated, OpenAI‑compatible model listing scoped to each account’s preferences. This endpoint returns only the text models you have marked as “visible” in Settings → Models, regardless of whether they are subscription or paid models.

  * GET `/api/personalized/v1/models`

See also:

  * Canonical models list: `GET /api/v1/models`
  * Subscription‑only list: `GET /api/subscription/v1/models`
  * Paid‑only list: `GET /api/paid/v1/models`



## 

[​](#compatibility-&-response-shape)

Compatibility & Response Shape

The response mirrors OpenAI’s Models API:

Copy
    
    
    {
      "object": "list",
      "data": [ { /* model */ }, ... ]
    }
    

Each model contains at least:

Copy
    
    
    {
      "id": "deepseek/deepseek-chat-v3-0324",
      "object": "model",
      "created": 1736966400,
      "owned_by": "deepseek"
    }
    

Use `?detailed=true` to include additional fields like `name`, `description`, `context_length`, `capabilities.vision`, `pricing`, `icon_url`, and `cost_estimate`.

## 

[​](#authentication)

Authentication

An API key is required.

  * `Authorization: Bearer <api_key>`
  * or `x-api-key: <api_key>`

If the key is missing or invalid, the endpoint returns `401`.

## 

[​](#personalization-rules)

Personalization Rules

  * The list is filtered by your account’s visible text models (configured in the NanoGPT web app under Settings → Models → “Visible Text Models”).
  * This endpoint ignores the user preference “Also show paid models.” If you marked paid models as visible, they appear here even if you generally hide paid models elsewhere.
  * If you have not set any preferences, the endpoint falls back to NanoGPT defaults (`visible === true` in our model registry).



## 

[​](#examples)

Examples

Basic list:

Copy
    
    
    curl -H "Authorization: Bearer $NANOGPT_API_KEY" \
      https://nano-gpt.com/api/personalized/v1/models
    

Detailed list with pricing/capabilities:

Copy
    
    
    curl -H "x-api-key: $NANOGPT_API_KEY" \
      "https://nano-gpt.com/api/personalized/v1/models?detailed=true"
    

Sample detailed item:

Copy
    
    
    {
      "id": "deepseek/deepseek-chat-v3-0324",
      "object": "model",
      "created": 1736966400,
      "owned_by": "deepseek",
      "name": "DeepSeek V3 (0324)",
      "description": "General-purpose chat model with strong reasoning",
      "context_length": 128000,
      "capabilities": { "vision": false },
      "pricing": {
        "prompt": 2500,
        "completion": 10000,
        "currency": "USD",
        "unit": "per_million_tokens"
      },
      "icon_url": "/icons/DeepSeek.svg",
      "cost_estimate": {
        "cheap": true
      }
    }
    

## 

[​](#managing-your-visible-models)

Managing Your Visible Models

The recommended way to customize your personalized list is via the NanoGPT web UI:

  * Open Settings → Models → “Visible Text Models”.
  * Toggle visibility and categories as needed; changes are saved to your account.

Advanced (web session only):

  * GET `/api/user/model-visibility` — returns your saved preferences as `{ modelPreferences: { visibleTextModels, modelCategories } }`.
  * POST `/api/user/model-visibility` — upserts preferences. Cookie‑based session auth is required (not API‑key auth).

Payload shape:

Copy
    
    
    {
      "visibleTextModels": {
        "deepseek/deepseek-chat-v3-0324": true,
        "claude-3-haiku": false
      },
      "modelCategories": {
        "deepseek/deepseek-chat-v3-0324": "General"
      }
    }
    

Keys outside NanoGPT’s known model ids are ignored.

## 

[​](#notes)

Notes

  * This route is explicitly dynamic (no shared caching across keys).
  * Model ids and metadata evolve as providers update their catalogs; keep consumers resilient to new fields.
  * Personalized results may include paid models even if `/api/v1/models` hides them for your account (by design).



[Models](/api-reference/endpoint/models)[Models (Old)](/api-reference/endpoint/models-old)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
