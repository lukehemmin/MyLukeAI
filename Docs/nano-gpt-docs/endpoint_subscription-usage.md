# Subscription Usage - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/subscription-usage

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
  * [Request](#request)
  * [Response](#response)
  * [Usage semantics](#usage-semantics)
  * [Examples](#examples)



Endpoint Examples

# Subscription Usage

## 

[​](#overview)

Overview

Returns subscription status and current daily/monthly usage for the active billing period.

## 

[​](#request)

Request

  * Method: `GET`
  * Path: `/api/subscription/v1/usage`
  * Auth: `Authorization: Bearer <api_key>` or `x-api-key: <api_key>`



## 

[​](#response)

Response

`200 application/json`. Timestamps are UNIX epoch milliseconds.

Copy
    
    
    {
      "active": true,
      "limits": { "daily": 2000, "monthly": 60000 },
      "enforceDailyLimit": false,
      "daily": {
        "used": 5,
        "remaining": 1995,
        "percentUsed": 0.0025,
        "resetAt": 1738540800000
      },
      "monthly": {
        "used": 45,
        "remaining": 59955,
        "percentUsed": 0.00075,
        "resetAt": 1739404800000
      },
      "period": {
        "currentPeriodEnd": "2025-02-13T23:59:59.000Z"
      },
      "state": "active",
      "graceUntil": null
    }
    

Fields

  * `active` — Whether the account is currently active for subscription usage.
  * `limits.daily`, `limits.monthly` — Configured daily/monthly allowance.
  * `enforceDailyLimit` — If `true`, access requires both daily AND monthly remaining > 0; if `false`, only monthly remaining is required.
  * `daily.used`, `monthly.used` — Usage units consumed in the current day/month window.
  * `daily.remaining`, `monthly.remaining` — Remaining allowance for each window.
  * `daily.percentUsed`, `monthly.percentUsed` — Decimal fraction in [0,1].
  * `daily.resetAt`, `monthly.resetAt` — Millisecond epoch when the window resets.
  * `period.currentPeriodEnd` — ISO timestamp for the end of the current billing period, if known.
  * `state` — One of `active`, `grace`, `inactive`.
  * `graceUntil` — ISO timestamp when grace access ends (if applicable).



## 

[​](#usage-semantics)

Usage semantics

  * Usage units represent successful subscription‑covered operations (e.g., a completed generation). They are not tokens or dollar cost.
  * Daily window resets at the next UTC day start; monthly usage aligns to the subscription billing cycle when available.



## 

[​](#examples)

Examples

cURL

JavaScript/TypeScript

Copy
    
    
    curl -s \
      -H "Authorization: Bearer $NANOGPT_API_KEY" \
      https://nano-gpt.com/api/subscription/v1/usage | jq
    

[Check Balance](/api-reference/endpoint/check-balance)[Receive Nano](/api-reference/endpoint/receive-nano)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
