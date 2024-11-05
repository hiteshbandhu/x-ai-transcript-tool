# Transcript Analysis Tool (Beta)

A powerful meeting transcript and document analysis tool built with Next.js and X-AI API capabilities. Thanks to Elon's $25 API credit, we can analyze documents and transcripts with cutting-edge AI. This tool helps extract key points, action items, and summaries from your meeting notes and documents.

## Features

- 🤖 AI-powered analysis using X-AI's Grok API for intelligent document understanding
- 📝 Automatic extraction of key points and action items 
- 💾 Local storage for saving analysis history
- 🔒 Password protected for internal use
- 🎨 Clean, modern UI with responsive design
- 🧪 Beta version with X-AI integration

## Quick Start

1. Clone the repository
2. Get your X-AI API key from [console.x.ai](https://console.x.ai)
3. Create a `.env.local` file and add:
   ```
   OPENAI_API_KEY=your_xai_api_key_here
   ```
4. Update the password in `src/app/page.tsx` (default: wetrsfrm@2024)
5. Install dependencies and run:
   ```bash
   pnpm install
   pnpm dev
   ```
