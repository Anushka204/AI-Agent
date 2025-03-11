"use server";

import { api } from "@/convex/_generated/api";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";
import { getConvexClient } from "@/lib/convex";
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { generateText } from "ai";

const convexClient = getConvexClient();

// Create DeepSeek instance
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function titleGeneration(
  videoId: string,
  videoSummary: string,
  considerations: string
) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not found");
  }

  try {
    console.log(`🎯 Generating title for videoId: ${videoId}`);
    console.log(`🎯 Video summary: ${videoSummary}`);
    console.log(`🎯 Considerations: ${considerations}`);

    // Generate title using DeepSeek
    const prompt = `
You are a helpful YouTube video creator assistant that creates high-quality SEO-friendly concise video titles.

Please provide ONE concise YouTube title (and nothing else) for this video. 
- Focus on the main points and key takeaways. 
- The title should be SEO friendly and under 100 characters.

Video Summary:
${videoSummary}

Considerations:
${considerations}
`.trim();

    const { text: title } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt,
    });

    if (!title?.trim()) {
      throw new Error("Failed to generate title (System error)");
    }

    console.log(`✅ Title generated: "${title}"`);

    // Save the generated title in Convex
    await convexClient.mutation(api.titles.generate, {
      videoId,
      userId: user.id,
      title: title.trim(),
    });

    // Track the title generation event
    await client.track({
      event: featureFlagEvents[FeatureFlag.TITLE_GENERATIONS].event,
      company: { id: user.id },
      user: { id: user.id },
    });

    return title.trim();
  } catch (error) {
    console.error("❌ Error generating title:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to generate title");
  }
}
