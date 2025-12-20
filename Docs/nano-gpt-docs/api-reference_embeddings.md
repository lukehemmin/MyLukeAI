# Embeddings - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/embeddings

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
  * [Quick Start](#quick-start)
  * [Available Models](#available-models)
  * [OpenAI Models](#openai-models)
  * [Alternative Models](#alternative-models)
  * [Multilingual Models](#multilingual-models)
  * [Language-Specific Models](#language-specific-models)
  * [Specialized Models](#specialized-models)
  * [API Endpoints](#api-endpoints)
  * [Create Embeddings](#create-embeddings)
  * [Discover Embedding Models](#discover-embedding-models)
  * [Advanced Features](#advanced-features)
  * [Batch Processing](#batch-processing)
  * [Dimension Reduction](#dimension-reduction)
  * [Base64 Encoding](#base64-encoding)
  * [Use Cases](#use-cases)
  * [Semantic Search](#semantic-search)
  * [RAG (Retrieval Augmented Generation)](#rag-retrieval-augmented-generation)
  * [Clustering & Classification](#clustering-%26-classification)
  * [Duplicate Detection](#duplicate-detection)
  * [Model Selection Guide](#model-selection-guide)
  * [By Use Case](#by-use-case)
  * [By Requirements](#by-requirements)
  * [Best Practices](#best-practices)
  * [Performance Optimization](#performance-optimization)
  * [Cost Optimization](#cost-optimization)
  * [Quality Optimization](#quality-optimization)
  * [Integration Examples](#integration-examples)
  * [JavaScript/TypeScript](#javascript%2Ftypescript)
  * [cURL](#curl)
  * [Direct API Usage](#direct-api-usage)
  * [Rate Limits & Error Handling](#rate-limits-%26-error-handling)
  * [Rate Limits](#rate-limits)
  * [Error Codes](#error-codes)
  * [Error Response Format](#error-response-format)
  * [Migration from OpenAI](#migration-from-openai)
  * [Pricing Summary](#pricing-summary)
  * [Additional Resources](#additional-resources)



API Reference

# Embeddings

Complete guide to text embeddings API

## 

[​](#overview)

Overview

NanoGPT provides a fully OpenAI-compatible embeddings API that offers access to both OpenAI’s industry-leading embedding models and a curated selection of alternative embedding models at competitive prices. Our API supports 16 different embedding models, providing options for various use cases, languages, and budget requirements.

## 

[​](#quick-start)

Quick Start

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
    
    embedding = response.data[0].embedding
    print(f"Embedding has {len(embedding)} dimensions")
    

## 

[​](#available-models)

Available Models

### 

[​](#openai-models)

OpenAI Models

Model| Dimensions| Max Tokens| Price/1M tokens| Features  
---|---|---|---|---  
`text-embedding-3-small`| 1536| 8191| $0.02| Dimension reduction support, most cost-effective  
`text-embedding-3-large`| 3072| 8191| $0.13| Dimension reduction support, highest performance  
`text-embedding-ada-002`| 1536| 8191| $0.10| Legacy model, no dimension reduction  
  
### 

[​](#alternative-models)

Alternative Models

#### 

[​](#multilingual-models)

Multilingual Models

Model| Dimensions| Price/1M tokens| Description  
---|---|---|---  
`BAAI/bge-m3`| 1024| $0.01| Excellent multilingual support  
`jina-clip-v1`| 768| $0.04| Multimodal CLIP embeddings  
  
#### 

[​](#language-specific-models)

Language-Specific Models

Model| Language| Dimensions| Price/1M tokens  
---|---|---|---  
`BAAI/bge-large-en-v1.5`| English| 768| $0.01  
`BAAI/bge-large-zh-v1.5`| Chinese| 1024| $0.01  
`jina-embeddings-v2-base-en`| English| 768| $0.05  
`jina-embeddings-v2-base-de`| German| 768| $0.05  
`jina-embeddings-v2-base-zh`| Chinese| 768| $0.05  
`jina-embeddings-v2-base-es`| Spanish| 768| $0.05  
  
#### 

[​](#specialized-models)

Specialized Models

Model| Use Case| Dimensions| Price/1M tokens  
---|---|---|---  
`jina-embeddings-v2-base-code`| Code| 768| $0.05  
`Baichuan-Text-Embedding`| General| 1024| $0.088  
`netease-youdao/bce-embedding-base_v1`| General| 1024| $0.02  
`zhipu-embedding-2`| Chinese| 1024| $0.07  
`Qwen/Qwen3-Embedding-0.6B`| General| 1024| $0.01  
  
## 

[​](#api-endpoints)

API Endpoints

### 

[​](#create-embeddings)

Create Embeddings

**Endpoint:** `POST https://nano-gpt.com/api/v1/embeddings` Create embeddings for one or more text inputs.

### 

[​](#discover-embedding-models)

Discover Embedding Models

**Endpoint:** `GET https://nano-gpt.com/api/v1/embedding-models` List all available embedding models with detailed information.

## 

[​](#advanced-features)

Advanced Features

### 

[​](#batch-processing)

Batch Processing

Process multiple texts efficiently in a single request:

Copy
    
    
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

Reduce embedding dimensions for faster similarity comparisons (supported models only):

Copy
    
    
    # Reduce dimensions to 256 for faster processing
    response = client.embeddings.create(
        input="Your text here",
        model="text-embedding-3-small",
        dimensions=256  # Reduce from 1536 to 256
    )
    

Supported models for dimension reduction:

  * `text-embedding-3-small`
  * `text-embedding-3-large`
  * `Qwen/Qwen3-Embedding-0.6B`



### 

[​](#base64-encoding)

Base64 Encoding

For more efficient data transfer, request base64-encoded embeddings:

Copy
    
    
    response = client.embeddings.create(
        input="Your text here",
        model="text-embedding-3-small",
        encoding_format="base64"  # Returns base64-encoded bytes
    )
    

## 

[​](#use-cases)

Use Cases

### 

[​](#semantic-search)

Semantic Search

Build powerful search systems that understand meaning:

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

Enhance LLM responses with relevant context:

Copy
    
    
    # 1. Embed and store your knowledge base
    knowledge_base = [
        {"text": "Company founded in 2020...", "embedding": None},
        {"text": "Product features include...", "embedding": None},
    ]
    
    for item in knowledge_base:
        response = client.embeddings.create(
            input=item["text"], 
            model="text-embedding-3-small"
        )
        item["embedding"] = response.data[0].embedding
    
    # 2. For a user query, find relevant context
    user_query = "When was the company founded?"
    query_response = client.embeddings.create(
        input=user_query,
        model="text-embedding-3-small"
    )
    query_embedding = query_response.data[0].embedding
    
    # 3. Find most relevant facts (implement similarity search)
    # relevant_facts = find_similar_texts(query_embedding, knowledge_base, top_k=3)
    
    # 4. Use retrieved context with chat completion
    chat_response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"Use this context to answer: {relevant_facts}"},
            {"role": "user", "content": user_query}
        ]
    )
    

### 

[​](#clustering-&-classification)

Clustering & Classification

Group similar texts or classify content:

Copy
    
    
    from sklearn.cluster import KMeans
    
    # Create embeddings for texts
    texts = ["Text 1", "Text 2", "Text 3", ...]
    embeddings = []
    
    for text in texts:
        response = client.embeddings.create(input=text, model="text-embedding-3-small")
        embeddings.append(response.data[0].embedding)
    
    # Cluster embeddings
    kmeans = KMeans(n_clusters=5)
    clusters = kmeans.fit_predict(embeddings)
    
    # Each text now has a cluster assignment
    for text, cluster_id in zip(texts, clusters):
        print(f"'{text}' belongs to cluster {cluster_id}")
    

### 

[​](#duplicate-detection)

Duplicate Detection

Find similar or duplicate content:

Copy
    
    
    def find_duplicates(texts, threshold=0.95):
        embeddings = []
        
        # Generate embeddings
        for text in texts:
            response = client.embeddings.create(
                input=text,
                model="text-embedding-3-small"
            )
            embeddings.append(response.data[0].embedding)
        
        # Calculate pairwise similarities
        similarities = cosine_similarity(embeddings)
        
        # Find duplicates
        duplicates = []
        for i in range(len(texts)):
            for j in range(i+1, len(texts)):
                if similarities[i][j] > threshold:
                    duplicates.append((i, j, similarities[i][j]))
        
        return duplicates
    

## 

[​](#model-selection-guide)

Model Selection Guide

### 

[​](#by-use-case)

By Use Case

Use Case| Recommended Model| Rationale  
---|---|---  
General English text| `text-embedding-3-small`| Best price/performance ratio  
Maximum accuracy| `text-embedding-3-large`| Highest quality embeddings  
Multilingual content| `BAAI/bge-m3`| Excellent cross-language performance  
Code embeddings| `jina-embeddings-v2-base-code`| Specialized for programming languages  
Budget-conscious| `BAAI/bge-large-en-v1.5`| Just $0.01/1M tokens  
Chinese content| `BAAI/bge-large-zh-v1.5`| Optimized for Chinese  
Fast similarity search| Models with dimension reduction| Can reduce dimensions for speed  
  
### 

[​](#by-requirements)

By Requirements

**Need fastest search?**

  * Use models supporting dimension reduction
  * Reduce to 256-512 dimensions
  * Trade small accuracy loss for 2-4x speed improvement

**Need highest accuracy?**

  * Use `text-embedding-3-large`
  * Keep full 3072 dimensions
  * Best for critical applications

**Processing many languages?**

  * Use `BAAI/bge-m3` for general multilingual
  * Use language-specific Jina models for best per-language performance

**Working with code?**

  * Use `jina-embeddings-v2-base-code`
  * Optimized for programming language semantics



## 

[​](#best-practices)

Best Practices

### 

[​](#performance-optimization)

Performance Optimization

  1. **Batch Requests** : Send up to 2048 texts in a single request
  2. **Use Dimension Reduction** : Reduce dimensions when exact precision isn’t critical
  3. **Cache Embeddings** : Store computed embeddings to avoid re-processing
  4. **Choose Appropriate Models** : Don’t use 3072-dimension models if 768 suffices



### 

[​](#cost-optimization)

Cost Optimization

  1. **Monitor Usage** : Track the `usage` field in responses
  2. **Start Small** : Begin with `text-embedding-3-small` before upgrading
  3. **Implement Caching** : Avoid re-embedding identical content
  4. **Batch Processing** : Reduce API call overhead



### 

[​](#quality-optimization)

Quality Optimization

  1. **Preprocess Text** : Clean and normalize text before embedding
  2. **Consider Context** : Include relevant context in the text to embed
  3. **Test Different Models** : Compare performance for your specific use case
  4. **Use Appropriate Similarity Metrics** : Cosine similarity for most cases



## 

[​](#integration-examples)

Integration Examples

### 

[​](#javascript/typescript)

JavaScript/TypeScript

Copy
    
    
    import OpenAI from 'openai';
    
    // Initialize client
    const openai = new OpenAI({
        apiKey: 'YOUR_NANOGPT_API_KEY',
        baseURL: 'https://nano-gpt.com/api/v1'
    });
    
    // Create embedding
    const response = await openai.embeddings.create({
        input: "Your text to embed",
        model: "text-embedding-3-small"
    });
    
    const embedding = response.data[0].embedding;
    console.log(`Embedding has ${embedding.length} dimensions`);
    

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

[​](#direct-api-usage)

Direct API Usage

Copy
    
    
    import requests
    import json
    
    headers = {
        "Authorization": "Bearer YOUR_NANOGPT_API_KEY",
        "Content-Type": "application/json"
    }
    
    data = {
        "input": "Your text to embed",
        "model": "text-embedding-3-small"
    }
    
    response = requests.post(
        "https://nano-gpt.com/api/v1/embeddings",
        headers=headers,
        json=data
    )
    
    result = response.json()
    embedding = result["data"][0]["embedding"]
    

## 

[​](#rate-limits-&-error-handling)

Rate Limits & Error Handling

### 

[​](#rate-limits)

Rate Limits

  * **Default** : 100 requests per second per IP address
  * **Internal requests** : No rate limiting (requires internal auth token)



### 

[​](#error-codes)

Error Codes

Code| Description| Solution  
---|---|---  
401| Invalid or missing API key| Check your API key  
400| Invalid request parameters| Verify model name and input format  
429| Rate limit exceeded| Implement exponential backoff  
500| Server error| Retry with exponential backoff  
  
### 

[​](#error-response-format)

Error Response Format

Copy
    
    
    {
      "error": {
        "message": "Invalid model specified",
        "type": "invalid_request_error",
        "param": "model",
        "code": null
      }
    }
    

## 

[​](#migration-from-openai)

Migration from OpenAI

Switching from OpenAI to NanoGPT is seamless:

Copy
    
    
    # OpenAI
    client = OpenAI(api_key="sk-...")
    
    # NanoGPT (just change base_url and api_key)
    client = OpenAI(
        api_key="YOUR_NANOGPT_API_KEY",
        base_url="https://nano-gpt.com/api/v1"
    )
    
    # All other code remains exactly the same!
    

## 

[​](#pricing-summary)

Pricing Summary

Price Range| Models| Best For  
---|---|---  
$0.01/1M| BAAI models, Qwen| Budget applications  
$0.02/1M| text-embedding-3-small, netease-youdao| Balanced performance  
$0.04-0.05/1M| Jina models| Specialized use cases  
$0.07-0.088/1M| zhipu, Baichuan| Specific requirements  
$0.10/1M| ada-002| Legacy compatibility  
$0.13/1M| text-embedding-3-large| Maximum performance  
  
## 

[​](#additional-resources)

Additional Resources

  * [Embeddings Endpoint Reference](/api-reference/endpoint/embeddings)
  * [Embedding Models List](/api-reference/endpoint/embedding-models)
  * [Text Generation Guide](/api-reference/text-generation)
  * [Quickstart Guide](/quickstart)



[Text Generation](/api-reference/text-generation)[Image Generation](/api-reference/image-generation)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
