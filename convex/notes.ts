import { ConvexError, v } from "convex/values";
import { internalAction, internalMutation, mutation, query } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { internal } from "./_generated/api";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

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

const embed = async (content: string) => {
    const result = await model.embedContent(content);
    return result.embedding.values;
}

export const setNoteEmbedding = internalMutation({
    args: {
        noteId: v.id("notes"),
        embedding: v.array(v.float64())
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.noteId, { embedding: args.embedding });
    }
})

export const createNoteEmbedding = internalAction({
    args: {
        noteId: v.id("notes"),
        content: v.string()
    },
    handler: async (ctx, args) => {
        const embedding = await embed(args.content);

        await ctx.runMutation(internal.notes.setNoteEmbedding, {
            noteId: args.noteId,
            embedding: embedding
        });
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

        const noteId = await ctx.db.insert("notes", {
            title: args.title,
            content: args.content,
            userId: user.subject,
            tags: args.tags,
            updatedTime: Date.now(),
        });

        await ctx.scheduler.runAfter(0, internal.notes.createNoteEmbedding, {
            noteId: noteId,
            content: args.content
        })

        return noteId;
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