import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const createTweet = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        url: v.string(),
        tags: v.optional(v.array(v.string())),
    },

    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Not authorized");
        }

        const link = await ctx.db.insert("tweets", {
            title: args.title,
            description: args.description,
            url: args.url,
            userId: user.subject,
            tags: args.tags
        });
        return link;
    },
});

export const deleteLink = mutation({
    args: { id: v.id("links") },
    handler: async (ctx, args) => {
        const userId = await ctx.auth.getUserIdentity();
        if (!userId) {
            throw new ConvexError("Not authorized");
        }

        const link = await ctx.db.get(args.id);

        if (!link) {
            throw new ConvexError("Link not found");
        }

        if (link.userId !== userId.subject) {
            throw new ConvexError("Not authorized");
        }

        await ctx.db.delete(args.id);
    }
})