# Text-to-Speech - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/tts

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
  * [Supported Models](#supported-models)
  * [Basic Usage](#basic-usage)
  * [Async Status and Result Retrieval](#async-status-and-result-retrieval)
  * [Endpoints](#endpoints)
  * [When you see status: “pending”](#when-you-see-status%3A-%E2%80%9Cpending%E2%80%9D)
  * [cURL — Submit, then Poll](#curl-%E2%80%94-submit%2C-then-poll)
  * [Synchronous vs. Asynchronous Models](#synchronous-vs-asynchronous-models)
  * [Best Practices](#best-practices)
  * [FAQ](#faq)
  * [Model-Specific Examples](#model-specific-examples)
  * [Kokoro-82m - Multilingual Voices](#kokoro-82m-multilingual-voices)
  * [Elevenlabs-Turbo-V2.5 - Advanced Voice Controls](#elevenlabs-turbo-v2-5-advanced-voice-controls)
  * [OpenAI Models - Multiple Formats & Instructions](#openai-models-multiple-formats-%26-instructions)
  * [Response Examples](#response-examples)
  * [JSON Response (Most Models)](#json-response-most-models)
  * [Binary Response (OpenAI Models)](#binary-response-openai-models)
  * [Voice Options](#voice-options)
  * [Kokoro-82m Voices](#kokoro-82m-voices)
  * [Elevenlabs-Turbo-V2.5 Voices](#elevenlabs-turbo-v2-5-voices)
  * [OpenAI Voices](#openai-voices)
  * [Error Handling](#error-handling)



Endpoint Examples

# Text-to-Speech

## 

[​](#overview)

Overview

Convert text into natural-sounding speech using various TTS models. Supports multiple languages, voices, and customization options including speed control and voice instructions. Looking for synchronous, low‑latency TTS that returns audio bytes directly? See `api-reference/endpoint/speech.mdx` (POST `/v1/speech`).

## 

[​](#supported-models)

Supported Models

  * **Kokoro-82m** : 44 multilingual voices ($0.001/1k chars)
  * **Elevenlabs-Turbo-V2.5** : Premium quality with style controls ($0.06/1k chars)
  * **tts-1** : OpenAI standard quality ($0.015/1k chars)
  * **tts-1-hd** : OpenAI high definition ($0.030/1k chars)
  * **gpt-4o-mini-tts** : Ultra-low cost ($0.0006/1k chars)



## 

[​](#basic-usage)

Basic Usage

Python

JavaScript

cURL

Copy
    
    
    import requests
    
    def text_to_speech(text, model="Kokoro-82m", voice=None, **kwargs):
        headers = {
            "x-api-key": "YOUR_API_KEY",
            "Content-Type": "application/json"
        }
        
        payload = {
            "text": text,
            "model": model
        }
        
        if voice:
            payload["voice"] = voice
        
        payload.update(kwargs)
        
        response = requests.post(
            "https://nano-gpt.com/api/tts",
            headers=headers,
            json=payload
        )
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            
            if 'application/json' in content_type:
                # JSON response with audio URL
                data = response.json()
                audio_response = requests.get(data['audioUrl'])
                with open('output.wav', 'wb') as f:
                    f.write(audio_response.content)
            else:
                # Binary audio data (OpenAI models)
                with open('output.mp3', 'wb') as f:
                    f.write(response.content)
            
            return response
        else:
            raise Exception(f"Error: {response.status_code}")
    
    # Basic usage
    text_to_speech(
        "Hello! Welcome to our service.",
        model="Kokoro-82m",
        voice="af_bella"
    )
    

## 

[​](#async-status-and-result-retrieval)

Async Status and Result Retrieval

Some TTS models run asynchronously. When queued, the API returns HTTP 202 with a ticket containing a `runId` and `model`. Use the TTS Status endpoint to poll until the job is complete. Synchronous models return audio immediately and do not require status polling.

### 

[​](#endpoints)

Endpoints

  * Submit TTS: `POST /api/tts`
  * Check TTS Status (async only): `GET /api/tts/status?runId=...&model=...`



### 

[​](#when-you-see-status:-“pending”)

When you see status: “pending”

If your initial `POST /api/tts` returns HTTP 202 with a body like:

Copy
    
    
    {
      "status": "pending",
      "runId": "98b0d593-fe8d-49b8-89c9-233022232297",
      "model": "Elevenlabs-Turbo-V2.5",
      "charged": true,
      "cost": 0.0050388,
      "paymentSource": "USD",
      "isApiRequest": true
    }
    

…the request is queued. Poll the Status endpoint using the `runId` and `model`. If present, include `cost`, `paymentSource`, and `isApiRequest` from the ticket when polling to help with automatic refunds if the upstream provider later rejects content.

### 

[​](#curl-—-submit,-then-poll)

cURL — Submit, then Poll

cURL

JavaScript

Copy
    
    
    # 1) Submit TTS
    curl -X POST https://nano-gpt.com/api/tts \
      -H 'x-api-key: YOUR_API_KEY' \
      -H 'Content-Type: application/json' \
      -d '{
        "text": "Hello there!",
        "model": "Elevenlabs-Turbo-V2.5",
        "voice": "Rachel",
        "speed": 1.0
      }'
    
    # 2) If response is 202/pending, poll using returned values
    curl "https://nano-gpt.com/api/tts/status?runId=98b0d593-fe8d-49b8-89c9-233022232297&model=Elevenlabs-Turbo-V2.5&cost=0.0050388&paymentSource=USD&isApiRequest=true" \
      -H 'x-api-key: YOUR_API_KEY'
    
    # 3) On completion, you'll receive an audioUrl
    # {
    #   "status": "completed",
    #   "audioUrl": "https://.../file.mp3",
    #   "contentType": "audio/mpeg",
    #   "model": "Elevenlabs-Turbo-V2.5"
    # }
    

### 

[​](#synchronous-vs-asynchronous-models)

Synchronous vs. Asynchronous Models

  * Synchronous models (examples: `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts`, `Kokoro-82m`) return immediately from `POST /api/tts` with either binary audio or JSON containing `{ audioUrl, contentType }` depending on the provider.
  * Asynchronous models (examples: `Elevenlabs-Turbo-V2.5`, `Elevenlabs-V3`, `Elevenlabs-Music-V1`) return HTTP 202 with a polling ticket. Use `GET /api/tts/status` until completed.



### 

[​](#best-practices)

Best Practices

  * Poll every 2–3 seconds; stop after 2–3 minutes and show a timeout error.
  * Always include `runId` and `model`. If available, include `cost`, `paymentSource`, and `isApiRequest` from the ticket for better error handling and refund automation.
  * On `completed`, prefer using the `audioUrl` directly (streaming or download). Cache URLs client‑side if you plan to replay.
  * If you receive `CONTENT_POLICY_VIOLATION`, do not retry the same content; surface a clear message to the user.



### 

[​](#faq)

FAQ

  * Why did I get 202/pending? The selected model runs asynchronously; your request was queued and billed after a successful queue submission.
  * Can I cancel a pending TTS? Not currently. Let it complete or time out client‑side.
  * Do all TTS models require polling? No. Only async models. Synchronous models return immediately.



## 

[​](#model-specific-examples)

Model-Specific Examples

### 

[​](#kokoro-82m-multilingual-voices)

Kokoro-82m - Multilingual Voices

44 voices across 13 language groups:

Python

Copy
    
    
    # Popular voice examples by category
    voices = {
        "american_female": ["af_bella", "af_nova", "af_aoede"],
        "american_male": ["am_adam", "am_onyx", "am_eric"],
        "british_female": ["bf_alice", "bf_emma"],
        "british_male": ["bm_daniel", "bm_george"],
        "japanese_female": ["jf_alpha", "jf_gongitsune"],
        "chinese_female": ["zf_xiaoxiao", "zf_xiaoyi"],
        "french_female": ["ff_siwis"],
        "italian_male": ["im_nicola"]
    }
    
    # Generate multilingual samples
    samples = [
        {"text": "Hello, welcome!", "voice": "af_bella", "lang": "English"},
        {"text": "Bonjour et bienvenue!", "voice": "ff_siwis", "lang": "French"},
        {"text": "こんにちは！", "voice": "jf_alpha", "lang": "Japanese"},
        {"text": "你好，欢迎！", "voice": "zf_xiaoxiao", "lang": "Chinese"}
    ]
    
    for sample in samples:
        text_to_speech(
            text=sample["text"],
            model="Kokoro-82m",
            voice=sample["voice"]
        )
    

### 

[​](#elevenlabs-turbo-v2-5-advanced-voice-controls)

Elevenlabs-Turbo-V2.5 - Advanced Voice Controls

Premium quality with style adjustments:

Python

cURL

Copy
    
    
    # Stable, consistent voice
    text_to_speech(
        text="This is a professional announcement.",
        model="Elevenlabs-Turbo-V2.5",
        voice="Rachel",
        stability=0.9,
        similarity_boost=0.8,
        style=0
    )
    
    # Expressive, dynamic voice  
    text_to_speech(
        text="This is so exciting!",
        model="Elevenlabs-Turbo-V2.5",
        voice="Rachel",
        stability=0.3,
        similarity_boost=0.7,
        style=0.8,
        speed=1.2
    )
    
    # Available voices: Rachel, Adam, Bella, Brian, etc.
    

### 

[​](#openai-models-multiple-formats-&-instructions)

OpenAI Models - Multiple Formats & Instructions

Python

cURL

Copy
    
    
    # High-definition with voice instructions
    text_to_speech(
        text="Welcome to customer service.",
        model="tts-1-hd",
        voice="nova",
        instructions="Speak warmly and professionally like a customer service representative",
        response_format="flac"
    )
    
    # Ultra-low cost option
    text_to_speech(
        text="This is a cost-effective option.",
        model="gpt-4o-mini-tts",
        voice="alloy",
        instructions="Speak clearly and cheerfully",
        response_format="mp3"
    )
    
    # Different format examples
    formats = ["mp3", "wav", "opus", "flac", "aac"]
    for fmt in formats:
        text_to_speech(
            text=f"This is {fmt.upper()} format.",
            model="tts-1",
            voice="echo",
            response_format=fmt
        )
    

## 

[​](#response-examples)

Response Examples

### 

[​](#json-response-most-models)

JSON Response (Most Models)

Copy
    
    
    {
      "audioUrl": "https://storage.url/audio-file.wav",
      "contentType": "audio/wav",
      "model": "Kokoro-82m",
      "text": "Hello world",
      "voice": "af_bella",
      "speed": 1,
      "duration": 2.3,
      "cost": 0.001,
      "currency": "USD"
    }
    

### 

[​](#binary-response-openai-models)

Binary Response (OpenAI Models)

OpenAI models return audio data directly as binary with appropriate headers:

Copy
    
    
    Content-Type: audio/mp3
    Content-Length: 123456
    [Binary audio data]
    

## 

[​](#voice-options)

Voice Options

### 

[​](#kokoro-82m-voices)

Kokoro-82m Voices

  * **American Female** : af_bella, af_nova, af_aoede, af_jessica, af_sarah
  * **American Male** : am_adam, am_onyx, am_eric, am_liam
  * **British** : bf_alice, bf_emma, bm_daniel, bm_george
  * **Asian Languages** : jf_alpha (Japanese), zf_xiaoxiao (Chinese)
  * **European** : ff_siwis (French), im_nicola (Italian)



### 

[​](#elevenlabs-turbo-v2-5-voices)

Elevenlabs-Turbo-V2.5 Voices

Rachel, Adam, Bella, Brian, Sarah, Michael, Emily, James, Nicole, and 37 more

### 

[​](#openai-voices)

OpenAI Voices

alloy, echo, fable, onyx, nova, shimmer, ash, ballad, coral, sage, verse

## 

[​](#error-handling)

Error Handling

Python

Copy
    
    
    try:
        result = text_to_speech("Hello world!", model="Kokoro-82m")
        print("Success!")
    except Exception as e:
        if "400" in str(e):
            print("Bad request - check parameters")
        elif "401" in str(e):
            print("Unauthorized - check API key")
        elif "413" in str(e):
            print("Text too long for model")
        else:
            print(f"Error: {e}")
    

Common errors:

  * **400** : Invalid parameters or missing text
  * **401** : Invalid or missing API key
  * **413** : Text exceeds model character limit
  * **429** : Rate limit exceeded



[v1/speech (Synchronous TTS)](/api-reference/endpoint/speech)[TTS Status](/api-reference/endpoint/tts-status)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
