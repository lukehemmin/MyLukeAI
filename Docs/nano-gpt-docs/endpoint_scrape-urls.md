# Web Scraping - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/scrape-urls

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
  * [2\. Bearer Token Authentication](#2-bearer-token-authentication)
  * [Request Format](#request-format)
  * [Headers](#headers)
  * [Request Body](#request-body)
  * [Parameters](#parameters)
  * [Stealth scraping (optional)](#stealth-scraping-optional)
  * [URL Requirements](#url-requirements)
  * [Response Format](#response-format)
  * [Success Response (200 OK)](#success-response-200-ok)
  * [Response Fields](#response-fields)
  * [results](#results)
  * [summary](#summary)
  * [Error Responses](#error-responses)
  * [400 Bad Request](#400-bad-request)
  * [401 Unauthorized](#401-unauthorized)
  * [402 Payment Required](#402-payment-required)
  * [429 Too Many Requests](#429-too-many-requests)
  * [500 Internal Server Error](#500-internal-server-error)
  * [Pricing](#pricing)
  * [Rate Limits](#rate-limits)
  * [Code Examples](#code-examples)
  * [Best Practices](#best-practices)
  * [Limitations](#limitations)
  * [FAQ](#faq)



Endpoint Examples

# Web Scraping

## 

[​](#overview)

Overview

The NanoGPT Web Scraping API allows you to extract clean, formatted content from web pages. It uses the Firecrawl service to scrape URLs and returns both raw HTML content and formatted markdown.

## 

[​](#authentication)

Authentication

The API supports two authentication methods:

### 

[​](#1-api-key-authentication-recommended)

1\. API Key Authentication (Recommended)

Include your API key in the request header:

Copy
    
    
    x-api-key: YOUR_API_KEY
    

### 

[​](#2-bearer-token-authentication)

2\. Bearer Token Authentication

Copy
    
    
    Authorization: Bearer YOUR_API_KEY
    

## 

[​](#request-format)

Request Format

### 

[​](#headers)

Headers

Copy
    
    
    Content-Type: application/json
    x-api-key: YOUR_API_KEY
    

### 

[​](#request-body)

Request Body

Copy
    
    
    {
      "urls": [
        "https://example.com/article",
        "https://blog.com/post",
        "https://news.site.com/story"
      ],
      "stealthMode": false
    }
    

### 

[​](#parameters)

Parameters

Parameter| Type| Required| Description  
---|---|---|---  
urls| string[]| Yes| Array of URLs to scrape. Maximum 5 URLs per request.  
stealthMode| boolean| No| Optional. Default `false`. When `true`, multiplies the upfront per-URL charge by 5 and routes requests through the stealth proxy.  
  
#### 

[​](#stealth-scraping-optional)

Stealth scraping (optional)

Set `stealthMode: true` to run requests through Firecrawl’s stealth proxy for tougher targets. Stealth scraping costs 5× the standard per-URL rate and still counts toward the configured URL cap. The web UI exposes the same toggle, so use this field to mirror that behavior from the API.

Copy
    
    
    POST /api/scrape-urls
    {
      "urls": ["https://example.com/restricted"],
      "stealthMode": true
    }
    

The response `summary` includes `stealthModeUsed` so you can track when the surcharge applied.

### 

[​](#url-requirements)

URL Requirements

  * Must be valid HTTP or HTTPS URLs
  * Must have standard web ports (80, 443, or default)
  * Cannot be localhost, private IPs, or metadata endpoints
  * YouTube URLs are not supported (use the YouTube transcription endpoint instead)



## 

[​](#response-format)

Response Format

### 

[​](#success-response-200-ok)

Success Response (200 OK)

Copy
    
    
    {
      "results": [
        {
          "url": "https://example.com/article",
          "success": true,
          "title": "Article Title",
          "content": "Raw HTML content...",
          "markdown": "# Article Title\n\nFormatted markdown content..."
        },
        {
          "url": "https://invalid.site.com",
          "success": false,
          "error": "Failed to scrape URL"
        }
      ],
      "summary": {
        "requested": 3,
        "processed": 3,
        "successful": 2,
        "failed": 1,
        "totalCost": 0.002,
        "stealthModeUsed": false
      }
    }
    

### 

[​](#response-fields)

Response Fields

#### 

[​](#results)

results

Array of scraping results for each URL:

  * `url` (string): The URL that was scraped
  * `success` (boolean): Whether the scraping was successful
  * `title` (string, optional): Page title if successfully scraped
  * `content` (string, optional): Raw HTML content
  * `markdown` (string, optional): Formatted markdown version of the content
  * `error` (string, optional): Error message if scraping failed



#### 

[​](#summary)

summary

Summary statistics for the request:

  * `requested` (number): Number of URLs in the original request
  * `processed` (number): Number of valid URLs that were processed
  * `successful` (number): Number of URLs successfully scraped
  * `failed` (number): Number of URLs that failed to scrape
  * `totalCost` (number): Total cost in USD (only for successful scrapes)
  * `stealthModeUsed` (boolean): Indicates whether stealth mode was enabled for any processed URLs



## 

[​](#error-responses)

Error Responses

### 

[​](#400-bad-request)

400 Bad Request

Copy
    
    
    {
      "error": "Please provide an array of URLs to scrape"
    }
    

### 

[​](#401-unauthorized)

401 Unauthorized

Copy
    
    
    {
      "error": "Invalid session"
    }
    

### 

[​](#402-payment-required)

402 Payment Required

Copy
    
    
    {
      "error": "Insufficient balance"
    }
    

### 

[​](#429-too-many-requests)

429 Too Many Requests

Copy
    
    
    {
      "error": "Rate limit exceeded. Please wait before sending another request."
    }
    

### 

[​](#500-internal-server-error)

500 Internal Server Error

Copy
    
    
    {
      "error": "An error occurred while processing your request"
    }
    

## 

[​](#pricing)

Pricing

  * **Cost** : $0.001 per successfully scraped URL
  * **Billing** : You are only charged for URLs that are successfully scraped
  * **Payment Methods** : USD balance or Nano (XNO) cryptocurrency



## 

[​](#rate-limits)

Rate Limits

  * **Default** : 30 requests per minute per IP address
  * **With API Key** : 30 requests per minute per API key



## 

[​](#code-examples)

Code Examples

cURL

Python

JavaScript/TypeScript

Copy
    
    
    curl -X POST https://nano-gpt.com/api/scrape-urls \
      -H "Content-Type: application/json" \
      -H "x-api-key: YOUR_API_KEY" \
      -d '{
        "urls": [
          "https://example.com/article",
          "https://blog.com/post"
        ]
      }'
    

## 

[​](#best-practices)

Best Practices

  1. **Batch Requests** : Send multiple URLs in a single request (up to 5) to minimize API calls
  2. **Error Handling** : Always check the `success` field for each result before accessing content
  3. **Content Size** : Scraped content is limited to 100KB per URL
  4. **URL Validation** : Validate URLs on your end before sending to reduce failed requests
  5. **Markdown Format** : Use the markdown field for better readability and formatting



## 

[​](#limitations)

Limitations

  * Maximum 5 URLs per request
  * Maximum content size: 100KB per URL
  * No JavaScript rendering (static content only)



## 

[​](#faq)

FAQ

**Q: Why was my URL rejected?** A: URLs can be rejected for several reasons:

  * Invalid format (not HTTP/HTTPS)
  * Pointing to localhost or private IPs
  * Using non-standard ports
  * Being a YouTube URL (use the YouTube transcription endpoint)

**Q: Can I scrape JavaScript-heavy sites?** A: The scraper fetches static HTML content. Sites that rely heavily on JavaScript may not return complete content. **Q: What happens if a URL fails to scrape?** A: You are not charged for failed URLs. The response will include an error message for that specific URL. **Q: Is there a sandbox/test environment?** A: You can test with your regular API key. Since you’re only charged for successful scrapes, failed attempts during testing won’t cost anything.

[Context Memory (Standalone)](/api-reference/endpoint/memory)[Web Search](/api-reference/endpoint/web-search)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
