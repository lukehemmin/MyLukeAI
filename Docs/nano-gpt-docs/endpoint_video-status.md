# Video Status - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/video-status

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
  * [Status values](#status-values)
  * [Response examples](#response-examples)
  * [In progress](#in-progress)
  * [Completed](#completed)
  * [Failed](#failed)
  * [Notes](#notes)



Endpoint Examples

# Video Status

## 

[​](#overview)

Overview

Poll the status of an asynchronous video generation run. Use the `runId` you received from `POST /generate-video` along with the `modelSlug` you used to start the job. When the run completes, the response includes `data.output.video.url`.

### 

[​](#query-parameters)

Query parameters

  * `runId` (string, required): The run identifier returned by the submit call
  * `modelSlug` (string, required): The model used for the run (e.g., `veo2-video`)



## 

[​](#usage)

Usage

Python

JavaScript

cURL

Copy
    
    
    import requests
    import time
    
    BASE = "https://nano-gpt.com/api"
    
    def get_video_status(run_id: str, model_slug: str, api_key: str) -> dict:
        resp = requests.get(
            f"{BASE}/generate-video/status",
            headers={"x-api-key": api_key},
            params={"runId": run_id, "modelSlug": model_slug},
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()
    
    
    def wait_for_video(run_id: str, model_slug: str, api_key: str, max_attempts: int = 120, delay_s: int = 5) -> str:
        for i in range(max_attempts):
            data = get_video_status(run_id, model_slug, api_key)
            status = data.get("data", {}).get("status")
            if status == "COMPLETED":
                return data["data"]["output"]["video"]["url"]
            if status == "FAILED":
                raise RuntimeError(data.get("data", {}).get("error", "Video generation failed"))
            time.sleep(delay_s)
        raise TimeoutError("Video generation timed out")
    

## 

[​](#status-values)

Status values

  * `IN_QUEUE`: Request queued
  * `IN_PROGRESS`: Generation in progress
  * `COMPLETED`: Video ready
  * `FAILED`: Generation failed
  * `CANCELLED`: Request cancelled



## 

[​](#response-examples)

Response examples

### 

[​](#in-progress)

In progress

Copy
    
    
    {
      "data": {
        "status": "IN_PROGRESS",
        "request_id": "fal-request-abc123xyz"
      }
    }
    

### 

[​](#completed)

Completed

Copy
    
    
    {
      "data": {
        "status": "COMPLETED",
        "request_id": "fal-request-abc123xyz",
        "output": {
          "video": {
            "url": "https://storage.example.com/video.mp4"
          }
        }
      }
    }
    

### 

[​](#failed)

Failed

Copy
    
    
    {
      "data": {
        "status": "FAILED",
        "request_id": "fal-request-abc123xyz",
        "error": "Content policy violation",
        "isNSFWError": true,
        "userFriendlyError": "Content flagged as inappropriate. Please modify your prompt and try again."
      }
    }
    

### 

[​](#notes)

Notes

  * Polling this endpoint is free; submission endpoints are rate limited.
  * The final video URL is returned in `data.output.video.url` when status is `COMPLETED`.



[Video Generation](/api-reference/endpoint/video-generation)[Talk to GPT (Legacy)](/api-reference/endpoint/talk-to-gpt)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
