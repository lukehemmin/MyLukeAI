# Introduction - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/introduction

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
  * [Chat Completion example](#chat-completion-example)
  * [Quick Start](#quick-start)
  * [Documentation Sections](#documentation-sections)
  * [What’s New](#what%E2%80%99s-new)



Get Started

# Introduction

Welcome to the Nano-GPT.com API

## 

[​](#overview)

Overview

The NanoGPT API allows you to generate text, images and video using any AI model available. Our implementation for text generation generally matches the OpenAI standards. We also support verifiably private TEE (Trusted Execution Environment) models, allowing for confidential computations.

All examples in this documentation also work on our alternative domains. Just replace the base URL `https://nano-gpt.com` with your preferred domain: [ai.bitcoin.com](https://ai.bitcoin.com), [bcashgpt.com](https://bcashgpt.com), or [cake.nano-gpt.com](https://cake.nano-gpt.com). Only the base URL changes; endpoints and request formats remain the same.

## 

[​](#chat-completion-example)

Chat Completion example

Here’s a simple python example using our OpenAI-compatible chat completions endpoint:

Copy
    
    
    import requests
    import json
    
    BASE_URL = "https://nano-gpt.com/api/v1"
    API_KEY = "YOUR_API_KEY"  # Replace with your API key
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "Accept": "text/event-stream"  # Required for SSE streaming
    }
    
    def stream_chat_completion(messages, model="chatgpt-4o-latest"):
        """
        Send a streaming chat completion request using the OpenAI-compatible endpoint.
        """
        data = {
            "model": model,
            "messages": messages,
            "stream": True  # Enable streaming
        }
    
        response = requests.post(
            f"{BASE_URL}/chat/completions",
            headers=headers,
            json=data,
            stream=True
        )
    
        if response.status_code != 200:
            raise Exception(f"Error: {response.status_code}")
    
        for line in response.iter_lines():
            if line:
                line = line.decode('utf-8')
                if line.startswith('data: '):
                    line = line[6:]
                if line == '[DONE]':
                    break
                try:
                    chunk = json.loads(line)
                    if chunk['choices'][0]['delta'].get('content'):
                        yield chunk['choices'][0]['delta']['content']
                except json.JSONDecodeError:
                    continue
    
    # Example usage
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Please explain the concept of artificial intelligence."}
    ]
    
    try:
        print("Assistant's Response:")
        for content_chunk in stream_chat_completion(messages):
            print(content_chunk, end='', flush=True)
        print("")
    except Exception as e:
        print(f"Error: {str(e)}")
    

## 

[​](#quick-start)

Quick Start

The quickest way to get started with our API is to explore our [Endpoint Examples](/api-reference/endpoint/chat-completion). Each endpoint page provides comprehensive documentation with request/response formats and example code. The [Chat Completion](/api-reference/endpoint/chat-completion) endpoint is a great starting point for text generation.

## 

[​](#documentation-sections)

Documentation Sections

For detailed documentation on each feature, please refer to the following sections:

  * [Text Generation](/api-reference/text-generation) \- Complete guide to text generation APIs including OpenAI-compatible endpoints and legacy options
  * [Image Generation](/api-reference/image-generation) \- Learn how to generate images using various models like Recraft, Flux, and Stable Diffusion.
  * [Video Generation](/api-reference/video-generation) \- Create high-quality videos with our video generation API
  * [TEE Model Verification](/api-reference/tee-verification) \- Verify attestation and signatures for TEE-backed models.



## 

[​](#what’s-new)

What’s New

  * Wavespeed video models now accept direct `imageUrl` inputs, so you can reference publicly hosted images without converting them to base64 first.



[Quickstart](/quickstart)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
