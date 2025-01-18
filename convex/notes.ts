import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getNotes = query({
    handler: async (ctx) => {

        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Not authorized");
        }
        const notes = await ctx.db.query("notes")
            .withIndex("by_user_id", (q) => q.eq("userId", user.subject))
            .collect();
        return notes;
    }
})

export const getNoteById = query({
    args: { id: v.id("notes") },
    handler: async (ctx, args) => {

        const userId = await ctx.auth.getUserIdentity();
        if (!userId) {
            throw new ConvexError("Not a user");
        }

        const note = await ctx.db.get(args.id);

        if (!note) {
            throw new ConvexError("Note not found");
        }

        if (note.userId !== userId.subject) {
            throw new ConvexError("Not authorized");
        }

        return note;
    }
})

export const createNote = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        tags: v.optional(v.array(v.string())),
    },

    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Not authorized");
        }

        const note = await ctx.db.insert("notes", {
            title: args.title,
            content: args.content,
            userId: user.subject,
            tags: args.tags,
            updatedTime: Date.now()
        });
        return note;
    },
});

export const updateNote = mutation({
    args: { id: v.id("notes"), title: v.string(), content: v.string(), tags: v.optional(v.array(v.string())) },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new ConvexError("Not authorized");
        }

        const note = await ctx.db.get(args.id);

        if (!note) {
            throw new ConvexError("Note not found");
        }

        if (note.userId !== user.subject) {
            throw new ConvexError("Not authorized");
        }

        await ctx.db.patch(args.id, {
            title: args.title,
            content: args.content,
            tags: args.tags,
            updatedTime: Date.now()
        });
    }
})

export const deleteNote = mutation({
    args: { id: v.id("notes") },
    handler: async (ctx, args) => {
        const userId = await ctx.auth.getUserIdentity();
        if (!userId) {
            throw new ConvexError("Not authorized");
        }

        const note = await ctx.db.get(args.id);

        if (!note) {
            throw new ConvexError("Note not found");
        }

        if (note.userId !== userId.subject) {
            throw new ConvexError("Not authorized");
        }

        await ctx.db.delete(args.id);
    }
})