import { ConvexError, v } from "convex/values";
import { internalAction, internalMutation, mutation, query } from "./_generated/server";
import { embed } from "./notes";
import { internal } from "./_generated/api";

export const getLinks = query({
    handler: async (ctx) => {

        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Not authorized");
        }
        const links = await ctx.db.query("links")
            .withIndex("by_user_id", (q) => q.eq("userId", user.subject))
            .collect();
        return links;
    }
})

export const getLinkById = query({
    args: { id: v.id("links") },
    handler: async (ctx, args) => {

        const userId = await ctx.auth.getUserIdentity();
        if (!userId) {
            throw new ConvexError("Not a user");
        }

        const link = await ctx.db.get(args.id);

        if (!link) {
            throw new ConvexError("Link not found");
        }

        if (link.userId !== userId.subject) {
            throw new ConvexError("Not authorized");
        }

        return link;
    }
})

export const setLinkEmbedding = internalMutation({
    args: {
        linkId: v.id("links"),
        embedding: v.array(v.float64())
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.linkId, { embedding: args.embedding });
    }
})

export const createLinkEmbedding = internalAction({
    args: {
        linkId: v.id("links"),
        content: v.string()
    },
    handler: async (ctx, args) => {
        const embedding = await embed(args.content);

        await ctx.runMutation(internal.links.setLinkEmbedding, {
            linkId: args.linkId,
            embedding: embedding
        });
    }
})

export const createLink = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        url: v.string(),
        tags: v.optional(v.array(v.string())),
    },

    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Not authorized");
        }

        const linkId = await ctx.db.insert("links", {
            title: args.title,
            content: args.content,
            url: args.url,
            userId: user.subject,
            tags: args.tags,
            updatedTime: Date.now(),
        });

        await ctx.scheduler.runAfter(0, internal.links.createLinkEmbedding, {
            linkId: linkId,
            content: args.content
        })

        return linkId;
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