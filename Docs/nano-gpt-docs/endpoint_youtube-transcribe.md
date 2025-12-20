# YouTube Transcription - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/youtube-transcribe

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
  * [Authentication](#authentication)
  * [1\. API Key Authentication (Recommended)](#1-api-key-authentication-recommended)
  * [2\. Session Authentication](#2-session-authentication)
  * [Request Format](#request-format)
  * [Headers](#headers)
  * [Body](#body)
  * [Parameters](#parameters)
  * [Supported YouTube URL Formats](#supported-youtube-url-formats)
  * [Response Format](#response-format)
  * [Success Response (200 OK)](#success-response-200-ok)
  * [Response Fields](#response-fields)
  * [transcripts Array](#transcripts-array)
  * [summary Object](#summary-object)
  * [Error Responses](#error-responses)
  * [400 Bad Request](#400-bad-request)
  * [401 Unauthorized](#401-unauthorized)
  * [402 Payment Required](#402-payment-required)
  * [429 Too Many Requests](#429-too-many-requests)
  * [Pricing](#pricing)
  * [Rate Limits](#rate-limits)
  * [Code Examples](#code-examples)
  * [Best Practices](#best-practices)
  * [Limitations](#limitations)
  * [Use Cases](#use-cases)
  * [Support](#support)



Endpoint Examples

# YouTube Transcription

## 

[​](#overview)

Overview

The YouTube Transcription API allows you to extract transcripts from YouTube videos programmatically. This is useful for content analysis, accessibility, research, or any application that needs to work with YouTube video content in text format.

## 

[​](#authentication)

Authentication

The API supports two authentication methods:

### 

[​](#1-api-key-authentication-recommended)

1\. API Key Authentication (Recommended)

Include your API key in the request headers:

Copy
    
    
    x-api-key: YOUR_API_KEY
    

### 

[​](#2-session-authentication)

2\. Session Authentication

If you’re making requests from a browser with an active session, authentication will be handled automatically via cookies.

## 

[​](#request-format)

Request Format

### 

[​](#headers)

Headers

Copy
    
    
    {
      "Content-Type": "application/json",
      "x-api-key": "YOUR_API_KEY"
    }
    

### 

[​](#body)

Body

Copy
    
    
    {
      "urls": [
        "https://www.youtube.com/watch?v=VIDEO_ID_1",
        "https://youtu.be/VIDEO_ID_2",
        "https://youtube.com/watch?v=VIDEO_ID_3"
      ]
    }
    

### 

[​](#parameters)

Parameters

Parameter| Type| Required| Description  
---|---|---|---  
`urls`| string[]| Yes| Array of YouTube URLs to transcribe. Maximum 10 URLs per request.  
  
### 

[​](#supported-youtube-url-formats)

Supported YouTube URL Formats

  * `https://www.youtube.com/watch?v=VIDEO_ID`
  * `https://youtu.be/VIDEO_ID`
  * `https://youtube.com/embed/VIDEO_ID`
  * `https://m.youtube.com/watch?v=VIDEO_ID`
  * `https://youtube.com/live/VIDEO_ID`



## 

[​](#response-format)

Response Format

### 

[​](#success-response-200-ok)

Success Response (200 OK)

Copy
    
    
    {
      "transcripts": [
        {
          "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          "success": true,
          "title": "Rick Astley - Never Gonna Give You Up",
          "transcript": "We're no strangers to love\nYou know the rules and so do I..."
        },
        {
          "url": "https://youtube.com/watch?v=invalid",
          "success": false,
          "error": "Video not found or transcripts not available"
        }
      ],
      "summary": {
        "requested": 2,
        "processed": 2,
        "successful": 1,
        "failed": 1,
        "totalCost": 0.01
      }
    }
    

### 

[​](#response-fields)

Response Fields

#### 

[​](#transcripts-array)

`transcripts` Array

Each transcript object contains:

  * `url` (string): The original YouTube URL
  * `success` (boolean): Whether the transcript was successfully retrieved
  * `title` (string, optional): Video title (only if successful)
  * `transcript` (string, optional): The full transcript text (only if successful)
  * `error` (string, optional): Error message (only if failed)



#### 

[​](#summary-object)

`summary` Object

  * `requested`: Number of URLs provided in the request
  * `processed`: Number of valid YouTube URLs found and processed
  * `successful`: Number of transcripts successfully retrieved
  * `failed`: Number of transcripts that failed
  * `totalCost`: Total cost in USD for successful transcripts



### 

[​](#error-responses)

Error Responses

#### 

[​](#400-bad-request)

400 Bad Request

Copy
    
    
    {
      "error": "Please provide an array of YouTube URLs"
    }
    

#### 

[​](#401-unauthorized)

401 Unauthorized

Copy
    
    
    {
      "error": "Invalid session"
    }
    

#### 

[​](#402-payment-required)

402 Payment Required

Copy
    
    
    {
      "error": "Insufficient balance. Current balance: $0.50, required: $1.00"
    }
    

#### 

[​](#429-too-many-requests)

429 Too Many Requests

Copy
    
    
    {
      "error": "Rate limit exceeded. Please wait before sending another request."
    }
    

## 

[​](#pricing)

Pricing

  * **Cost** : $0.01 USD per successful transcript
  * **Billing** : You are only charged for successfully retrieved transcripts
  * **Failed transcripts** : No charge



## 

[​](#rate-limits)

Rate Limits

  * **10 requests per minute** per IP address
  * **10 URLs maximum** per request



## 

[​](#code-examples)

Code Examples

JavaScript/Node.js

Python

cURL

PHP

Copy
    
    
    const axios = require('axios');
    
    async function getYouTubeTranscripts() {
      try {
        const response = await axios.post('https://nano-gpt.com/api/youtube-transcribe', {
          urls: [
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'https://youtu.be/kJQP7kiw5Fk'
          ]
        }, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'YOUR_API_KEY'
          }
        });
    
        console.log('Transcripts:', response.data.transcripts);
        console.log('Summary:', response.data.summary);
      } catch (error) {
        console.error('Error:', error.response?.data || error.message);
      }
    }
    

## 

[​](#best-practices)

Best Practices

  1. **Batch Requests** : Send multiple URLs in a single request (up to 10) rather than making individual requests for better efficiency.
  2. **Error Handling** : Always check the `success` field for each transcript, as some videos may not have transcripts available.
  3. **Rate Limiting** : Implement exponential backoff if you receive a 429 status code.
  4. **URL Validation** : The API automatically detects and validates YouTube URLs, but validating on your end can save API calls.
  5. **Cost Monitoring** : Use the `summary.totalCost` field to track your spending.



## 

[​](#limitations)

Limitations

  1. **Transcript Availability** : Not all YouTube videos have transcripts available. Videos may lack transcripts if:
     * The creator hasn’t enabled auto-captions
     * The video is private or age-restricted
     * The video has been deleted
     * The video is a live stream without captions
  2. **Language** : Transcripts are returned in their original language. The API doesn’t provide translation services.
  3. **Formatting** : Transcripts are returned as plain text with natural line breaks. Timestamp information is not included.



## 

[​](#use-cases)

Use Cases

  * **Content Analysis** : Analyze video content for keywords, topics, or sentiment
  * **Accessibility** : Create accessible versions of video content
  * **Research** : Study communication patterns, language use, or content trends
  * **SEO** : Extract content for search engine optimization
  * **Education** : Create study materials from educational videos
  * **Content Moderation** : Check video content for compliance



## 

[​](#support)

Support

For technical support or questions about the YouTube Transcription API:

  * Email: [[email protected]](/cdn-cgi/l/email-protection#493a3c3939263b3d0927282726642e393d672a2624)
  * Documentation: <https://docs.nano-gpt.com>
  * Status Page: <https://status.nano-gpt.com>



[Speech-to-Text Status](/api-reference/endpoint/transcribe-status)[Context Memory (Standalone)](/api-reference/endpoint/memory)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
