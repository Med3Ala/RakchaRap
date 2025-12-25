import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAllSongs = query({
  args: {
    sortBy: v.optional(v.union(v.literal("rating"), v.literal("votes"), v.literal("date"), v.literal("singer"))),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let songs = await ctx.db.query("songs").collect();
    
    // Filter by search term
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      songs = songs.filter(song => 
        song.title.toLowerCase().includes(searchLower)
      );
    }
    
    // Get singer info for each song
    const songsWithSingers = await Promise.all(
      songs.map(async (song) => {
        const singer = await ctx.db.get(song.singerId);
        const singerProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", song.singerId))
          .first();
        
        return {
          ...song,
          singer: singer ? { ...singer, profile: singerProfile } : null,
        };
      })
    );
    
    // Sort based on sortBy parameter
    switch (args.sortBy) {
      case "rating":
        songsWithSingers.sort((a, b) => {
          const aAvg = a.ratings ? Object.values(a.ratings).reduce((sum, val) => sum + val, 0) / 5 : 0;
          const bAvg = b.ratings ? Object.values(b.ratings).reduce((sum, val) => sum + val, 0) / 5 : 0;
          return bAvg - aAvg;
        });
        break;
      case "votes":
        songsWithSingers.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
      case "date":
        songsWithSingers.sort((a, b) => b._creationTime - a._creationTime);
        break;
      case "singer":
        songsWithSingers.sort((a, b) => {
          const aName = a.singer?.profile?.displayName || a.singer?.name || "";
          const bName = b.singer?.profile?.displayName || b.singer?.name || "";
          return aName.localeCompare(bName);
        });
        break;
      default:
        songsWithSingers.sort((a, b) => b._creationTime - a._creationTime);
    }
    
    return songsWithSingers;
  },
});

export const getSongsBySinger = query({
  args: { singerId: v.id("users") },
  handler: async (ctx, args) => {
    const songs = await ctx.db
      .query("songs")
      .withIndex("by_singer", (q) => q.eq("singerId", args.singerId))
      .order("desc")
      .collect();
    
    return songs;
  },
});

export const createSong = mutation({
  args: {
    title: v.string(),
    youtubeUrl: v.string(),
    lyrics: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (!profile || profile.role !== "singer") {
      throw new Error("Only singers can post songs");
    }
    
    // Extract YouTube thumbnail
    const videoId = extractYouTubeVideoId(args.youtubeUrl);
    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : undefined;
    
    return await ctx.db.insert("songs", {
      singerId: userId,
      title: args.title,
      youtubeUrl: args.youtubeUrl,
      lyrics: args.lyrics,
      thumbnail,
      upvotes: 0,
      downvotes: 0,
      ratingCount: 0,
    });
  },
});

export const voteSong = mutation({
  args: {
    songId: v.id("songs"),
    type: v.union(v.literal("upvote"), v.literal("downvote")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_user_song", (q) => q.eq("userId", userId).eq("songId", args.songId))
      .first();
    
    const song = await ctx.db.get(args.songId);
    if (!song) throw new Error("Song not found");
    
    if (existingVote) {
      // Update existing vote
      if (existingVote.type !== args.type) {
        await ctx.db.patch(existingVote._id, { type: args.type });
        
        // Update song vote counts
        if (args.type === "upvote") {
          await ctx.db.patch(args.songId, {
            upvotes: song.upvotes + 1,
            downvotes: song.downvotes - 1,
          });
        } else {
          await ctx.db.patch(args.songId, {
            upvotes: song.upvotes - 1,
            downvotes: song.downvotes + 1,
          });
        }
      }
    } else {
      // Create new vote
      await ctx.db.insert("votes", {
        songId: args.songId,
        userId,
        type: args.type,
      });
      
      // Update song vote counts
      if (args.type === "upvote") {
        await ctx.db.patch(args.songId, { upvotes: song.upvotes + 1 });
      } else {
        await ctx.db.patch(args.songId, { downvotes: song.downvotes + 1 });
      }
    }
  },
});

export const rateSong = mutation({
  args: {
    songId: v.id("songs"),
    lyrics: v.number(),
    beat: v.number(),
    flow: v.number(),
    style: v.number(),
    videoclip: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const existingRating = await ctx.db
      .query("songRatings")
      .withIndex("by_user_song", (q) => q.eq("userId", userId).eq("songId", args.songId))
      .first();
    
    if (existingRating) {
      // Update existing rating
      await ctx.db.patch(existingRating._id, {
        lyrics: args.lyrics,
        beat: args.beat,
        flow: args.flow,
        style: args.style,
        videoclip: args.videoclip,
      });
    } else {
      // Create new rating
      await ctx.db.insert("songRatings", {
        songId: args.songId,
        userId,
        lyrics: args.lyrics,
        beat: args.beat,
        flow: args.flow,
        style: args.style,
        videoclip: args.videoclip,
      });
    }
    
    // Recalculate average ratings for the song
    await recalculateSongRatings(ctx, args.songId);
  },
});

async function recalculateSongRatings(ctx: any, songId: any) {
  const ratings = await ctx.db
    .query("songRatings")
    .withIndex("by_song", (q: any) => q.eq("songId", songId))
    .collect();
  
  if (ratings.length === 0) return;
  
  const averages = {
    lyrics: ratings.reduce((sum: number, r: any) => sum + r.lyrics, 0) / ratings.length,
    beat: ratings.reduce((sum: number, r: any) => sum + r.beat, 0) / ratings.length,
    flow: ratings.reduce((sum: number, r: any) => sum + r.flow, 0) / ratings.length,
    style: ratings.reduce((sum: number, r: any) => sum + r.style, 0) / ratings.length,
    videoclip: ratings.reduce((sum: number, r: any) => sum + r.videoclip, 0) / ratings.length,
  };
  
  await ctx.db.patch(songId, {
    ratings: averages,
    ratingCount: ratings.length,
  });
}

function extractYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
