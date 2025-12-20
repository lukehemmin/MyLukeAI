# JavaScript Library - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/miscellaneous/javascript

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

  * [NanoGPTJS](#nanogptjs)
  * [Overview](#overview)
  * [Installation](#installation)
  * [Basic Usage](#basic-usage)
  * [Features](#features)
  * [API Methods](#api-methods)
  * [Chat](#chat)
  * [Generate Image](#generate-image)
  * [Check Balance](#check-balance)
  * [Error Handling](#error-handling)
  * [Resources](#resources)



Miscellaneous

# JavaScript Library

Node.js library for interacting with NanoGPT API

# 

[​](#nanogptjs)

NanoGPTJS

[NanoGPTJS](https://github.com/kilkelly/nanogptjs) is a Node.js library designed to interact with NanoGPT’s API. This library provides an easy way to integrate NanoGPT’s capabilities into your JavaScript applications.

## 

[​](#overview)

Overview

The NanoGPT service enables pay-per-prompt interaction with chat and image generation models. You will need a prefilled NanoGPT wallet and API key to use this library effectively.

## 

[​](#installation)

Installation

You can install the library using npm:

Copy
    
    
    npm install nanogptjs
    

## 

[​](#basic-usage)

Basic Usage

Copy
    
    
    const NanoGPT = require('nanogptjs');
    
    // Initialize with your API key
    const nanogpt = new NanoGPT('your-api-key');
    
    async function chatExample() {
      try {
        const response = await nanogpt.chat({
          model: 'chatgpt-4o-latest',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'What is the capital of France?' }
          ]
        });
        
        console.log(response);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
    chatExample();
    

## 

[​](#features)

Features

  * **Chat Completions** : Generate text responses using various AI models
  * **Image Generation** : Create images from text prompts
  * **Model Selection** : Choose from a wide range of available models
  * **Balance Management** : Check your NanoGPT balance and manage transactions



## 

[​](#api-methods)

API Methods

### 

[​](#chat)

Chat

Copy
    
    
    const response = await nanogpt.chat({
      model: 'chatgpt-4o-latest',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, how are you?' }
      ],
      temperature: 0.7,
      max_tokens: 150
    });
    

### 

[​](#generate-image)

Generate Image

Copy
    
    
    const response = await nanogpt.generateImage({
      prompt: 'A beautiful sunset over the ocean',
      model: 'recraft-v3',
      width: 1024,
      height: 1024
    });
    

### 

[​](#check-balance)

Check Balance

Copy
    
    
    const balance = await nanogpt.checkBalance();
    console.log('USD Balance:', balance.usd_balance);
    console.log('Nano Balance:', balance.nano_balance);
    

## 

[​](#error-handling)

Error Handling

The library provides robust error handling to manage API response errors:

Copy
    
    
    try {
      const response = await nanogpt.chat({
        model: 'chatgpt-4o-latest',
        messages: [
          { role: 'user', content: 'Hello!' }
        ]
      });
    } catch (error) {
      console.error('Status:', error.status);
      console.error('Message:', error.message);
    }
    

## 

[​](#resources)

Resources

  * [GitHub Repository](https://github.com/kilkelly/nanogptjs)
  * [NanoGPT API Documentation](https://docs.nano-gpt.com)
  * [Get your API Key](https://nano-gpt.com/api)



[Chrome Extension](/api-reference/miscellaneous/chrome-extension)[Context Memory](/api-reference/miscellaneous/context-memory)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
