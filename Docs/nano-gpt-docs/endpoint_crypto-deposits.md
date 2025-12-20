# Crypto Deposits - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/endpoint/crypto-deposits

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



cURL

JavaScript

KAS Example

Copy
    
    
    curl -X POST https://nano-gpt.com/api/transaction/create/btc \
      -H "x-api-key: YOUR_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{"amount": 0.001}'
    

Success Response

Copy
    
    
    {
      "txId": "6Uwh14rFrKG9XnKDYTWKc4",
      "amount": 0.001,
      "status": "New",
      "createdAt": "2025-06-23T14:52:43.000Z",
      "paidAmountCrypto": 0,
      "address": "bc1q...",
      "remainingTime": 3600,
      "expiration": 1750693963,
      "paymentLink": "bitcoin:bc1q...?amount=0.001"
    }
    

Endpoint Examples

# Crypto Deposits

Generate cryptocurrency deposit addresses via BTCPayServer integration

## 

[​](#overview)

Overview

The BTCPayServer integration allows API users to programmatically generate deposit addresses for multiple cryptocurrencies. When a user sends crypto to the generated address, their NanoGPT account balance is automatically credited with the equivalent value.

## 

[​](#supported-cryptocurrencies)

Supported Cryptocurrencies

  * **BTC** (Bitcoin)
  * **LTC** (Litecoin)
  * **XMR** (Monero)
  * **DOGE** (Dogecoin)
  * **DASH** (Dash)
  * **BCH** (Bitcoin Cash) - via PromptCash integration
  * **BAN** (Banano) - via Nanswap integration
  * **KAS** (Kaspa)



## 

[​](#authentication)

Authentication

All endpoints require API key authentication using one of these methods:

Copy
    
    
    # Method 1: Authorization header
    curl -H "Authorization: Bearer YOUR_API_KEY"
    
    # Method 2: x-api-key header  
    curl -H "x-api-key: YOUR_API_KEY"
    

## Create Crypto Deposit

Generate a deposit address for cryptocurrency deposits

[​](#param-ticker)

ticker

string

required

Cryptocurrency ticker symbol. Supported values: `btc`, `ltc`, `xmr`, `doge`, `dash`, `bch`, `ban`, `kas`

[​](#param-amount)

amount

number

required

Amount of cryptocurrency to deposit. Must be between minimum and maximum limits.

### 

[​](#amount-limits)

Amount Limits

Each cryptocurrency has minimum and maximum deposit limits based on USD equivalent: **Standard Limits** (BTC, LTC, XMR, DOGE, DASH, BCH, BAN):

  * **Minimum** : $0.10 USD equivalent
  * **Maximum** : $500 USD equivalent

**KAS Limits** :

  * **Minimum** : $10 USD equivalent
  * **Maximum** : $500 USD equivalent



cURL

JavaScript

KAS Example

Copy
    
    
    curl -X POST https://nano-gpt.com/api/transaction/create/btc \
      -H "x-api-key: YOUR_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{"amount": 0.001}'
    

Success Response

Copy
    
    
    {
      "txId": "6Uwh14rFrKG9XnKDYTWKc4",
      "amount": 0.001,
      "status": "New",
      "createdAt": "2025-06-23T14:52:43.000Z",
      "paidAmountCrypto": 0,
      "address": "bc1q...",
      "remainingTime": 3600,
      "expiration": 1750693963,
      "paymentLink": "bitcoin:bc1q...?amount=0.001"
    }
    

### 

[​](#response-fields)

Response Fields

[​](#param-tx-id)

txId

string

Unique transaction identifier for tracking

[​](#param-amount-1)

amount

number

Requested deposit amount

[​](#param-status)

status

string

Payment status (“New”, “Pending”, “Completed”, etc.)

[​](#param-created-at)

createdAt

string

ISO timestamp of invoice creation

[​](#param-paid-amount-crypto)

paidAmountCrypto

number

Amount paid so far (0 for new invoices)

[​](#param-address)

address

string

Crypto deposit address to send payment to

[​](#param-remaining-time)

remainingTime

number

Seconds until invoice expires

[​](#param-expiration)

expiration

number

Unix timestamp of expiration

[​](#param-payment-link)

paymentLink

string

URI link for wallet apps

[​](#param-qr-url)

QRUrl

string

QR code URL for the payment address (if available)

[​](#param-amount-crypto)

amountCrypto

number

Amount in cryptocurrency (if available)

[​](#param-amount-fiat)

amountFiat

number

Equivalent USD value (if available)

## Check Payment Limits

Get minimum and maximum deposit amounts for a cryptocurrency

[​](#param-ticker-1)

ticker

string

required

Cryptocurrency ticker symbol

cURL

JavaScript

Copy
    
    
    curl -H "x-api-key: YOUR_API_KEY" \
      https://nano-gpt.com/api/transaction/limits/btc
    

Limits Response

Copy
    
    
    {
      "minimum": 0.00002,
      "maximum": 0.01,
      "fiatEquivalentMinimum": 0.10,
      "fiatEquivalentMaximum": 500.0
    }
    

## 

[​](#error-handling)

Error Handling

### 

[​](#http-status-codes)

HTTP Status Codes

  * **200** : Success
  * **400** : Bad Request (invalid amount, unsupported ticker)
  * **401** : Unauthorized (invalid or missing API key)
  * **429** : Rate Limited
  * **500** : Server Error (payment provider unavailable)



### 

[​](#common-errors)

Common Errors

Amount Validation Errors

  * `"No amount specified"` \- Missing amount in request body
  * `"Minimum amount is X"` \- Amount below minimum threshold
  * `"Maximum amount is X"` \- Amount above maximum threshold



Authentication Errors

  * `"Incorrect API key"` \- Invalid authentication



Provider Errors

  * `"Unsupported ticker"` \- Invalid cryptocurrency ticker
  * `"This payment method is currently not available"` \- Provider temporarily unavailable



## 

[​](#rate-limits)

Rate Limits

  * **10 requests per 10 minutes** per IP address or API key
  * Rate limit applies to all deposit creation endpoints



## 

[​](#payment-flow)

Payment Flow

1

Create Invoice

Call `/api/transaction/create/{ticker}` with desired amount

2

Get Address

Extract `address` from response

3

Send Payment

User sends crypto to the provided address

4

Auto-Credit

Account balance automatically updated when payment confirms

**KAS (Kaspa) Special Considerations:**

  * Higher minimum deposit requirement (10USDvs10 USD vs 10USDvs0.10 for other cryptos)
  * Deposits are automatically credited upon blockchain confirmation
  * 1-hour expiration time for payment invoices



[Receive Nano](/api-reference/endpoint/receive-nano)[Text Generation](/api-reference/text-generation)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
