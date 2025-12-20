# LibreChat - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/integrations/librechat

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

  * [Using LibreChat with NanoGPT](#using-librechat-with-nanogpt)
  * [Setup Instructions](#setup-instructions)
  * [Available Models](#available-models)



Integrations

# LibreChat

Using NanoGPT with LibreChat for a ChatGPT-like interface

# 

[​](#using-librechat-with-nanogpt)

Using LibreChat with NanoGPT

A quick guide to setting up LibreChat with NanoGPT’s API.

## 

[​](#setup-instructions)

Setup Instructions

  1. Get your API key from [nano-gpt.com/api](https://nano-gpt.com/api)
  2. Locate your LibreChat installation’s `librechat.example.yml` file
  3. Create a copy named `librechat.yml`
  4. Add the following configuration to your `librechat.yml`:



Copy
    
    
    # NanoGPT Example
    - name: 'NanoGPT'
      apiKey: '${NANO_GPT_API_KEY}'
      baseURL: 'https://nano-gpt.com/api/v1/'
      models:
          default: [
            "chatgpt-4o-latest",
            "gpt-4o-mini",
            ]
          fetch: true
      addParams:
        reasoning_content_compat: true
      titleConvo: true
      titleModel: 'gpt-4o-mini'
      modelDisplayLabel: 'NanoGPT'
      iconUrl: https://nano-gpt.com/logo.png
    

LibreChat currently streams internal thinking from the legacy `reasoning_content` field. The `addParams` block above enables NanoGPT’s compatibility shim so LibreChat can render thoughts without additional changes. If you would rather not send the compatibility flag, you can instead point LibreChat at `https://nano-gpt.com/api/v1legacy/` which keeps the legacy response shape by default.

  5. Set your API key in your environment variables:

Copy
         
         export NANO_GPT_API_KEY='your-api-key-here'
         


That’s it! Restart LibreChat, and you’ll have access to all NanoGPT models through the interface.

## 

[​](#available-models)

Available Models

You can access all our models through this integration, including:

  * ChatGPT
  * Claude 3.7 Sonnet
  * Gemini 2.0 Pro
  * Perplexity
  * And many more!

For a complete list of available models and their pricing, visit our [pricing page](https://nano-gpt.com/pricing).

[TypingMind](/integrations/typingmind)[OpenHands](/integrations/openhands)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
