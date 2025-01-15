import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTags = mutation({
    args: {
        names: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        await Promise.all(
            args.names.map(async (name) => {
                await ctx.db.insert("tags", { name });
            })
        );
    }
})

export const getAllTags = query({
    handler: async (ctx) => {
        const tags = await ctx.db.query("tags").collect();
        return tags;
    }
})