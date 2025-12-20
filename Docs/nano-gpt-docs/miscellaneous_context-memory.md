# Context Memory - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/miscellaneous/context-memory

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
  * [The Problem](#the-problem)
  * [How It Works](#how-it-works)
  * [Benefits](#benefits)
  * [Use Cases](#use-cases)
  * [Using Context Memory](#using-context-memory)
  * [Retention and Caching](#retention-and-caching)
  * [Technical Details](#technical-details)
  * [Privacy & Partnership](#privacy-%26-partnership)
  * [Pricing](#pricing)
  * [Getting Started](#getting-started)



Miscellaneous

# Context Memory

Lossless, hierarchical episodic memory for unlimited AI conversations

## 

[​](#overview)

Overview

Large Language Models are limited by their context window. As conversations grow, models forget details, degrade in quality, or hit hard limits. **Context Memory** solves this with lossless, hierarchical compression of your entire conversation history, enabling unlimited-length coding sessions and conversations while preserving full awareness.

## 

[​](#the-problem)

The Problem

Traditional memory solutions are semantic and store general facts. They miss episodic memory: recalling specific events at the right level of detail. Simple summarization drops critical details, while RAG surfaces isolated chunks without surrounding context. Without proper episodic memory:

  * Important details get lost during summarization
  * Conversations are cut short when context limits are reached
  * Agents lose track of previous work



## 

[​](#how-it-works)

How It Works

Context Memory builds a tree where upper levels contain summaries and lower levels preserve verbatim detail. Relevant sections are expanded while others remain compressed:

  * High-level summaries provide overall context
  * Mid-level sections explain relationships
  * Verbatim details are retrieved precisely when needed

Example from a coding session:

Copy
    
    
    Token estimation function refactoring
    ├── Initial user request
    ├── Refactoring to support integer inputs
    ├── Error: "exceeds the character limit"
    │   └── Fixed by changing test params from strings to integers
    └── Variable name refactoring
    

Ask, “What errors did we encounter?” and the relevant section expands automatically—no overload, no missing context.

## 

[​](#benefits)

Benefits

  * **For Developers** : Long coding sessions without losing context; agents learn from past mistakes; documentation retains project-wide context
  * **For Conversations** : Extended discussions with continuity; research that compounds; complex problem-solving with full history



## 

[​](#use-cases)

Use Cases

  * **Role‑playing and Storytelling** : Preserve 500k+ tokens of story history while delivering 8k–20k tokens of perfectly relevant context
  * **Software Development** : Summaries keep the big picture; verbatim code snippets are restored only when needed—no overload, no omissions



## 

[​](#using-context-memory)

Using Context Memory

You can enable Context Memory in the `POST /v1/chat/completions` endpoint in two ways:

  * **Model suffix** : Append `:memory` to any model name
  * **Header** : Add `memory: true`
  * **Combine** : Use with web search via `:online:memory`



Python

JavaScript

cURL

Copy
    
    
    import requests
    
    BASE_URL = "https://nano-gpt.com/api/v1"
    API_KEY = "YOUR_API_KEY"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Use the :memory suffix
    payload = {
        "model": "chatgpt-4o-latest:memory",
        "messages": [
            {"role": "user", "content": "Remember our plan and continue from step 3."}
        ]
    }
    
    r = requests.post(f"{BASE_URL}/chat/completions", headers=headers, json=payload)
    print(r.json())
    

## 

[​](#retention-and-caching)

Retention and Caching

  * **Default retention** : 30 days.
  * **Configure via model suffix** : `:memory-<days>` where `<days>` is 1..365
    * Example: `gpt-4o:memory-90`
  * **Configure via header** : `memory_expiration_days: <days>` (1..365)
    * Example:

Copy
          
          curl -X POST https://nano-gpt.com/api/v1/chat/completions \
            -H "Authorization: Bearer YOUR_API_KEY" \
            -H "Content-Type: application/json" \
            -H "memory: true" \
            -H "memory_expiration_days: 45" \
            -d '{
              "model": "gpt-4o",
              "messages": [{"role": "user", "content": "Hello"}]
            }'
          

  * **Precedence** : If both suffix and header are provided, the header value takes precedence for retention.
  * **Data lifecycle** : The compressed chat state is retained server‑side for the configured period (or until you delete the conversation). When you delete conversations locally, no memory data persists on Polychat’s systems.
  * **Caching** : There is currently no caching of compressed memory messages; compression runs per request. This simplifies correctness and privacy. Caching strategies may be introduced later.



## 

[​](#technical-details)

Technical Details

Context Memory is implemented as a B‑tree with lossless compression over message histories. Upper nodes store summaries; leaves retain verbatim excerpts relevant to recent turns. Retrieval returns details contextualized by their summaries—unlike RAG which returns isolated chunks. Using messages as identifiers supports:

  * Natural conversation branching
  * Easy reversion to earlier states
  * No complex indexing

Compression targets 8k–20k tokens of output—about 10% of Claude’s context window—while preserving access to full history.

## 

[​](#privacy-&-partnership)

Privacy & Partnership

We partner with **Polychat** to provide this technology.

  * API usage of Context Memory does not send data to Google Analytics or use cookies
  * Only your conversation messages are sent to Polychat for compression
  * No email, IP address, or other metadata is shared beyond prompts
  * When you delete conversations locally, no memory data persists on Polychat’s systems

See Polychat’s full privacy policy at <https://polychat.co/legal/privacy>.

## 

[​](#pricing)

Pricing

  * **Input Processing** : $5.00 per million tokens
  * **Output Generation** : $10.00 per million tokens
  * **Typical Usage** : 8k–20k tokens per session



## 

[​](#getting-started)

Getting Started

  1. Append `:memory` to any model name
  2. Or send the `memory: true` header
  3. Optionally combine with other features like `:online`

Context Memory ensures your AI remembers everything that matters—for coding, research, and long‑form conversations.

[JavaScript Library](/api-reference/miscellaneous/javascript)[TypeScript Library](/api-reference/miscellaneous/typescript)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
