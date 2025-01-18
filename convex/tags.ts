import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUniqueTags = mutation({
    args: {
        names: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const existingTags = await ctx.db.query("tags").collect();
        const existingTagNames = new Set(existingTags.map(tag => tag.name));

        await Promise.all(
            args.names.map(async (name) => {
                if (!existingTagNames.has(name)) {
                    await ctx.db.insert("tags", { name });
                }
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