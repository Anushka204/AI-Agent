"use server";

import { api } from "@/convex/_generated/api";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";
import { getConvexClient } from "@/lib/convex";
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";

const IMAGE_SIZE = "1792x1024" as const;
const convexClient = getConvexClient();

export const dalleImageGeneration = async (prompt: string, videoId: string) => {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not found");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  if (!prompt) {
    throw new Error("Failed to generate image prompt");
  }

  console.log("🎨 Generating image with prompt:", prompt);

  // Generate the image using DALL-E
  const imageResponse = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: IMAGE_SIZE,
    quality: "standard",
    style: "vivid",
  });

  const imageUrl = imageResponse.data[0]?.url;

  if (!imageUrl) {
    throw new Error("Failed to generate image");
  }

  // Step 1: Get a short-lived upload URL for Convex
  console.log("📤 Getting upload URL...");
  const postUrl = await convexClient.mutation(api.images.generateUploadUrl);
  console.log("✅ Got upload URL");

  // Step 2: Download the image from the URL
  console.log("⬇️ Downloading image from OpenAI...");
  const image: Blob = await fetch(imageUrl).then((res) => res.blob());
  console.log("✅ Downloaded image successfully");

  // Step 3: Upload the image to the convex storage bucket
  console.log("📁 Uploading image to storage...");
  const result = await fetch(postUrl, {
    method: "POST",
    headers: { "Content-Type": image!.type },
    body: image,
  });

  const { storageId } = await result.json();
  console.log("✅ Uploaded image to storage with ID:", storageId);

  // Step 4: Save the newly allocated storage id to the database
  console.log("💾 Saving image reference to database...");
  await convexClient.mutation(api.images.storeImage, {
    storageId: storageId,
    videoId,
    userId: user.id,
  });
  console.log("✅ Saved image reference to database");

  // get serve image url
  const dbImageUrl = await convexClient.query(api.images.getImage, {
    videoId,
    userId: user.id,
  });

  // Track the image generation event
  await client.track({
    event: featureFlagEvents[FeatureFlag.IMAGE_GENERATION].event,
    company: {
      id: user.id,
    },
    user: {
      id: user.id,
    },
  });

  return {
    imageUrl: dbImageUrl,
  };
};