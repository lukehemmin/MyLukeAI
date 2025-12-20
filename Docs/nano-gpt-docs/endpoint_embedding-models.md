# Embedding Models - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/embedding-models

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
  * [Response Format](#response-format)
  * [Field Descriptions](#field-descriptions)
  * [Pricing Object Structure](#pricing-object-structure)
  * [Model Categories](#model-categories)
  * [OpenAI Models](#openai-models)
  * [Multilingual Models](#multilingual-models)
  * [Language-Specific Models](#language-specific-models)
  * [Specialized Models](#specialized-models)
  * [Usage Examples](#usage-examples)
  * [Basic Request](#basic-request)
  * [With Authentication](#with-authentication)
  * [Python Example](#python-example)
  * [JavaScript Example](#javascript-example)
  * [Model Selection Guide](#model-selection-guide)



Endpoint Examples

# Embedding Models

## 

[​](#overview)

Overview

The `/api/v1/embedding-models` endpoint provides a comprehensive list of available embedding models with detailed information including dimensions, pricing, and features. This endpoint returns all embedding models in OpenAI-compatible format.

## 

[​](#authentication)

Authentication

Authentication is optional but may enable user-specific features:

Header| Format| Required| Description  
---|---|---|---  
`Authorization`| `Bearer {api_key}`| Optional| API key for authenticated access  
`x-api-key`| `{api_key}`| Optional| Alternative API key header  
  
## 

[​](#response-format)

Response Format

Returns a list of all available embedding models with comprehensive details:

Copy
    
    
    {
      "object": "list",
      "data": [
        {
          "id": "text-embedding-3-small",
          "object": "model",
          "created": 1754480583,
          "owned_by": "openai",
          "name": "Text Embedding 3 Small",
          "description": "Most cost-effective OpenAI embedding model with dimension reduction support",
          "dimensions": 1536,
          "supports_dimensions": true,
          "max_tokens": 8191,
          "pricing": {
            "per_million_tokens": 0.02,
            "currency": "USD"
          }
        },
        {
          "id": "text-embedding-3-large",
          "object": "model",
          "created": 1754480583,
          "owned_by": "openai",
          "name": "Text Embedding 3 Large",
          "description": "Highest performance OpenAI embedding model with dimension reduction support",
          "dimensions": 3072,
          "supports_dimensions": true,
          "max_tokens": 8191,
          "pricing": {
            "per_million_tokens": 0.13,
            "currency": "USD"
          }
        },
        {
          "id": "BAAI/bge-m3",
          "object": "model",
          "created": 1754480583,
          "owned_by": "baai",
          "name": "BGE M3",
          "description": "Multilingual embedding model with excellent performance across languages",
          "dimensions": 1024,
          "supports_dimensions": false,
          "max_tokens": 8192,
          "pricing": {
            "per_million_tokens": 0.01,
            "currency": "USD"
          }
        }
        // ... more models
      ]
    }
    

## 

[​](#field-descriptions)

Field Descriptions

Field| Type| Description  
---|---|---  
`id`| string| Unique model identifier to use in embedding requests  
`object`| string| Always “model” for OpenAI compatibility  
`created`| number| Unix timestamp of response creation  
`owned_by`| string| Model provider (openai, baai, jina, etc.)  
`name`| string| Human-readable model name  
`description`| string| Detailed model description and use cases  
`dimensions`| number| Default embedding vector dimensions  
`supports_dimensions`| boolean| Whether model supports dimension reduction  
`max_tokens`| number| Maximum input tokens supported  
`pricing`| object| Pricing information object  
  
### 

[​](#pricing-object-structure)

Pricing Object Structure

Field| Type| Description  
---|---|---  
`per_million_tokens`| number| Cost per million tokens in USD  
`currency`| string| Always “USD”  
  
## 

[​](#model-categories)

Model Categories

### 

[​](#openai-models)

OpenAI Models

High-quality embeddings with dimension reduction support:

  * `text-embedding-3-small` \- Balance of cost and performance
  * `text-embedding-3-large` \- Maximum accuracy
  * `text-embedding-ada-002` \- Legacy model



### 

[​](#multilingual-models)

Multilingual Models

Support for multiple languages:

  * `BAAI/bge-m3` \- Excellent multilingual support
  * `jina-clip-v1` \- Multimodal CLIP embeddings



### 

[​](#language-specific-models)

Language-Specific Models

Optimized for specific languages:

  * English: `BAAI/bge-large-en-v1.5`, `jina-embeddings-v2-base-en`
  * Chinese: `BAAI/bge-large-zh-v1.5`, `jina-embeddings-v2-base-zh`, `zhipu-embedding-2`
  * German: `jina-embeddings-v2-base-de`
  * Spanish: `jina-embeddings-v2-base-es`



### 

[​](#specialized-models)

Specialized Models

Domain-specific embeddings:

  * `jina-embeddings-v2-base-code` \- Optimized for code
  * `Baichuan-Text-Embedding` \- General purpose
  * `Qwen/Qwen3-Embedding-0.6B` \- Efficient with dimension reduction



## 

[​](#usage-examples)

Usage Examples

### 

[​](#basic-request)

Basic Request

Copy
    
    
    curl "https://nano-gpt.com/api/v1/embedding-models"
    

### 

[​](#with-authentication)

With Authentication

Copy
    
    
    curl "https://nano-gpt.com/api/v1/embedding-models" \
      -H "Authorization: Bearer your_api_key_here"
    

### 

[​](#python-example)

Python Example

Copy
    
    
    import requests
    
    # Discover available embedding models
    response = requests.get("https://nano-gpt.com/api/v1/embedding-models")
    models = response.json()
    
    # Display models sorted by price
    for model in sorted(models["data"], key=lambda x: x["pricing"]["per_million_tokens"]):
        print(f"{model['id']}: ${model['pricing']['per_million_tokens']}/1M tokens - {model['dimensions']} dims")
    

### 

[​](#javascript-example)

JavaScript Example

Copy
    
    
    // Discover available embedding models
    const response = await fetch("https://nano-gpt.com/api/v1/embedding-models");
    const models = await response.json();
    
    // Find models that support dimension reduction
    const flexibleModels = models.data.filter(m => m.supports_dimensions);
    console.log("Models with dimension reduction:", flexibleModels.map(m => m.id));
    

## 

[​](#model-selection-guide)

Model Selection Guide

Use Case| Recommended Models| Rationale  
---|---|---  
General English text| `text-embedding-3-small`| Best price/performance ratio  
Maximum accuracy| `text-embedding-3-large`| Highest quality embeddings  
Multilingual content| `BAAI/bge-m3`| Excellent cross-language performance  
Code embeddings| `jina-embeddings-v2-base-code`| Specialized for programming languages  
Budget-conscious| `BAAI/bge-large-en-v1.5`| $0.01/1M tokens  
Chinese content| `BAAI/bge-large-zh-v1.5`| Optimized for Chinese  
Fast similarity search| Models with `supports_dimensions: true`| Can reduce dimensions for speed  
  
[Embeddings](/api-reference/endpoint/embeddings)[Image Generation (OpenAI-Compatible)](/api-reference/endpoint/image-generation-openai)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
