import { ConvexError, v } from "convex/values";
import { internalAction, internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { embed } from "./search";

export const getTweets = query({
    handler: async (ctx) => {

        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Not authorized");
        }
        const tweets = await ctx.db.query("tweets")
            .withIndex("by_user_id", (q) => q.eq("userId", user.subject))
            .collect();
        return tweets;
    }
})

export const getTweetById = query({
    args: { id: v.id("tweets") },
    handler: async (ctx, args) => {

        const userId = await ctx.auth.getUserIdentity();
        if (!userId) {
            throw new ConvexError("Not a user");
        }

        const tweet = await ctx.db.get(args.id);

        if (!tweet) {
            throw new ConvexError("Tweet not found");
        }

        if (tweet.userId !== userId.subject) {
            throw new ConvexError("Not authorized");
        }

        return tweet;
    }
})

export const setTweetEmbedding = internalMutation({
    args: {
        tweetId: v.id("tweets"),
        embedding: v.array(v.float64())
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.tweetId, { embedding: args.embedding });
    }
})

export const createTweetEmbedding = internalAction({
    args: {
        tweetId: v.id("tweets"),
        content: v.string()
    },
    handler: async (ctx, args) => {
        const embedding = await embed(args.content);

        await ctx.runMutation(internal.tweets.setTweetEmbedding, {
            tweetId: args.tweetId,
            embedding: embedding
        });
    }
})

export const createTweet = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        url: v.string(),
        tags: v.optional(v.array(v.string())),
        author: v.string(),
    },

    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Not authorized");
        }

        const tweetId = await ctx.db.insert("tweets", {
            title: args.title,
            content: args.content,
            url: args.url,
            userId: user.subject,
            tags: args.tags,
            updatedTime: Date.now(),
            author: args.author
        });

        await ctx.scheduler.runAfter(0, internal.tweets.createTweetEmbedding, {
            tweetId: tweetId,
            content: args.content
        })

        return tweetId;
    },
});

export const deleteTweet = mutation({
    args: { id: v.id("tweets") },
    handler: async (ctx, args) => {
        const userId = await ctx.auth.getUserIdentity();
        if (!userId) {
            throw new ConvexError("Not authorized");
        }

        const tweet = await ctx.db.get(args.id);

        if (!tweet) {
            throw new ConvexError("Tweet not found");
        }

        if (tweet.userId !== userId.subject) {
            throw new ConvexError("Not authorized");
        }

        await ctx.db.delete(args.id);
    }
})