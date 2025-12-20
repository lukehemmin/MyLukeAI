# Context Memory (Standalone) - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/memory

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
  * [Authentication](#authentication)
  * [Request](#request)
  * [Headers](#headers)
  * [Body](#body)
  * [Response](#response)
  * [Success (200)](#success-200)
  * [Error Examples](#error-examples)
  * [Pricing & Billing](#pricing-%26-billing)
  * [Retention](#retention)
  * [Examples](#examples)



Endpoint Examples

# Context Memory (Standalone)

## 

[​](#overview)

Overview

The standalone Context Memory endpoint compresses an entire conversation into a single memory message. This endpoint does not run a model. It returns the compressed memory message and usage so you can pipe it into your own chat completion request or store it.

  * No model inference is performed
  * Pass your `messages` array and optional settings



## 

[​](#authentication)

Authentication

  * `Authorization: Bearer YOUR_API_KEY` or
  * `x-api-key: YOUR_API_KEY`



## 

[​](#request)

Request

### 

[​](#headers)

Headers

  * `Content-Type: application/json`
  * `Authorization: Bearer YOUR_API_KEY` or `x-api-key: YOUR_API_KEY`
  * `memory_expiration_days: <1..365>` (optional) — overrides body; defaults to 30



### 

[​](#body)

Body

Copy
    
    
    {
      "messages": [
        { "role": "system", "content": "You are a helpful assistant." },
        { "role": "user", "content": "Summarize our previous discussion and continue." }
      ],
      "expiration_days": 45,            
      "model_context_limit": 128000     
    }
    

  * `messages` (required): OpenAI-style messages. `user`, `assistant`, `system`, `tool`, and `function` roles are accepted. Assistant `tool_calls` are ignored during compression.
  * `expiration_days` (optional): 1..365; default 30. If both header and body are provided, the header takes precedence.
  * `model_context_limit` (optional): Context target for compression. Default 128k; values below 10k are clamped internally.



## 

[​](#response)

Response

### 

[​](#success-200)

Success (200)

Copy
    
    
    {
      "messages": [
        { "role": "system", "content": "<compressed-context>..." }
      ],
      "usage": {
        "prompt_tokens": 51234,
        "completion_tokens": 1234,
        "total_tokens": 52468,
        "prompt_tokens_details": {
          "cached_tokens": 4096
        }
      }
    }
    

  * `messages`: The single memory-compressed message array to use as your full context in a chat completion request
  * `usage`: Token usage. When available, `prompt_tokens_details.cached_tokens` indicates discounted cached input tokens



### 

[​](#error-examples)

Error Examples

400 Bad Request

Copy
    
    
    { "error": "messages must be a non-empty array" }
    

401 Unauthorized

Copy
    
    
    { "error": "Invalid session" }
    

402 Payment Required

Copy
    
    
    { "error": "Insufficient balance" }
    

429 Too Many Requests

Copy
    
    
    { "error": "Rate limit exceeded. Please wait before sending another request." }
    

## 

[​](#pricing-&-billing)

Pricing & Billing

  * Non-cached input tokens: $5.00 / 1M
  * Cached input tokens: $2.50 / 1M (when applicable)
  * Output tokens: $10.00 / 1M

Note: This endpoint only charges for memory compression. If you later call `/v1/chat/completions`, model costs are billed separately.

## 

[​](#retention)

Retention

  * Default retention: 30 days
  * Configure via body `expiration_days` or header `memory_expiration_days`
  * Header value takes precedence over body when both are supplied



## 

[​](#examples)

Examples

JavaScript

Python

cURL

Copy
    
    
    const res = await fetch('https://nano-gpt.com/api/v1/memory', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
        'memory_expiration_days': '45'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Optimize our previous plan and continue.' }
        ]
      })
    });
    
    const { messages, usage } = await res.json();
    // Use `messages` as the full context for a subsequent /v1/chat/completions call
    

[YouTube Transcription](/api-reference/endpoint/youtube-transcribe)[Web Scraping](/api-reference/endpoint/scrape-urls)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
