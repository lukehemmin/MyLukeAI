# Image Generation - NanoGPT API Documentation

**Source:** https://docs.nano-gpt.com/api-reference/image-generation

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
  * [OpenAI-Compatible Endpoint (v1/images/generations)](#openai-compatible-endpoint-v1%2Fimages%2Fgenerations)
  * [Basic Image Generation](#basic-image-generation)
  * [Return Hosted URLs (response_format: “url”)](#return-hosted-urls-response-format%3A-%E2%80%9Curl%E2%80%9D)
  * [Downloading the image](#downloading-the-image)
  * [Image-to-Image with OpenAI Endpoint](#image-to-image-with-openai-endpoint)
  * [Method 1: Upload from Local File](#method-1%3A-upload-from-local-file)
  * [Method 2: Upload from Image URL](#method-2%3A-upload-from-image-url)
  * [Method 3: Multiple Images (for supported models)](#method-3%3A-multiple-images-for-supported-models)
  * [Supported Image-to-Image Models](#supported-image-to-image-models)
  * [Image Data URL Format](#image-data-url-format)
  * [Additional Parameters for Image-to-Image](#additional-parameters-for-image-to-image)
  * [Best Practices](#best-practices)
  * [Error Handling](#error-handling)



API Reference

# Image Generation

Guide to the OpenAI-compatible image generation endpoint

## 

[​](#overview)

Overview

The NanoGPT API provides image generation through the OpenAI-compatible endpoint. This guide covers text-to-image and image-to-image flows, response formats, and best practices.

## 

[​](#openai-compatible-endpoint-v1/images/generations)

OpenAI-Compatible Endpoint (v1/images/generations)

This endpoint follows the OpenAI specification for image generation and returns a list of base64-encoded images by default (or hosted URLs when `response_format: "url"`).

### 

[​](#basic-image-generation)

Basic Image Generation

Copy
    
    
    curl https://nano-gpt.com/v1/images/generations \
      -H "Authorization: Bearer $API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "hidream",
        "prompt": "A sunset over a mountain range",
        "n": 1,
        "size": "1024x1024"
      }'
    

### 

[​](#return-hosted-urls-response-format:-“url”)

Return Hosted URLs (response_format: “url”)

By default, responses include base64 strings. Ask for hosted URLs instead:

Copy
    
    
    {
      "response_format": "url"
    }
    

Note on response_format: “url” The returned data[i].url is a time-limited, signed download URL (presigned URL) to the generated image. It will expire after a short period (currently ~1 hour). If you need long-term access, download the image and store it yourself.

  * Output: `data` will usually contain `{ url: "https://..." }` entries instead of `b64_json` (each `data[i]` is one or the other, never both).
  * Fallback: if URL generation (upload/presign) fails, the API may return `b64_json` even when you requested `response_format: "url"`.
  * Inputs: `imageDataUrl` accepts data URLs; download and convert remote images before sending.
  * Retention: the returned `data[i].url` is a signed, expiring URL (~1 hour). Generated files are kept for 24 hours, then permanently deleted. Download and store elsewhere if you need longer retention.

Example response (response_format: “url”)

Copy
    
    
    {
      "created": 123,
      "data": [
        { "url": "https://...signed-url..." }
      ],
      "cost": 123,
      "paymentSource": "<string>",
      "remainingBalance": 123
    }
    

Example response (response_format: “b64_json”)

Copy
    
    
    {
      "created": 123,
      "data": [
        { "b64_json": "<base64-encoded-image-bytes>" }
      ],
      "cost": 123,
      "paymentSource": "<string>",
      "remainingBalance": 123
    }
    

### 

[​](#downloading-the-image)

Downloading the image

If you requested response_format: “url”, download the image by performing a normal HTTP GET to data[i].url. Because the URL is signed and expiring, you should download it soon after generation.

### 

[​](#image-to-image-with-openai-endpoint)

Image-to-Image with OpenAI Endpoint

The OpenAI-compatible endpoint also supports img2img generation using the `imageDataUrl` parameter. Here are the different ways to provide input images:

> Uploads sent via the API must be 4 MB or smaller. Compress or resize larger files before converting to a data URL.

#### 

[​](#method-1:-upload-from-local-file)

Method 1: Upload from Local File

Copy
    
    
    import requests
    import base64
    
    API_KEY = "YOUR_API_KEY"
    
    # Read and encode your input image
    with open("input_image.jpg", "rb") as image_file:
        encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
        image_data_url = f"data:image/jpeg;base64,{encoded_image}"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        "https://nano-gpt.com/v1/images/generations",
        headers=headers,
        json={
            "model": "flux-kontext",
            "prompt": "Transform this image into a watercolor painting",
            "n": 1,
            "size": "1024x1024",
            "imageDataUrl": image_data_url
        }
    )
    
    result = response.json()
    # The response includes base64-encoded images in result["data"]
    

#### 

[​](#method-2:-upload-from-image-url)

Method 2: Upload from Image URL

Copy
    
    
    import requests
    import base64
    from urllib.request import urlopen
    
    API_KEY = "YOUR_API_KEY"
    
    # Download and encode image from URL
    image_url = "https://example.com/your-image.jpg"
    with urlopen(image_url) as response:
        image_data = response.read()
        encoded_image = base64.b64encode(image_data).decode('utf-8')
        # Detect image type from URL or response headers
        image_type = "jpeg"  # or detect from URL/headers
        image_data_url = f"data:image/{image_type};base64,{encoded_image}"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        "https://nano-gpt.com/v1/images/generations",
        headers=headers,
        json={
            "model": "flux-kontext",
            "prompt": "Transform this image into a watercolor painting",
            "n": 1,
            "size": "1024x1024",
            "imageDataUrl": image_data_url
        }
    )
    
    result = response.json()
    

#### 

[​](#method-3:-multiple-images-for-supported-models)

Method 3: Multiple Images (for supported models)

Some models like `gpt-4o-image`, `flux-kontext`, and `gpt-image-1` support multiple input images:

Copy
    
    
    import requests
    import base64
    
    API_KEY = "YOUR_API_KEY"
    
    def image_to_data_url(image_path):
        """Convert image file to base64 data URL"""
        with open(image_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
            ext = image_path.lower().split('.')[-1]
            mime_type = "jpeg" if ext == "jpg" else ext
            return f"data:image/{mime_type};base64,{encoded}"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Prepare multiple images
    image_data_urls = [
        image_to_data_url("image1.jpg"),
        image_to_data_url("image2.png"),
        image_to_data_url("image3.jpg")
    ]
    
    response = requests.post(
        "https://nano-gpt.com/v1/images/generations",
        headers=headers,
        json={
            "model": "gpt-4o-image",
            "prompt": "Combine these images into a creative collage",
            "n": 1,
            "size": "1024x1024",
            "imageDataUrls": image_data_urls  # Note: plural form for multiple images
        }
    )
    
    result = response.json()
    

#### 

[​](#supported-image-to-image-models)

Supported Image-to-Image Models

The following models support image input via the OpenAI endpoint: **Single Image Input:**

  * `flux-dev-image-to-image` \- Image-to-image only
  * `ghiblify` \- Transform images to Studio Ghibli style
  * `gemini-flash-edit` \- Edit images with prompts
  * `hidream-edit` \- Advanced image editing
  * `bagel` \- Both text-to-image and image-to-image
  * `SDXL-ArliMix-v1` \- Artistic transformations
  * `Upscaler` \- Upscale images to higher resolution

**Multiple Image Input:**

  * `flux-kontext` \- Advanced context-aware generation
  * `flux-kontext/dev` \- Development version (image-to-image only)
  * `gpt-4o-image` \- GPT-4 powered image generation
  * `gpt-image-1` \- Advanced multi-image processing

**Special Cases:**

  * `flux-lora/inpainting` \- Requires both `imageDataUrl` (base image) and `maskDataUrl` (mask)



#### 

[​](#image-data-url-format)

Image Data URL Format

All images must be provided as base64-encoded data URLs:

Copy
    
    
    data:image/[format];base64,[base64-encoded-data]
    

Supported formats:

  * `image/jpeg` or `image/jpg`
  * `image/png`
  * `image/webp`
  * `image/gif` (first frame only)



#### 

[​](#additional-parameters-for-image-to-image)

Additional Parameters for Image-to-Image

When using image-to-image models, you can include these additional parameters:

Copy
    
    
    {
      "model": "flux-kontext",
      "prompt": "Transform to cyberpunk style",
      "imageDataUrl": "data:image/jpeg;base64,...",
      "size": "1024x1024",
      "n": 1,
      
      // Optional parameters (model-specific)
      "strength": 0.8,              // How much to transform (0.0-1.0)
      "guidance_scale": 7.5,        // Prompt adherence
      "num_inference_steps": 30,    // Quality vs speed
      "seed": 42,                   // For reproducible results
      "kontext_max_mode": true      // Enhanced context (flux-kontext only)
    }
    

## 

[​](#best-practices)

Best Practices

  1. **Prompt Engineering**
     * Be specific and detailed in your prompts
     * Include style references when needed
     * Use the negative prompt to avoid unwanted elements
     * For img2img, describe the changes you want relative to the input image
  2. **Image Quality**
     * Higher resolution settings produce better quality but take longer
     * More steps generally mean better quality but slower generation
     * Adjust the guidance scale based on how closely you want to follow the prompt
     * For img2img, ensure your input image has good quality for best results
  3. **Cost Optimization**
     * Start with lower resolution for testing
     * Use fewer steps during development
     * Generate one image at a time unless multiple variations are needed
     * Compress input images appropriately to reduce upload size



## 

[​](#error-handling)

Error Handling

The API may return various error codes:

  * 400: Bad Request (invalid parameters)
  * 401: Unauthorized (invalid API key)
  * 429: Too Many Requests (rate limit exceeded)
  * 500: Internal Server Error

Always implement proper error handling in your applications:

Copy
    
    
    try:
        result = generate_image(prompt)
    except requests.exceptions.RequestException as e:
        if e.response:
            if e.response.status_code == 401:
                print("Invalid API key. Please check your credentials.")
            elif e.response.status_code == 429:
                print("Rate limit exceeded. Please wait before trying again.")
            else:
                print(f"API Error: {e.response.status_code}")
        else:
            print(f"Network Error: {str(e)}")
    

[Embeddings](/api-reference/embeddings)[Video Generation](/api-reference/video-generation)

⌘I

[x](https://x.com/nanogptcom)[discord](https://discord.gg/KaQt8gPG6V)[linkedin](https://linkedin.com/company/nanogpt)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nano-gpt)
