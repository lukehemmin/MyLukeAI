# TTS Status - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/tts-status

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
  * [Query parameters](#query-parameters)
  * [Usage](#usage)
  * [Response examples](#response-examples)
  * [Pending](#pending)
  * [Completed](#completed)
  * [Error (generic)](#error-generic)
  * [Error (content policy)](#error-content-policy)
  * [Notes](#notes)



Endpoint Examples

# TTS Status

## 

[​](#overview)

Overview

Poll the status of an asynchronous text-to-speech (TTS) job. Use the `runId` and `model` values returned by `POST /api/tts` when the initial response is `202` with `status: "pending"`. For low‑latency, synchronous TTS without polling, use `api-reference/endpoint/speech.mdx` (POST `/v1/speech`).

### 

[​](#query-parameters)

Query parameters

  * `runId` (string, required): Job identifier from the submit response
  * `model` (string, required): The model that was used for the job (e.g., `Elevenlabs-Turbo-V2.5`)
  * `cost` (number, optional): Cost from the ticket; helps with automatic refunds
  * `paymentSource` (string, optional): Currency/source from the ticket (e.g., `USD`)
  * `isApiRequest` (boolean, optional): Pass `true` when polling from API clients

Including `cost`, `paymentSource`, and `isApiRequest` from the original ticket helps the platform perform automatic refunds if the upstream provider rejects content after you were charged.

## 

[​](#usage)

Usage

Python

JavaScript

cURL

Copy
    
    
    import time
    import requests
    
    BASE = "https://nano-gpt.com/api"
    
    def get_tts_status(run_id: str, model: str, api_key: str, *, cost=None, payment_source=None, is_api_request=True) -> dict:
        params = {"runId": run_id, "model": model}
        if isinstance(cost, (int, float)):
            params["cost"] = str(cost)
        if payment_source:
            params["paymentSource"] = str(payment_source)
        if isinstance(is_api_request, bool):
            params["isApiRequest"] = str(is_api_request)
    
        resp = requests.get(
            f"{BASE}/tts/status",
            headers={"x-api-key": api_key},
            params=params,
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()
    
    
    def wait_for_tts(run_id: str, model: str, api_key: str, *, cost=None, payment_source=None, is_api_request=True, max_attempts: int = 60, delay_s: int = 3) -> str:
        for attempt in range(max_attempts):
            data = get_tts_status(run_id, model, api_key, cost=cost, payment_source=payment_source, is_api_request=is_api_request)
            status = data.get("status")
    
            if status == "completed" and data.get("audioUrl"):
                return data["audioUrl"]
            if status == "error":
                raise RuntimeError(data.get("error", "TTS generation failed"))
    
            time.sleep(delay_s)
    
        raise TimeoutError("Polling timeout")
    

## 

[​](#response-examples)

Response examples

### 

[​](#pending)

Pending

Copy
    
    
    {
      "status": "pending",
      "runId": "98b0d593-fe8d-49b8-89c9-233022232297",
      "queuePosition": 3
    }
    

### 

[​](#completed)

Completed

Copy
    
    
    {
      "status": "completed",
      "audioUrl": "https://.../file.mp3",
      "contentType": "audio/mpeg",
      "model": "Elevenlabs-Turbo-V2.5"
    }
    

### 

[​](#error-generic)

Error (generic)

Copy
    
    
    {
      "status": "error",
      "error": "TTS generation failed. Please try again."
    }
    

### 

[​](#error-content-policy)

Error (content policy)

Copy
    
    
    {
      "status": "error",
      "code": "CONTENT_POLICY_VIOLATION",
      "error": "Content rejected by provider. Please modify your prompt and try again."
    }
    

### 

[​](#notes)

Notes

  * For Elevenlabs‑family async models (e.g., `Elevenlabs-Turbo-V2.5`, `Elevenlabs-V3`) you will always poll this endpoint until it returns `completed`.
  * When the job completes, the response includes an `audioUrl` you can download or play in the browser.
  * If available, include `cost`, `paymentSource`, and `isApiRequest` from the original ticket while polling to improve refund handling.



[Text-to-Speech](/api-reference/endpoint/tts)[TEE Attestation](/api-reference/endpoint/tee-attestation)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
