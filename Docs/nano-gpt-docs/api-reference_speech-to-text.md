# Speech-to-Text (STT) - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/speech-to-text

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
  * [Available Models](#available-models)
  * [Authentication](#authentication)
  * [File Upload Methods](#file-upload-methods)
  * [Method 1: Direct File Upload (≤3MB)](#method-1%3A-direct-file-upload-%E2%89%A43mb)
  * [Method 2: URL Upload (Recommended for >3MB)](#method-2%3A-url-upload-recommended-for-%3E3mb)
  * [Advanced Features with Elevenlabs-STT](#advanced-features-with-elevenlabs-stt)
  * [Speaker Diarization](#speaker-diarization)
  * [Language Support](#language-support)
  * [Complete Class Implementation](#complete-class-implementation)
  * [Error Handling and Best Practices](#error-handling-and-best-practices)
  * [Common Error Responses](#common-error-responses)
  * [File Format Support](#file-format-support)
  * [Pricing and Billing](#pricing-and-billing)



API Reference

# Speech-to-Text (STT)

Complete guide to speech-to-text transcription APIs

## 

[​](#overview)

Overview

The NanoGPT STT API allows you to transcribe audio files into text using state-of-the-art speech recognition models. The API supports multiple languages, speaker diarization, and various audio formats with both synchronous and asynchronous processing options.

## 

[​](#available-models)

Available Models

  * **Whisper-Large-V3** : OpenAI’s flagship model with high accuracy ($0.01/min)
  * **Wizper** : Fast and efficient model optimized for speed ($0.01/min)
  * **Elevenlabs-STT** : Premium model with speaker diarization and word-level timestamps ($0.03/min)



## 

[​](#authentication)

Authentication

All requests require authentication via API key:

Copy
    
    
    x-api-key: YOUR_API_KEY
    

## 

[​](#file-upload-methods)

File Upload Methods

### 

[​](#method-1:-direct-file-upload-≤3mb)

Method 1: Direct File Upload (≤3MB)

For smaller audio files, upload directly using multipart/form-data:

Copy
    
    
    import requests
    
    BASE_URL = "https://nano-gpt.com/api"
    API_KEY = "YOUR_API_KEY"
    
    def transcribe_file(file_path, model="Whisper-Large-V3", language="auto"):
        """
        Transcribe an audio file using direct upload
        """
        headers = {"x-api-key": API_KEY}
        
        with open(file_path, 'rb') as audio_file:
            files = {
                'audio': ('audio.mp3', audio_file, 'audio/mpeg')
            }
            data = {
                'model': model,
                'language': language
            }
            
            response = requests.post(
                f"{BASE_URL}/transcribe",
                headers=headers,
                files=files,
                data=data
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise Exception(f"Error: {response.status_code} - {response.text}")
    
    # Example usage
    try:
        result = transcribe_file("meeting.mp3", model="Whisper-Large-V3", language="en")
        print("Transcription:", result['transcription'])
        print("Cost:", result['metadata']['cost'])
        print("Duration:", result['metadata']['chargedDuration'], "minutes")
    except Exception as e:
        print(f"Error: {e}")
    

### 

[​](#method-2:-url-upload-recommended-for->3mb)

Method 2: URL Upload (Recommended for >3MB)

For larger files, use URL-based upload:

Copy
    
    
    def transcribe_url(audio_url, model="Whisper-Large-V3", language="auto"):
        """
        Transcribe an audio file from URL
        """
        headers = {
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
        }
        
        data = {
            "audioUrl": audio_url,
            "model": model,
            "language": language
        }
        
        response = requests.post(
            f"{BASE_URL}/transcribe",
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Error: {response.status_code} - {response.text}")
    
    # Example usage
    audio_url = "https://example.com/large-audio-file.mp3"
    result = transcribe_url(audio_url, model="Wizper")
    print("Transcription:", result['transcription'])
    

## 

[​](#advanced-features-with-elevenlabs-stt)

Advanced Features with Elevenlabs-STT

### 

[​](#speaker-diarization)

Speaker Diarization

Identify and label different speakers in conversations:

Copy
    
    
    import time
    
    def transcribe_with_diarization(audio_url):
        """
        Transcribe with speaker identification (async)
        """
        headers = {
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
        }
        
        # Submit transcription job
        data = {
            "audioUrl": audio_url,
            "model": "Elevenlabs-STT",
            "diarize": True,
            "tagAudioEvents": True,
            "language": "auto"
        }
        
        response = requests.post(
            f"{BASE_URL}/transcribe",
            headers=headers,
            json=data
        )
        
        if response.status_code == 202:
            job_data = response.json()
            return poll_for_results(job_data)
        else:
            raise Exception(f"Error: {response.status_code}")
    
    def poll_for_results(job_data):
        """
        Poll for transcription results
        """
        headers = {
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
        }
        
        status_data = {
            "runId": job_data['runId'],
            "cost": job_data.get('cost'),
            "paymentSource": job_data.get('paymentSource'),
            "isApiRequest": True,
            "fileName": job_data.get('fileName'),
            "fileSize": job_data.get('fileSize'),
            "chargedDuration": job_data.get('chargedDuration'),
            "diarize": job_data.get('diarize', False)
        }
        
        max_attempts = 60
        for attempt in range(max_attempts):
            print(f"Checking status... (attempt {attempt + 1}/{max_attempts})")
            
            response = requests.post(
                f"{BASE_URL}/transcribe/status",
                headers=headers,
                json=status_data
            )
            
            if response.status_code == 200:
                result = response.json()
                status = result.get('status')
                
                if status == 'completed':
                    return result
                elif status == 'failed':
                    raise Exception(f"Transcription failed: {result.get('error')}")
            
            time.sleep(5)  # Wait 5 seconds before next check
        
        raise Exception("Transcription timed out")
    
    # Example usage
    conversation_url = "https://example.com/meeting-recording.mp3"
    try:
        result = transcribe_with_diarization(conversation_url)
        
        print("Full Transcription:", result['transcription'])
        print("\nSpeaker Breakdown:")
        
        if 'diarization' in result:
            for segment in result['diarization']['segments']:
                print(f"{segment['speaker']} ({segment['start']}-{segment['end']}s): {segment['text']}")
        
        # Word-level timestamps
        if 'words' in result:
            print("\nWord-level timestamps:")
            for word in result['words'][:10]:  # Show first 10 words
                if word['type'] == 'word':
                    print(f"'{word['text']}' at {word['start']}-{word['end']}s")
                    
    except Exception as e:
        print(f"Error: {e}")
    

## 

[​](#language-support)

Language Support

The API supports 97+ languages with auto-detection:

Copy
    
    
    # Common language codes
    SUPPORTED_LANGUAGES = {
        "auto": "Auto-detect",
        "en": "English",
        "es": "Spanish", 
        "fr": "French",
        "de": "German",
        "it": "Italian",
        "pt": "Portuguese",
        "zh": "Chinese",
        "ja": "Japanese",
        "ko": "Korean",
        "ar": "Arabic",
        "hi": "Hindi",
        "ru": "Russian"
    }
    
    def transcribe_multilingual(audio_files):
        """
        Transcribe multiple files with different languages
        """
        results = []
        
        for file_info in audio_files:
            try:
                result = transcribe_url(
                    file_info['url'], 
                    language=file_info.get('language', 'auto')
                )
                
                results.append({
                    'file': file_info['name'],
                    'language': result['metadata']['language'],
                    'transcription': result['transcription'],
                    'cost': result['metadata']['cost']
                })
                
            except Exception as e:
                results.append({
                    'file': file_info['name'],
                    'error': str(e)
                })
        
        return results
    
    # Example usage
    audio_files = [
        {"name": "english.mp3", "url": "https://example.com/english.mp3", "language": "en"},
        {"name": "spanish.mp3", "url": "https://example.com/spanish.mp3", "language": "es"},
        {"name": "unknown.mp3", "url": "https://example.com/unknown.mp3", "language": "auto"}
    ]
    
    results = transcribe_multilingual(audio_files)
    for result in results:
        if 'error' not in result:
            print(f"{result['file']} ({result['language']}): {result['transcription'][:100]}...")
        else:
            print(f"{result['file']}: Error - {result['error']}")
    

## 

[​](#complete-class-implementation)

Complete Class Implementation

Here’s a complete transcriber class with error handling and retry logic:

Copy
    
    
    import requests
    import time
    import json
    from pathlib import Path
    
    class NanoGPTTranscriber:
        def __init__(self, api_key):
            self.api_key = api_key
            self.base_url = "https://nano-gpt.com/api"
            
        def transcribe(self, audio_path=None, audio_url=None, **kwargs):
            """
            Transcribe audio with automatic method selection
            """
            if audio_path and audio_url:
                raise ValueError("Specify either audio_path or audio_url, not both")
            
            if audio_path:
                return self._transcribe_file(audio_path, **kwargs)
            elif audio_url:
                return self._transcribe_url(audio_url, **kwargs)
            else:
                raise ValueError("Either audio_path or audio_url must be provided")
        
        def _transcribe_file(self, audio_path, **kwargs):
            """Direct file upload transcription"""
            headers = {"x-api-key": self.api_key}
            
            path = Path(audio_path)
            if path.stat().st_size > 3 * 1024 * 1024:  # 3MB
                raise ValueError("File too large for direct upload. Use audio_url method.")
            
            with open(audio_path, 'rb') as f:
                files = {'audio': (path.name, f.read(), 'audio/mpeg')}
            
            data = self._prepare_request_data(**kwargs)
            
            response = requests.post(
                f"{self.base_url}/transcribe",
                headers=headers,
                files=files,
                data=data
            )
            
            return self._handle_response(response)
        
        def _transcribe_url(self, audio_url, **kwargs):
            """URL-based transcription"""
            headers = {
                "x-api-key": self.api_key,
                "Content-Type": "application/json"
            }
            
            data = {"audioUrl": audio_url}
            data.update(self._prepare_request_data(**kwargs))
            
            response = requests.post(
                f"{self.base_url}/transcribe",
                headers=headers,
                json=data
            )
            
            return self._handle_response(response)
        
        def _prepare_request_data(self, **kwargs):
            """Prepare request data with defaults"""
            data = {
                "model": kwargs.get("model", "Whisper-Large-V3"),
                "language": kwargs.get("language", "auto")
            }
            
            # Add optional parameters
            if kwargs.get("diarize"):
                data["diarize"] = "true" if isinstance(kwargs["diarize"], bool) else kwargs["diarize"]
            if kwargs.get("tagAudioEvents"):
                data["tagAudioEvents"] = "true" if isinstance(kwargs["tagAudioEvents"], bool) else kwargs["tagAudioEvents"]
            if kwargs.get("actualDuration"):
                data["actualDuration"] = str(kwargs["actualDuration"])
                
            return data
        
        def _handle_response(self, response):
            """Handle API response"""
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 202:
                return self._poll_async_job(response.json())
            else:
                try:
                    error_data = response.json()
                    raise Exception(f"API Error: {error_data.get('error', 'Unknown error')}")
                except json.JSONDecodeError:
                    raise Exception(f"HTTP Error: {response.status_code}")
        
        def _poll_async_job(self, job_data):
            """Poll for async job completion"""
            headers = {
                "x-api-key": self.api_key,
                "Content-Type": "application/json"
            }
            
            status_data = {
                "runId": job_data['runId'],
                "cost": job_data.get('cost'),
                "paymentSource": job_data.get('paymentSource'),
                "isApiRequest": True,
                "fileName": job_data.get('fileName'),
                "fileSize": job_data.get('fileSize'),
                "chargedDuration": job_data.get('chargedDuration'),
                "diarize": job_data.get('diarize', False)
            }
            
            max_attempts = 60
            for attempt in range(max_attempts):
                time.sleep(5)
                
                response = requests.post(
                    f"{self.base_url}/transcribe/status",
                    headers=headers,
                    json=status_data
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get('status') == 'completed':
                        return result
                    elif result.get('status') == 'failed':
                        raise Exception(f"Transcription failed: {result.get('error')}")
            
            raise Exception("Transcription timed out")
        
        def format_diarization(self, result):
            """Format transcription with speaker labels"""
            if 'diarization' in result and 'segments' in result['diarization']:
                segments = result['diarization']['segments']
                return '\n\n'.join([
                    f"{seg['speaker']}: {seg['text']}"
                    for seg in segments
                ])
            return result.get('transcription', '')
    
    # Usage examples
    transcriber = NanoGPTTranscriber("YOUR_API_KEY")
    
    # Simple transcription
    result = transcriber.transcribe(
        audio_path="meeting.mp3",
        model="Whisper-Large-V3",
        language="en"
    )
    print("Transcription:", result['transcription'])
    
    # Advanced with speaker diarization
    result = transcriber.transcribe(
        audio_url="https://example.com/conversation.mp3",
        model="Elevenlabs-STT",
        diarize=True,
        tagAudioEvents=True
    )
    
    print("Formatted conversation:")
    print(transcriber.format_diarization(result))
    

## 

[​](#error-handling-and-best-practices)

Error Handling and Best Practices

### 

[​](#common-error-responses)

Common Error Responses

Copy
    
    
    def handle_transcription_errors(func):
        """Decorator for handling common transcription errors"""
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 400:
                    print("Bad Request: Check file format or parameters")
                elif e.response.status_code == 401:
                    print("Unauthorized: Check your API key")
                elif e.response.status_code == 402:
                    print("Insufficient balance: Top up your account")
                elif e.response.status_code == 413:
                    print("File too large: Use URL upload for files >3MB")
                else:
                    print(f"HTTP Error {e.response.status_code}")
            except Exception as e:
                print(f"Error: {str(e)}")
                
        return wrapper
    
    @handle_transcription_errors
    def safe_transcribe(transcriber, **kwargs):
        return transcriber.transcribe(**kwargs)
    

### 

[​](#file-format-support)

File Format Support

Copy
    
    
    SUPPORTED_FORMATS = {
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav', 
        '.m4a': 'audio/mp4',
        '.ogg': 'audio/ogg',
        '.aac': 'audio/aac'
    }
    
    def validate_audio_file(file_path):
        """Validate audio file format and size"""
        path = Path(file_path)
        
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        if path.suffix.lower() not in SUPPORTED_FORMATS:
            raise ValueError(f"Unsupported format: {path.suffix}")
        
        size_mb = path.stat().st_size / (1024 * 1024)
        if size_mb > 3:
            print(f"Warning: File is {size_mb:.1f}MB. Consider using URL upload.")
        
        return True
    

## 

[​](#pricing-and-billing)

Pricing and Billing

  * **Whisper-Large-V3** : $0.01 per minute
  * **Wizper** : $0.01 per minute
  * **Elevenlabs-STT** : $0.03 per minute

Costs are calculated based on audio duration.

[Video Generation](/api-reference/video-generation)[Text-to-Speech (TTS)](/api-reference/text-to-speech)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
