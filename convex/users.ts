import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    const user = await ctx.db.get(userId);
    if (!user) return null;
    
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    return { ...user, profile };
  },
});

export const createProfile = mutation({
  args: {
    role: v.union(v.literal("admin"), v.literal("singer"), v.literal("spectator")),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    socialLinks: v.optional(v.object({
      instagram: v.optional(v.string()),
      twitter: v.optional(v.string()),
      youtube: v.optional(v.string()),
      spotify: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (existingProfile) {
      throw new Error("Profile already exists");
    }
    
    return await ctx.db.insert("userProfiles", {
      userId,
      role: args.role,
      displayName: args.displayName,
      bio: args.bio,
      socialLinks: args.socialLinks,
      ratings: {
        lyrics: 0,
        beat: 0,
        flow: 0,
        style: 0,
        videoclip: 0,
      },
    });
  },
});

export const updateProfile = mutation({
  args: {
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    socialLinks: v.optional(v.object({
      instagram: v.optional(v.string()),
      twitter: v.optional(v.string()),
      youtube: v.optional(v.string()),
      spotify: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (!profile) throw new Error("Profile not found");
    
    await ctx.db.patch(profile._id, {
      displayName: args.displayName,
      bio: args.bio,
      socialLinks: args.socialLinks,
    });
  },
});

export const getSingers = query({
  args: {},
  handler: async (ctx) => {
    const singers = await ctx.db
      .query("userProfiles")
      .withIndex("by_role", (q) => q.eq("role", "singer"))
      .collect();
    
    const singersWithUsers = await Promise.all(
      singers.map(async (singer) => {
        const user = await ctx.db.get(singer.userId);
        return { ...singer, user };
      })
    );
    
    return singersWithUsers;
  },
});

export const getSingerProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    
    if (!profile || profile.role !== "singer") return null;
    
    return { ...user, profile };
  },
});
