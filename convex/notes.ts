import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getNotes = query({
    handler: async (ctx) => {

        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Not authorized");
        }
        const documents = await ctx.db.query("notes")
            .withIndex("by_user_id", (q) => q.eq("userId", user.subject))
            .collect();
        return documents;
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

        return {
            ...note,
            fileUrl: note.fileId ? await ctx.storage.getUrl(note.fileId) : null,
        };
    }
})

export const createNotes = mutation({
    args: {
        title: v.string(),
        content: v.optional(v.string()),
        fileId: v.optional(v.id("_storage")),
        tags: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Not authorized");
        }

        console.log(user.subject);
        const document = await ctx.db.insert("notes", {
            title: args.title,
            content: args.content,
            fileId: args.fileId,
            userId: user.subject,
            updatedTime: Date.now(),
            tags: args.tags
        });
        return document;
    },
});

export const updateNotes = mutation({
    args: {
        id: v.id("notes"),
        title: v.string(),
        content: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, { title: args.title, content: args.content });
    },
});

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const getMetadata = query({
    args: {
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.system.get(args.storageId);
    },
});