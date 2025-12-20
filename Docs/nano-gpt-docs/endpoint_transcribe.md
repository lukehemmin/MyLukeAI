# Speech-to-Text Transcription - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/transcribe

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
  * [Upload Methods](#upload-methods)
  * [Direct File Upload (≤3MB)](#direct-file-upload-%E2%89%A43mb)
  * [URL Upload (≤500MB)](#url-upload-%E2%89%A4500mb)
  * [Advanced Features - Speaker Diarization](#advanced-features-speaker-diarization)
  * [Language Support](#language-support)
  * [Response Examples](#response-examples)
  * [Synchronous Response (Whisper/Wizper)](#synchronous-response-whisper%2Fwizper)
  * [Asynchronous Response (Elevenlabs-STT)](#asynchronous-response-elevenlabs-stt)



Endpoint Examples

# Speech-to-Text Transcription

## 

[​](#overview)

Overview

The Speech-to-Text transcription endpoint converts audio files into text using state-of-the-art speech recognition models. Supports multiple languages, speaker diarization, and various audio formats.

## 

[​](#supported-models)

Supported Models

  * **Whisper-Large-V3** : OpenAI’s flagship model ($0.01/min) - Synchronous
  * **Wizper** : Fast and efficient model ($0.01/min) - Synchronous
  * **Elevenlabs-STT** : Premium with diarization ($0.03/min) - Asynchronous



## 

[​](#upload-methods)

Upload Methods

### 

[​](#direct-file-upload-≤3mb)

Direct File Upload (≤3MB)

Python

JavaScript

cURL

Copy
    
    
    import requests
    
    def transcribe_file(file_path):
        headers = {"x-api-key": "YOUR_API_KEY"}
        
        with open(file_path, 'rb') as audio_file:
            files = {'audio': ('audio.mp3', audio_file, 'audio/mpeg')}
            data = {
                'model': 'Whisper-Large-V3',
                'language': 'en'
            }
            
            response = requests.post(
                "https://nano-gpt.com/api/transcribe",
                headers=headers,
                files=files,
                data=data
            )
            
            return response.json()
    
    result = transcribe_file("meeting.mp3")
    print(result['transcription'])
    

### 

[​](#url-upload-≤500mb)

URL Upload (≤500MB)

Python

JavaScript

cURL

Copy
    
    
    import requests
    
    def transcribe_url(audio_url):
        headers = {
            "x-api-key": "YOUR_API_KEY",
            "Content-Type": "application/json"
        }
        
        data = {
            "audioUrl": audio_url,
            "model": "Wizper",
            "language": "auto"
        }
        
        response = requests.post(
            "https://nano-gpt.com/api/transcribe",
            headers=headers,
            json=data
        )
        
        return response.json()
    
    result = transcribe_url("https://example.com/audio.mp3")
    print(result['transcription'])
    

## 

[​](#advanced-features-speaker-diarization)

Advanced Features - Speaker Diarization

Use Elevenlabs-STT for speaker identification (asynchronous processing):

Python

Copy
    
    
    import requests
    import time
    
    def transcribe_with_speakers(audio_url):
        headers = {
            "x-api-key": "YOUR_API_KEY",
            "Content-Type": "application/json"
        }
        
        # Submit transcription job
        data = {
            "audioUrl": audio_url,
            "model": "Elevenlabs-STT",
            "diarize": True,
            "tagAudioEvents": True
        }
        
        response = requests.post(
            "https://nano-gpt.com/api/transcribe",
            headers=headers,
            json=data
        )
        
        if response.status_code == 202:
            job_data = response.json()
            
            # Poll for results
            status_data = {
                "runId": job_data['runId'],
                "cost": job_data.get('cost'),
                "paymentSource": job_data.get('paymentSource'),
                "isApiRequest": True
            }
            
            while True:
                status_response = requests.post(
                    "https://nano-gpt.com/api/transcribe/status",
                    headers=headers,
                    json=status_data
                )
                
                result = status_response.json()
                if result.get('status') == 'completed':
                    return result
                elif result.get('status') == 'failed':
                    raise Exception(f"Transcription failed: {result.get('error')}")
                
                time.sleep(5)
    
    result = transcribe_with_speakers("https://example.com/meeting.mp3")
    
    # Access speaker segments
    for segment in result['diarization']['segments']:
        print(f"{segment['speaker']}: {segment['text']}")
    

## 

[​](#language-support)

Language Support

Supports 97+ languages with auto-detection:

Copy
    
    
    # Common language codes
    languages = {
        "auto": "Auto-detect",
        "en": "English", 
        "es": "Spanish",
        "fr": "French",
        "de": "German", 
        "zh": "Chinese",
        "ja": "Japanese",
        "ar": "Arabic"
    }
    

## 

[​](#response-examples)

Response Examples

### 

[​](#synchronous-response-whisper/wizper)

Synchronous Response (Whisper/Wizper)

Copy
    
    
    {
      "transcription": "Hello, this is a test transcription.",
      "metadata": {
        "fileName": "audio.mp3",
        "fileSize": 1234567,
        "chargedDuration": 2.5,
        "actualDuration": 2.5,
        "language": "en",
        "cost": 0.025,
        "currency": "USD",
        "model": "Whisper-Large-V3"
      }
    }
    

### 

[​](#asynchronous-response-elevenlabs-stt)

Asynchronous Response (Elevenlabs-STT)

Initial response (202):

Copy
    
    
    {
      "runId": "abc123def456",
      "status": "pending",
      "model": "Elevenlabs-STT",
      "cost": 0.075,
      "paymentSource": "USD"
    }
    

Final response (when completed):

Copy
    
    
    {
      "status": "completed",
      "transcription": "Speaker 1: Hello everyone. Speaker 2: Hi there!",
      "metadata": { ... },
      "diarization": {
        "segments": [
          {
            "speaker": "Speaker 1",
            "text": "Hello everyone",
            "start": 0.5,
            "end": 1.5
          }
        ]
      },
      "words": [
        {
          "text": "Hello",
          "start": 0.5,
          "end": 0.9,
          "type": "word",
          "speaker_id": "speaker_0"
        }
      ]
    }
    

[Image Generation (OpenAI-Compatible)](/api-reference/endpoint/image-generation-openai)[Speech-to-Text Status](/api-reference/endpoint/transcribe-status)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
