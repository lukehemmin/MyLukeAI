# Speech-to-Text Status - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/transcribe-status

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
  * [Usage](#usage)
  * [Status Values](#status-values)
  * [Response Examples](#response-examples)
  * [Pending/Processing](#pending%2Fprocessing)
  * [Completed](#completed)
  * [Failed](#failed)



Endpoint Examples

# Speech-to-Text Status

## 

[​](#overview)

Overview

Check the status of an asynchronous transcription job (Elevenlabs-STT). Poll this endpoint to get transcription results when the job is completed.

## 

[​](#usage)

Usage

This endpoint is used with the Elevenlabs-STT model which processes transcriptions asynchronously. After submitting a transcription job, you’ll receive a `runId` that you use to check the status.

Python

JavaScript

cURL

Copy
    
    
    import requests
    import time
    
    def check_transcription_status(run_id, job_data):
        headers = {
            "x-api-key": "YOUR_API_KEY",
            "Content-Type": "application/json"
        }
        
        status_data = {
            "runId": run_id,
            "cost": job_data.get('cost'),
            "paymentSource": job_data.get('paymentSource'),
            "isApiRequest": True,
            "fileName": job_data.get('fileName'),
            "fileSize": job_data.get('fileSize'),
            "chargedDuration": job_data.get('chargedDuration'),
            "diarize": job_data.get('diarize', False)
        }
        
        response = requests.post(
            "https://nano-gpt.com/api/transcribe/status",
            headers=headers,
            json=status_data
        )
        
        return response.json()
    
    def wait_for_completion(run_id, job_data, max_attempts=60):
        for attempt in range(max_attempts):
            result = check_transcription_status(run_id, job_data)
            status = result.get('status')
            
            if status == 'completed':
                return result
            elif status == 'failed':
                raise Exception(f"Transcription failed: {result.get('error')}")
            
            print(f"Status: {status} (attempt {attempt + 1}/{max_attempts})")
            time.sleep(5)
        
        raise Exception("Transcription timed out")
    
    # Usage
    job_data = {"runId": "abc123", "cost": 0.075, "paymentSource": "USD"}
    result = wait_for_completion("abc123", job_data)
    print(result['transcription'])
    

## 

[​](#status-values)

Status Values

  * **`pending`** : Job is queued for processing
  * **`processing`** : Transcription is in progress
  * **`completed`** : Transcription finished successfully
  * **`failed`** : Transcription failed (check error field)



## 

[​](#response-examples)

Response Examples

### 

[​](#pending/processing)

Pending/Processing

Copy
    
    
    {
      "status": "processing"
    }
    

### 

[​](#completed)

Completed

Copy
    
    
    {
      "status": "completed",
      "transcription": "Speaker 1: Hello everyone. Speaker 2: Hi there!",
      "metadata": {
        "fileName": "meeting.mp3",
        "fileSize": 2345678,
        "chargedDuration": 2.5,
        "actualDuration": 2.47,
        "language": "en",
        "cost": 0.075,
        "currency": "USD",
        "model": "Elevenlabs-STT"
      },
      "words": [
        {
          "text": "Hello",
          "start": 0.5,
          "end": 0.9,
          "type": "word",
          "speaker_id": "speaker_0"
        }
      ],
      "diarization": {
        "segments": [
          {
            "speaker": "Speaker 1",
            "text": "Hello everyone",
            "start": 0.5,
            "end": 1.5
          }
        ]
      }
    }
    

### 

[​](#failed)

Failed

Copy
    
    
    {
      "status": "failed",
      "error": "Audio file could not be processed"
    }
    

[Speech-to-Text Transcription](/api-reference/endpoint/transcribe)[YouTube Transcription](/api-reference/endpoint/youtube-transcribe)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
