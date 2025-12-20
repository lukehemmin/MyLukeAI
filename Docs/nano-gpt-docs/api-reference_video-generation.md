# Video Generation - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/video-generation

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
  * [API Authentication](#api-authentication)
  * [1\. API Key Authentication](#1-api-key-authentication)
  * [Making a Video Generation Request](#making-a-video-generation-request)
  * [Endpoint](#endpoint)
  * [Request Headers](#request-headers)
  * [Request Body](#request-body)
  * [Basic Text-to-Video Request](#basic-text-to-video-request)
  * [Image-to-Video Request](#image-to-video-request)
  * [Model-Specific Parameters](#model-specific-parameters)
  * [Veo Models](#veo-models)
  * [Kling Models](#kling-models)
  * [Hunyuan Models](#hunyuan-models)
  * [Wan Image-to-Video](#wan-image-to-video)
  * [Seedance Models](#seedance-models)
  * [Response Format](#response-format)
  * [Initial Response (202 Accepted)](#initial-response-202-accepted)
  * [Response Fields](#response-fields)
  * [Polling for Status](#polling-for-status)
  * [Status Endpoint](#status-endpoint)
  * [Polling Example](#polling-example)
  * [Status Response States](#status-response-states)
  * [In Progress](#in-progress)
  * [Completed](#completed)
  * [Failed](#failed)
  * [Status Values](#status-values)
  * [Complete Examples](#complete-examples)
  * [Example 1: Text-to-Video with cURL](#example-1%3A-text-to-video-with-curl)
  * [Example 2: Image-to-Video with cURL](#example-2%3A-image-to-video-with-curl)
  * [Base64 input](#base64-input)
  * [Public URL input](#public-url-input)
  * [Example 3: Image-to-Video with JavaScript](#example-3%3A-image-to-video-with-javascript)
  * [Using a public image URL directly](#using-a-public-image-url-directly)
  * [Example 4: Image-to-Video with Python](#example-4%3A-image-to-video-with-python)
  * [Example 5: Batch Processing](#example-5%3A-batch-processing)
  * [Error Handling](#error-handling)
  * [Common Error Responses](#common-error-responses)
  * [Insufficient Balance](#insufficient-balance)
  * [Invalid Session](#invalid-session)
  * [Rate Limit Exceeded](#rate-limit-exceeded)
  * [Content Policy Violation](#content-policy-violation)
  * [Model-Specific Errors](#model-specific-errors)
  * [Error Handling Best Practices](#error-handling-best-practices)
  * [Rate Limits](#rate-limits)
  * [Best Practices](#best-practices)



API Reference

# Video Generation

Complete guide to video generation APIs

## 

[​](#overview)

Overview

The NanoGPT API provides advanced video generation capabilities using state-of-the-art models. This guide covers how to use our video generation endpoints.

## 

[​](#api-authentication)

API Authentication

### 

[​](#1-api-key-authentication)

1\. API Key Authentication

Copy
    
    
    # Using x-api-key header
    curl -H "x-api-key: YOUR_API_KEY"
    
    # Using Bearer token
    curl -H "Authorization: Bearer YOUR_API_KEY"
    

## 

[​](#making-a-video-generation-request)

Making a Video Generation Request

### 

[​](#endpoint)

Endpoint

Copy
    
    
    POST /api/generate-video
    

### 

[​](#request-headers)

Request Headers

Copy
    
    
    Content-Type: application/json
    x-api-key: YOUR_API_KEY  # Optional, for API key auth
    

### 

[​](#request-body)

Request Body

#### 

[​](#basic-text-to-video-request)

Basic Text-to-Video Request

Copy
    
    
    {
      "model": "veo2-video",
      "prompt": "A majestic eagle soaring through mountain peaks at sunset",
      "duration": "5s",
      "aspect_ratio": "16:9"
    }
    

#### 

[​](#image-to-video-request)

Image-to-Video Request

Image-conditioned models accept either `imageDataUrl` (base64) or `imageUrl` (a public HTTPS link). The platform always uses the explicit field you send before falling back to any library attachments.

> Uploads sent via the API must be 4 MB or smaller. For larger assets, host them externally and provide an `imageUrl`.

##### Base64 input

Copy
    
    
    {
      "model": "kling-v21-standard",
      "prompt": "Make the person in the image wave hello",
      "imageDataUrl": "data:image/jpeg;base64,/9j/4AAQ...",
      "duration": "5",
      "aspect_ratio": "16:9"
    }
    

##### Public URL input

Copy
    
    
    {
      "model": "kling-v21-standard",
      "prompt": "Make the person in the image wave hello",
      "imageUrl": "https://assets.example.com/reference/wave-hello.jpg",
      "duration": "5",
      "aspect_ratio": "16:9"
    }
    

### 

[​](#model-specific-parameters)

Model-Specific Parameters

#### 

[​](#veo-models)

Veo Models

Copy
    
    
    {
      "model": "veo2-video",
      "prompt": "Your prompt",
      "duration": "5s",  // 5s-30s for Veo2, fixed 8s for Veo3
      "aspect_ratio": "16:9"  // 16:9, 9:16, 1:1, 4:3, 3:4
    }
    

#### 

[​](#kling-models)

Kling Models

Copy
    
    
    {
      "model": "kling-video-v2",
      "prompt": "Your prompt",
      "duration": "5",  // "5" or "10"
      "aspect_ratio": "16:9",
      "negative_prompt": "blur, distortion",  // Optional
      "cfg_scale": 0.5  // 0-1, default 0.5
    }
    

#### 

[​](#hunyuan-models)

Hunyuan Models

Copy
    
    
    {
      "model": "hunyuan-video",
      "prompt": "Your prompt",
      "pro_mode": false,  // true for higher quality (2x cost)
      "aspect_ratio": "16:9",
      "resolution": "720p",  // 480p, 720p, 1080p
      "num_frames": 129,  // 65, 97, 129
      "num_inference_steps": 20,  // 10-50
      "showExplicitContent": false  // Safety filter
    }
    

#### 

[​](#wan-image-to-video)

Wan Image-to-Video

> Accepts base64 via `imageDataUrl` or a public URL via `imageUrl`.

Copy
    
    
    {
      "model": "wan-video-image-to-video",
      "prompt": "Your prompt",
      "imageDataUrl": "data:image/...",
      "num_frames": 81,  // 81-100
      "frames_per_second": 16,  // 5-24
      "resolution": "720p",  // 480p or 720p
      "num_inference_steps": 30,  // 1-40
      "negative_prompt": "blur, distortion",
      "seed": 42  // Optional
    }
    

#### 

[​](#seedance-models)

Seedance Models

> Accepts base64 via `imageDataUrl` or a public URL via `imageUrl`. Ensure URLs are directly fetchable by the provider.

Copy
    
    
    {
      "model": "seedance-video",
      "prompt": "Your prompt",
      "resolution": "1080p",  // 480p or 1080p (standard), 480p or 720p (lite)
      "duration": "5",  // "5" or "10"
      "aspect_ratio": "16:9",  // T2V only
      "camera_fixed": false,  // Static camera
      "seed": 42  // Optional
    }
    

## 

[​](#response-format)

Response Format

### 

[​](#initial-response-202-accepted)

Initial Response (202 Accepted)

Copy
    
    
    {
      "runId": "fal-request-abc123xyz",
      "status": "pending",
      "model": "veo2-video",
      "cost": 2.5,
      "paymentSource": "USD",
      "remainingBalance": 47.5
    }
    

### 

[​](#response-fields)

Response Fields

  * `runId`: Unique identifier for polling status
  * `status`: Always “pending” for initial response
  * `model`: The model used for generation
  * `cost`: Cost in USD or XNO
  * `paymentSource`: “USD” or “XNO”
  * `remainingBalance`: Account balance after deduction



## 

[​](#polling-for-status)

Polling for Status

After receiving a `runId`, poll the status endpoint until completion.

### 

[​](#status-endpoint)

Status Endpoint

Copy
    
    
    GET /api/generate-video/status?runId={runId}&modelSlug={model}
    

### 

[​](#polling-example)

Polling Example

Copy
    
    
    async function pollVideoStatus(runId, model) {
      const maxAttempts = 120; // ~10 minutes total
      const delayMs = 5000; // 5 seconds (max ~10 minutes)
    
      for (let i = 0; i < maxAttempts; i++) {
        const response = await fetch(
          `/api/generate-video/status?runId=${runId}&modelSlug=${model}`
        );
        const result = await response.json();
    
        if (result.data.status === 'COMPLETED') {
          return result.data.output.video.url;
        } else if (result.data.status === 'FAILED') {
          throw new Error(result.data.error || 'Video generation failed');
        }
    
        // Wait before next poll
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    
      throw new Error('Video generation timed out');
    }
    

### 

[​](#status-response-states)

Status Response States

#### 

[​](#in-progress)

In Progress

Copy
    
    
    {
      "data": {
        "status": "IN_PROGRESS",
        "request_id": "fal-request-abc123xyz",
        "details": "Video is being generated"
      }
    }
    

#### 

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
    

#### 

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

[​](#status-values)

Status Values

  * `IN_QUEUE`: Request is queued
  * `IN_PROGRESS`: Video is being generated
  * `COMPLETED`: Video ready for download
  * `FAILED`: Generation failed
  * `CANCELLED`: Request was cancelled



## 

[​](#complete-examples)

Complete Examples

The submit + poll flow works the same regardless of how you supply the image: image-conditioned models accept either `imageDataUrl` (base64) or a public `imageUrl`, and the platform prefers whichever field you send before checking library attachments.

### 

[​](#example-1:-text-to-video-with-curl)

Example 1: Text-to-Video with cURL

Copy
    
    
    # 1) Submit
    RUN_ID=$(curl -s -X POST https://nano-gpt.com/api/generate-video \
      -H "x-api-key: YOUR_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "veo2-video",
        "prompt": "A beautiful sunset over the ocean with waves",
        "duration": "5s",
        "aspect_ratio": "16:9"
      }' | jq -r '.runId')
    
    echo "Run ID: $RUN_ID"
    
    # 2) Poll status (max ~10 minutes)
    for i in {1..120}; do
      RESP=$(curl -s "https://nano-gpt.com/api/generate-video/status?runId=$RUN_ID&modelSlug=veo2-video" \
        -H "x-api-key: YOUR_API_KEY")
      STATUS=$(echo "$RESP" | jq -r '.data.status // empty')
      echo "Attempt $i: status=$STATUS"
      if [ "$STATUS" = "COMPLETED" ]; then
        echo "Completed response:"
        echo "$RESP" | jq .
        VIDEO_URL=$(echo "$RESP" | jq -r '.data.output.video.url')
        echo "Video URL: $VIDEO_URL"
        break
      fi
      sleep 5
    done
    
    # Download when ready
    # curl -L "$VIDEO_URL" -o output.mp4
    

### 

[​](#example-2:-image-to-video-with-curl)

Example 2: Image-to-Video with cURL

#### 

[​](#base64-input)

Base64 input

Copy
    
    
    RUN_ID=$(curl -s -X POST https://nano-gpt.com/api/generate-video \
      -H "x-api-key: YOUR_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "kling-v21-pro",
        "prompt": "Animate this scene with a slow dolly zoom",
        "imageDataUrl": "data:image/jpeg;base64,/9j/4AAQ...",
        "duration": "5",
        "aspect_ratio": "16:9"
      }' | jq -r '.runId')
    

#### 

[​](#public-url-input)

Public URL input

Copy
    
    
    RUN_ID=$(curl -s -X POST https://nano-gpt.com/api/generate-video \
      -H "x-api-key: YOUR_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "kling-v21-pro",
        "prompt": "Animate this scene with a slow dolly zoom",
        "imageUrl": "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=1024",
        "duration": "5",
        "aspect_ratio": "16:9"
      }' | jq -r '.runId')
    

Use the same polling loop from Example 1 to monitor either request.

### 

[​](#example-3:-image-to-video-with-javascript)

Example 3: Image-to-Video with JavaScript

Copy
    
    
    // 1. Convert image to base64
    async function imageToBase64(imageFile) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
    }
    
    // 2. Submit video generation
    async function generateVideo(imageFile) {
      const imageDataUrl = await imageToBase64(imageFile);
      
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'YOUR_API_KEY'
        },
        body: JSON.stringify({
          model: 'kling-v21-pro',
          prompt: 'Add gentle camera movement to this scene',
          imageDataUrl: imageDataUrl,
          duration: '5',
          aspect_ratio: '16:9'
        })
      });
      
      const result = await response.json();
      console.log('Video generation started:', result.runId);
      
      // 3. Poll for completion
      const videoUrl = await pollVideoStatus(result.runId, result.model);
      console.log('Video ready:', videoUrl);
      
      return videoUrl;
    }
    

#### 

[​](#using-a-public-image-url-directly)

Using a public image URL directly

Copy
    
    
    async function generateVideoFromUrl(imageUrl) {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'YOUR_API_KEY'
        },
        body: JSON.stringify({
          model: 'kling-v21-pro',
          prompt: 'Add gentle camera movement to this scene',
          imageUrl,
          duration: '5',
          aspect_ratio: '16:9'
        })
      });
    
      const result = await response.json();
      const videoUrl = await pollVideoStatus(result.runId, result.model);
      return videoUrl;
    }
    

### 

[​](#example-4:-image-to-video-with-python)

Example 4: Image-to-Video with Python

Copy
    
    
    import base64
    import json
    import requests
    
    API_URL = "https://nano-gpt.com/api/generate-video"
    API_KEY = "YOUR_API_KEY"
    
    def submit_image_to_video(image_path: str) -> str:
        with open(image_path, "rb") as image_file:
            encoded = base64.b64encode(image_file.read()).decode("utf-8")
    
        payload = {
            "model": "kling-v21-pro",
            "prompt": "Animate this scene with a slow dolly zoom",
            "imageDataUrl": f"data:image/jpeg;base64,{encoded}",
            "duration": "5",
            "aspect_ratio": "16:9",
        }
        response = requests.post(
            API_URL,
            headers={
                "x-api-key": API_KEY,
                "Content-Type": "application/json",
            },
            data=json.dumps(payload),
            timeout=60,
        )
        response.raise_for_status()
        return response.json()["runId"]
    

Copy
    
    
    def submit_image_url(image_url: str) -> str:
        payload = {
            "model": "kling-v21-pro",
            "prompt": "Animate this scene with a slow dolly zoom",
            "imageUrl": image_url,
            "duration": "5",
            "aspect_ratio": "16:9",
        }
        response = requests.post(
            API_URL,
            headers={
                "x-api-key": API_KEY,
                "Content-Type": "application/json",
            },
            data=json.dumps(payload),
            timeout=60,
        )
        response.raise_for_status()
        return response.json()["runId"]
    

Reuse the polling helper from the JavaScript example (or your own status loop) to watch these run IDs until completion.

### 

[​](#example-5:-batch-processing)

Example 5: Batch Processing

Copy
    
    
    async function generateMultipleVideos(prompts) {
      // Submit all requests
      const requests = await Promise.all(
        prompts.map(async (prompt) => {
          const response = await fetch('/api/generate-video', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'YOUR_API_KEY'
            },
            body: JSON.stringify({
              model: 'seedance-lite-video',
              prompt: prompt,
              duration: '5',
              resolution: '720p'
            })
          });
          return response.json();
        })
      );
      
      // Poll all statuses concurrently
      const videos = await Promise.all(
        requests.map(({ runId, model }) => 
          pollVideoStatus(runId, model)
        )
      );
      
      return videos;
    }
    

## 

[​](#error-handling)

Error Handling

### 

[​](#common-error-responses)

Common Error Responses

#### 

[​](#insufficient-balance)

Insufficient Balance

Copy
    
    
    {
      "error": "Insufficient balance",
      "status": 402
    }
    

#### 

[​](#invalid-session)

Invalid Session

Copy
    
    
    {
      "error": "Invalid session",
      "status": 401
    }
    

#### 

[​](#rate-limit-exceeded)

Rate Limit Exceeded

Copy
    
    
    {
      "error": "Rate limit exceeded. Please wait before generating another video.",
      "status": 429
    }
    

#### 

[​](#content-policy-violation)

Content Policy Violation

Copy
    
    
    {
      "error": {
        "message": "Your prompt was blocked due to safety concerns. Please modify your prompt.",
        "type": "CONTENT_POLICY_VIOLATION"
      },
      "status": 400
    }
    

#### 

[​](#model-specific-errors)

Model-Specific Errors

Copy
    
    
    {
      "error": "Kling 2.1 Standard requires an input image. Please select an image to generate a video.",
      "status": 400
    }
    

### 

[​](#error-handling-best-practices)

Error Handling Best Practices

Copy
    
    
    async function generateVideoWithErrorHandling(params) {
      try {
        // Submit request
        const response = await fetch('/api/generate-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'YOUR_API_KEY'
          },
          body: JSON.stringify(params)
        });
        
        if (!response.ok) {
          const error = await response.json();
          
          // Handle specific error types
          if (response.status === 429) {
            console.error('Rate limited, retry after delay');
            // Implement exponential backoff
          } else if (response.status === 402) {
            console.error('Insufficient balance');
            // Prompt user to add credits
          } else if (error.error?.type === 'CONTENT_POLICY_VIOLATION') {
            console.error('Content policy violation');
            // Show user-friendly message
          }
          
          throw new Error(error.error?.message || error.error);
        }
        
        const result = await response.json();
        
        // Poll for status with timeout
        const videoUrl = await pollVideoStatus(result.runId, result.model);
        return videoUrl;
        
      } catch (error) {
        console.error('Video generation failed:', error);
        throw error;
      }
    }
    

## 

[​](#rate-limits)

Rate Limits

  * **Default** : 50 requests per minute per IP address
  * **API Key** : Same as default
  * **Internal Auth** : No rate limit

Rate limits apply to the submission endpoint (`/api/generate-video`). Status polling endpoints have no rate limits.

## 

[​](#best-practices)

Best Practices

  1. **Choose the Right Model**
     * Use text-to-video for creative generation
     * Use image-to-video for animating existing content
     * Consider cost vs quality tradeoffs
  2. **Optimize Prompts**
     * Be specific and descriptive
     * Include motion and camera directions
     * Avoid content policy violations
  3. **Handle Async Operations**
     * Implement proper polling with delays
     * Set reasonable timeouts (5-10 minutes)
     * Show progress to users
  4. **Error Recovery**
     * Implement retry logic for transient failures
     * Handle rate limits with exponential backoff
     * Provide clear error messages to users
  5. **Cost Management**
     * Check balance before submitting
     * Estimate costs before generation
     * Use shorter durations for testing



[Image Generation](/api-reference/image-generation)[Speech-to-Text (STT)](/api-reference/speech-to-text)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
