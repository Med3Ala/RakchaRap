import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getActivePolls = query({
  args: {},
  handler: async (ctx) => {
    const polls = await ctx.db
      .query("polls")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    
    return polls;
  },
});

export const createPoll = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    endDate: v.number(),
    options: v.array(v.object({
      id: v.string(),
      songId: v.optional(v.id("songs")),
      title: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (!profile || profile.role !== "admin") {
      throw new Error("Only admins can create polls");
    }
    
    const optionsWithVotes = args.options.map(option => ({
      ...option,
      votes: 0,
    }));
    
    return await ctx.db.insert("polls", {
      title: args.title,
      description: args.description,
      createdBy: userId,
      endDate: args.endDate,
      isActive: true,
      options: optionsWithVotes,
    });
  },
});

export const votePoll = mutation({
  args: {
    pollId: v.id("polls"),
    optionId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const existingVote = await ctx.db
      .query("pollVotes")
      .withIndex("by_user_poll", (q) => q.eq("userId", userId).eq("pollId", args.pollId))
      .first();
    
    if (existingVote) {
      throw new Error("You have already voted in this poll");
    }
    
    await ctx.db.insert("pollVotes", {
      pollId: args.pollId,
      userId,
      optionId: args.optionId,
    });
    
    // Update poll option vote count
    const poll = await ctx.db.get(args.pollId);
    if (poll) {
      const updatedOptions = poll.options.map(option => 
        option.id === args.optionId 
          ? { ...option, votes: option.votes + 1 }
          : option
      );
      
      await ctx.db.patch(args.pollId, { options: updatedOptions });
    }
  },
});
