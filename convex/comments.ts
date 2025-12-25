import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCommentsBySong = query({
  args: { songId: v.id("songs") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_song", (q) => q.eq("songId", args.songId))
      .order("desc")
      .collect();
    
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", comment.userId))
          .first();
        
        return {
          ...comment,
          user: user ? { ...user, profile } : null,
        };
      })
    );
    
    return commentsWithUsers;
  },
});

export const createComment = mutation({
  args: {
    songId: v.id("songs"),
    content: v.string(),
    parentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db.insert("comments", {
      songId: args.songId,
      userId,
      content: args.content,
      parentId: args.parentId,
    });
  },
});
