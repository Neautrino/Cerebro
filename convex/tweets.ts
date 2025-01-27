import { ConvexError, v } from "convex/values";
import { action, internalAction, internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { embed } from "./search";
import axios from "axios";

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

export const createTweet = internalMutation({
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

export const createTweetFromUrl = action({
    args: {
        title: v.string(),
        tweetUrl: v.string(),
        tags: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {

          try {
            const parsedUrl = new URL(args.tweetUrl);
            const pathParts = parsedUrl.pathname.split('/');
            const owner = pathParts[1];
            const id = pathParts[3];
        
            const apiUrl = `https://cdn.syndication.twimg.com/tweet-result?features=tfw_timeline_list%3A%3Btfw_follower_count_sunset%3Atrue%3Btfw_tweet_edit_backend%3Aon%3Btfw_refsrc_session%3Aon%3Btfw_fosnr_soft_interventions_enabled%3Aon%3Btfw_mixed_media_15897%3Atreatment%3Btfw_experiments_cookie_expiration%3A1209600%3Btfw_show_birdwatch_pivots_enabled%3Aon%3Btfw_duplicate_scribes_to_settings%3Aon%3Btfw_use_profile_image_shape_enabled%3Aon%3Btfw_video_hls_dynamic_manifests_15082%3Atrue_bitrate%3Btfw_legacy_timeline_sunset%3Atrue%3Btfw_tweet_edit_frontend%3Aon&id=${id}&lang=en&token=4kbabg4ncmx&mhxten=3iqg8qw9e9yt&xk7qtq=1a98h8cin3oy&og12p0=15xg48m1zrage&mhcgqi=ohuubp8wehhh&vmy5iw=97nyxp78byaj&atza2u=rfjqjg8vbyhk&nz0n3x=1a58whnoj6tkk&owner=${owner}`;
        
            const response = await axios.get(apiUrl);

            await ctx.runMutation(internal.tweets.createTweet, {
                title: args.title,
                content: response.data.text,
                url: args.tweetUrl,
                tags: args.tags,
                author: owner
            })
        
          } catch (error: any) {
            throw new ConvexError('Error fetching tweet');
          }        
    }
})

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