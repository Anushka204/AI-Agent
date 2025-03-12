AI Content Analysis Platform is an AI-powered tool designed to help content creators maximize the potential of their YouTube videos by providing deep insights, automated content generation, and strategic recommendations. Built using Next.js 15, React 19, and AI SDK, the platform streamlines content creation and optimization for increased engagement and visibility.

Key Features:
🎯 AI Video Analysis – Extracts deep insights from video content using advanced AI models.
📝 Smart Transcription – Provides accurate video transcriptions with timestamps for subtitles and content repurposing.
🖼️ Thumbnail Generation – Generates engaging and click-worthy thumbnails using AI.
🪶 Title Generation – Suggests SEO-optimized titles to increase visibility and audience reach.
📹 Shot Script – Creates detailed shooting and editing guides for recreating successful video styles.
🤖 AI Agent Conversations – Offers AI-driven content strategy suggestions through interactive conversations.

Tech Stack:
Frontend: Next.js 15, React 19, Tailwind CSS
Backend: Node.js
AI Integration: AI SDK, Anthropic, OpenAI
Authentication: Clerk
Database: Convex
Styling: Tailwind CSS, Radix UI
YouTube Integration: youtubei.js for fetching video data
Project Structure:
📂 /app – Next.js app directory with routing and layouts
📂 /components – Reusable UI components (buttons, forms, etc.)
📂 /convex – Convex models and schema definitions
📂 /actions – Server actions for form handling and business logic
📂 /lib – Utility functions and helper methods
📂 /features – Feature flag configurations
📂 /public – Static assets (images, fonts)

Data Model:
YouTube video IDs linked to user accounts
Video transcripts with timestamps for easy reference
Generated thumbnails stored with metadata
Custom titles optimized for SEO and engagement


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
