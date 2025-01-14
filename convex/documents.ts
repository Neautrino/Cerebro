import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getDocuments = query({
    handler: async(ctx) => {

        const user = await ctx.auth.getUserIdentity();

        if(!user){
            throw new ConvexError("Not authorized");
        }
        const documents = await ctx.db.query("documents")
            .withIndex("by_user_id", (q) => q.eq("userId", user.subject))
            .collect();
        return documents;
    }
})

export const createDocuments = mutation({
    args: {
        title: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if(!user){
            throw new ConvexError("Not authorized");
        }

        console.log(user.subject);
        const document = await ctx.db.insert("documents", { title: args.title, content: args.content, userId: user.subject });
        return document;
    },
});