# Image Generation (OpenAI-Compatible) - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/image-generation-openai

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



Endpoint Examples

# Image Generation (OpenAI-Compatible)

## 

[​](#overview)

Overview

Generate images from text prompts or base64 image inputs using the OpenAI-compatible endpoint. Responses include base64 bytes (`b64_json`) by default or signed URLs (`url`) when `response_format: "url"`.

## 

[​](#endpoint)

Endpoint

  * Method/Path: `POST https://nano-gpt.com/v1/images/generations`
  * Auth: `Authorization: Bearer <API_KEY>`
  * Required header: `Content-Type: application/json`



## 

[​](#request-body-json)

Request Body (JSON)

Core fields:

  * `prompt` (string, required): Text prompt to generate an image from.
  * `model` (string, optional): Model ID (default `hidream`).
  * `n` (integer, optional): Number of images to generate (default `1`).
  * `size` (string, optional): `256x256`, `512x512`, or `1024x1024`.
  * `response_format` (string, optional): `b64_json` (default) or `url`.
  * `user` (string, optional): End-user identifier.

Image inputs (img2img/inpainting):

  * `imageDataUrl` (string, optional): Base64 data URL for a single input image.
  * `imageDataUrls` (array, optional): Multiple base64 data URLs for supported models.
  * `maskDataUrl` (string, optional): Base64 mask data URL for inpainting.

Image-to-image controls (model-specific):

  * `strength`, `guidance_scale`, `num_inference_steps`, `seed`, `kontext_max_mode`.



## 

[​](#response)

Response

  * Each `data[i]` contains either `b64_json` (default) or `url` (when `response_format: "url"`), never both.
  * When requesting `response_format: "url"`, the API may still return `b64_json` if URL generation (upload/presign) fails, as a fallback.
  * Signed URLs expire after a short period (currently ~1 hour). Download promptly for long-term storage.



## 

[​](#examples)

Examples

cURL (basic)

cURL (response_format: "url")

Python (img2img)

Copy
    
    
    curl https://nano-gpt.com/v1/images/generations \
      -H "Authorization: Bearer $API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "hidream",
        "prompt": "A sunset over a mountain range",
        "n": 1,
        "size": "1024x1024"
      }'
    

## 

[​](#notes-&-limits)

Notes & Limits

  * Input images must be provided as base64 data URLs; download and convert remote images before sending.
  * Uploads should be 4 MB or smaller after encoding. Compress or resize large assets before sending.



[Embedding Models](/api-reference/endpoint/embedding-models)[Speech-to-Text Transcription](/api-reference/endpoint/transcribe)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
