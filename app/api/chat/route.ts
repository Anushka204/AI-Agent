import { NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText, tool } from "ai";
import { currentUser } from "@clerk/nextjs/server";
import { getVideoDetails } from "@/actions/getVideoDetails";

import { z } from "zod";

import { titleGeneration } from "@/actions/titleGeneration"; // ✅ Fixed import

const anthropic = createAnthropic({
  apiKey: process.env.CLAUDE_API_KEY,
  headers: {
    "anthropic-beta": "token-efficient-tools-2025-02-19",
  },
});

const model = anthropic("claude-3-7-sonnet-20250219");

export async function POST(req: Request) {
  try {
    const { messages, videoId } = await req.json();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const videoDetails = await getVideoDetails(videoId);

    const systemMessage = `
You are an AI agent ready to accept questions from the user about ONE specific video. 
The video ID in question is ${videoId} but you'll refer to this as ${videoDetails?.title || "Selected Video"}.

Use emojis to make the conversation more engaging. 
If an error occurs, explain it to the user and ask them to try again later. 
If the error suggests the user upgrade, explain that they must upgrade to use the feature. 
Tell them to go to 'Manage Plan' in the header and upgrade. 
If any tool is used, analyze the response and if it contains a cache, explain that the transcript is cached 
because they previously transcribed the video saving the user a token — use words like database instead of cache 
to make it easier to understand. Format for notion.
`.trim();

    const result = streamText({
      model,
      messages: [{ role: "system", content: systemMessage }, ...messages],
      tools: {
        generateTitle: tool({
          description: "Generate a YouTube video title based on the content",
          parameters: z.object({
            videoId: z.string().describe("The video ID"),
            videoSummary: z.string().describe("The summary of the video content"),
            considerations: z.string().describe("Key points to highlight in the title"),
          }),
          execute: async ({ videoId, videoSummary, considerations }) => {
            try {
              console.log(`🎯 Generating title for video ID: ${videoId}`);
              const title = await titleGeneration(videoId, videoSummary, considerations); // ✅ Fixed return type

              if (!title) {
                console.error("❌ Title generation failed");
                throw new Error("Failed to generate title");
              }

              console.log("✅ Generated Title:", title);

              // ✅ Return the expected format
              return { title };
            } catch (error) {
              console.error("❌ Error generating title:", error);
              return { title: "Title generation failed. Try again later." };
            }
          },
        }),
      },
    });

    // ✅ Ensure the result is correctly streamed
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("❌ Error in POST handler:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
