# TypeScript Library - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/miscellaneous/typescript

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

  * [NanoGPT-client](#nanogpt-client)
  * [Overview](#overview)
  * [Installation](#installation)
  * [Basic Usage](#basic-usage)
  * [Features](#features)
  * [API Methods](#api-methods)
  * [Chat Completions](#chat-completions)
  * [Text Completions](#text-completions)
  * [Image Generation](#image-generation)
  * [Video Generation](#video-generation)
  * [Check Balance](#check-balance)
  * [Advanced Configuration](#advanced-configuration)
  * [Development](#development)
  * [Resources](#resources)



Miscellaneous

# TypeScript Library

TypeScript client for NanoGPT API

# 

[​](#nanogpt-client)

NanoGPT-client

[NanoGPT-client](https://github.com/aspic/nanogpt-client) is an unofficial TypeScript implementation of the NanoGPT API. This library aims to provide a type-safe client for both browser and Node.js environments.

## 

[​](#overview)

Overview

NanoGPT-client is built on the inferred OpenAPI spec, providing a strongly-typed interface to interact with the NanoGPT API. This makes it easier to integrate NanoGPT’s capabilities into your TypeScript applications with full type checking and IntelliSense support.

## 

[​](#installation)

Installation

Install the package via npm:

Copy
    
    
    npm install nanogpt-client
    

Or using yarn:

Copy
    
    
    yarn add nanogpt-client
    

## 

[​](#basic-usage)

Basic Usage

Copy
    
    
    import { NanoGPTClient } from 'nanogpt-client';
    
    // Initialize with your API key
    const client = new NanoGPTClient({
      apiKey: 'your-api-key'
    });
    
    async function main() {
      try {
        const response = await client.chatCompletions.create({
          model: 'chatgpt-4o-latest',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'Explain TypeScript interfaces.' }
          ]
        });
        
        console.log(response.choices[0].message.content);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
    main();
    

## 

[​](#features)

Features

  * **Type Safety** : Full TypeScript type definitions for all API endpoints and parameters
  * **Cross-Platform** : Works in both browser and Node.js environments
  * **Modern Architecture** : Built with modern TypeScript practices
  * **Comprehensive Coverage** : Supports all NanoGPT API endpoints



## 

[​](#api-methods)

API Methods

### 

[​](#chat-completions)

Chat Completions

Copy
    
    
    const completion = await client.chatCompletions.create({
      model: 'chatgpt-4o-latest',
      messages: [
        { role: 'user', content: 'Hello, world!' }
      ],
      temperature: 0.7,
      max_tokens: 150
    });
    

### 

[​](#text-completions)

Text Completions

Copy
    
    
    const completion = await client.completions.create({
      model: 'chatgpt-4o-latest',
      prompt: 'Write a poem about TypeScript',
      max_tokens: 100
    });
    

### 

[​](#image-generation)

Image Generation

Copy
    
    
    const image = await client.images.generate({
      prompt: 'A cat programming in TypeScript',
      model: 'recraft-v3',
      n: 1,
      size: '1024x1024'
    });
    

### 

[​](#video-generation)

Video Generation

Copy
    
    
    const video = await client.videos.create({
      prompt: 'A short animation of code being written',
      framework: 'emotional_story',
      targetLengthInWords: 70
    });
    

### 

[​](#check-balance)

Check Balance

Copy
    
    
    const balance = await client.balance.check();
    console.log('Current balance:', balance);
    

## 

[​](#advanced-configuration)

Advanced Configuration

Copy
    
    
    const client = new NanoGPTClient({
      apiKey: 'your-api-key',
      baseUrl: 'https://custom-domain.com/api', // Optional custom API URL
      timeout: 30000, // Request timeout in ms
      headers: {
        'Custom-Header': 'value'
      }
    });
    

## 

[​](#development)

Development

The library is open-source and welcomes contributions. To contribute:

  1. Fork the [repository](https://github.com/aspic/nanogpt-client)
  2. Clone your fork
  3. Install dependencies (`npm install` or `yarn`)
  4. Make your changes
  5. Submit a pull request



## 

[​](#resources)

Resources

  * [GitHub Repository](https://github.com/aspic/nanogpt-client)
  * [NanoGPT API Documentation](https://docs.nano-gpt.com)
  * [Get your API Key](https://nano-gpt.com/api)



[Context Memory](/api-reference/miscellaneous/context-memory)[Cline](/integrations/cline)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
