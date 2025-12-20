# Talk to GPT (Legacy) - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/talk-to-gpt

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
  * [Web Search](#web-search)
  * [Example with Web Search](#example-with-web-search)
  * [Important Notes](#important-notes)



Endpoint Examples

# Talk to GPT (Legacy)

## 

[​](#overview)

Overview

The Talk to GPT endpoint is our legacy text generation API that also supports web search capabilities through LinkUp integration.

## 

[​](#web-search)

Web Search

Enable web search by appending suffixes to the model name:

  * **`:online`** \- Standard web search ($0.006 per request)
  * **`:online/linkup-deep`** \- Deep web search ($0.06 per request)



### 

[​](#example-with-web-search)

Example with Web Search

Python

JavaScript

cURL

Copy
    
    
    import requests
    import json
    
    BASE_URL = "https://nano-gpt.com/api"
    API_KEY = "YOUR_API_KEY"
    
    headers = {
        "x-api-key": API_KEY,
        "Content-Type": "application/json"
    }
    
    # Standard web search
    data = {
        "prompt": "What are the latest AI breakthroughs this month?",
        "model": "chatgpt-4o-latest:online",
        "messages": []
    }
    
    response = requests.post(
        f"{BASE_URL}/talk-to-gpt",
        headers=headers,
        json=data
    )
    
    # Deep web search for comprehensive research
    data_deep = {
        "prompt": "Provide a detailed analysis of recent quantum computing advances",
        "model": "chatgpt-4o-latest:online/linkup-deep",
        "messages": []
    }
    
    response_deep = requests.post(
        f"{BASE_URL}/talk-to-gpt",
        headers=headers,
        json=data_deep
    )
    
    # Parse response
    if response.status_code == 200:
        parts = response.text.split('<NanoGPT>')
        text_response = parts[0].strip()
        nano_info = json.loads(parts[1].split('</NanoGPT>')[0])
        
        print("Response:", text_response)
        print("Cost:", nano_info['cost'])
    

## 

[​](#important-notes)

Important Notes

  * Web search works with all models - simply append the suffix
  * Increases input token count which affects total cost
  * Provides access to real-time information
  * For new projects, consider using the OpenAI-compatible `/v1/chat/completions` endpoint instead



[Video Status](/api-reference/endpoint/video-status)[Check Balance](/api-reference/endpoint/check-balance)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
