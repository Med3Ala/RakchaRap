import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Extended user profiles
  userProfiles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("singer"), v.literal("spectator")),
    displayName: v.optional(v.string()),
    avatar: v.optional(v.id("_storage")),
    bio: v.optional(v.string()),
    socialLinks: v.optional(v.object({
      instagram: v.optional(v.string()),
      twitter: v.optional(v.string()),
      youtube: v.optional(v.string()),
      spotify: v.optional(v.string()),
    })),
    // Radar chart ratings (averages)
    ratings: v.optional(v.object({
      lyrics: v.number(),
      beat: v.number(),
      flow: v.number(),
      style: v.number(),
      videoclip: v.number(),
    })),
  }).index("by_user", ["userId"]).index("by_role", ["role"]),

  // Songs posted by singers
  songs: defineTable({
    singerId: v.id("users"),
    title: v.string(),
    youtubeUrl: v.string(),
    lyrics: v.optional(v.string()),
    thumbnail: v.optional(v.string()),
    upvotes: v.number(),
    downvotes: v.number(),
    // Average ratings
    ratings: v.optional(v.object({
      lyrics: v.number(),
      beat: v.number(),
      flow: v.number(),
      style: v.number(),
      videoclip: v.number(),
    })),
    ratingCount: v.number(),
  }).index("by_singer", ["singerId"]),

  // Individual ratings for songs
  songRatings: defineTable({
    songId: v.id("songs"),
    userId: v.id("users"),
    lyrics: v.number(),
    beat: v.number(),
    flow: v.number(),
    style: v.number(),
    videoclip: v.number(),
  }).index("by_song", ["songId"]).index("by_user_song", ["userId", "songId"]),

  // Votes on songs
  votes: defineTable({
    songId: v.id("songs"),
    userId: v.id("users"),
    type: v.union(v.literal("upvote"), v.literal("downvote")),
  }).index("by_song", ["songId"]).index("by_user_song", ["userId", "songId"]),

  // Comments on songs
  comments: defineTable({
    songId: v.id("songs"),
    userId: v.id("users"),
    content: v.string(),
    parentId: v.optional(v.id("comments")), // For replies
  }).index("by_song", ["songId"]).index("by_parent", ["parentId"]),

  // Admin polls
  polls: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    createdBy: v.id("users"),
    endDate: v.number(),
    isActive: v.boolean(),
    options: v.array(v.object({
      id: v.string(),
      songId: v.optional(v.id("songs")),
      title: v.string(),
      votes: v.number(),
    })),
  }).index("by_active", ["isActive"]).index("by_creator", ["createdBy"]),

  // Poll votes
  pollVotes: defineTable({
    pollId: v.id("polls"),
    userId: v.id("users"),
    optionId: v.string(),
  }).index("by_poll", ["pollId"]).index("by_user_poll", ["userId", "pollId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
