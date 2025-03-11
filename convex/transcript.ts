import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get transcript by video ID
export const getTranscriptByVideoId = query({
  args: {
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transcript")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .unique();
  },
});

// Store a transcript for a video
export const storeTranscript = mutation({
  args: {
    videoId: v.string(),
    userId: v.string(),
    transcript: v.array(
      v.object({
        text: v.string(),
        timestamp: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Check if transcript already exists for this user and video
    const existingTranscript = await ctx.db
      .query("transcript")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .unique();

    if (existingTranscript) {
      return existingTranscript;
    }

    // Create new transcript
    return await ctx.db.insert("transcript", {
      videoId: args.videoId,
      userId: args.userId,
      transcript: args.transcript,
    });
  },
});

// Get all transcripts for a user
export const getTranscriptsByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transcript")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Delete transcript by ID
export const deleteTranscript = mutation({
  args: { id: v.id("transcript"), userId: v.string() },
  handler: async (ctx, args) => {
    const transcript = await ctx.db.get(args.id);
    if (!transcript) {
      throw new Error("Transcript not found");
    }

    if (transcript.userId !== args.userId) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
    return true;
  },
});