# Embeddings - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/embeddings

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
  * [Available Models](#available-models)
  * [OpenAI Models](#openai-models)
  * [Alternative Models](#alternative-models)
  * [Request Parameters](#request-parameters)
  * [Response Format](#response-format)
  * [Code Examples](#code-examples)
  * [Python with OpenAI SDK](#python-with-openai-sdk)
  * [JavaScript/TypeScript](#javascript%2Ftypescript)
  * [cURL](#curl)
  * [Batch Processing](#batch-processing)
  * [Dimension Reduction](#dimension-reduction)
  * [Use Cases](#use-cases)
  * [Semantic Search](#semantic-search)
  * [RAG (Retrieval Augmented Generation)](#rag-retrieval-augmented-generation)
  * [Best Practices](#best-practices)
  * [Model Selection](#model-selection)
  * [Performance Optimization](#performance-optimization)
  * [Cost Optimization](#cost-optimization)
  * [Rate Limits](#rate-limits)
  * [Error Handling](#error-handling)



Endpoint Examples

# Embeddings

## 

[​](#overview)

Overview

Create embeddings for text using OpenAI-compatible and alternative embedding models. Our API provides access to 16 different embedding models at competitive prices, fully compatible with OpenAI’s embedding API.

## 

[​](#available-models)

Available Models

### 

[​](#openai-models)

OpenAI Models

  * `text-embedding-3-small` \- 1536 dimensions, $0.02/1M tokens - Most cost-effective with dimension reduction support
  * `text-embedding-3-large` \- 3072 dimensions, $0.13/1M tokens - Highest performance with dimension reduction support
  * `text-embedding-ada-002` \- 1536 dimensions, $0.10/1M tokens - Legacy model



### 

[​](#alternative-models)

Alternative Models

**Multilingual:**

  * `BAAI/bge-m3` \- 1024 dimensions, $0.01/1M tokens - Multilingual support
  * `jina-clip-v1` \- 768 dimensions, $0.04/1M tokens - Multimodal CLIP embeddings

**Language-Specific:**

  * `BAAI/bge-large-en-v1.5` \- 768 dimensions, $0.01/1M tokens - English optimized
  * `BAAI/bge-large-zh-v1.5` \- 1024 dimensions, $0.01/1M tokens - Chinese optimized
  * `jina-embeddings-v2-base-en` \- 768 dimensions, $0.05/1M tokens - English
  * `jina-embeddings-v2-base-de` \- 768 dimensions, $0.05/1M tokens - German
  * `jina-embeddings-v2-base-zh` \- 768 dimensions, $0.05/1M tokens - Chinese
  * `jina-embeddings-v2-base-es` \- 768 dimensions, $0.05/1M tokens - Spanish

**Specialized:**

  * `jina-embeddings-v2-base-code` \- 768 dimensions, $0.05/1M tokens - Code embeddings
  * `Baichuan-Text-Embedding` \- 1024 dimensions, $0.088/1M tokens
  * `netease-youdao/bce-embedding-base_v1` \- 1024 dimensions, $0.02/1M tokens
  * `zhipu-embedding-2` \- 1024 dimensions, $0.07/1M tokens
  * `Qwen/Qwen3-Embedding-0.6B` \- 1024 dimensions, $0.01/1M tokens - Supports dimension reduction



## 

[​](#request-parameters)

Request Parameters

Parameter| Type| Required| Description  
---|---|---|---  
`input`| string or array| Yes| Single text string or array of up to 2048 strings to embed  
`model`| string| Yes| ID of the embedding model to use  
`encoding_format`| string| No| Format for embeddings: `"float"` (default) or `"base64"`  
`dimensions`| integer| No| Reduce embedding dimensions (only for supported models)  
`user`| string| No| Optional identifier for tracking usage  
  
## 

[​](#response-format)

Response Format

Copy
    
    
    {
      "object": "list",
      "data": [
        {
          "object": "embedding",
          "index": 0,
          "embedding": [0.023, -0.012, 0.045, ...]
        }
      ],
      "model": "text-embedding-3-small",
      "usage": {
        "prompt_tokens": 8,
        "total_tokens": 8
      }
    }
    

## 

[​](#code-examples)

Code Examples

### 

[​](#python-with-openai-sdk)

Python with OpenAI SDK

Copy
    
    
    from openai import OpenAI
    
    # Initialize client pointing to NanoGPT
    client = OpenAI(
        api_key="YOUR_NANOGPT_API_KEY",
        base_url="https://nano-gpt.com/api/v1"
    )
    
    # Create embedding
    response = client.embeddings.create(
        input="Your text to embed",
        model="text-embedding-3-small"
    )
    
    # Access the embedding
    embedding = response.data[0].embedding
    print(f"Embedding dimensions: {len(embedding)}")
    

### 

[​](#javascript/typescript)

JavaScript/TypeScript

Copy
    
    
    import OpenAI from 'openai';
    
    // Initialize client pointing to NanoGPT
    const openai = new OpenAI({
        apiKey: 'YOUR_NANOGPT_API_KEY',
        baseURL: 'https://nano-gpt.com/api/v1'
    });
    
    // Create embedding
    const response = await openai.embeddings.create({
        input: "Your text to embed",
        model: "text-embedding-3-small"
    });
    
    // Access the embedding
    const embedding = response.data[0].embedding;
    console.log(`Embedding dimensions: ${embedding.length}`);
    

### 

[​](#curl)

cURL

Copy
    
    
    curl https://nano-gpt.com/api/v1/embeddings \
      -H "Authorization: Bearer YOUR_NANOGPT_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "input": "Your text to embed",
        "model": "text-embedding-3-small"
      }'
    

### 

[​](#batch-processing)

Batch Processing

Copy
    
    
    # Process multiple texts in a single request
    texts = [
        "First text to embed",
        "Second text to embed",
        "Third text to embed"
    ]
    
    response = client.embeddings.create(
        input=texts,  # Pass array of strings
        model="text-embedding-3-small"
    )
    
    # Access embeddings by index
    for i, data in enumerate(response.data):
        print(f"Text {i}: {len(data.embedding)} dimensions")
    

### 

[​](#dimension-reduction)

Dimension Reduction

For models that support it (text-embedding-3-small, text-embedding-3-large, Qwen/Qwen3-Embedding-0.6B):

Copy
    
    
    # Reduce dimensions to 256 for faster similarity comparisons
    response = client.embeddings.create(
        input="Your text to embed",
        model="text-embedding-3-small",
        dimensions=256  # Reduce from 1536 to 256
    )
    

## 

[​](#use-cases)

Use Cases

### 

[​](#semantic-search)

Semantic Search

Copy
    
    
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity
    
    # Create embeddings for your documents
    documents = ["Document 1 text", "Document 2 text", "Document 3 text"]
    doc_embeddings = []
    
    for doc in documents:
        response = client.embeddings.create(input=doc, model="text-embedding-3-small")
        doc_embeddings.append(response.data[0].embedding)
    
    # Create embedding for search query
    query = "Search query text"
    query_response = client.embeddings.create(input=query, model="text-embedding-3-small")
    query_embedding = query_response.data[0].embedding
    
    # Calculate similarities
    similarities = cosine_similarity([query_embedding], doc_embeddings)[0]
    
    # Find most similar documents
    top_matches = np.argsort(similarities)[::-1][:3]
    for idx in top_matches:
        print(f"Document {idx}: {similarities[idx]:.3f} similarity")
    

### 

[​](#rag-retrieval-augmented-generation)

RAG (Retrieval Augmented Generation)

Copy
    
    
    # 1. Embed and store your knowledge base
    knowledge_base = [
        {"text": "Fact 1...", "embedding": None},
        {"text": "Fact 2...", "embedding": None},
    ]
    
    for item in knowledge_base:
        response = client.embeddings.create(
            input=item["text"], 
            model="text-embedding-3-small"
        )
        item["embedding"] = response.data[0].embedding
    
    # 2. For a user query, find relevant context
    user_query = "What is...?"
    query_response = client.embeddings.create(
        input=user_query,
        model="text-embedding-3-small"
    )
    query_embedding = query_response.data[0].embedding
    
    # 3. Find most relevant facts
    # relevant_facts = find_similar_texts(query_embedding, knowledge_base, top_k=3)
    
    # 4. Use retrieved context with chat completion
    chat_response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"Context: {relevant_facts}"},
            {"role": "user", "content": user_query}
        ]
    )
    

## 

[​](#best-practices)

Best Practices

### 

[​](#model-selection)

Model Selection

  * **General English text** : Use `text-embedding-3-small` for best price/performance
  * **Maximum accuracy** : Use `text-embedding-3-large`
  * **Multilingual** : Use `BAAI/bge-m3` or language-specific Jina models
  * **Code** : Use `jina-embeddings-v2-base-code`
  * **Budget-conscious** : Use BAAI models at $0.01/1M tokens



### 

[​](#performance-optimization)

Performance Optimization

  * **Batch requests** : Send up to 2048 texts in a single request
  * **Use dimension reduction** : Reduce dimensions for faster similarity calculations when exact precision isn’t critical
  * **Cache embeddings** : Store computed embeddings to avoid re-processing identical texts
  * **Choose appropriate models** : Don’t use 3072-dimension models if 768 dimensions suffice



### 

[​](#cost-optimization)

Cost Optimization

  * **Monitor token usage** : Track the `usage` field in responses
  * **Use smaller models** : Start with `text-embedding-3-small` before upgrading
  * **Implement caching** : Avoid re-embedding identical content
  * **Batch processing** : Reduce API call overhead



## 

[​](#rate-limits)

Rate Limits

  * **Default** : 100 requests per second per IP address
  * **Internal requests** : No rate limiting (requires internal auth token)



## 

[​](#error-handling)

Error Handling

The API returns standard HTTP status codes and OpenAI-compatible error responses:

Copy
    
    
    {
      "error": {
        "message": "Invalid model specified",
        "type": "invalid_request_error",
        "param": "model",
        "code": null
      }
    }
    

Common error codes:

  * `401`: Invalid or missing API key
  * `400`: Invalid request parameters
  * `429`: Rate limit exceeded
  * `500`: Server error



[Completions](/api-reference/endpoint/completion)[Embedding Models](/api-reference/endpoint/embedding-models)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
