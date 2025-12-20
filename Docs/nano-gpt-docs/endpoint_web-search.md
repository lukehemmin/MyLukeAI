# Web Search - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/web-search

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



Web Search

cURL

Copy
    
    
    curl --request POST \
      --url https://nano-gpt.com/api/web \
      --header 'Content-Type: application/json' \
      --header 'x-api-key: <x-api-key>' \
      --data '
    {
      "query": "<string>",
      "depth": "<string>",
      "outputType": "<string>",
      "structuredOutputSchema": "<string>",
      "includeImages": true,
      "fromDate": "<string>",
      "toDate": "<string>",
      "excludeDomains": [
        "<string>"
      ],
      "includeDomains": [
        "<string>"
      ]
    }
    '

400 Bad Request

401 Unauthorized

402 Payment Required

429 Too Many Requests

500 Internal Server Error

Copy
    
    
    {
      "error": "Query parameter is required and must be a string"
    }
    

Endpoint Examples

# Web Search

Perform AI-powered web searches using Linkup with multiple output formats

POST

https://nano-gpt.com

/

api

/

web

Try it

Web Search

cURL

Copy
    
    
    curl --request POST \
      --url https://nano-gpt.com/api/web \
      --header 'Content-Type: application/json' \
      --header 'x-api-key: <x-api-key>' \
      --data '
    {
      "query": "<string>",
      "depth": "<string>",
      "outputType": "<string>",
      "structuredOutputSchema": "<string>",
      "includeImages": true,
      "fromDate": "<string>",
      "toDate": "<string>",
      "excludeDomains": [
        "<string>"
      ],
      "includeDomains": [
        "<string>"
      ]
    }
    '

400 Bad Request

401 Unauthorized

402 Payment Required

429 Too Many Requests

500 Internal Server Error

Copy
    
    
    {
      "error": "Query parameter is required and must be a string"
    }
    

## 

