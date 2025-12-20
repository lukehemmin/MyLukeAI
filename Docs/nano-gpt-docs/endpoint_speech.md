# v1/speech (Synchronous TTS) - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/speech

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
  * [Endpoint](#endpoint)
  * [Request Body (JSON)](#request-body-json)
  * [Response](#response)
  * [Examples](#examples)
  * [Notes & Limits](#notes-%26-limits)
  * [Audio Formats](#audio-formats)
  * [Voices](#voices)
  * [Errors & Troubleshooting](#errors-%26-troubleshooting)
  * [Security](#security)
  * [Pricing, Quotas, and Rate Limits](#pricing%2C-quotas%2C-and-rate-limits)
  * [Migration from Job‑based TTS](#migration-from-job%E2%80%91based-tts)
  * [Streaming](#streaming)
  * [See Also](#see-also)



Endpoint Examples

# v1/speech (Synchronous TTS)

## 

[​](#overview)

Overview

Synthesize speech with a single, low‑latency request. The `POST /v1/speech` endpoint returns audio bytes directly in the HTTP response—ideal for simple request/response flows, UI playback, and short prompts without job polling.

## 

[​](#endpoint)

Endpoint

  * Method/Path: `POST https://api.nano-gpt.com/v1/speech`
  * Auth: `Authorization: Bearer <API_KEY>`
  * Required header: `Content-Type: application/json`
  * Optional header: `Accept` to prefer a MIME type (for example `audio/mpeg`, `audio/wav`, `audio/ogg`). If omitted, the response `Content-Type` follows the requested `format` in the body.



## 

[​](#request-body-json)

Request Body (JSON)

  * `model` (string, required): TTS‑capable model ID (for example `nano-tts-1`).
  * `input` (string, required): The text to synthesize. Plain text is supported.
  * `voice` (string, required): Voice preset (for example `luna`, `verse`, `sonic`). See Voices below.
  * `format` (string, optional): Output container/codec. Common values: `mp3`, `wav`, `ogg`, `opus`, `aac`, `flac`, `pcm16`.
  * `sample_rate` (number, optional): Required when `format=pcm16` (for example `16000`).
  * `speed` (number, optional): Speaking rate multiplier (for example `0.5`–`2.0`).
  * `language` (string, optional): BCP‑47 tag (for example `en-US`).

Additional controls (if supported by the selected model):

  * `pitch` (number, optional): Pitch shift or style value; model‑specific range.
  * `emotion` (string, optional): Style tag (for example `neutral`, `friendly`, `excited`).
  * `stability` (number, optional): 0–1; voice stability (provider‑specific).
  * `similarity` (number, optional): 0–1; similarity boost (provider‑specific).



## 

[​](#response)

Response

  * Success: `200 OK`, body contains binary audio.
  * `Content-Type`: Based on `format`/`Accept` (for example `audio/mpeg`, `audio/wav`, `audio/ogg`).

On error, returns JSON with details and a non‑2xx status:

Copy
    
    
    { "error": { "type": "invalid_request_error", "message": "details" } }
    

Common error types: `invalid_model`, `invalid_voice`, `unsupported_format`, `invalid_sample_rate`, `input_too_long`, `rate_limit_exceeded`.

## 

[​](#examples)

Examples

All examples write audio to disk.

cURL (MP3)

Node (fetch)

Python (requests)

Copy
    
    
    curl -X POST \
      -H "Authorization: Bearer $NANOGPT_API_KEY" \
      -H "Content-Type: application/json" \
      -H "Accept: audio/mpeg" \
      https://api.nano-gpt.com/v1/speech \
      -d '{
        "model": "nano-tts-1",
        "input": "Hello from NanoGPT!",
        "voice": "luna",
        "format": "mp3"
      }' \
      --output speech.mp3
    

## 

[​](#notes-&-limits)

Notes & Limits

  * Max input length: depends on model; measured in characters or tokens. For short, interactive prompts, prefer under ~1–2k characters.
  * Language support: varies by model. Specify `language` to force selection; otherwise, language may be auto‑detected.
  * Typical latency: scales with input length and selected `format`; compressed formats like `mp3` are often faster than `wav`.
  * Usage metering: billed by characters/tokens or generated audio seconds (provider‑specific). See Pricing.



## 

[​](#audio-formats)

Audio Formats

Mapping between `format` and response `Content-Type`:

format| Content-Type| Notes  
---|---|---  
mp3| `audio/mpeg`| Widely supported in browsers  
wav| `audio/wav`| PCM; larger payloads  
ogg| `audio/ogg`| Container; may include Opus  
opus| `audio/opus` or `audio/ogg`| Streaming‑friendly  
aac| `audio/aac`| Safari‑friendly  
flac| `audio/flac`| Lossless  
pcm16| `application/octet-stream`| Little‑endian mono; requires `sample_rate`  
  
Browser notes: Safari supports AAC/MP3; Ogg/Opus plays in Chrome/Firefox; WAV is universal but larger.

## 

[​](#voices)

Voices

  * Voice IDs vary by model/provider. See model‑specific voices on Text‑to‑Speech: `api-reference/text-to-speech.mdx`.
  * If a voices listing endpoint is available (for example `GET /v1/voices`), it returns available voice IDs and metadata (language coverage, gender/pitch, sample links).



## 

[​](#errors-&-troubleshooting)

Errors & Troubleshooting

  * `invalid_model`, `invalid_voice`, `unsupported_format`, `invalid_sample_rate`: Verify `model`, `voice`, `format`, and required `sample_rate` for `pcm16`.
  * `input_too_long`: Reduce length; split long text into chunks and stitch audio client‑side.
  * `rate_limit_exceeded`: Exponential backoff; retry after the window resets.
  * Network/client tips: Set `Accept` to your preferred audio type and write the raw response body directly to a file.



## 

[​](#security)

Security

  * Do not expose API keys in browsers. Proxy via your server.
  * Redact PII in logs; avoid logging raw text/audio in production.
  * Rate‑limit public routes.



## 

[​](#pricing,-quotas,-and-rate-limits)

Pricing, Quotas, and Rate Limits

  * Billing: per characters/tokens or generated seconds depending on provider/model; minimum billing increments may apply.
  * Rate limits: per‑minute/day caps; contact support to request increases. See `api-reference/miscellaneous/pricing.mdx` and `api-reference/miscellaneous/rate-limits.mdx`.



## 

[​](#migration-from-job‑based-tts)

Migration from Job‑based TTS

Already using the async `POST /tts` \+ `GET /tts/status` flow?

  * When to switch: choose `v1/speech` for short prompts, low latency, and direct playback; keep job‑based TTS for long/batch generation and webhook workflows.
  * Parameter mapping: `text` → `input`, `voice` stays `voice`, `output_format` → `format`, speed/controls map directly when supported.
  * Retries/timeouts: `v1/speech` returns inline; implement client‑side timeouts and simple retries on 5xx.



## 

[​](#streaming)

Streaming

If chunked audio streaming is enabled for your account, you can request streaming with compatible formats (for example Opus/MP3) and consume the response as a stream. Example Node pattern:

Copy
    
    
    const res = await fetch("https://api.nano-gpt.com/v1/speech", { /* headers/body as above */ });
    if (!res.ok) throw new Error(await res.text());
    const file = await fs.open("speech.mp3", "w");
    for await (const chunk of res.body) {
      await file.write(chunk);
    }
    await file.close();
    

Note: Streaming availability and formats may vary by model/provider.

## 

[​](#see-also)

See Also

  * Async/job‑based TTS: `api-reference/endpoint/tts.mdx`
  * TTS Status polling: `api-reference/endpoint/tts-status.mdx`



[Web Search](/api-reference/endpoint/web-search)[Text-to-Speech](/api-reference/endpoint/tts)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
