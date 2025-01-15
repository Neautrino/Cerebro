import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getNotes = query({
    handler: async(ctx) => {

        const user = await ctx.auth.getUserIdentity();

        if(!user){
            throw new ConvexError("Not authorized");
        }
        const documents = await ctx.db.query("notes")
            .withIndex("by_user_id", (q) => q.eq("userId", user.subject))
            .collect();
        return documents;
    }
})

export const createNotes = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        tags: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if(!user){
            throw new ConvexError("Not authorized");
        }

        console.log(user.subject);
        const document = await ctx.db.insert("notes", { title: args.title, content: args.content, userId: user.subject, updatedTime: Date.now(), tags: args.tags });
        return document;
    },
});