[​](#overview)

Overview

The Web Search API allows you to perform AI-powered web searches using Linkup, returning up-to-date information from across the internet. This API supports multiple output formats, date filtering, domain filtering, and two search depth options.

## 

[​](#authentication)

Authentication

[​](#param-x-api-key)

x-api-key

string

required

Your NanoGPT API key

Alternatively, you can use Bearer token authentication:

[​](#param-authorization)

Authorization

string

Bearer YOUR_API_KEY

## 

[​](#request-body)

Request Body

[​](#param-query)

query

string

required

The search query to send to Linkup

[​](#param-depth)

depth

string

default:"standard"

Search depth. Options: “standard” or “deep”

  * **standard** : $0.006 per search
  * **deep** : $0.06 per search



[​](#param-output-type)

outputType

string

default:"searchResults"

Output format. Options: “searchResults”, “sourcedAnswer”, or “structured”

[​](#param-structured-output-schema)

structuredOutputSchema

string

Required when outputType is “structured”. JSON schema string defining the desired response format

[​](#param-include-images)

includeImages

boolean

default:false

Whether to include image results in the search

[​](#param-from-date)

fromDate

string

Filter results from this date (YYYY-MM-DD format)

[​](#param-to-date)

toDate

string

Filter results until this date (YYYY-MM-DD format)

[​](#param-exclude-domains)

excludeDomains

string[]

Array of domains to exclude from search results

[​](#param-include-domains)

includeDomains

string[]

Array of domains to search exclusively

## 

[​](#response)

Response

[​](#param-data)

data

object|array

Search results, answer, or structured data depending on outputType

[​](#param-metadata)

metadata

object

Show metadata

[​](#param-query-1)

query

string

The search query that was executed

[​](#param-depth-1)

depth

string

The search depth used (“standard” or “deep”)

[​](#param-output-type-1)

outputType

string

The output format used

[​](#param-timestamp)

timestamp

string

ISO 8601 timestamp of when the search was performed

[​](#param-cost)

cost

number

The cost of the search in USD

## 

[​](#output-formats)

Output Formats

### 

[​](#search-results-default)

Search Results (default)

Returns an array of search results with text and image entries:

Copy
    
    
    {
      "data": [
        {
          "type": "text",
          "title": "Article Title",
          "url": "https://example.com/article",
          "content": "Article content snippet..."
        },
        {
          "type": "image",
          "title": "Image Title",
          "url": "https://example.com/image.jpg",
          "imageUrl": "https://example.com/image.jpg"
        }
      ],
      "metadata": {
        "query": "your search query",
        "depth": "standard",
        "outputType": "searchResults",
        "timestamp": "2025-07-08T09:00:00.000Z",
        "cost": 0.006
      }
    }
    

### 

[​](#sourced-answer)

Sourced Answer

Returns a comprehensive answer with source citations:

Copy
    
    
    {
      "data": {
        "answer": "The comprehensive answer to your query...",
        "sources": [
          {
            "name": "Source Name",
            "url": "https://example.com",
            "snippet": "Relevant snippet from the source..."
          }
        ]
      },
      "metadata": {
        "query": "your search query",
        "depth": "standard",
        "outputType": "sourcedAnswer",
        "timestamp": "2025-07-08T09:00:00.000Z",
        "cost": 0.006
      }
    }
    

### 

[​](#structured-output)

Structured Output

Returns data matching your provided JSON schema:

Copy
    
    
    {
      "data": {
        // Your structured data according to the schema
      },
      "metadata": {
        "query": "your search query",
        "depth": "standard",
        "outputType": "structured",
        "timestamp": "2025-07-08T09:00:00.000Z",
        "cost": 0.006
      }
    }
    

## 

[​](#examples)

Examples

Python

JavaScript

cURL

Copy
    
    
    import requests
    import json
    
    # Your API key
    api_key = "YOUR_API_KEY"
    
    # API endpoint
    url = "https://nano-gpt.com/api/web"
    
    # Headers
    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key
    }
    
    # Basic search
    basic_search = {
        "query": "artificial intelligence trends 2025"
    }
    
    response = requests.post(url, headers=headers, json=basic_search)
    results = response.json()
    
    # Print results
    if results["metadata"]["outputType"] == "searchResults":
        for result in results["data"]:
            print(f"Title: {result['title']}")
            print(f"URL: {result['url']}")
            print(f"Content: {result.get('content', 'N/A')[:200]}...")
            print("-" * 50)
        print(f"Search cost: ${results['metadata']['cost']}")
    

## 

[​](#advanced-examples)

Advanced Examples

### 

[​](#deep-search-with-date-filtering)

Deep Search with Date Filtering

Copy
    
    
    def deep_search_with_dates(query, from_date, to_date):
        data = {
            "query": query,
            "depth": "deep",
            "fromDate": from_date,
            "toDate": to_date
        }
        
        response = requests.post(url, headers=headers, json=data)
        return response.json()
    
    # Search for recent research
    results = deep_search_with_dates(
        "quantum computing breakthroughs",
        "2025-01-01",
        "2025-07-01"
    )
    

### 

[​](#structured-output-for-data-extraction)

Structured Output for Data Extraction

Copy
    
    
    def extract_structured_data(query, schema):
        data = {
            "query": query,
            "outputType": "structured",
            "structuredOutputSchema": json.dumps(schema)
        }
        
        response = requests.post(url, headers=headers, json=data)
        return response.json()
    
    # Define schema for extracting programming language data
    schema = {
        "type": "object",
        "properties": {
            "languages": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "rank": {"type": "number"},
                        "name": {"type": "string"},
                        "popularityScore": {"type": "string"},
                        "primaryUseCase": {"type": "string"}
                    }
                }
            }
        }
    }
    
    # Extract structured data
    results = extract_structured_data(
        "top 5 programming languages 2025",
        schema
    )
    

### 

[​](#domain-specific-search)

Domain-Specific Search

Copy
    
    
    def search_specific_domains(query, domains, exclude=False):
        data = {
            "query": query,
            "outputType": "sourcedAnswer"
        }
        
        if exclude:
            data["excludeDomains"] = domains
        else:
            data["includeDomains"] = domains
        
        response = requests.post(url, headers=headers, json=data)
        return response.json()
    
    # Search only trusted news sources
    news_results = search_specific_domains(
        "latest tech acquisitions",
        ["reuters.com", "bloomberg.com", "techcrunch.com"],
        exclude=False
    )
    
    # Exclude certain domains
    filtered_results = search_specific_domains(
        "python tutorials",
        ["w3schools.com", "geeksforgeeks.org"],
        exclude=True
    )
    

## 

[​](#error-handling)

Error Handling

400 Bad Request

401 Unauthorized

402 Payment Required

429 Too Many Requests

500 Internal Server Error

Copy
    
    
    {
      "error": "Query parameter is required and must be a string"
    }
    

## 

[​](#rate-limiting)

Rate Limiting

The API is rate-limited to 10 requests per minute per IP address. If you exceed this limit, you’ll receive a 429 status code.

## 

[​](#best-practices)

Best Practices

  1. **Use Standard Search for General Queries** : Standard search is 10x cheaper and sufficient for most use cases.
  2. **Use Deep Search for Research** : Deep search provides more comprehensive results and is ideal for research tasks or when you need extensive information.
  3. **Leverage Domain Filtering** : Use `includeDomains` to search specific trusted sources or `excludeDomains` to filter out unwanted sources.
  4. **Date Filtering for Current Events** : Use `fromDate` and `toDate` to get the most recent information on rapidly evolving topics.
  5. **Structured Output for Data Extraction** : Use structured output when you need to extract specific data points from search results in a predictable format.
  6. **Handle Errors Gracefully** : Always implement error handling for rate limits, insufficient balance, and network errors.
  7. **Cache Results** : Consider caching search results for identical queries to reduce costs and improve performance.



## 

[​](#output-type-selection-guide)

Output Type Selection Guide

  * **searchResults** : Best for general searches where you want to see multiple sources and snippets. Ideal for research and exploration.
  * **sourcedAnswer** : Best when you want a comprehensive answer synthesized from multiple sources. Great for factual questions and summaries.
  * **structured** : Best when you need to extract specific data points in a predictable format. Perfect for data collection and automation.



## 

[​](#pricing)

Pricing

  * **Standard Search** : $0.006 per search
  * **Deep Search** : $0.06 per search

A minimum balance of $1.00 is required to use the web search API.

[Web Scraping](/api-reference/endpoint/scrape-urls)[v1/speech (Synchronous TTS)](/api-reference/endpoint/speech)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
